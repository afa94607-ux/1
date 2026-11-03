import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const PERSISTENCE_FILE = path.resolve(DATA_DIR, 'lottery_server_state.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Failed to ensure data dir exists', e);
}

// Data Types
type ColorGroup = 'red' | 'green' | 'blue';
type SizeGroup = 'small' | 'big';
type ParityGroup = 'odd' | 'even';
type BetCategory =
  | 'small'
  | 'big'
  | 'odd'
  | 'even'
  | 'color_red'
  | 'color_green'
  | 'color_blue'
  | `animal_${number}`;

interface AnimalData {
  number: number;
  khmerName: string;
  animalEn: string;
  color: ColorGroup;
  size: SizeGroup;
  parity: ParityGroup;
  odds: number;
}

const ANIMALS_DATA: Record<number, AnimalData> = {
  1: { number: 1, khmerName: 'ជូត', animalEn: 'Rat', color: 'red', size: 'small', parity: 'odd', odds: 11 },
  2: { number: 2, khmerName: 'ឆ្លូវ', animalEn: 'Ox', color: 'green', size: 'small', parity: 'even', odds: 11 },
  3: { number: 3, khmerName: 'ខាល', animalEn: 'Tiger', color: 'blue', size: 'small', parity: 'odd', odds: 11 },
  4: { number: 4, khmerName: 'ថោះ', animalEn: 'Rabbit', color: 'red', size: 'small', parity: 'even', odds: 11 },
  5: { number: 5, khmerName: 'រោង', animalEn: 'Dragon', color: 'green', size: 'small', parity: 'odd', odds: 11 },
  6: { number: 6, khmerName: 'ម្សាញ់', animalEn: 'Snake', color: 'blue', size: 'small', parity: 'even', odds: 11 },
  7: { number: 7, khmerName: 'មមី', animalEn: 'Horse', color: 'red', size: 'big', parity: 'odd', odds: 11 },
  8: { number: 8, khmerName: 'មមែ', animalEn: 'Goat', color: 'green', size: 'big', parity: 'even', odds: 11 },
  9: { number: 9, khmerName: 'វក', animalEn: 'Monkey', color: 'blue', size: 'big', parity: 'odd', odds: 11 },
  10: { number: 10, khmerName: 'រកា', animalEn: 'Rooster', color: 'red', size: 'big', parity: 'even', odds: 11 },
  11: { number: 11, khmerName: 'ច', animalEn: 'Dog', color: 'green', size: 'big', parity: 'odd', odds: 11 },
  12: { number: 12, khmerName: 'កុរ', animalEn: 'Pig', color: 'blue', size: 'big', parity: 'even', odds: 11 },
};

interface DrawResult {
  roundId: string;
  roundIndex: number;
  time: string;
  number: number;
  animal: string;
  color: ColorGroup;
  size: SizeGroup;
  parity: ParityGroup;
  timestamp: number;
}

interface BetHistoryRecord {
  id: string;
  roundId: string;
  time: string;
  bets: {
    type: BetCategory;
    label: string;
    amount: number;
    odds: number;
    potentialWin?: number;
    won: boolean;
    payout: number;
  }[];
  totalStake: number;
  totalPotentialPayout: number;
  totalPayout: number;
  netProfit: number;
  resultNumber?: number;
  status: 'won' | 'lost' | 'pending';
}

interface TransactionRecord {
  id: string;
  userName: string;
  userPhone: string;
  type: 'deposit' | 'withdrawal' | 'adjustment';
  amount: number;
  method: 'ABA Bank' | 'Wing' | 'ACLEDA' | 'TrueMoney' | 'Cash' | 'Manual';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
  timeString: string;
  note?: string;
}

