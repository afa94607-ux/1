import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GoldIngotIcon } from './AnimalIllustrations';
import { sound } from '../utils/sound';
import { PostLetter, Lottery199Result, Lottery199BetRecord } from '../types';
import { Maximize2, RotateCcw, Printer, Send, Trash2, CheckCircle, RefreshCw } from 'lucide-react';

interface Lottery199Props {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onOpenTopUp: () => void;
}

// Initial history matching the exact screenshot
const INITIAL_199_HISTORY: Lottery199Result[] = [
  {
    roundId: '26305#194',
    roundIndex: 194,
    time: '16:30',
    posts: { A: 13, B: 20, C: 23, D: 29, E: 74 },
    timestamp: Date.now() - 60000,
  },
  {
    roundId: '26305#193',
    roundIndex: 193,
    time: '16:25',
    posts: { A: 68, B: 50, C: 60, D: 98, E: 54 },
    timestamp: Date.now() - 360000,
  },
  {
    roundId: '26305#192',
    roundIndex: 192,
    time: '16:20',
    posts: { A: 88, B: 63, C: 98, D: 10, E: 29 },
    timestamp: Date.now() - 660000,
  },
  {
    roundId: '26305#191',
    roundIndex: 191,
    time: '16:15',
    posts: { A: 84, B: 70, C: 85, D: 20, E: 76 },
    timestamp: Date.now() - 960000,
  },
  {
    roundId: '26305#190',
    roundIndex: 190,
    time: '16:09',
    posts: { A: 69, B: 13, C: 49, D: 14, E: 43 },
    timestamp: Date.now() - 1320000,
  },
  {
    roundId: '26305#189',
    roundIndex: 189,
    time: '16:04',
    posts: { A: 97, B: 24, C: 65, D: 85, E: 28 },
    timestamp: Date.now() - 1620000,
  },
];

