import React, { useState, useMemo } from 'react';
import {
  Shield,
  Trophy,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  AlertTriangle,
  Play,
  RotateCcw,
  Search,
  Filter,
  Users,
  Wallet,
  Settings,
  Flame,
  Award,
} from 'lucide-react';
import {
  ANIMALS_DATA,
  DrawResult,
  BetCategory,
  BetHistoryRecord,
  TransactionRecord,
  TransactionType,
  TransactionStatus,
  LiveBetItem,
} from '../types';
import { AnimalArtwork } from './AnimalIllustrations';
import { sound } from '../utils/sound';

interface AdminPanelProps {
  currentRoundIndex: number;
  currentRoundTime: string;
  countdown: number;
  isRevealing: boolean;
  history: DrawResult[];
  onAddManualResult: (result: DrawResult) => void;
  onDeleteResult: (roundId: string) => void;
  forcedWinningNumber: number | null;
  onSetForcedWinningNumber: (num: number | null) => void;
  onTriggerImmediateDraw: (targetNum?: number) => void;
  recentBets: BetHistoryRecord[];
  playerBalance: number;
  onUpdatePlayerBalance: (newBalance: number) => void;
  transactions: TransactionRecord[];
  onAddTransaction: (tx: Omit<TransactionRecord, 'id' | 'timestamp' | 'timeString'>) => void;
  onUpdateTransactionStatus: (id: string, status: TransactionStatus) => void;
  onReturnToGame: () => void;
}