// Initial History
const INITIAL_HISTORY: DrawResult[] = [
  { roundId: '2004#283', roundIndex: 283, time: '16:19', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 60000 },
  { roundId: '2004#282', roundIndex: 282, time: '16:15', number: 9, animal: 'វក', color: 'blue', size: 'big', parity: 'odd', timestamp: Date.now() - 120000 },
  { roundId: '2004#281', roundIndex: 281, time: '16:12', number: 8, animal: 'មមែ', color: 'green', size: 'big', parity: 'even', timestamp: Date.now() - 180000 },
  { roundId: '2004#280', roundIndex: 280, time: '16:08', number: 10, animal: 'រកា', color: 'red', size: 'big', parity: 'even', timestamp: Date.now() - 240000 },
  { roundId: '2004#279', roundIndex: 279, time: '16:05', number: 11, animal: 'ច', color: 'green', size: 'big', parity: 'odd', timestamp: Date.now() - 300000 },
  { roundId: '2004#278', roundIndex: 278, time: '16:01', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 360000 },
  { roundId: '2004#277', roundIndex: 277, time: '15:58', number: 9, animal: 'វក', color: 'blue', size: 'big', parity: 'odd', timestamp: Date.now() - 420000 },
  { roundId: '2004#276', roundIndex: 276, time: '15:54', number: 10, animal: 'រកា', color: 'red', size: 'big', parity: 'even', timestamp: Date.now() - 480000 },
  { roundId: '2004#275', roundIndex: 275, time: '15:50', number: 8, animal: 'មមែ', color: 'green', size: 'big', parity: 'even', timestamp: Date.now() - 540000 },
  { roundId: '2004#274', roundIndex: 274, time: '15:47', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 600000 },
  { roundId: '2004#273', roundIndex: 273, time: '15:43', number: 2, animal: 'ឆ្លូវ', color: 'green', size: 'small', parity: 'even', timestamp: Date.now() - 660000 },
  { roundId: '2004#272', roundIndex: 272, time: '15:40', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 720000 },
  { roundId: '2004#271', roundIndex: 271, time: '15:36', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 780000 },
  { roundId: '2004#270', roundIndex: 270, time: '15:32', number: 8, animal: 'មមែ', color: 'green', size: 'big', parity: 'even', timestamp: Date.now() - 840000 },
  { roundId: '2004#269', roundIndex: 269, time: '15:28', number: 11, animal: 'ច', color: 'green', size: 'big', parity: 'odd', timestamp: Date.now() - 900000 },
  { roundId: '2004#268', roundIndex: 268, time: '15:25', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 960000 },
  { roundId: '2004#267', roundIndex: 267, time: '15:21', number: 7, animal: 'មមី', color: 'red', size: 'big', parity: 'odd', timestamp: Date.now() - 1020000 },
  { roundId: '2004#266', roundIndex: 266, time: '15:18', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 1080000 },
  { roundId: '2004#265', roundIndex: 265, time: '15:14', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 1140000 },
  { roundId: '2004#264', roundIndex: 264, time: '15:10', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 1200000 },
  { roundId: '2004#263', roundIndex: 263, time: '15:06', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 1260000 },
  { roundId: '2004#262', roundIndex: 262, time: '15:02', number: 10, animal: 'រកា', color: 'red', size: 'big', parity: 'even', timestamp: Date.now() - 1320000 },
  { roundId: '2004#261', roundIndex: 261, time: '14:58', number: 7, animal: 'មមី', color: 'red', size: 'big', parity: 'odd', timestamp: Date.now() - 1380000 },
  { roundId: '2004#260', roundIndex: 260, time: '14:54', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 1440000 },
  { roundId: '2004#259', roundIndex: 259, time: '14:50', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 1500000 },
  { roundId: '2004#258', roundIndex: 258, time: '14:46', number: 2, animal: 'ឆ្លូវ', color: 'green', size: 'small', parity: 'even', timestamp: Date.now() - 1560000 },
  { roundId: '2004#257', roundIndex: 257, time: '14:42', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 1620000 },
];