export const Lottery199: React.FC<Lottery199Props> = ({
  balance,
  onUpdateBalance,
  onOpenTopUp,
}) => {
  // Timer & Round State (Screenshot displays 00:00:25)
  const [countdown, setCountdown] = useState<number>(25);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(195);
  const [currentRoundId, setCurrentRoundId] = useState<string>('26305#195');
  const [previousRoundId, setPreviousRoundId] = useState<string>('26305#194');

  // Reel Display State
  const [displayPosts, setDisplayPosts] = useState<Record<PostLetter, number>>({
    A: 13,
    B: 20,
    C: 23,
    D: 29,
    E: 74,
  });
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // History & Betting with persistent storage
  const LOTTERY_199_STORAGE_KEY = 'cambodia_lottery_199_bet_history_v2';
  const [history, setHistory] = useState<Lottery199Result[]>(INITIAL_199_HISTORY);
  const [recentBets, setRecentBets] = useState<Lottery199BetRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOTTERY_199_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load 199 bet history', e);
    }
    return [];
  });

  // Sync 1/99 bets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOTTERY_199_STORAGE_KEY, JSON.stringify(recentBets));
    } catch (e) {
      console.warn('Failed to save 199 bet history', e);
    }
  }, [recentBets]);

  // Selection Controls
  const [mode, setMode] = useState<'number' | 'range'>('number');
  const [selectedPosts, setSelectedPosts] = useState<PostLetter[]>(['A', 'B', 'C', 'D', 'E']);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [stakeAmount, setStakeAmount] = useState<number>(1000); // 1,000 KHR default

  // Total stake calculation
  const totalBetsCount = selectedNumbers.length * (selectedPosts.length || 1);
  const totalStake = totalBetsCount * stakeAmount;

  // Active betting in play
  const [activeStakeInPlay, setActiveStakeInPlay] = useState<number>(0);

  // Notification Toast
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Countdown Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerDraw();
          return 30; // 30s quick rounds
        }
        if (prev <= 4) {
          sound.playUrgentTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRoundIndex, selectedPosts, selectedNumbers, stakeAmount, balance]);

  // Trigger draw and reel roll
  const triggerDraw = () => {
    sound.playBowlShake();
    setIsSpinning(true);

    // Roll random reels for 2.5 seconds
    const interval = setInterval(() => {
      setDisplayPosts({
        A: Math.floor(Math.random() * 99) + 1,
        B: Math.floor(Math.random() * 99) + 1,
        C: Math.floor(Math.random() * 99) + 1,
        D: Math.floor(Math.random() * 99) + 1,
        E: Math.floor(Math.random() * 99) + 1,
      });
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);

      // Final numbers for this round
      const finalA = Math.floor(Math.random() * 99) + 1;
      const finalB = Math.floor(Math.random() * 99) + 1;
      const finalC = Math.floor(Math.random() * 99) + 1;
      const finalD = Math.floor(Math.random() * 99) + 1;
      const finalE = Math.floor(Math.random() * 99) + 1;

      const finalPosts = { A: finalA, B: finalB, C: finalC, D: finalD, E: finalE };
      setDisplayPosts(finalPosts);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newRecord: Lottery199Result = {
        roundId: currentRoundId,
        roundIndex: currentRoundIndex,
        time: timeStr,
        posts: finalPosts,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newRecord, ...prev]);
      setPreviousRoundId(currentRoundId);
      setCurrentRoundIndex((p) => p + 1);
      setCurrentRoundId(`26305#${currentRoundIndex + 1}`);

      // Evaluate any active bets placed on this round
      if (activeStakeInPlay > 0) {
        let totalWinPayout = 0;
        const hits: { post: PostLetter; number: string; payout: number }[] = [];

        selectedPosts.forEach((post) => {
          const drawnNum = finalPosts[post];
          const drawnStr = String(drawnNum).padStart(2, '0');
          if (selectedNumbers.includes(drawnStr)) {
            // Hitting 2D number on 1/99 pays 80x stake
            const winAmount = stakeAmount * 80;
            totalWinPayout += winAmount;
            hits.push({ post, number: drawnStr, payout: winAmount });
          }
        });

        const isWon = totalWinPayout > 0;
        setRecentBets((prev) =>
          prev.map((rec) => {
            if (rec.status !== 'pending' && rec.roundId !== currentRoundId) return rec;
            return {
              ...rec,
              totalPayout: totalWinPayout,
              status: isWon ? 'won' : 'lost',
              winningDetails: hits,
            };
          })
        );
        setActiveStakeInPlay(0);

        if (isWon) {
          onUpdateBalance(balance + totalWinPayout);
          setToastNotice(`🎉 អបអរសាទរ! អ្នកបានត្រូវឆ្នោត 1/99 ឈ្នះ +${totalWinPayout.toLocaleString()}៛!`);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#ef4444', '#a855f7', '#f59e0b', '#22c55e'],
          });
          sound.playWin();
        } else {
          sound.playGongReveal();
        }
      } else {
        sound.playGongReveal();
      }
    }, 2200);
  };

  // Toggle Post selection (A, B, C, D, E)
  const togglePost = (post: PostLetter) => {
    sound.playButton();
    setSelectedPosts((prev) =>
      prev.includes(post)
        ? prev.length > 1
          ? prev.filter((p) => p !== post)
          : prev
        : [...prev, post]
    );
  };

  // Toggle Number selection (01 to 99)
  const toggleNumber = (numStr: string) => {
    sound.playChip();
    setSelectedNumbers((prev) =>
      prev.includes(numStr) ? prev.filter((n) => n !== numStr) : [...prev, numStr]
    );
  };

  // Preset stake buttons
  const presetAmounts = [
    { label: '1រយ', value: 100 },
    { label: '5រយ', value: 500 },
    { label: '1ពាន់', value: 1000 },
    { label: '2ពាន់', value: 2000 },
    { label: '5ពាន់', value: 5000 },
    { label: '1ម៉ឺន', value: 10000 },
    { label: '2ម៉ឺន', value: 20000 },
    { label: '5ម៉ឺន', value: 50000 },
  ];

  // Submit bet
  const handleConfirmBet = () => {
    if (selectedNumbers.length === 0) {
      alert('សូមជ្រើសរើសលេខយ៉ាងហោចណាស់ ១ (01-99) ដើម្បីចាក់!');
      return;
    }
    if (balance < totalStake) {
      onOpenTopUp();
      return;
    }

    sound.playChip();
    onUpdateBalance(balance - totalStake);
    setActiveStakeInPlay((prev) => prev + totalStake);

    // Immediately record pending bet into persistent history
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newBetRecord: Lottery199BetRecord = {
      id: `199_bet_${Date.now()}`,
      roundId: currentRoundId,
      time: timeStr,
      posts: [...selectedPosts],
      numbers: [...selectedNumbers],
      amountPerBet: stakeAmount,
      totalStake: totalStake,
      totalPayout: 0,
      status: 'pending',
    };
    setRecentBets((prev) => [newBetRecord, ...prev]);

    setToastNotice(`បានបញ្ជូនការភ្នាល់ ${totalStake.toLocaleString()}៛ ជោគជ័យ!`);
    setTimeout(() => setToastNotice(null), 3000);
  };

  // Clear selections
  const handleClearSelections = () => {
    sound.playButton();
    setSelectedNumbers([]);
  };

  // Format timer 00:00:25
  const formatTimer = (sec: number) => {
    const s = String(sec).padStart(2, '0');
    return `00:00:${s}`;
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white select-none">
      {/* 1. Left Column (Account Balance, Recent 3 Bets, Illustration) */}
      <div className="w-full lg:w-[260px] xl:w-[280px] bg-white border-r border-[#94a3b8] flex flex-col text-xs">
        {/* Top Header Card */}
        <div className="p-3 border-b border-[#cbd5e1] bg-slate-50">
          <div className="flex items-center justify-between text-[#1e40af] font-bold text-xs mb-1.5">
            <span>2026-11-01</span>
            <button
              onClick={() => sound.playButton()}
              className="text-slate-500 hover:text-blue-600 transition-transform active:rotate-180"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[#1e40af] font-bold text-xs mb-2">
            (៛) AADPDPP004
          </div>

          {/* Row 1: Balance (សមតុល្យទឹកប្រាក់) */}
          <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-200">
            <span className="text-slate-700 font-medium">សមតុល្យទឹកប្រាក់</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#16a34a] font-bold text-sm">
                {balance.toLocaleString()}៛
              </span>
              <button
                onClick={onOpenTopUp}
                className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded shadow-xs"
                title="បញ្ចូលទឹកប្រាក់"
              >
                +
              </button>
            </div>
          </div>

          {/* Row 2: Betting in play (លុយកំពុងភ្នាល់) */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-700 font-medium">លុយកំពុងភ្នាល់</span>
            <span className="text-[#16a34a] font-bold text-sm">
              {activeStakeInPlay.toLocaleString()}៛
            </span>
          </div>
        </div>

        {/* Recent 3 Bets Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#e2e8f0] text-slate-800 font-bold border-y border-[#cbd5e1]">
          <div className="flex items-center gap-1">
            <span>ទើបភ្នាល់</span>
            <span className="bg-white text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-300">
              {recentBets.length}
            </span>
            <span className="text-slate-500 text-[10px] font-normal">(History)</span>
          </div>
          <div className="flex items-center gap-1.5">
            {recentBets.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRecentBets([]);
                  try {
                    localStorage.removeItem(LOTTERY_199_STORAGE_KEY);
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="text-slate-500 hover:text-rose-600 transition-colors text-[10px] underline"
                title="Clear history"
              >
                លុប
              </button>
            )}
            <button onClick={() => sound.playButton()} className="text-slate-600 hover:text-blue-700">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Bets List */}
        <div className="divide-y divide-slate-100 bg-white max-h-[260px] overflow-y-auto scrollbar-thin">
          {recentBets.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs italic">
              មិនទាន់មានការភ្នាល់នៅឡើយទេ
            </div>
          ) : (
            recentBets.slice(0, 5).map((bet) => (
              <div key={bet.id} className="p-2 flex flex-col gap-1 text-[11px] hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-bold text-blue-700">{bet.roundId}</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] border ${
                      bet.status === 'won'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : bet.status === 'lost'
                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold tracking-wide'
                        : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                    }`}
                  >
                    {bet.status === 'won' ? 'ឈ្នះ (Won)' : bet.status === 'lost' ? 'Lost' : 'កំពុងរង់ចាំ'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 text-[10px]">
                  <span>ប៉ុស្តិ៍ {bet.posts.join(',')} ({bet.numbers.length} លេខ)</span>
                  <span className="text-blue-600 font-mono font-bold bg-blue-50 px-1 rounded">x80</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-[10px] pt-1 border-t border-dashed border-slate-100">
                  <span>ភ្នាល់: <strong className="text-slate-900">{bet.totalStake.toLocaleString()}៛</strong></span>
                  <span>
                    {bet.status === 'pending' ? (
                      <span className="text-emerald-700 font-medium">
                        អាចឈ្នះ: <strong className="text-emerald-800 font-bold">{(bet.amountPerBet * 80).toLocaleString()}៛</strong>
                      </span>
                    ) : bet.status === 'won' ? (
                      <span className="text-emerald-600 font-bold">
                        +{bet.totalPayout.toLocaleString()}៛
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold">
                        Lost (-{bet.totalStake.toLocaleString()}៛)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Graphic Illustration */}
        <div className="mt-auto p-4 flex flex-col items-center justify-center border-t border-slate-200 bg-slate-50/60">
          <svg className="w-28 h-20 text-slate-400 drop-shadow-sm" viewBox="0 0 120 80" fill="none">
            <rect x="25" y="10" width="70" height="48" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <line x1="30" y1="20" x2="85" y2="20" stroke="#cbd5e1" strokeWidth="1.5" />
            <polyline points="32,45 45,35 55,42 70,30 85,38" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="55" y="58" width="10" height="10" fill="#94a3b8" />
            <line x1="45" y1="68" x2="75" y2="68" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <path d="M 98 68 L 106 68 L 104 56 L 100 56 Z" fill="#b45309" />
            <path d="M 102 56 C 96 46, 102 38, 108 40" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <rect x="10" y="32" width="12" height="26" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
          <div className="text-[11px] text-slate-500 font-medium text-center mt-1">
            ឆ្នោត 1/99 ប្រពៃណីខ្មែរ
          </div>
        </div>
      </div>

      {/* 2. Center Column: Live Draw Arena + 01-99 Number Matrix */}
      <div className="flex-1 flex flex-col border-r border-[#94a3b8] overflow-y-auto">
        {/* Top Galaxy Live Draw Stage */}
        <div className="relative bg-gradient-to-b from-[#2e1065] via-[#3b0764] to-[#1e1b4b] p-3 text-white overflow-hidden shadow-inner min-h-[220px] flex flex-col justify-between">
          {/* Subtle Stage Spotlights / Star Dust */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-10 left-1/4 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 right-1/4 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

          {/* Stage Header */}
          <div className="flex items-start justify-between relative z-10">
            {/* Left: Golden Ingot Icon & Ornate Title */}
            <div className="flex items-center gap-2.5">
              <GoldIngotIcon size={44} className="shadow-lg border-amber-300" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide font-['Siemreap',sans-serif]">
                  រ៉ែ សំណាង
                </h1>
                <div className="text-[11px] text-slate-300 font-mono tracking-wider font-semibold">
                  01-11-2026 &nbsp; {previousRoundId}
                </div>
              </div>
            </div>

            {/* Right: Fullscreen Icon & Digital Timer Box */}
            <div className="flex flex-col items-end gap-1">
              <button
                className="p-1 text-slate-300 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* White Timer Card */}
              <div className="bg-white text-slate-900 px-3 py-1 rounded-lg border-2 border-slate-300 shadow-xl flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-black font-mono tracking-widest leading-tight text-slate-950">
                  {formatTimer(countdown)}
                </div>
                <div className="text-[10px] text-slate-600 font-bold tracking-tight">
                  01-11-2026 &nbsp; {currentRoundId}
                </div>
              </div>
            </div>
          </div>

          {/* Center 5-Post Slot Reel Cabinet */}
          <div className="my-3 flex justify-center relative z-10">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#854d0e] border-2 border-[#fde047] shadow-[0_10px_25px_rgba(0,0,0,0.6)] max-w-lg w-full">
              <div className="grid grid-cols-5 bg-white rounded-xl overflow-hidden border border-amber-900/40 divide-x divide-slate-300 shadow-inner">
                {/* 5 Columns: A, B, C, D, E */}
                {(['A', 'B', 'C', 'D', 'E'] as PostLetter[]).map((post) => {
                  const num = displayPosts[post];
                  const numStr = String(num).padStart(2, '0');

                  // Number text colors matching screenshot
                  const numColorClass =
                    post === 'A'
                      ? 'text-[#0284c7]' // Bright cyan/blue
                      : post === 'B'
                      ? 'text-[#ef4444]' // Red
                      : post === 'C'
                      ? 'text-[#4338ca]' // Slate purple/blue
                      : post === 'D'
                      ? 'text-[#d97706]' // Amber / gold
                      : 'text-[#16a34a]'; // Emerald green

                  return (
                    <div key={post} className="flex flex-col items-center">
                      {/* Red Post Header Plate */}
                      <div className="w-full bg-gradient-to-b from-[#dc2626] to-[#b91c1c] text-white py-1 text-center font-black text-sm sm:text-base border-b border-red-900 shadow-xs">
                        {post}
                      </div>

                      {/* White Slot Window */}
                      <div className="w-full py-2 sm:py-3 bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center">
                        <span
                          className={`text-2xl sm:text-4xl font-black tracking-tight ${numColorClass} drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform ${
                            isSpinning ? 'scale-110 blur-[0.5px]' : ''
                          }`}
                        >
                          {numStr}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Mode & Post Selection Row */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          {/* Radio Buttons */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-800 font-bold">
              <input
                type="radio"
                name="bet_mode"
                checked={mode === 'number'}
                onChange={() => setMode('number')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span>លេខ</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
              <input
                type="radio"
                name="bet_mode"
                checked={mode === 'range'}
                onChange={() => setMode('range')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span>ចន្លោះ</span>
            </label>
          </div>

          <span className="text-slate-300">|</span>

          {/* Post Selection Circles: A, B, C, D, E */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">ប៉ុស្តិ៍:</span>
            {(['A', 'B', 'C', 'D', 'E'] as PostLetter[]).map((post) => {
              const isSelected = selectedPosts.includes(post);
              return (
                <button
                  key={post}
                  onClick={() => togglePost(post)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all transform active:scale-95 shadow-xs ${
                    isSelected
                      ? 'bg-[#2563eb] text-white shadow-md ring-2 ring-blue-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {post}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              sound.playButton();
              setSelectedPosts(['A', 'B', 'C', 'D', 'E']);
            }}
            className="text-[11px] text-blue-600 hover:underline"
          >
            (ជ្រើសទាំងអស់ A-E)
          </button>
        </div>

        {/* 3. Numbers Matrix 01 to 99 (5 rows of 20 circular pills) */}
        <div className="p-3 bg-white flex-1 overflow-x-auto flex flex-col items-center justify-center">
          <div className="space-y-1.5 min-w-[700px] w-full max-w-4xl">
            {Array.from({ length: 5 }).map((_, rowIdx) => {
              const start = rowIdx * 20 + 1;
              const count = rowIdx === 4 ? 19 : 20; // 99 numbers total

              return (
                <div key={rowIdx} className="flex justify-between gap-1">
                  {Array.from({ length: count }).map((_, colIdx) => {
                    const num = start + colIdx;
                    const numStr = String(num).padStart(2, '0');
                    const isSelected = selectedNumbers.includes(numStr);

                    return (
                      <button
                        key={numStr}
                        onClick={() => toggleNumber(numStr)}
                        className={`flex-1 h-8 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-2xs ${
                          isSelected
                            ? 'bg-[#facc15] text-slate-950 border-amber-500 ring-2 ring-amber-400 font-black shadow-md scale-105'
                            : 'bg-white text-slate-800 border-[#cbd5e1] hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {numStr}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Quick selection status */}
          <div className="mt-3 flex items-center justify-between w-full max-w-4xl text-xs text-slate-600 px-2">
            <div>
              បានជ្រើសរើស:{' '}
              <span className="font-bold text-blue-700">
                {selectedNumbers.length} លេខ
              </span>{' '}
              | ប៉ុស្តិ៍:{' '}
              <span className="font-bold text-blue-700">
                {selectedPosts.join(', ')}
              </span>
            </div>
            {selectedNumbers.length > 0 && (
              <button
                onClick={handleClearSelections}
                className="text-rose-600 hover:underline flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" /> លុបការជ្រើសរើសទាំងអស់
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Right Column: Betting Stake Controls & Recent Results */}
      <div className="w-full lg:w-[320px] xl:w-[350px] bg-white flex flex-col text-xs">
        {/* Betting Stake Box */}
        <div className="p-3 border-b border-slate-200 bg-slate-50">
          {/* Stake Input */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">ទឹកប្រាក់:</span>
            <div className="flex-1 relative">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Math.max(100, Number(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-bold text-slate-900 bg-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 top-1.5 text-slate-400 text-xs pointer-events-none">
                ៛
              </span>
            </div>
            <button
              onClick={() => {
                sound.playButton();
                setStakeAmount(0);
              }}
              className="px-2.5 py-1.5 bg-[#64748b] hover:bg-slate-600 text-white font-bold rounded transition-colors"
            >
              លុប
            </button>
          </div>

          {/* Quick Amount Pills */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {presetAmounts.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  sound.playChip();
                  setStakeAmount(p.value);
                }}
                className={`py-1 rounded-full text-center font-bold text-[11px] border transition-all ${
                  stakeAmount === p.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Stake Summary Card */}
          <div className="p-2 bg-blue-50 rounded border border-blue-200 text-[11px] text-blue-900 mb-3 flex justify-between items-center">
            <span>
              {selectedNumbers.length} លេខ × {selectedPosts.length} ប៉ុស្តិ៍
            </span>
            <span className="font-bold text-sm text-blue-800">
              សរុប: {totalStake.toLocaleString()}៛
            </span>
          </div>

          {/* 4 Action Buttons matching screenshot colors */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* 1. បញ្ជូន (Submit - Light Blue) */}
            <button
              onClick={handleConfirmBet}
              className="py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>បញ្ជូន</span>
            </button>

            {/* 2. បោះពុម្ព (Print - Green) */}
            <button
              onClick={() => {
                sound.playButton();
                alert(`បោះពុម្ពប័ណ្ណឆ្នោត 1/99 សម្រាប់ជុំ ${currentRoundId}`);
              }}
              className="py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </button>

            {/* 3. លុប (Clear - Slate) */}
            <button
              onClick={handleClearSelections}
              className="py-1.5 bg-[#94a3b8] hover:bg-slate-500 text-white font-bold rounded shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>លុប</span>
            </button>

            {/* 4. រួចរាល់ (Done - Emerald) */}
            <button
              onClick={handleConfirmBet}
              className="py-1.5 bg-[#34d399] hover:bg-emerald-500 text-white font-bold rounded shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>រួចរាល់</span>
            </button>
          </div>
        </div>

        {/* Recent Results Header (`លទ្ធផលថ្មីៗ`) */}
        <div className="bg-gradient-to-r from-[#e9d5ff] via-[#f3e8ff] to-[#f5f3ff] px-3 py-1.5 border-y border-[#d8b4fe] text-[#7e22ce] font-black text-sm">
          លទ្ធផលថ្មីៗ
        </div>

        {/* Results List */}
        <div className="flex-1 divide-y divide-slate-100 overflow-y-auto bg-white p-1">
          {history.map((item) => (
            <div key={item.roundId} className="p-2 hover:bg-slate-50 transition-colors">
              {/* Round number and time */}
              <div className="flex justify-between items-center text-slate-500 text-[11px] mb-1 font-mono">
                <span className="font-bold text-slate-800">{item.roundId}</span>
                <span>{item.time}</span>
              </div>

              {/* 5 Posts Numbers with colorful circle badges */}
              <div className="flex items-center justify-between text-center font-bold">
                <div className="text-slate-600 text-[11px] font-semibold mr-1">
                  ប៉ុស្តិ៍
                </div>

                {/* Post A */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 mb-0.5">A</span>
                  <div className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {String(item.posts.A).padStart(2, '0')}
                  </div>
                </div>

                {/* Post B */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 mb-0.5">B</span>
                  <div className="w-6 h-6 rounded-full bg-[#ef4444] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {String(item.posts.B).padStart(2, '0')}
                  </div>
                </div>

                {/* Post C */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 mb-0.5">C</span>
                  <div className="w-6 h-6 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {String(item.posts.C).padStart(2, '0')}
                  </div>
                </div>

                {/* Post D */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 mb-0.5">D</span>
                  <div className="w-6 h-6 rounded-full bg-[#f59e0b] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {String(item.posts.D).padStart(2, '0')}
                  </div>
                </div>

                {/* Post E */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 mb-0.5">E</span>
                  <div className="w-6 h-6 rounded-full bg-[#22c55e] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {String(item.posts.E).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastNotice && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2 rounded-full shadow-2xl border border-slate-700 text-xs font-bold animate-fadeIn">
          {toastNotice}
        </div>
      )}
    </div>
  );
};
