import { DrawResult, BetHistoryRecord, TransactionRecord, TransactionStatus } from '../types';

export interface GameServerState {
  currentRoundIndex: number;
  currentRoundTime: string;
  countdown: number;
  isRevealing: boolean;
  revealStep: number;
  drawMix: number[];
  forcedWinningNumber: number | null;
  pendingWinningResult: DrawResult | null;
  history: DrawResult[];
  balance: number;
  recentBets: BetHistoryRecord[];
  transactions: TransactionRecord[];
  isBettingClosed: boolean;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'fallback_polling' | 'disconnected';

export type RealtimeEventHandler = (state: Partial<GameServerState>, eventType?: string) => void;
export type StatusEventHandler = (status: ConnectionStatus) => void;

class RealtimeSyncService {
  private socket: WebSocket | null = null;
  private listeners: Set<RealtimeEventHandler> = new Set();
  private statusListeners: Set<StatusEventHandler> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private isConnecting = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private fallbackPollerTimer: NodeJS.Timeout | null = null;
  private currentStatus: ConnectionStatus = 'disconnected';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('cambodia_lottery_cross_device_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.state) {
            this.notifyListeners(event.data.state, event.data.type);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported', e);
      }
    }
  }

  public subscribe(handler: RealtimeEventHandler): () => void {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }

  public subscribeStatus(handler: StatusEventHandler): () => void {
    this.statusListeners.add(handler);
    handler(this.currentStatus);
    return () => {
      this.statusListeners.delete(handler);
    };
  }

  public getStatus(): ConnectionStatus {
    return this.currentStatus;
  }

  private setStatus(status: ConnectionStatus) {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusListeners.forEach((l) => {
        try {
          l(status);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  private notifyListeners(partial: Partial<GameServerState>, eventType?: string) {
    this.listeners.forEach((listener) => {
      try {
        listener(partial, eventType);
      } catch (e) {
        console.error('Error in realtime listener', e);
      }
    });
  }

  public connect() {
    if (typeof window === 'undefined') return;
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.setStatus('connecting');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnecting = false;
        this.setStatus('connected');
        this.stopFallbackPoller();
        console.log('✅ Realtime WebSocket connected across devices via custom domain / host:', window.location.host);
      };

      this.socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncomingEvent(msg);
        } catch (e) {
          console.warn('Failed to parse incoming WS message', e);
        }
      };

      this.socket.onclose = () => {
        this.isConnecting = false;
        this.socket = null;
        this.setStatus('fallback_polling');
        this.startFallbackPoller();
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.isConnecting = false;
        this.setStatus('fallback_polling');
        this.startFallbackPoller();
      };
    } catch (e) {
      this.isConnecting = false;
      this.setStatus('fallback_polling');
      this.startFallbackPoller();
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 2500);
  }

  // Fallback Polling ensures zero data loss even on Cloudflare proxies that block or throttle WebSocket connections
  private startFallbackPoller() {
    if (this.fallbackPollerTimer) return;
    this.fallbackPollerTimer = setInterval(async () => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.stopFallbackPoller();
        return;
      }
      await this.fetchInitialState();
    }, 1000);
  }

  private stopFallbackPoller() {
    if (this.fallbackPollerTimer) {
      clearInterval(this.fallbackPollerTimer);
      this.fallbackPollerTimer = null;
    }
  }

  private handleIncomingEvent(msg: { type: string; [key: string]: any }) {
    switch (msg.type) {
      case 'INIT_STATE':
        if (msg.payload) {
          this.notifyListeners(msg.payload, 'INIT_STATE');
          this.broadcastLocally(msg.payload, 'INIT_STATE');
        }
        break;

      case 'TICK':
        this.notifyListeners({
          countdown: msg.countdown,
          currentRoundIndex: msg.currentRoundIndex,
          isBettingClosed: msg.isBettingClosed,
        }, 'TICK');
        break;

      case 'COUNTDOWN_10S_START':
        this.notifyListeners({
          countdown: 10,
          currentRoundIndex: msg.currentRoundIndex,
          isBettingClosed: true,
        }, 'COUNTDOWN_10S_START');
        this.broadcastLocally({ countdown: 10, isBettingClosed: true }, 'COUNTDOWN_10S_START');
        break;

      case 'FORCED_RESULT_UPDATED':
        this.notifyListeners({
          forcedWinningNumber: msg.forcedWinningNumber,
        }, 'FORCED_RESULT_UPDATED');
        this.broadcastLocally({ forcedWinningNumber: msg.forcedWinningNumber }, 'FORCED_RESULT_UPDATED');
        break;

      case 'DRAW_STARTED':
        this.notifyListeners({
          isRevealing: true,
          revealStep: msg.revealStep ?? 1,
          pendingWinningResult: msg.outcomeResult,
          drawMix: msg.drawMix,
          countdown: 0,
          isBettingClosed: true,
        }, 'DRAW_STARTED');
        this.broadcastLocally({
          isRevealing: true,
          revealStep: msg.revealStep ?? 1,
          pendingWinningResult: msg.outcomeResult,
          drawMix: msg.drawMix,
        }, 'DRAW_STARTED');
        break;

      case 'DRAW_STEP':
        this.notifyListeners({
          revealStep: msg.revealStep,
          isRevealing: true,
        }, 'DRAW_STEP');
        break;

      case 'DRAW_FINISHED':
        this.notifyListeners({
          isRevealing: true,
          revealStep: 12,
          pendingWinningResult: msg.outcomeResult,
          history: msg.newHistory,
          recentBets: msg.recentBets,
          balance: msg.newBalance,
        }, 'DRAW_FINISHED');
        this.broadcastLocally({
          history: msg.newHistory,
          recentBets: msg.recentBets,
          balance: msg.newBalance,
        }, 'DRAW_FINISHED');
        break;

      case 'ROUND_RESET':
        this.notifyListeners({
          isRevealing: false,
          revealStep: 0,
          pendingWinningResult: null,
          countdown: msg.countdown ?? 180,
          currentRoundIndex: msg.currentRoundIndex,
          drawMix: msg.drawMix,
          isBettingClosed: false,
        }, 'ROUND_RESET');
        this.broadcastLocally({
          currentRoundIndex: msg.currentRoundIndex,
          countdown: msg.countdown ?? 180,
        }, 'ROUND_RESET');
        break;

      case 'BET_PLACED':
        this.notifyListeners({
          recentBets: msg.recentBets,
          balance: msg.newBalance,
        }, 'BET_PLACED');
        this.broadcastLocally({
          recentBets: msg.recentBets,
          balance: msg.newBalance,
        }, 'BET_PLACED');
        break;

      case 'TRANSACTION_UPDATED':
        this.notifyListeners({
          transactions: msg.transactions,
          balance: msg.newBalance,
        }, 'TRANSACTION_UPDATED');
        this.broadcastLocally({
          transactions: msg.transactions,
          balance: msg.newBalance,
        }, 'TRANSACTION_UPDATED');
        break;

      case 'BALANCE_UPDATED':
        this.notifyListeners({ balance: msg.newBalance }, 'BALANCE_UPDATED');
        break;

      case 'HISTORY_UPDATED':
        this.notifyListeners({ history: msg.history }, 'HISTORY_UPDATED');
        break;
    }
  }

  private broadcastLocally(state: Partial<GameServerState>, type: string) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ state, type });
      } catch (e) {
        // Ignore
      }
    }
  }

  // ========================================================
  // REMOTE ACTION DISPATCHERS (Used by Admin Panel & Player Game)
  // ========================================================

  public async fetchInitialState(): Promise<GameServerState | null> {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        this.notifyListeners(data, 'INIT_STATE');
        return data;
      }
    } catch (e) {
      console.warn('Failed to fetch state via HTTP', e);
    }
    return null;
  }

  // Admin remotely sets result (reflects across ALL devices immediately)
  public async setForcedResult(number: number | null) {
    try {
      await fetch('/api/admin/set-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number }),
      });
    } catch (e) {
      console.warn('HTTP fallback failed for setForcedResult', e);
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'SET_FORCED_RESULT', payload: { number } }));
    }
  }

  // Admin remotely forces immediate draw
  public async forceDrawNow(targetNumber?: number, withCountdown: boolean = false) {
    try {
      await fetch('/api/admin/force-draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetNumber, withCountdown }),
      });
    } catch (e) {
      console.warn('HTTP fallback failed for forceDrawNow', e);
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'FORCE_DRAW_NOW', payload: { targetNumber } }));
    }
  }

  // Player places bet
  public async placeBet(betRecord: BetHistoryRecord) {
    try {
      const res = await fetch('/api/bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betRecord }),
      });
      return await res.json();
    } catch (e) {
      console.warn('Failed to post bet', e);
    }
  }

  // Add transaction
  public async createTransaction(tx: Omit<TransactionRecord, 'id' | 'timestamp' | 'timeString'>) {
    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });
      return await res.json();
    } catch (e) {
      console.warn('Failed to post transaction', e);
    }
  }

  // Approve / Reject transaction
  public async updateTransactionStatus(id: string, status: TransactionStatus) {
    try {
      const res = await fetch(`/api/transaction/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (e) {
      console.warn('Failed to update transaction status', e);
    }
  }

  // Add manual result
  public async addManualResult(result: DrawResult) {
    try {
      await fetch('/api/admin/manual-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });
    } catch (e) {
      console.warn('Failed to add manual result', e);
    }
  }

  // Delete result
  public async deleteResult(roundId: string) {
    try {
      await fetch(`/api/admin/result/${encodeURIComponent(roundId)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Failed to delete result', e);
    }
  }
}

export const realtimeSync = new RealtimeSyncService();