function generateRandomMix(): number[] {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

// Global Authoritative Server State
class ServerGameState {
  currentRoundIndex = 284;
  currentRoundTime = '16:22';
  countdown = 180;
  isRevealing = false;
  revealStep = 0;
  drawMix = generateRandomMix();
  forcedWinningNumber: number | null = null;
  pendingWinningResult: DrawResult | null = null;
  history: DrawResult[] = INITIAL_HISTORY;
  balance = 500000;
  recentBets: BetHistoryRecord[] = [];
  transactions: TransactionRecord[] = [
    {
      id: 'tx-1001',
      userName: 'អតិថិជន Player #1',
      userPhone: '012 888 999',
      type: 'deposit',
      amount: 500000,
      method: 'ABA Bank',
      status: 'approved',
      timestamp: Date.now() - 3600000,
      timeString: '15:20',
      note: 'ABA PayWay Deposit',
    },
    {
      id: 'tx-1002',
      userName: 'អតិថិជន Player #2',
      userPhone: '098 777 666',
      type: 'withdrawal',
      amount: 200000,
      method: 'Wing',
      status: 'pending',
      timestamp: Date.now() - 1800000,
      timeString: '15:55',
      note: 'ដកប្រាក់ឈ្នះជុំ 2004#280',
    },
    {
      id: 'tx-1003',
      userName: 'អតិថិជន Player #3',
      userPhone: '077 111 222',
      type: 'deposit',
      amount: 300000,
      method: 'ACLEDA',
      status: 'pending',
      timestamp: Date.now() - 900000,
      timeString: '16:10',
      note: 'ACLEDA Mobile Top-up',
    },
    {
      id: 'tx-1004',
      userName: 'អតិថិជន Player #1',
      userPhone: '012 888 999',
      type: 'deposit',
      amount: 100000,
      method: 'TrueMoney',
      status: 'approved',
      timestamp: Date.now() - 600000,
      timeString: '16:15',
      note: 'TrueMoney Deposit',
    },
  ];

  drawTimeouts: NodeJS.Timeout[] = [];

  constructor() {
    this.loadStateFromDisk();
  }

  loadStateFromDisk() {
    try {
      if (fs.existsSync(PERSISTENCE_FILE)) {
        const raw = fs.readFileSync(PERSISTENCE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed) {
          if (typeof parsed.currentRoundIndex === 'number' && parsed.currentRoundIndex > 0) {
            this.currentRoundIndex = parsed.currentRoundIndex;
          }
          if (typeof parsed.currentRoundTime === 'string') {
            this.currentRoundTime = parsed.currentRoundTime;
          }
          if (Array.isArray(parsed.history) && parsed.history.length > 0) {
            this.history = parsed.history;
          }
          if (Array.isArray(parsed.recentBets)) {
            this.recentBets = parsed.recentBets;
          }
          if (Array.isArray(parsed.transactions) && parsed.transactions.length > 0) {
            this.transactions = parsed.transactions;
          }
          if (typeof parsed.balance === 'number') {
            this.balance = parsed.balance;
          }
          if (parsed.forcedWinningNumber !== undefined) {
            this.forcedWinningNumber = parsed.forcedWinningNumber;
          }
          console.log(`[Disk Persistence] Loaded game state. Round: 2004#${this.currentRoundIndex}, History count: ${this.history.length}, Total betting records: ${this.recentBets.length}, Balance: ${this.balance}៛`);
        }
      }
    } catch (e) {
      console.warn('[Disk Persistence] Failed to load state from disk', e);
    }
  }

  saveStateToDisk() {
    try {
      const dataToSave = {
        currentRoundIndex: this.currentRoundIndex,
        currentRoundTime: this.currentRoundTime,
        history: this.history,
        recentBets: this.recentBets,
        transactions: this.transactions,
        balance: this.balance,
        forcedWinningNumber: this.forcedWinningNumber,
        savedAt: Date.now(),
      };
      fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[Disk Persistence] Error writing state to disk', e);
    }
  }

  getStatePayload() {
    return {
      currentRoundIndex: this.currentRoundIndex,
      currentRoundTime: this.currentRoundTime,
      countdown: this.countdown,
      isRevealing: this.isRevealing,
      revealStep: this.revealStep,
      drawMix: this.drawMix,
      forcedWinningNumber: this.forcedWinningNumber,
      pendingWinningResult: this.pendingWinningResult,
      history: this.history,
      balance: this.balance,
      recentBets: this.recentBets,
      transactions: this.transactions,
      isBettingClosed: this.countdown <= 10 || this.isRevealing,
    };
  }

  clearDrawTimeouts() {
    this.drawTimeouts.forEach((t) => clearTimeout(t));
    this.drawTimeouts = [];
  }
}

const gameState = new ServerGameState();

// Express & WebSocket Server Setup
const app = express();
app.set('trust proxy', true); // Full trust for Cloudflare proxy hops

// Robust CORS Middleware for custom domains & reverse proxies (Cloudflare, Nginx, GCP)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, CF-Connecting-IP, CF-RAY');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Cloudflare CDN Cache Disabling for API endpoints - ensures zero stale game state across edges
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(message: object) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// WebSocket Connection Management with Ping/Pong Heartbeat
interface ExtWebSocket extends WebSocket {
  isAlive?: boolean;
}

wss.on('connection', (ws: ExtWebSocket) => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Immediately send authoritative initial state on connect
  ws.send(JSON.stringify({ type: 'INIT_STATE', payload: gameState.getStatePayload() }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      handleClientMessage(msg);
    } catch (e) {
      console.warn('Invalid WS message received', e);
    }
  });

  ws.on('error', (err) => {
    console.warn('WebSocket client error', err);
  });
});

