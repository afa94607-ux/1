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
import { sound } from './utils/sound';
import {
  ANIMALS_DATA,
  DrawResult,
  BetCategory,
  BetHistoryRecord,
} from './types';

// Preloaded historical results replicating the exact image data and streak roads
const INITIAL_HISTORY: DrawResult[] = [
  { roundId: '2004#283', roundIndex: 283, time: '16:19', number: 7, animal: 'មមី', color: 'red', size: 'big', parity: 'odd', timestamp: Date.now() - 180000 },
  { roundId: '2004#282', roundIndex: 282, time: '16:15', number: 6, animal: 'ម្សាញ់', color: 'blue', size: 'small', parity: 'even', timestamp: Date.now() - 360000 },
  { roundId: '2004#281', roundIndex: 281, time: '16:12', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 540000 },
  { roundId: '2004#280', roundIndex: 280, time: '16:08', number: 4, animal: 'ថោះ', color: 'red', size: 'small', parity: 'even', timestamp: Date.now() - 720000 },
  { roundId: '2004#279', roundIndex: 279, time: '16:05', number: 3, animal: 'ខាល', color: 'blue', size: 'small', parity: 'odd', timestamp: Date.now() - 900000 },
  { roundId: '2004#278', roundIndex: 278, time: '16:01', number: 2, animal: 'ឆ្លូវ', color: 'green', size: 'small', parity: 'even', timestamp: Date.now() - 1080000 },
  { roundId: '2004#277', roundIndex: 277, time: '15:58', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 1260000 },
  { roundId: '2004#276', roundIndex: 276, time: '15:54', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 1440000 },
  { roundId: '2004#275', roundIndex: 275, time: '15:50', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 1620000 },
  { roundId: '2004#274', roundIndex: 274, time: '15:47', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 1800000 },
  { roundId: '2004#273', roundIndex: 273, time: '15:43', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 1980000 },
  { roundId: '2004#272', roundIndex: 272, time: '15:40', number: 2, animal: 'ឆ្លូវ', color: 'green', size: 'small', parity: 'even', timestamp: Date.now() - 2160000 },
  { roundId: '2004#271', roundIndex: 271, time: '15:36', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 2340000 },
  { roundId: '2004#270', roundIndex: 270, time: '15:32', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 2520000 },
  { roundId: '2004#269', roundIndex: 269, time: '15:28', number: 1, animal: 'ជូត', color: 'red', size: 'small', parity: 'odd', timestamp: Date.now() - 2700000 },
  { roundId: '2004#268', roundIndex: 268, time: '15:25', number: 9, animal: 'វក', color: 'blue', size: 'big', parity: 'odd', timestamp: Date.now() - 2880000 },
  { roundId: '2004#267', roundIndex: 267, time: '15:21', number: 5, animal: 'រោង', color: 'green', size: 'small', parity: 'odd', timestamp: Date.now() - 3060000 },
  { roundId: '2004#266', roundIndex: 266, time: '15:18', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 3240000 },
  { roundId: '2004#265', roundIndex: 265, time: '15:14', number: 11, animal: 'ច', color: 'green', size: 'big', parity: 'odd', timestamp: Date.now() - 3420000 },
  { roundId: '2004#264', roundIndex: 264, time: '15:10', number: 3, animal: 'ខាល', color: 'blue', size: 'small', parity: 'odd', timestamp: Date.now() - 3600000 },
  { roundId: '2004#263', roundIndex: 263, time: '15:06', number: 11, animal: 'ច', color: 'green', size: 'big', parity: 'odd', timestamp: Date.now() - 3780000 },
  { roundId: '2004#262', roundIndex: 262, time: '15:02', number: 12, animal: 'កុរ', color: 'blue', size: 'big', parity: 'even', timestamp: Date.now() - 3960000 },
  { roundId: '2004#261', roundIndex: 261, time: '14:58', number: 8, animal: 'មមែ', color: 'green', size: 'big', parity: 'even', timestamp: Date.now() - 4140000 },
  { roundId: '2004#260', roundIndex: 260, time: '14:54', number: 2, animal: 'ឆ្លូវ', color: 'green', size: 'small', parity: 'even', timestamp: Date.now() - 4320000 },
  { roundId: '2004#259', roundIndex: 259, time: '14:50', number: 7, animal: 'មមី', color: 'red', size: 'big', parity: 'odd', timestamp: Date.now() - 4500000 },
  { roundId: '2004#258', roundIndex: 258, time: '14:46', number: 7, animal: 'មមី', color: 'red', size: 'big', parity: 'odd', timestamp: Date.now() - 4680000 },
];