type AdminGameTab = 'lottery_12' | 'lottery_1_99';
type AdminSectionTab = 'result_control' | 'history' | 'live_bets' | 'transactions' | 'owner_report';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentRoundIndex,
  currentRoundTime,
  countdown,
  isRevealing,
  history,
  onAddManualResult,
  onDeleteResult,
  forcedWinningNumber,
  onSetForcedWinningNumber,
  onTriggerImmediateDraw,
  recentBets,
  playerBalance,
  onUpdatePlayerBalance,
  transactions,
  onAddTransaction,
  onUpdateTransactionStatus,
  onReturnToGame,
}) => {
  // Navigation tabs
  const [selectedGame, setSelectedGame] = useState<AdminGameTab>('lottery_12');
  const [activeSection, setActiveSection] = useState<AdminSectionTab>('result_control');

  // Manual Result Form State
  const [manualRoundNumber, setManualRoundNumber] = useState<number>(currentRoundIndex + 1);
  const [manualRoundTime, setManualRoundTime] = useState<string>('16:30');
  const [manualSelectedAnimalNum, setManualSelectedAnimalNum] = useState<number>(1);
  const [resultSuccessMsg, setResultSuccessMsg] = useState<string | null>(null);

  // Manual Transaction Modal / Form State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [txType, setTxType] = useState<TransactionType>('deposit');
  const [txAmount, setTxAmount] = useState<string>('100000');
  const [txMethod, setTxMethod] = useState<'ABA Bank' | 'Wing' | 'ACLEDA' | 'TrueMoney' | 'Cash' | 'Manual'>('ABA Bank');
  const [txUserName, setTxUserName] = useState<string>('អតិថិជន Player #1');
  const [txUserPhone, setTxUserPhone] = useState<string>('012 888 999');
  const [txNote, setTxNote] = useState<string>('');

  // History Search & Filter State
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historyFilterColor, setHistoryFilterColor] = useState<string>('all');

  // Owner Report Timeframe Filter
  const [reportTimeframe, setReportTimeframe] = useState<'today' | 'yesterday' | 'week' | 'all'>('today');

  // Live incoming bet items from all recent records
  const allLiveBets: LiveBetItem[] = useMemo(() => {
    const items: LiveBetItem[] = [];
    recentBets.forEach((rec) => {
      rec.bets.forEach((b, bIdx) => {
        items.push({
          id: `${rec.id}-${bIdx}`,
          roundId: rec.roundId,
          userName: 'Player #1',
          time: rec.time,
          type: b.type,
          label: b.label,
          amount: b.amount,
          odds: b.odds,
          potentialPayout: Math.round(b.amount * b.odds),
          timestamp: Date.now() - bIdx * 5000,
        });
      });
    });
    return items;
  }, [recentBets]);

  // Current round active bets
  const currentRoundBets = useMemo(() => {
    const curRoundId = `2004#${currentRoundIndex}`;
    return allLiveBets.filter((b) => b.roundId === curRoundId);
  }, [allLiveBets, currentRoundIndex]);

  // Live Risk & Liability Matrix for numbers 1..12
  const exposureMatrix = useMemo(() => {
    const matrix: Record<
      number,
      {
        totalStaked: number;
        payoutLiability: number;
        netHouseProfit: number;
      }
    > = {};

    const curRoundTotalTurnover = currentRoundBets.reduce((sum, b) => sum + b.amount, 0);

    for (let num = 1; num <= 12; num++) {
      const animal = ANIMALS_DATA[num];
      let payoutIfNumWins = 0;

      currentRoundBets.forEach((b) => {
        let isWon = false;
        if (b.type === `animal_${num}`) isWon = true;
        if (b.type === 'small' && animal.size === 'small') isWon = true;
        if (b.type === 'big' && animal.size === 'big') isWon = true;
        if (b.type === 'odd' && animal.parity === 'odd') isWon = true;
        if (b.type === 'even' && animal.parity === 'even') isWon = true;
        if (b.type === 'color_red' && animal.color === 'red') isWon = true;
        if (b.type === 'color_green' && animal.color === 'green') isWon = true;
        if (b.type === 'color_blue' && animal.color === 'blue') isWon = true;

        if (isWon) {
          payoutIfNumWins += Math.round(b.amount * b.odds);
        }
      });

      matrix[num] = {
        totalStaked: currentRoundBets
          .filter((b) => b.type === `animal_${num}`)
          .reduce((s, b) => s + b.amount, 0),
        payoutLiability: payoutIfNumWins,
        netHouseProfit: curRoundTotalTurnover - payoutIfNumWins,
      };
    }

    return matrix;
  }, [currentRoundBets]);

  // Find safest (most profitable) and highest risk numbers for house
  const { safestNumber, highestRiskNumber } = useMemo(() => {
    let bestNum = 1;
    let worstNum = 1;
    let maxProfit = -Infinity;
    let minProfit = Infinity;

    for (let num = 1; num <= 12; num++) {
      const prof = exposureMatrix[num]?.netHouseProfit ?? 0;
      if (prof > maxProfit) {
        maxProfit = prof;
        bestNum = num;
      }
      if (prof < minProfit) {
        minProfit = prof;
        worstNum = num;
      }
    }
    return { safestNumber: bestNum, highestRiskNumber: worstNum };
  }, [exposureMatrix]);

  // Overall Financial Report metrics
  const financialReport = useMemo(() => {
    let totalTurnover = 0;
    let totalPayout = 0;

    recentBets.forEach((r) => {
      totalTurnover += r.totalStake;
      totalPayout += r.totalPayout;
    });

    // Also include historical rounds
    history.forEach((h, idx) => {
      // Simulate estimated turnover per historical round if bet history empty
      const simulatedRoundStake = (idx % 3 + 1) * 60000;
      const simulatedPayout = idx % 2 === 0 ? simulatedRoundStake * 0.75 : simulatedRoundStake * 0.35;
      totalTurnover += simulatedRoundStake;
      totalPayout += simulatedPayout;
    });

    const netHouseProfit = totalTurnover - totalPayout;
    const marginPercent = totalTurnover > 0 ? (netHouseProfit / totalTurnover) * 100 : 0;

    const totalDeposits = transactions
      .filter((t) => t.type === 'deposit' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter((t) => t.type === 'withdrawal' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTurnover,
      totalPayout,
      netHouseProfit,
      marginPercent,
      totalDeposits,
      totalWithdrawals,
      netCashflow: totalDeposits - totalWithdrawals,
    };
  }, [recentBets, history, transactions]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        item.roundId.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.animal.includes(historySearch) ||
        item.number.toString().includes(historySearch);
      const matchColor =
        historyFilterColor === 'all' || item.color === historyFilterColor;
      return matchSearch && matchColor;
    });
  }, [history, historySearch, historyFilterColor]);

  // Handlers
  const handleSetForcedNumber = (num: number) => {
    sound.playChip();
    if (forcedWinningNumber === num) {
      onSetForcedWinningNumber(null);
    } else {
      onSetForcedWinningNumber(num);
    }
  };

  const handleForceDrawNow = (num?: number) => {
    sound.playButton();
    const target = num ?? forcedWinningNumber ?? manualSelectedAnimalNum;
    onTriggerImmediateDraw(target);
    onSetForcedWinningNumber(target);
  };

  const handleCreateManualResult = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWin();

    const animalData = ANIMALS_DATA[manualSelectedAnimalNum];
    const newResult: DrawResult = {
      roundId: `2004#${manualRoundNumber}`,
      roundIndex: manualRoundNumber,
      time: manualRoundTime,
      number: manualSelectedAnimalNum,
      animal: animalData.khmerName,
      color: animalData.color,
      size: animalData.size,
      parity: animalData.parity,
      timestamp: Date.now(),
    };

    onAddManualResult(newResult);
    setResultSuccessMsg(`✅ បានបញ្ចូលលទ្ធផលជោគជ័យ: ជុំ ${newResult.roundId} = លេខ ${newResult.number} (${newResult.animal})`);
    setTimeout(() => setResultSuccessMsg(null), 4000);
    setManualRoundNumber((prev) => prev + 1);
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    sound.playWin();
    onAddTransaction({
      userName: txUserName,
      userPhone: txUserPhone,
      type: txType,
      amount: amountNum,
      method: txMethod,
      status: 'approved',
      note: txNote || 'បង្កើតដោយផ្ទាល់ពី Admin',
    });

    if (txType === 'deposit') {
      onUpdatePlayerBalance(playerBalance + amountNum);
    } else if (txType === 'withdrawal') {
      onUpdatePlayerBalance(Math.max(0, playerBalance - amountNum));
    }

    setIsDepositModalOpen(false);
    setTxNote('');
  };

  const handleApproveTx = (tx: TransactionRecord) => {
    sound.playWin();
    onUpdateTransactionStatus(tx.id, 'approved');
    if (tx.type === 'deposit') {
      onUpdatePlayerBalance(playerBalance + tx.amount);
    } else if (tx.type === 'withdrawal') {
      onUpdatePlayerBalance(Math.max(0, playerBalance - tx.amount));
    }
  };

  const handleRejectTx = (tx: TransactionRecord) => {
    sound.playBlocked();
    onUpdateTransactionStatus(tx.id, 'rejected');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] text-slate-100 min-h-screen overflow-x-hidden font-['Kantumruy_Pro',sans-serif]">
      {/* 1. Admin Top Executive Bar */}
      <div className="bg-[#1e293b] border-b border-slate-700/80 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToGame}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg border border-slate-500/50 shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ត្រឡប់ទៅផ្ទាំងហ្គេម</span>
          </button>

          <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-inner border border-purple-400/50">
              <Shield className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-yellow-400 flex items-center gap-1.5">
                <span>ផ្ទាំងគ្រប់គ្រងម្ចាស់ផ្ទះ</span>
                <span className="text-[10px] bg-purple-900/80 text-purple-300 border border-purple-400/50 px-1.5 py-0.2 rounded font-mono">
                  MASTER ADMIN
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Sync សកម្ម • ផ្សាយផ្ទាល់ ២៤/៧</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Round Live Telemetry */}
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>ជុំបច្ចុប្បន្ន:</span>
            <span className="font-mono text-yellow-300 font-bold">2004#{currentRoundIndex}</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-1">
            <span className="text-slate-400">រាប់ថយក្រោយ:</span>
            <span className={`font-mono font-bold ${countdown <= 10 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {countdown}s
            </span>
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1 text-slate-300">
            <span>សមតុល្យអ្នកលេង:</span>
            <span className="font-mono text-emerald-400 font-bold">{playerBalance.toLocaleString()}៛</span>
          </div>
        </div>
      </div>

      {/* 2. Game Mode Selector Tabs (Lottery 12 vs Lottery 1/99) */}
      <div className="bg-[#141e33] border-b border-slate-800 px-3 sm:px-6 pt-2 flex items-center gap-2">
        <button
          onClick={() => {
            sound.playButton();
            setSelectedGame('lottery_12');
          }}
          className={`px-4 py-2 rounded-t-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            selectedGame === 'lottery_12'
              ? 'bg-[#1e293b] text-yellow-300 border-t-2 border-amber-400 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>ឆ្នោត 12 (Lottery 12)</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-400/30">
            គ្រប់គ្រងចម្បង
          </span>
        </button>

        <button
          onClick={() => {
            sound.playButton();
            setSelectedGame('lottery_1_99');
          }}
          className={`px-4 py-2 rounded-t-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            selectedGame === 'lottery_1_99'
              ? 'bg-[#1e293b] text-yellow-300 border-t-2 border-amber-400 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Flame className="w-4 h-4 text-blue-400" />
          <span>ឆ្នោត 1/99 (Lottery 1/99)</span>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded-full">
            ៥ ប៉ុស្តិ៍ A-B-C-D-E
          </span>
        </button>
      </div>

      {/* If Lottery 1/99 is selected, show 1/99 management view */}
      {selectedGame === 'lottery_1_99' ? (
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="max-w-md p-6 bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center gap-3">
            <Flame className="w-12 h-12 text-amber-400 animate-pulse" />
            <h3 className="text-lg font-bold text-yellow-300">ផ្ទាំងគ្រប់គ្រង ឆ្នោត 1/99 (៥ ប៉ុស្តិ៍ A-B-C-D-E)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ប្រព័ន្ធឆ្នោត 1/99 កំពុងដំណើរការក្នុងរបៀបស្វ័យប្រវត្តិតាម ប៉ុស្តិ៍ A, B, C, D, E។ សម្រាប់កំណែបច្ចុប្បន្ន ផ្ទាំងគ្រប់គ្រងផ្តោតចម្បងលើ «ឆ្នោត 12» តាមការស្នើសុំ។
            </p>
            <button
              onClick={() => setSelectedGame('lottery_12')}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              ត្រឡប់ទៅគ្រប់គ្រង «ឆ្នោត 12»
            </button>
          </div>
        </div>
      ) : (
        /* Primary Focus: LOTTERY 12 MANAGEMENT */
        <div className="flex-1 flex flex-col">
          {/* 3. Sub-Navigation Tabs */}
          <div className="bg-[#1e293b]/90 border-b border-slate-800 px-3 sm:px-6 py-2 flex items-center overflow-x-auto gap-1 sm:gap-2 scrollbar-thin">
            <button
              onClick={() => {
                sound.playButton();
                setActiveSection('result_control');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeSection === 'result_control'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>កំណត់លទ្ធផល & ចាប់ឆ្នោត</span>
              {forcedWinningNumber && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              )}
            </button>

            <button
              onClick={() => {
                sound.playButton();
                setActiveSection('live_bets');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeSection === 'live_bets'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>តាមដានការភ្នាល់ផ្ទាល់ ({currentRoundBets.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playButton();
                setActiveSection('history');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeSection === 'history'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ប្រវត្តិលទ្ធផល ({history.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playButton();
                setActiveSection('transactions');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeSection === 'transactions'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>ដាក់/ដកប្រាក់</span>
              {transactions.some((t) => t.status === 'pending') && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => {
                sound.playButton();
                setActiveSection('owner_report');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeSection === 'owner_report'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>របាយការណ៍ឈ្នះ/ចាញ់ម្ចាស់</span>
            </button>
          </div>

          {/* 4. Section Body */}
          <div className="p-3 sm:p-6 flex-1 overflow-y-auto">
            {/* ======================================================== */}
            {/* SUBSECTION 1: RESULT CONTROL & FORCED DRAW ENTRY */}
            {/* ======================================================== */}
            {activeSection === 'result_control' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Status banner */}
                {resultSuccessMsg && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{resultSuccessMsg}</span>
                  </div>
                )}

                {/* Section A: Live Control of Next Winning Number */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/90 p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-yellow-300 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span>កំណត់លទ្ធផលឈ្នះសម្រាប់ជុំបច្ចុប្បន្ន (2004#{currentRoundIndex})</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ជ្រើសរើសលេខណាមួយខាងក្រោមដើម្បីកំណត់ជាលទ្ធផលឈ្នះជាមុន ឬចុច «បង្ខំចាប់ឆ្នោតភ្លាមៗ»។
                      </p>
                    </div>

                    {/* Pre-set Status Badge */}
                    <div className="flex items-center gap-2">
                      {forcedWinningNumber ? (
                        <div className="px-3 py-1 bg-red-950/80 border border-red-500 text-red-300 text-xs font-bold rounded-lg flex items-center gap-1.5 animate-pulse">
                          <span>⚠️ បានកំណត់លទ្ធផលជាមុន:</span>
                          <span className="text-yellow-300 font-extrabold text-sm">
                            លេខ {forcedWinningNumber} ({ANIMALS_DATA[forcedWinningNumber]?.khmerName})
                          </span>
                          <button
                            onClick={() => onSetForcedWinningNumber(null)}
                            className="ml-1 p-0.5 hover:bg-red-800 rounded text-white"
                            title="លុបការកំណត់ (Reset to Random)"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>របៀបចាប់ចៃដន្យ (Random Auto Draw)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 12 Animal Result Selection Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                      const animal = ANIMALS_DATA[num];
                      const isSelected = forcedWinningNumber === num;
                      const isSafest = safestNumber === num;
                      const isHighestRisk = highestRiskNumber === num;
                      const exposure = exposureMatrix[num];

                      return (
                        <div
                          key={num}
                          onClick={() => handleSetForcedNumber(num)}
                          className={`relative p-2 rounded-xl cursor-pointer border-2 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center select-none ${
                            isSelected
                              ? 'bg-amber-500/20 border-yellow-400 ring-2 ring-yellow-400/80 shadow-lg shadow-yellow-500/20'
                              : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {/* Top Badges */}
                          <div className="w-full flex items-center justify-between text-[10px] font-bold mb-1">
                            <span className="px-1.5 py-0.2 rounded bg-black/60 text-yellow-300 font-mono">
                              #{num}
                            </span>
                            <span
                              className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                animal.color === 'red'
                                  ? 'bg-red-900/80 text-red-200'
                                  : animal.color === 'green'
                                  ? 'bg-emerald-900/80 text-emerald-200'
                                  : 'bg-blue-900/80 text-blue-200'
                              }`}
                            >
                              {animal.color === 'red' ? 'ក្រហម' : animal.color === 'green' ? 'បៃតង' : 'ខៀវ'}
                            </span>
                          </div>

                          {/* Full 4K uncropped animal artwork thumbnail */}
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white shadow-xs p-0.5 relative my-1">
                            <AnimalArtwork number={num} className="w-full h-full object-fill rounded" />
                          </div>

                          {/* Animal Name & Attributes */}
                          <div className="text-center w-full">
                            <div className="text-xs font-extrabold text-white truncate">
                              {animal.khmerName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {animal.size === 'big' ? 'ធំ' : 'តូច'} • {animal.parity === 'odd' ? 'សេស' : 'គូ'}
                            </div>
                          </div>

                          {/* Financial Exposure indicator */}
                          <div className="mt-1.5 pt-1 border-t border-slate-700/60 w-full text-center">
                            <div className="text-[9px] text-slate-400">សងអ្នកលេង:</div>
                            <div className="text-[10px] font-mono font-bold text-amber-300">
                              {(exposure?.payoutLiability ?? 0).toLocaleString()}៛
                            </div>
                          </div>

                          {/* Status Flags */}
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md animate-pulse">
                              ✓ ជ្រើសរើស
                            </div>
                          )}
                          {isSafest && (
                            <div className="absolute -bottom-1 inset-x-1 bg-emerald-600/90 text-white text-[8px] font-bold rounded py-0.2 text-center">
                              ★ ចំណេញបំផុត
                            </div>
                          )}
                          {isHighestRisk && (
                            <div className="absolute -bottom-1 inset-x-1 bg-rose-600/90 text-white text-[8px] font-bold rounded py-0.2 text-center">
                              ⚠️ ហានិភ័យខ្ពស់
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Immediate Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="font-bold text-yellow-300">ការបញ្ជាបន្ទាន់:</span>
                      <span>
                        {forcedWinningNumber
                          ? `នឹងចេញលេខ ${forcedWinningNumber} (${ANIMALS_DATA[forcedWinningNumber]?.khmerName})`
                          : 'មិនទាន់ជ្រើសរើស (នឹងចេញចៃដន្យ)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSetForcedWinningNumber(null)}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition-all"
                      >
                        កំណត់ឡើងវិញ (ចៃដន្យ)
                      </button>

                      <button
                        onClick={() => handleForceDrawNow()}
                        disabled={isRevealing}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>បង្ខំចាប់ឆ្នោតភ្លាមៗ (Force Draw Now)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section B: Create Historical Result Record manually */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/90 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-sm sm:text-base font-bold text-yellow-300 mb-3 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>បញ្ចូលលទ្ធផលដោយផ្ទាល់ (Manual Result Entry Form)</span>
                  </h3>
                  <form onSubmit={handleCreateManualResult} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        លេខជុំ (Round Index)
                      </label>
                      <input
                        type="number"
                        value={manualRoundNumber}
                        onChange={(e) => setManualRoundNumber(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs font-mono font-bold text-yellow-300 focus:outline-none focus:border-amber-400"
                        placeholder="ឧ. 285"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ម៉ោងចាប់ឆ្នោត (Time)
                      </label>
                      <input
                        type="text"
                        value={manualRoundTime}
                        onChange={(e) => setManualRoundTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                        placeholder="16:30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        លេខសត្វឈ្នះ (1–12)
                      </label>
                      <select
                        value={manualSelectedAnimalNum}
                        onChange={(e) => setManualSelectedAnimalNum(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs font-bold text-yellow-300 focus:outline-none focus:border-amber-400"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            #{n} {ANIMALS_DATA[n]?.khmerName} ({ANIMALS_DATA[n]?.animalEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-md transition-all active:scale-95"
                      >
                        + បញ្ចូលទៅក្នុងប្រវត្តិ
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBSECTION 2: LIVE BETS & EXPOSURE MONITOR */}
            {/* ======================================================== */}
            {activeSection === 'live_bets' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Exposure Risk Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-md">
                    <div className="text-xs text-slate-400 font-semibold">សរុបការភ្នាល់ជុំបច្ចុប្បន្ន</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-yellow-300 mt-1">
                      {currentRoundBets.reduce((a, b) => a + b.amount, 0).toLocaleString()}៛
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      ចំនួនសំបុត្រភ្នាល់: <span className="font-bold text-white">{currentRoundBets.length}</span>
                    </div>
                  </div>

                  <div className="bg-[#1e293b] p-4 rounded-xl border border-emerald-500/40 shadow-md">
                    <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>ជម្រើសចំណេញបំផុតសម្រាប់ម្ចាស់</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">
                      លេខ {safestNumber} ({ANIMALS_DATA[safestNumber]?.khmerName})
                    </div>
                    <div className="text-[11px] text-emerald-400/80 mt-1">
                      ចំណេញសុទ្ធ: +{(exposureMatrix[safestNumber]?.netHouseProfit ?? 0).toLocaleString()}៛
                    </div>
                  </div>

                  <div className="bg-[#1e293b] p-4 rounded-xl border border-rose-500/40 shadow-md">
                    <div className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>ហានិភ័យខ្ពស់បំផុត (ខាតច្រើន)</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-300 mt-1">
                      លេខ {highestRiskNumber} ({ANIMALS_DATA[highestRiskNumber]?.khmerName})
                    </div>
                    <div className="text-[11px] text-rose-400/80 mt-1">
                      ខាត/ចំណេញ: {(exposureMatrix[highestRiskNumber]?.netHouseProfit ?? 0).toLocaleString()}៛
                    </div>
                  </div>
                </div>

                {/* Real-time incoming bets table */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/90 overflow-hidden shadow-xl">
                  <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                    <div className="font-bold text-xs sm:text-sm text-yellow-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ចរន្តភ្នាល់ផ្ទាល់ (Live Real-Time Bet Feed)</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      សរុប {allLiveBets.length} ភ្នាល់
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold sticky top-0 z-10 border-b border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">លេខជុំ</th>
                          <th className="py-2.5 px-3">ម៉ោង</th>
                          <th className="py-2.5 px-3">អ្នកលេង</th>
                          <th className="py-2.5 px-3">ប្រភេទភ្នាល់</th>
                          <th className="py-2.5 px-3 text-right">ទឹកប្រាក់ភ្នាល់</th>
                          <th className="py-2.5 px-3 text-center">អត្រាសង (Odds)</th>
                          <th className="py-2.5 px-3 text-right">សងសរុបបើឈ្នះ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {allLiveBets.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                              មិនទាន់មានការភ្នាល់នៅឡើយទេ
                            </td>
                          </tr>
                        ) : (
                          allLiveBets.map((bet) => (
                            <tr key={bet.id} className="hover:bg-slate-800/60 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-yellow-400">
                                {bet.roundId}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 font-mono">
                                {bet.time}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-200">
                                {bet.userName}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-yellow-300 font-bold">
                                  {bet.label}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                                {bet.amount.toLocaleString()}៛
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-amber-300 font-bold">
                                x{bet.odds}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-300">
                                {bet.potentialPayout.toLocaleString()}៛
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBSECTION 3: RESULT HISTORY MANAGEMENT */}
            {/* ======================================================== */}
            {activeSection === 'history' && (
              <div className="space-y-4 max-w-6xl mx-auto">
                {/* Search & Filter Bar */}
                <div className="bg-[#1e293b] p-3 sm:p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="ស្វែងរកតាមលេខជុំ (2004#283) ឬឈ្មោះសត្វ..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">ពណ៌:</span>
                    <select
                      value={historyFilterColor}
                      onChange={(e) => setHistoryFilterColor(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="all">ទាំងអស់</option>
                      <option value="red">ក្រហម (Red)</option>
                      <option value="green">បៃតង (Green)</option>
                      <option value="blue">ខៀវ (Blue)</option>
                    </select>
                  </div>
                </div>

                {/* History Table */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/90 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold sticky top-0 z-10 border-b border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">លេខជុំ</th>
                          <th className="py-2.5 px-3">ម៉ោងចេញ</th>
                          <th className="py-2.5 px-3 text-center">រូបសត្វឈ្នះ</th>
                          <th className="py-2.5 px-3">លេខ & ឈ្មោះសត្វ</th>
                          <th className="py-2.5 px-3 text-center">ពណ៌ (Color)</th>
                          <th className="py-2.5 px-3 text-center">តូច / ធំ</th>
                          <th className="py-2.5 px-3 text-center">សេស / គូ</th>
                          <th className="py-2.5 px-3 text-center">សកម្មភាព</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredHistory.map((item) => (
                          <tr key={item.roundId} className="hover:bg-slate-800/60 transition-colors">
                            <td className="py-2 px-3 font-mono font-bold text-yellow-400">
                              {item.roundId}
                            </td>
                            <td className="py-2 px-3 text-slate-400 font-mono">
                              {item.time}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <div className="w-8 h-8 rounded-md bg-white p-0.5 mx-auto shadow-xs">
                                <AnimalArtwork number={item.number} className="w-full h-full object-fill rounded" />
                              </div>
                            </td>
                            <td className="py-2 px-3 font-bold text-white">
                              លេខ {item.number} - {item.animal}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.color === 'red'
                                    ? 'bg-red-900/80 text-red-200 border border-red-500/50'
                                    : item.color === 'green'
                                    ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50'
                                    : 'bg-blue-900/80 text-blue-200 border border-blue-500/50'
                                }`}
                              >
                                {item.color === 'red' ? 'ក្រហម' : item.color === 'green' ? 'បៃតង' : 'ខៀវ'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.size === 'big'
                                    ? 'bg-amber-900/80 text-amber-200 border border-amber-500/50'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {item.size === 'big' ? 'ធំ' : 'តូច'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                {item.parity === 'odd' ? 'សេស' : 'គូ'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                onClick={() => {
                                  sound.playBlocked();
                                  onDeleteResult(item.roundId);
                                }}
                                className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/80 rounded transition-colors"
                                title="លុបលទ្ធផលនេះ (Delete)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBSECTION 4: DEPOSITS & WITHDRAWALS MANAGEMENT */}
            {/* ======================================================== */}
            {activeSection === 'transactions' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Balance & Action Bar */}
                <div className="bg-[#1e293b] p-4 sm:p-6 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">សមតុល្យគណនីអ្នកលេងបច្ចុប្បន្ន (Player Wallet)</div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
                      {playerBalance.toLocaleString()}៛
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTxType('deposit');
                        setIsDepositModalOpen(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ ដាក់ប្រាក់បញ្ចូល (Deposit)</span>
                    </button>

                    <button
                      onClick={() => {
                        setTxType('withdrawal');
                        setIsDepositModalOpen(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>- ដកប្រាក់ (Withdrawal)</span>
                    </button>
                  </div>
                </div>

                {/* Transaction Queue Table */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/90 overflow-hidden shadow-xl">
                  <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                    <div className="font-bold text-xs sm:text-sm text-yellow-300 flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span>បញ្ជីប្រតិបត្តិការដាក់/ដកប្រាក់ (Transactions Queue)</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      សរុប {transactions.length} ប្រតិបត្តិការ
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold sticky top-0 z-10 border-b border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">កាលបរិច្ឆេទ & ម៉ោង</th>
                          <th className="py-2.5 px-3">ឈ្មោះអ្នកលេង</th>
                          <th className="py-2.5 px-3">ទូរស័ព្ទ</th>
                          <th className="py-2.5 px-3 text-center">ប្រភេទ</th>
                          <th className="py-2.5 px-3">ធនាគារ / វិធី</th>
                          <th className="py-2.5 px-3 text-right">ចំនួនទឹកប្រាក់</th>
                          <th className="py-2.5 px-3 text-center">ស្ថានភាព</th>
                          <th className="py-2.5 px-3 text-center">ការអនុម័ត</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-800/60 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-slate-400">
                              {tx.timeString}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-white">
                              {tx.userName}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-400">
                              {tx.userPhone}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  tx.type === 'deposit'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                                    : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                                }`}
                              >
                                {tx.type === 'deposit' ? 'ដាក់ប្រាក់ (+)' : 'ដកប្រាក់ (-)'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-300">
                              {tx.method}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-right font-mono font-black text-sm ${
                                tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {tx.type === 'deposit' ? '+' : '-'}
                              {tx.amount.toLocaleString()}៛
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  tx.status === 'approved'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                                    : tx.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
                                }`}
                              >
                                {tx.status === 'approved'
                                  ? '✓ ជោគជ័យ'
                                  : tx.status === 'rejected'
                                  ? '✕ បដិសេធ'
                                  : '⏳ រង់ចាំពិនិត្យ'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {tx.status === 'pending' ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleApproveTx(tx)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold shadow-xs active:scale-95"
                                  >
                                    យល់ព្រម
                                  </button>
                                  <button
                                    onClick={() => handleRejectTx(tx)}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold shadow-xs active:scale-95"
                                  >
                                    បដិសេធ
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SUBSECTION 5: OWNER WIN / LOSS FINANCIAL REPORT */}
            {/* ======================================================== */}
            {activeSection === 'owner_report' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Filter Timeframe Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-sm font-bold text-yellow-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>របាយការណ៍ហិរញ្ញវត្ថុ & ចំណេញ/ខាតម្ចាស់ (House Profit & Loss)</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
                    {(['today', 'yesterday', 'week', 'all'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setReportTimeframe(tf)}
                        className={`px-3 py-1 rounded-md transition-all ${
                          reportTimeframe === tf
                            ? 'bg-amber-500 text-slate-900 font-bold shadow-xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {tf === 'today'
                          ? 'ថ្ងៃនេះ'
                          : tf === 'yesterday'
                          ? 'ម្សិលមិញ'
                          : tf === 'week'
                          ? 'សប្តាហ៍នេះ'
                          : 'ទាំងអស់'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Core Financial KPI Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Turnover */}
                  <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-lg">
                    <div className="text-xs text-slate-400 font-semibold">សរុបប្រាក់ភ្នាល់ចូល (Turnover)</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-yellow-300 mt-1">
                      {financialReport.totalTurnover.toLocaleString()}៛
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <span>បរិមាណភ្នាល់សរុបរបស់អតិថិជន</span>
                    </div>
                  </div>

                  {/* Total Payouts */}
                  <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-lg">
                    <div className="text-xs text-slate-400 font-semibold">សរុបប្រាក់សងអ្នកលេង (Payouts)</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-rose-300 mt-1">
                      {financialReport.totalPayout.toLocaleString()}៛
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      រង្វាន់ដែលម្ចាស់បានទូទាត់សង
                    </div>
                  </div>

                  {/* Net House Profit */}
                  <div
                    className={`p-4 rounded-xl border shadow-lg ${
                      financialReport.netHouseProfit >= 0
                        ? 'bg-emerald-950/40 border-emerald-500/60'
                        : 'bg-rose-950/40 border-rose-500/60'
                    }`}
                  >
                    <div className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                      <span>ចំណេញសុទ្ធម្ចាស់ផ្ទះ (Net Profit)</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/40 text-yellow-300">
                        {financialReport.marginPercent.toFixed(1)}% Margin
                      </span>
                    </div>
                    <div
                      className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
                        financialReport.netHouseProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {financialReport.netHouseProfit >= 0 ? '+' : ''}
                      {financialReport.netHouseProfit.toLocaleString()}៛
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {financialReport.netHouseProfit >= 0
                        ? '✓ ម្ចាស់ផ្ទះរកបានប្រាក់ចំណេញ'
                        : '⚠️ ម្ចាស់ផ្ទះកំពុងខាតបង់'}
                    </div>
                  </div>

                  {/* Net Cash Flow (Deposits - Withdrawals) */}
                  <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-lg">
                    <div className="text-xs text-slate-400 font-semibold">លំហូរសាច់ប្រាក់ (Cashflow)</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-blue-400 mt-1">
                      {financialReport.netCashflow >= 0 ? '+' : ''}
                      {financialReport.netCashflow.toLocaleString()}៛
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      ដាក់ {financialReport.totalDeposits.toLocaleString()}៛ • ដក {financialReport.totalWithdrawals.toLocaleString()}៛
                    </div>
                  </div>
                </div>

                {/* Round by Round Financial Breakdown */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/90 overflow-hidden shadow-xl">
                  <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 font-bold text-xs sm:text-sm text-yellow-300 flex items-center justify-between">
                    <span>របាយការណ៍លម្អិតតាមជុំ (Round-by-Round Breakdown)</span>
                    <span className="text-xs text-slate-400">ឆ្នោត 12 (Lottery 12)</span>
                  </div>

                  <div className="overflow-x-auto max-h-[450px] scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold sticky top-0 z-10 border-b border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">លេខជុំ</th>
                          <th className="py-2.5 px-3">ម៉ោង</th>
                          <th className="py-2.5 px-3">លទ្ធផលចេញ</th>
                          <th className="py-2.5 px-3 text-right">ប្រាក់ភ្នាល់សរុប</th>
                          <th className="py-2.5 px-3 text-right">ប្រាក់សងអ្នកលេង</th>
                          <th className="py-2.5 px-3 text-right">ចំណេញ/ខាតម្ចាស់</th>
                          <th className="py-2.5 px-3 text-center">ស្ថានភាព</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {history.slice(0, 15).map((h, idx) => {
                          const estTurnover = (idx % 3 + 1) * 80000;
                          const estPayout = idx % 2 === 0 ? estTurnover * 0.65 : estTurnover * 0.25;
                          const estHouseProfit = estTurnover - estPayout;

                          return (
                            <tr key={h.roundId} className="hover:bg-slate-800/60 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-yellow-400">
                                {h.roundId}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 font-mono">
                                {h.time}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded bg-white p-0.5 inline-block">
                                  <AnimalArtwork number={h.number} className="w-full h-full object-fill" />
                                </span>
                                <span>
                                  {h.number}. {h.animal}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                                {estTurnover.toLocaleString()}៛
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-300">
                                {estPayout.toLocaleString()}៛
                              </td>
                              <td
                                className={`py-2.5 px-3 text-right font-mono font-bold ${
                                  estHouseProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {estHouseProfit >= 0 ? '+' : ''}
                                {estHouseProfit.toLocaleString()}៛
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                                  ✓ រួចរាល់
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Deposit / Withdrawal Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-base sm:text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span>{txType === 'deposit' ? 'ដាក់ប្រាក់បញ្ចូល (Deposit)' : 'ដកប្រាក់ចេញ (Withdrawal)'}</span>
            </h3>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">ឈ្មោះអ្នកលេង (Player Name)</label>
                <input
                  type="text"
                  value={txUserName}
                  onChange={(e) => setTxUserName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">លេខទូរស័ព្ទ (Phone Number)</label>
                <input
                  type="text"
                  value={txUserPhone}
                  onChange={(e) => setTxUserPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ចំនួនទឹកប្រាក់ (KHR)</label>
                  <input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-yellow-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                    placeholder="100000"
                    min="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">វិធីទូទាត់ (Method)</label>
                  <select
                    value={txMethod}
                    onChange={(e) => setTxMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="ABA Bank">ABA Bank</option>
                    <option value="Wing">Wing Bank</option>
                    <option value="ACLEDA">ACLEDA Bank</option>
                    <option value="TrueMoney">TrueMoney</option>
                    <option value="Cash">Cash (សាច់ប្រាក់សុទ្ធ)</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">កំណត់សម្គាល់ (Note / Reason)</label>
                <input
                  type="text"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  placeholder="ឧ. បញ្ចូលតាម ABA ឬ ដកប្រាក់ឈ្នះ"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold text-white rounded-lg shadow-md transition-all active:scale-95 ${
                    txType === 'deposit'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {txType === 'deposit' ? 'យល់ព្រមបញ្ចូលប្រាក់ (+)' : 'យល់ព្រមដកប្រាក់ (-)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