// Heartbeat ping interval to keep connection alive through Cloudflare, Nginx, or mobile cellular proxies (15s < Cloudflare 100s timeout)
const pingInterval = setInterval(() => {
  wss.clients.forEach((client) => {
    const ws = client as ExtWebSocket;
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 15000);

wss.on('close', () => {
  clearInterval(pingInterval);
});

// Client Message Dispatcher
function handleClientMessage(msg: { type: string; payload?: any }) {
  switch (msg.type) {
    case 'PING':
      broadcast({ type: 'PONG', timestamp: Date.now() });
      break;
    case 'SET_FORCED_RESULT':
      gameState.forcedWinningNumber = msg.payload?.number ?? null;
      broadcast({
        type: 'FORCED_RESULT_UPDATED',
        forcedWinningNumber: gameState.forcedWinningNumber,
      });
      break;
    case 'FORCE_DRAW_NOW':
      executeDrawSequence(msg.payload?.targetNumber);
      break;
  }
}

// Draw Sequence Execution (Authoritative on Server)
function executeDrawSequence(explicitTarget?: number) {
  if (gameState.isRevealing) return;
  gameState.clearDrawTimeouts();

  const targetNum = explicitTarget ?? gameState.forcedWinningNumber;
  let winningNum: number;
  let mix = generateRandomMix();

  if (targetNum && targetNum >= 1 && targetNum <= 12) {
    winningNum = targetNum;
    const remaining = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((n) => n !== targetNum);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    mix = [...remaining, targetNum];
    gameState.forcedWinningNumber = null;
  } else {
    winningNum = mix[11];
  }

  gameState.drawMix = mix;
  const animal = ANIMALS_DATA[winningNum];
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const roundId = `2004#${gameState.currentRoundIndex}`;

  const outcomeResult: DrawResult = {
    roundId,
    roundIndex: gameState.currentRoundIndex,
    time: timeStr,
    number: winningNum,
    animal: animal.khmerName,
    color: animal.color,
    size: animal.size,
    parity: animal.parity,
    timestamp: Date.now(),
  };

  gameState.pendingWinningResult = outcomeResult;
  gameState.isRevealing = true;
  gameState.countdown = 0;
  gameState.revealStep = 1;

  // Broadcast DRAW_STARTED to ALL connected devices immediately
  broadcast({
    type: 'DRAW_STARTED',
    outcomeResult,
    drawMix: mix,
    revealStep: 1,
  });

  // Reveal Row 1 & Row 2 bowls sequentially (each 1,100ms)
  for (let s = 2; s <= 11; s++) {
    const delay = (s - 1) * 1100;
    const t = setTimeout(() => {
      gameState.revealStep = s;
      broadcast({ type: 'DRAW_STEP', revealStep: s });
    }, delay);
    gameState.drawTimeouts.push(t);
  }

  // Row 3 Final Result Reveal at 12,100ms
  const finalDelay = 11 * 1100;
  const tFinal = setTimeout(() => {
    gameState.revealStep = 12;
    // Settle bets for current round
    settleRoundBets(outcomeResult);

    // Update history
    gameState.history = [outcomeResult, ...gameState.history];
    gameState.saveStateToDisk();

    broadcast({
      type: 'DRAW_FINISHED',
      outcomeResult,
      revealStep: 12,
      newHistory: gameState.history,
      recentBets: gameState.recentBets,
      newBalance: gameState.balance,
    });

    // 5 seconds display before resetting for next round
    const tReset = setTimeout(() => {
      gameState.isRevealing = false;
      gameState.revealStep = 0;
      gameState.pendingWinningResult = null;
      gameState.countdown = 180;
      gameState.currentRoundIndex += 1;
      gameState.drawMix = generateRandomMix();
      gameState.saveStateToDisk();

      broadcast({
        type: 'ROUND_RESET',
        currentRoundIndex: gameState.currentRoundIndex,
        countdown: 180,
        drawMix: gameState.drawMix,
      });
    }, 5000);
    gameState.drawTimeouts.push(tReset);
  }, finalDelay);

  gameState.drawTimeouts.push(tFinal);
}

// Settle Bets on Server
function settleRoundBets(outcome: DrawResult) {
  let roundTotalWinPayout = 0;
  const currentRoundId = outcome.roundId;

  const checkIsCategoryWon = (catKey: BetCategory): boolean => {
    if (catKey === 'small') return outcome.size === 'small';
    if (catKey === 'big') return outcome.size === 'big';
    if (catKey === 'odd') return outcome.parity === 'odd';
    if (catKey === 'even') return outcome.parity === 'even';
    if (catKey === 'color_red') return outcome.color === 'red';
    if (catKey === 'color_green') return outcome.color === 'green';
    if (catKey === 'color_blue') return outcome.color === 'blue';
    if (catKey.startsWith('animal_')) {
      const betNum = parseInt(catKey.replace('animal_', ''), 10);
      return betNum === outcome.number;
    }
    return false;
  };

  gameState.recentBets = gameState.recentBets.map((rec) => {
    if (rec.status !== 'pending' && rec.roundId !== currentRoundId) {
      return rec;
    }

    let recordWonPayout = 0;
    const updatedBets = rec.bets.map((b) => {
      const won = checkIsCategoryWon(b.type);
      const payout = won ? Math.round(b.amount * b.odds) : 0;
      if (won) recordWonPayout += payout;
      return { ...b, won, payout };
    });

    const isWon = recordWonPayout > 0;
    if (isWon) roundTotalWinPayout += recordWonPayout;

    return {
      ...rec,
      bets: updatedBets,
      totalPayout: recordWonPayout,
      netProfit: isWon ? recordWonPayout - rec.totalStake : -rec.totalStake,
      resultNumber: outcome.number,
      status: isWon ? 'won' : 'lost',
    };
  });

  if (roundTotalWinPayout > 0) {
    gameState.balance += roundTotalWinPayout;
  }
}

// 1-Second Server Authoritative Timer Loop
setInterval(() => {
  if (gameState.isRevealing) return;

  if (gameState.countdown <= 1) {
    // Timer reached 0 -> Start Draw Sequence!
    executeDrawSequence();
    return;
  }

  gameState.countdown -= 1;

  if (gameState.countdown === 10) {
    broadcast({
      type: 'COUNTDOWN_10S_START',
      countdown: 10,
      currentRoundIndex: gameState.currentRoundIndex,
      isBettingClosed: true,
    });
  }

  // Broadcast tick (including countdown remaining and closed status)
  broadcast({
    type: 'TICK',
    countdown: gameState.countdown,
    currentRoundIndex: gameState.currentRoundIndex,
    isBettingClosed: gameState.countdown <= 10,
  });
}, 1000);

// ========================================================
// REST API ENDPOINTS FOR CROSS-DEVICE ACTIONS & FALLBACK
// ========================================================

// 0. Cloudflare & Health Diagnostics endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    clientsConnected: wss.clients.size,
    currentRoundIndex: gameState.currentRoundIndex,
    countdown: gameState.countdown,
    forcedWinningNumber: gameState.forcedWinningNumber,
    cfRay: req.headers['cf-ray'] || null,
    cfConnectingIp: req.headers['cf-connecting-ip'] || null,
  });
});