export default function App() {
  // Navigation State
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('lottery_12');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('lottery');

  // Account & Wallet State
  const [balance, setBalance] = useState<number>(500000); // 500,000 KHR initial
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Round & Timer State (70s countdown matching image)
  const [countdown, setCountdown] = useState<number>(70);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(284);
  const [currentRoundTime, setCurrentRoundTime] = useState<string>('16:22');
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  // Results History
  const [history, setHistory] = useState<DrawResult[]>(INITIAL_HISTORY);
  const latestResult = history[0] || null;

  // Betting State
  const [selectedChip, setSelectedChip] = useState<number>(10000); // 10,000 KHR default
  const [pendingBets, setPendingBets] = useState<Record<string, number>>({});
  const [confirmedBets, setConfirmedBets] = useState<Record<string, number>>({});
  const [lastRoundBets, setLastRoundBets] = useState<Record<string, number>>({});
  const [recentBetRecords, setRecentBetRecords] = useState<BetHistoryRecord[]>([]);

  // Winning Announcement Toast
  const [winNotice, setWinNotice] = useState<{ amount: number; number: number; animal: string } | null>(null);

  // Calculation of totals
  const pendingBetsTotal = Object.values(pendingBets).reduce((a, b) => a + b, 0);
  const confirmedBetsTotal = Object.values(confirmedBets).reduce((a, b) => a + b, 0);

  // Active bets map displayed on the board
  const displayedBets = { ...confirmedBets, ...pendingBets };

  // Countdown Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger draw reveal
          handleDrawResult();
          return 70;
        }

        // Sound cues
        if (prev <= 6 && prev > 1) {
          sound.playUrgentTick();
        } else if (prev % 10 === 0) {
          sound.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRoundIndex, confirmedBets]);

  // Handle Draw Outcome
  const handleDrawResult = () => {
    sound.playBowlShake();
    setIsRevealing(true);

    // Random drawn number (1 to 12)
    const winningNum = Math.floor(Math.random() * 12) + 1;
    const animal = ANIMALS_DATA[winningNum];

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const roundId = `2004#${currentRoundIndex}`;

    const newResult: DrawResult = {
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

    // Calculate payouts for confirmed bets
    let totalWinPayout = 0;
    const currentRoundStake = Object.values(confirmedBets).reduce((a, b) => a + b, 0);

    const betDetails: {
      type: BetCategory;
      label: string;
      amount: number;
      odds: number;
      won: boolean;
      payout: number;
    }[] = [];

    Object.entries(confirmedBets).forEach(([catKey, amount]) => {
      let won = false;
      let odds = 1.95;
      let label = catKey;

      if (catKey === 'small') {
        label = 'តូច (Small)';
        odds = 1.95;
        won = animal.size === 'small';
      } else if (catKey === 'big') {
        label = 'ធំ (Big)';
        odds = 1.95;
        won = animal.size === 'big';
      } else if (catKey === 'odd') {
        label = 'សេស (Odd)';
        odds = 1.95;
        won = animal.parity === 'odd';
      } else if (catKey === 'even') {
        label = 'គូ (Even)';
        odds = 1.95;
        won = animal.parity === 'even';
      } else if (catKey === 'color_red') {
        label = 'ក្រហម (Red)';
        odds = 2.95;
        won = animal.color === 'red';
      } else if (catKey === 'color_green') {
        label = 'បៃតង (Green)';
        odds = 2.95;
        won = animal.color === 'green';
      } else if (catKey === 'color_blue') {
        label = 'ខៀវ (Blue)';
        odds = 2.95;
        won = animal.color === 'blue';
      } else if (catKey.startsWith('animal_')) {
        const betNum = parseInt(catKey.replace('animal_', ''), 10);
        label = `${betNum}. ${ANIMALS_DATA[betNum]?.khmerName}`;
        odds = 11;
        won = betNum === winningNum;
      }

      const payout = won ? Math.round(amount * odds) : 0;
      if (won) {
        totalWinPayout += payout;
      }

      betDetails.push({
        type: catKey as BetCategory,
        label,
        amount,
        odds,
        won,
        payout,
      });
    });

    // Record win/loss history if player had placed bets
    if (currentRoundStake > 0) {
      const isWon = totalWinPayout > 0;
      const historyItem: BetHistoryRecord = {
        id: `bet_${Date.now()}`,
        roundId,
        time: timeStr,
        bets: betDetails,
        totalStake: currentRoundStake,
        totalPayout: totalWinPayout,
        netProfit: totalWinPayout - currentRoundStake,
        resultNumber: winningNum,
        status: isWon ? 'won' : 'lost',
      };
      setRecentBetRecords((prev) => [historyItem, ...prev]);

      // Credit winnings
      if (totalWinPayout > 0) {
        setBalance((prev) => prev + totalWinPayout);
        setWinNotice({
          amount: totalWinPayout,
          number: winningNum,
          animal: animal.khmerName,
        });

        // Festive confetti & victory sound
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#eab308', '#f59e0b', '#3b82f6', '#ef4444', '#10b981'],
        });
        sound.playWin();
      }
    }

    // Play reveal gong
    sound.playGongReveal();

    // Update history list and advance round
    setHistory((prev) => [newResult, ...prev]);
    if (Object.keys(confirmedBets).length > 0) {
      setLastRoundBets(confirmedBets);
    }
    setConfirmedBets({});
    setPendingBets({});

    // Advance round ID
    setCurrentRoundIndex((prev) => prev + 1);

    // Turn off reveal state after 5 seconds
    setTimeout(() => {
      setIsRevealing(false);
      setWinNotice(null);
    }, 5500);
  };

  // Place bet directly on board
  const handlePlaceBet = (category: BetCategory, defaultOdds: number, label: string) => {
    const chipAmount = 1000; // 1,000 KHR per click
    if (balance < chipAmount) {
      setIsTopUpOpen(true);
      return;
    }
    sound.playChip();
    setBalance((prev) => prev - chipAmount);
    setConfirmedBets((prev) => {
      const cur = prev[category] || 0;
      return {
        ...prev,
        [category]: cur + chipAmount,
      };
    });
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
            />

            {/* Right Main Playfield */}
            <div className="flex-1 flex flex-col bg-white overflow-x-auto min-w-[760px]">
              {/* Top Row: Center Bowls (Left) & Betting Odds + 12 Animals (Right) */}
              <div className="flex flex-col md:flex-row border-b border-[#94a3b8]">
                {/* 12 Bowls & Center Main Chamber */}
                <BowlDrawArea
                  countdown={countdown}
                  isRevealing={isRevealing}
                  latestResult={latestResult}
                  onBowlClick={(num) =>
                    handlePlaceBet(`animal_${num}` as BetCategory, 11, `ពានលេខ ${num}`)
                  }
                />

                {/* Right Betting Board (Countdown block, odds buttons, 12 animal cards) */}
                <BettingBoard
                  countdown={countdown}
                  currentRoundId={`2004#${currentRoundIndex}`}
                  currentRoundTime={currentRoundTime}
                  activeBets={displayedBets}
                  onPlaceBet={handlePlaceBet}
                  selectedChip={selectedChip}
                  latestResult={latestResult}
                  isRevealing={isRevealing}
                  onRefreshRound={() => sound.playButton()}
                />
              </div>

              {/* Bottom Row: Streak Roads & Bead Plate (លេខ / តូចធំ & ពណ៌ / សេសគូ) */}
              <RoadGrid history={history} />
            </div>
          </>
        )}
      </div>

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
    </div>
  );
}
