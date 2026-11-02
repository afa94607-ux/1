import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { HeaderNav, MainTab, SubTab } from './components/HeaderNav';
import { Sidebar } from './components/Sidebar';
import { BowlDrawArea } from './components/BowlDrawArea';
import { BettingBoard } from './components/BettingBoard';
import { RoadGrid } from './components/RoadGrid';
import { WinLossView } from './components/WinLossView';
import { ResultsView } from './components/ResultsView';
import { OtherGamesView } from './components/OtherGamesView';
import { Lottery199 } from './components/Lottery199';
import { TopUpModal } from './components/TopUpModal';
import { HelpRulesModal } from './components/HelpRulesModal';
import { BetAmountModal } from './components/BetAmountModal';
import { sound } from './utils/sound';
import { countdownAudioSync, CountdownSyncSegment } from './utils/countdownAudioSync';
import {
  ANIMALS_DATA,
  DrawResult,
  BetCategory,
  BetHistoryRecord,
} from './types';

// Preloaded historical results replicating the exact image data and streak roads from image_9d92c28c.png
const INITIAL_HISTORY: DrawResult[] = [
  // Col 15
  { roundId: '2004#283', roundIndex: 283, time: '16:19', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 60000 },
  // Col 14
  { roundId: '2004#282', roundIndex: 282, time: '16:15', number: 9, animal: 'វក', color: 'blue', size: 'big', parity: 'odd', timestamp: Date.now() - 120000 },
  { roundId: '2004#281', roundIndex: 281, time: '16:12', number: 8, animal: 'មមែ', color: 'green', size: 'big', parity: 'even', timestamp: Date.now() - 180000 },
  // Col 13 (6 items)
  { roundId: '2004#280', roundIndex: 280, time: '16:08', number: 10, animal: 'រកា', color: 'red', size: 'big', parity: 'even', timestamp: Date.now() - 240000 },
  { roundId: '2004#279', roundIndex: 279, time: '16:05', number: 11, animal: 'ច', color: 'green', size: 'big', parity: 'odd', timestamp: Date.now() - 300000 },
  { roundId: '2004#278', roundIndex: 278, time: '16:01', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 360000 },
  { roundId: '2004#277', roundIndex: 277, time: '15:58', number: 9, animal: 'វក', color: 'blue', size: 'big', parity: 'odd', timestamp: Date.now() - 420000 },
  { roundId: '2004#276', roundIndex: 276, time: '15:54', number: 10, animal: 'រកា', color: 'red', size: 'big', parity: 'even', timestamp: Date.now() - 480000 },
  { roundId: '2004#275', roundIndex: 275, time: '15:50', number: 8, animal: 'មមែ', color: 'green', size: 'big', parity: 'even', timestamp: Date.now() - 540000 },
  // Col 12 (2 items)
  { roundId: '2004#274', roundIndex: 274, time: '15:47', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 600000 },
  { roundId: '2004#273', roundIndex: 273, time: '15:43', number: 2, animal: 'ឆ្លូវ', color: 'green', size: 'small', parity: 'even', timestamp: Date.now() - 660000 },
  // Col 11
  { roundId: '2004#272', roundIndex: 272, time: '15:40', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 720000 },
  // Col 10
  { roundId: '2004#271', roundIndex: 271, time: '15:36', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 780000 },
  // Col 9 (2 items)
  { roundId: '2004#270', roundIndex: 270, time: '15:32', number: 8, animal: 'មមែ', color: 'green', size: 'big', parity: 'even', timestamp: Date.now() - 840000 },
  { roundId: '2004#269', roundIndex: 269, time: '15:28', number: 11, animal: 'ច', color: 'green', size: 'big', parity: 'odd', timestamp: Date.now() - 900000 },
  // Col 8
  { roundId: '2004#268', roundIndex: 268, time: '15:25', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 960000 },
  // Col 7
  { roundId: '2004#267', roundIndex: 267, time: '15:21', number: 7, animal: 'មមី', color: 'red', size: 'big', parity: 'odd', timestamp: Date.now() - 1020000 },
  // Col 6 (4 items)
  { roundId: '2004#266', roundIndex: 266, time: '15:18', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 1080000 },
  { roundId: '2004#265', roundIndex: 265, time: '15:14', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 1140000 },
  { roundId: '2004#264', roundIndex: 264, time: '15:10', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 1200000 },
  { roundId: '2004#263', roundIndex: 263, time: '15:06', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 1260000 },
  // Col 5 (2 items)
  { roundId: '2004#262', roundIndex: 262, time: '15:02', number: 10, animal: 'រកា', color: 'red', size: 'big', parity: 'even', timestamp: Date.now() - 1320000 },
  { roundId: '2004#261', roundIndex: 261, time: '14:58', number: 7, animal: 'មមី', color: 'red', size: 'big', parity: 'odd', timestamp: Date.now() - 1380000 },
  // Col 4
  { roundId: '2004#260', roundIndex: 260, time: '14:54', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 1440000 },
  // Col 3
  { roundId: '2004#259', roundIndex: 259, time: '14:50', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 1500000 },
  // Col 2
  { roundId: '2004#258', roundIndex: 258, time: '14:46', number: 2, animal: 'ឆ្លូវ', color: 'green', size: 'small', parity: 'even', timestamp: Date.now() - 1560000 },
  // Col 1
  { roundId: '2004#257', roundIndex: 257, time: '14:42', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 1620000 },
];