// 1. Get complete current game state (used on initial page load / reconnection)
app.get('/api/state', (req, res) => {
  res.json(gameState.getStatePayload());
});

// 2. Admin: Set Pre-determined Winning Result (Remotely from Mobile or Desktop)
app.post('/api/admin/set-result', (req, res) => {
  const { number } = req.body;
  gameState.forcedWinningNumber = typeof number === 'number' && number >= 1 && number <= 12 ? number : null;
  gameState.saveStateToDisk();
  
  broadcast({
    type: 'FORCED_RESULT_UPDATED',
    forcedWinningNumber: gameState.forcedWinningNumber,
  });

  res.json({
    success: true,
    forcedWinningNumber: gameState.forcedWinningNumber,
    message: gameState.forcedWinningNumber
      ? `កំណត់លទ្ធផលឈ្នះជាមុន: លេខ ${gameState.forcedWinningNumber}`
      : 'កំណត់ឡើងវិញទៅជាចៃដន្យ',
  });
});

// 3. Admin: Force Immediate Draw (Remotely triggers instant draw on all devices)
app.post('/api/admin/force-draw', (req, res) => {
  const { targetNumber } = req.body;
  executeDrawSequence(targetNumber);
  res.json({ success: true, message: 'បានចាប់ផ្តើមការចាប់ឆ្នោតភ្លាមៗលើគ្រប់ឧបករណ៍' });
});

// 4. Admin: Add Manual Result Record to History
app.post('/api/admin/manual-result', (req, res) => {
  const { result } = req.body;
  if (!result || !result.number || !result.roundId) {
    return res.status(400).json({ error: 'Invalid result object' });
  }

  gameState.history = [result, ...gameState.history];
  gameState.saveStateToDisk();
  broadcast({
    type: 'HISTORY_UPDATED',
    history: gameState.history,
  });

  res.json({ success: true, history: gameState.history });
});

// 5. Admin: Delete Result from History
app.delete('/api/admin/result/:roundId', (req, res) => {
  const { roundId } = req.params;
  gameState.history = gameState.history.filter((h) => h.roundId !== roundId);
  gameState.saveStateToDisk();

  broadcast({
    type: 'HISTORY_UPDATED',
    history: gameState.history,
  });

  res.json({ success: true, history: gameState.history });
});

// 6. User: Place Bet (Real-Time broadcast to Admin Live Bet Feed & other devices)
app.post('/api/bet', (req, res) => {
  const { betRecord } = req.body;
  if (!betRecord || !betRecord.totalStake) {
    return res.status(400).json({ error: 'Invalid bet record' });
  }

  if (gameState.countdown <= 10 || gameState.isRevealing) {
    return res.status(403).json({ error: 'Betting is closed for this round' });
  }

  if (gameState.balance < betRecord.totalStake) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  gameState.balance -= betRecord.totalStake;
  gameState.recentBets = [betRecord, ...gameState.recentBets];
  gameState.saveStateToDisk();

  broadcast({
    type: 'BET_PLACED',
    betRecord,
    recentBets: gameState.recentBets,
    newBalance: gameState.balance,
  });

  res.json({
    success: true,
    betRecord,
    newBalance: gameState.balance,
  });
});

// 7. Transactions: Deposit / Withdrawal Request
app.post('/api/transaction', (req, res) => {
  const { userName, userPhone, type, amount, method, status, note } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid transaction amount' });
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const newTx: TransactionRecord = {
    id: `tx-${Date.now()}`,
    userName: userName || 'អតិថិជន Player #1',
    userPhone: userPhone || '012 888 999',
    type: type || 'deposit',
    amount,
    method: method || 'ABA Bank',
    status: status || 'pending',
    timestamp: Date.now(),
    timeString: timeStr,
    note: note || '',
  };

  if (newTx.status === 'approved') {
    if (newTx.type === 'deposit') {
      gameState.balance += newTx.amount;
    } else if (newTx.type === 'withdrawal') {
      gameState.balance = Math.max(0, gameState.balance - newTx.amount);
    }
  }

  gameState.transactions = [newTx, ...gameState.transactions];
  gameState.saveStateToDisk();

  broadcast({
    type: 'TRANSACTION_UPDATED',
    transactions: gameState.transactions,
    newBalance: gameState.balance,
  });

  res.json({ success: true, transaction: newTx, newBalance: gameState.balance });
});

// 8. Transactions: Approve / Reject Transaction
app.post('/api/transaction/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  let txAmount = 0;
  let txType: 'deposit' | 'withdrawal' | 'adjustment' = 'deposit';

  gameState.transactions = gameState.transactions.map((tx) => {
    if (tx.id === id) {
      txAmount = tx.amount;
      txType = tx.type;
      return { ...tx, status };
    }
    return tx;
  });

  if (status === 'approved') {
    if (txType === 'deposit') {
      gameState.balance += txAmount;
    } else if (txType === 'withdrawal') {
      gameState.balance = Math.max(0, gameState.balance - txAmount);
    }
  }

  gameState.saveStateToDisk();

  broadcast({
    type: 'TRANSACTION_UPDATED',
    transactions: gameState.transactions,
    newBalance: gameState.balance,
  });

  res.json({ success: true, transactions: gameState.transactions, newBalance: gameState.balance });
});

// 9. Wallet: Direct Balance Update
app.post('/api/wallet/balance', (req, res) => {
  const { balance } = req.body;
  if (typeof balance === 'number') {
    gameState.balance = balance;
    gameState.saveStateToDisk();
    broadcast({
      type: 'BALANCE_UPDATED',
      newBalance: gameState.balance,
    });
    return res.json({ success: true, balance: gameState.balance });
  }
  res.status(400).json({ error: 'Invalid balance value' });
});

// Vite Middleware for Development / Static for Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