export default function App() {
  // Navigation State
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('lottery_12');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('lottery');

  // Account & Wallet State
  const [balance, setBalance] = useState<number>(500000); // 500,000 KHR initial
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Round & Timer State (3 minutes / 180s per round)
  const [countdown, setCountdown] = useState<number>(180);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(284);
  const [currentRoundTime, setCurrentRoundTime] = useState<string>('16:22');
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [revealStep, setRevealStep] = useState<number>(0); // 0: closed, 1..6: row 1, 7..11: row 2, 12: row 3 final result
  const [pendingWinningResult, setPendingWinningResult] = useState<DrawResult | null>(null);
  const drawTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Real-Time Sound & Figure Synchronization States (10s Countdown)
  const [audioSyncSegment, setAudioSyncSegment] = useState<CountdownSyncSegment | null>(null);
  const [isAudioSyncing, setIsAudioSyncing] = useState<boolean>(false);
  const [betBlockedNotice, setBetBlockedNotice] = useState<string | null>(null);

  // Once 10 seconds remain, the acceptance of new bets is closed
  const isBettingClosed = countdown <= 10 || isRevealing || isAudioSyncing;

  // Clear all pending draw sequence timeouts
  const clearAllDrawTimeouts = () => {
    drawTimeoutsRef.current.forEach((t) => clearTimeout(t));
    drawTimeoutsRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllDrawTimeouts();
      countdownAudioSync.stop();
    };
  }, []);

  // Start the 10-second vocal audio countdown with real-time sound & figure synchronization
  const start10sCountdown = () => {
    if (isRevealing || isAudioSyncing) return;
    setIsAudioSyncing(true);
    setIsBetModalOpen(false); // Close bet specification modal immediately
    setCountdown(10);

    countdownAudioSync.start(
      (segment) => {
        setAudioSyncSegment(segment);
        setCountdown(segment.number);
      },
      () => {
        // When audio finishes (after «សូមសំណាងល្អ» 0 / Draw), initiate draw sequence to reveal new result
        setIsAudioSyncing(false);
        setAudioSyncSegment(null);
        startDrawSequence(true);
      },
      sound.isMuted()
    );
  };

  const handleBlockedAttempt = () => {
    sound.playBlocked();
    setBetBlockedNotice('⚠️ ការទទួលការភ្នាល់ត្រូវបានបិទ! (Betting Closed - មិនទទួលការភ្នាល់ក្នុងអំឡុងពេលរាប់ថយក្រោយឡើយ)');
    setTimeout(() => {
      setBetBlockedNotice(null);
    }, 3200);
  };

  // Results History
  const [history, setHistory] = useState<DrawResult[]>(INITIAL_HISTORY);
  const latestResult = history[0] || null;

  // Betting State
  const [selectedChip, setSelectedChip] = useState<number>(10000); // 10,000 KHR default
  const [pendingBets, setPendingBets] = useState<Record<string, number>>({});
  const [confirmedBets, setConfirmedBets] = useState<Record<string, number>>({});
  const [lastRoundBets, setLastRoundBets] = useState<Record<string, number>>({});
  
  // Persistent Betting History Storage
  const BET_HISTORY_STORAGE_KEY = 'cambodia_lottery_12_bet_history_v2';
  const [recentBetRecords, setRecentBetRecords] = useState<BetHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(BET_HISTORY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load bet history from localStorage', e);
    }
    return [];
  });

  // Sync betting history to persistent localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(BET_HISTORY_STORAGE_KEY, JSON.stringify(recentBetRecords));
    } catch (e) {
      console.warn('Failed to save bet history to localStorage', e);
    }
  }, [recentBetRecords]);

  // Bet Amount Modal State (Appears when clicking to place a bet as per image_f977baed.png)
  const [isBetModalOpen, setIsBetModalOpen] = useState<boolean>(false);
  const [selectedBetTarget, setSelectedBetTarget] = useState<{
    category: BetCategory;
    odds: number;
    label: string;
  } | null>(null);

  // Winning Announcement Toast
  const [winNotice, setWinNotice] = useState<{ amount: number; number: number; animal: string } | null>(null);

  // Calculation of totals
  const pendingBetsTotal = Object.values(pendingBets).reduce((a, b) => a + b, 0);
  const confirmedBetsTotal = Object.values(confirmedBets).reduce((a, b) => a + b, 0);

  // Active bets map displayed on the board
  const displayedBets = { ...confirmedBets, ...pendingBets };

  // Countdown Loop (Every 3 minutes / 180 seconds)
  useEffect(() => {
    if (isRevealing || isAudioSyncing) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 11) {
          // Exactly 10 seconds remaining -> Trigger audible countdown with Real-Time Sound & Figure Synchronization
          start10sCountdown();
          return 10;
        }

        // Periodic tick
        if (prev % 10 === 0) {
          sound.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRevealing, isAudioSyncing, currentRoundIndex]);

  // Settle bets when final winning result appears
  const finalizeBets = (outcome: DrawResult) => {
    let roundTotalWinPayout = 0;
    const currentRoundId = outcome.roundId;

    // Helper to evaluate if a bet category won against the outcome
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

    // Update all pending records for this round:
    // In the event of a loss, mark it as "lost"
    setRecentBetRecords((prevRecords) => {
      return prevRecords.map((rec) => {
        if (rec.status !== 'pending' && rec.roundId !== currentRoundId) {
          return rec;
        }

        let recordWonPayout = 0;
        const updatedBets = rec.bets.map((b) => {
          const won = checkIsCategoryWon(b.type);
          const payout = won ? Math.round(b.amount * b.odds) : 0;
          if (won) {
            recordWonPayout += payout;
          }
          return {
            ...b,
            won,
            payout,
          };
        });

        const isWon = recordWonPayout > 0;
        if (isWon) {
          roundTotalWinPayout += recordWonPayout;
        }

        return {
          ...rec,
          bets: updatedBets,
          totalPayout: recordWonPayout,
          netProfit: isWon ? recordWonPayout - rec.totalStake : -rec.totalStake,
          resultNumber: outcome.number,
          status: isWon ? 'won' : 'lost', // Explicitly marked as 'lost' on loss
        };
      });
    });

    // Credit winnings and trigger celebratory animations
    if (roundTotalWinPayout > 0) {
      setBalance((prev) => prev + roundTotalWinPayout);
      setWinNotice({
        amount: roundTotalWinPayout,
        number: outcome.number,
        animal: outcome.animal,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#eab308', '#f59e0b', '#3b82f6', '#ef4444', '#10b981'],
      });
      sound.playWin();
    }
  };

  // Sequence of New Result Display (Only occurs AFTER audible countdown finishes)
  const startDrawSequence = (fromAudioCompletion: boolean = false) => {
    // Enforce that audible countdown must finish before revealing new results!
    if (!fromAudioCompletion) {
      if (!isRevealing && !isAudioSyncing) {
        start10sCountdown();
      }
      return;
    }

    if (isRevealing) return;
    clearAllDrawTimeouts();
    countdownAudioSync.stop();
    setIsAudioSyncing(false);
    setAudioSyncSegment(null);

    // 1. Determine new winning result
    const winningNum = Math.floor(Math.random() * 12) + 1;
    const animal = ANIMALS_DATA[winningNum];

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const roundId = `2004#${currentRoundIndex}`;

    const outcomeResult: DrawResult = {
      roundId,
      roundIndex: currentRoundIndex,
      time: timeStr,
      number: winningNum,
      animal: animal.khmerName,
      color: animal.color,
      size: animal.size,
      parity: animal.parity,
      timestamp: Date.now(),
    };

    setPendingWinningResult(outcomeResult);
    setIsRevealing(true);
    setCountdown(0);
    sound.playBowlShake();

    // Row 1 (Numbers 1–6): Each number appears with an interval of 1,100 milliseconds (ms)
    // Step 1: Open Number 1 at t = 0ms
    setRevealStep(1);
    sound.playCardFlip(1);

    // Numbers 2 to 6 with 1,100 ms interval
    for (let s = 2; s <= 6; s++) {
      const delay = (s - 1) * 1100;
      const t = setTimeout(() => {
        setRevealStep(s);
        sound.playCardFlip(s);
      }, delay);
      drawTimeoutsRef.current.push(t);
    }

    // Row 2 (Numbers 7–11): Each number appears with an interval of 1,100 milliseconds (ms)
    for (let s = 7; s <= 11; s++) {
      const delay = (s - 1) * 1100;
      const t = setTimeout(() => {
        setRevealStep(s);
        sound.playCardFlip(s);
      }, delay);
      drawTimeoutsRef.current.push(t);
    }

    // Row 3 (Final Result/Number 12): The final winning result appears 1,100 milliseconds (ms) after the last number of the second row
    // Number 11 was at delay = 10 * 1100 = 11,000 ms.
    // Row 3 appears at delay = 11 * 1100 = 12,100 ms (exactly 1,100ms after Number 11).
    const finalResultDelay = 11 * 1100;
    const tFinal = setTimeout(() => {
      setRevealStep(12);
      sound.playGongReveal();

      // Settle bets and calculate winnings
      finalizeBets(outcomeResult);

      // Add to history records & streak tables
      setHistory((prev) => [outcomeResult, ...prev]);

      // Display of Winning Results: Once the final winning result is displayed,
      // it remains on the screen for 5,000 milliseconds (5 seconds) before resetting for the next round.
      const tReset = setTimeout(() => {
        countdownAudioSync.stop();
        setIsAudioSyncing(false);
        setAudioSyncSegment(null);
        setIsRevealing(false);
        setRevealStep(0);
        setPendingWinningResult(null);
        setWinNotice(null);
        setCountdown(180); // Reset for next 3-minute round
        setCurrentRoundIndex((prev) => prev + 1);

        if (Object.keys(confirmedBets).length > 0) {
          setLastRoundBets(confirmedBets);
        }
        setConfirmedBets({});
        setPendingBets({});
      }, 5000);
      drawTimeoutsRef.current.push(tReset);
    }, finalResultDelay);
    drawTimeoutsRef.current.push(tFinal);
  };

  // Place bet triggers the bet amount specification modal (image_f977baed.png)
  const handlePlaceBet = (category: BetCategory, defaultOdds: number, label: string) => {
    if (isBettingClosed) {
      handleBlockedAttempt();
      return;
    }
    setSelectedBetTarget({ category, odds: defaultOdds, label });
    setIsBetModalOpen(true);
  };

  const handleConfirmBetFromModal = (
    category: BetCategory,
    amount: number,
    label: string,
    odds: number,
    _singlePost: boolean
  ) => {
    if (isBettingClosed) {
      handleBlockedAttempt();
      return;
    }
    if (balance < amount) {
      setIsTopUpOpen(true);
      return;
    }
    setBalance((prev) => prev - amount);
    setConfirmedBets((prev) => {
      const cur = prev[category] || 0;
      return {
        ...prev,
        [category]: cur + amount,
      };
    });

    // Immediate bet recording requirement:
    // "Every time a bet is placed, the data must be immediately recorded in the betting history,
    // including the bet details, the wagered amount, and the potential winnings."
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const potentialWin = Math.round(amount * odds);

    const newRecord: BetHistoryRecord = {
      id: `bet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      roundId: `2004#${currentRoundIndex}`,
      time: timeStr,
      bets: [
        {
          type: category,
          label: label || category,
          amount,
          odds,
          potentialWin,
          won: false,
          payout: 0,
        },
      ],
      totalStake: amount,
      totalPotentialPayout: potentialWin,
      totalPayout: 0,
      netProfit: -amount,
      status: 'pending',
    };

    setRecentBetRecords((prev) => [newRecord, ...prev]);
  };

  // Clear betting history if requested
  const handleClearBetHistory = () => {
    setRecentBetRecords([]);
    try {
      localStorage.removeItem(BET_HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear bet history', e);
    }
  };

  // Clear bets
  const handleClearBets = () => {
    setConfirmedBets({});
    setPendingBets({});
  };

  // Double x2 pending bets
  const handleDoubleBets = () => {
    setPendingBets((prev) => {
      const doubled: Record<string, number> = {};
      Object.entries(prev).forEach(([k, v]) => {
        doubled[k] = v * 2;
      });
      return doubled;
    });
  };

  // Repeat previous round bets
  const handleRepeatBets = () => {
    if (Object.keys(lastRoundBets).length === 0) return;
    setPendingBets(lastRoundBets);
  };

  // Add Funds
  const handleAddFunds = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col font-['Kantumruy_Pro',sans-serif] text-slate-800">
      {/* 1. Header Navigation Bar (Matches screenshot top tabs) */}
      <HeaderNav
        activeMainTab={activeMainTab}
        onSelectMainTab={setActiveMainTab}
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* 2. Main Body Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* If user selected ឆ្នោត 1/99 */}
        {activeMainTab === 'lottery_1_99' ? (
          <Lottery199
            balance={balance}
            onUpdateBalance={setBalance}
            onOpenTopUp={() => setIsTopUpOpen(true)}
          />
        ) : activeMainTab !== 'lottery_12' ? (
          <OtherGamesView
            tab={activeMainTab}
            onReturnTo12={() => setActiveMainTab('lottery_12')}
          />
        ) : activeSubTab === 'win_loss' ? (
          <WinLossView
            records={recentBetRecords}
            onBackToGame={() => setActiveSubTab('lottery')}
          />
        ) : activeSubTab === 'results' ? (
          <ResultsView
            history={history}
            onBackToGame={() => setActiveSubTab('lottery')}
          />
        ) : (
          /* Main Cambodian 12 Lottery Board (Exact recreation of user screenshot) */
          <>
            {/* Left Sidebar (Balance, Latest Results, Recent Bets) */}
            <Sidebar
              balance={balance}
              activeBetsTotal={confirmedBetsTotal + pendingBetsTotal}
              latestResults={history}
              recentBets={recentBetRecords}
              onAddBalance={() => setIsTopUpOpen(true)}
              onRefreshResults={() => sound.playButton()}
              onClearBetsHistory={handleClearBetHistory}
            />

            {/* Right Main Playfield */}
            <div className="flex-1 flex flex-col bg-white overflow-x-auto min-w-[760px]">
              {/* Top Row: Center Bowls (Left) & Betting Odds + 12 Animals (Right) */}
              <div className="flex flex-col md:flex-row border-b border-[#94a3b8]">
                {/* 12 Bowls & Center Main Chamber */}
                <BowlDrawArea
                  countdown={countdown}
                  isRevealing={isRevealing}
                  revealStep={revealStep}
                  latestResult={isRevealing ? pendingWinningResult : latestResult}
                  onBowlClick={(num) =>
                    handlePlaceBet(`animal_${num}` as BetCategory, 11, `ពានលេខ ${num}`)
                  }
                  onTriggerDraw={start10sCountdown}
                  audioSyncSegment={audioSyncSegment}
                  isBettingClosed={isBettingClosed}
                  onTrigger10sCountdown={start10sCountdown}
                  onBlockedAttempt={handleBlockedAttempt}
                />

                {/* Right Betting Board (Countdown block, odds buttons, 12 animal cards) */}
                <BettingBoard
                  countdown={countdown}
                  currentRoundId={`2004#${currentRoundIndex}`}
                  currentRoundTime={currentRoundTime}
                  activeBets={displayedBets}
                  onPlaceBet={handlePlaceBet}
                  selectedChip={selectedChip}
                  latestResult={isRevealing && revealStep >= 12 ? pendingWinningResult : latestResult}
                  isRevealing={isRevealing && revealStep >= 12}
                  revealStep={revealStep}
                  onRefreshRound={start10sCountdown}
                  audioSyncSegment={audioSyncSegment}
                  isBettingClosed={isBettingClosed}
                  onBlockedAttempt={handleBlockedAttempt}
                />
              </div>

              {/* Bottom Row: Streak Roads & Bead Plate (លេខ / តូចធំ & ពណ៌ / សេសគូ) */}
              <RoadGrid history={history} />
            </div>
          </>
        )}
      </div>

      {/* Floating Bet Blocked Warning Toast */}
      {betBlockedNotice && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-6 py-2.5 rounded-full shadow-2xl border-2 border-yellow-300 flex items-center gap-3 animate-bounce">
          <span className="text-xl">🚫</span>
          <div className="font-black text-sm drop-shadow">
            {betBlockedNotice}
          </div>
        </div>
      )}

      {/* Floating Win Notification Banner */}
      {winNotice && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-900 px-6 py-2.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-3 animate-bounce">
          <span className="text-xl">🏆</span>
          <div className="font-black text-sm">
            អបអរសាទរ! អ្នកបានឈ្នះ{' '}
            <span className="text-red-700 font-extrabold text-base underline">
              +{winNotice.amount.toLocaleString()}៛
            </span>{' '}
            (លេខ {winNotice.number} {winNotice.animal})
          </div>
        </div>
      )}

      {/* Top-up Balance Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        currentBalance={balance}
        onAddFunds={handleAddFunds}
      />

      {/* Help & Rules Modal */}
      <HelpRulesModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Bet Amount Specification Modal (Matches image_f977baed.png) */}
      <BetAmountModal
        isOpen={isBetModalOpen}
        onClose={() => setIsBetModalOpen(false)}
        onConfirmBet={handleConfirmBetFromModal}
        currentRoundId={`2005#${currentRoundIndex}`}
        currentRoundTime={currentRoundTime}
        betCategory={selectedBetTarget?.category || null}
        betLabel={selectedBetTarget?.label || ''}
        betOdds={selectedBetTarget?.odds || 1.95}
        balance={balance}
        onOpenTopUp={() => setIsTopUpOpen(true)}
        isBettingClosed={isBettingClosed}
      />
    </div>
  );
}
