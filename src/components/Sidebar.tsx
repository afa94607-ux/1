import React from 'react';
import { DrawResult, BetHistoryRecord } from '../types';

interface SidebarProps {
  balance: number;
  activeBetsTotal: number;
  latestResults: DrawResult[];
  recentBets: BetHistoryRecord[];
  onAddBalance: () => void;
  onRefreshResults: () => void;
  onClearBetsHistory?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  balance,
  activeBetsTotal,
  latestResults,
  recentBets,
  onAddBalance,
  onRefreshResults,
  onClearBetsHistory,
}) => {
  // Format KHR currency (e.g. 50,000៛)
  const formatKHR = (amount: number) => {
    return `${amount.toLocaleString()}៛`;
  };

  return (
    <div className="w-full lg:w-[290px] xl:w-[320px] bg-white border-r border-[#94a3b8] flex flex-col select-none text-sm">
      {/* Top Account Header Card */}
      <div className="p-3.5 border-b border-[#cbd5e1] bg-slate-50">
        <div className="flex items-center justify-between text-[#1e40af] font-bold text-xs sm:text-sm mb-2.5">
          <span>2026-11-01 (៛) AADPDPP004</span>
          <button
            onClick={onRefreshResults}
            className="text-slate-500 hover:text-blue-600 transition-transform active:rotate-180"
            title="Refresh Account Info"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Row 1: Balance (សមតុល្យទឹកប្រាក់) */}
        <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-200">
          <span className="text-slate-700 font-semibold text-xs sm:text-sm">សមតុល្យទឹកប្រាក់</span>
          <div className="flex items-center gap-2">
            <span className="text-[#16a34a] font-extrabold text-sm sm:text-base">
              {formatKHR(balance)}
            </span>
            <button
              onClick={onAddBalance}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded shadow-xs font-bold"
              title="បញ្ចូលទឹកប្រាក់ (Add Funds)"
            >
              +
            </button>
          </div>
        </div>

        {/* Row 2: Betting in play (លុយកំពុងភ្នាល់) */}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-slate-700 font-semibold text-xs sm:text-sm">លុយកំពុងភ្នាល់</span>
          <span className="text-[#16a34a] font-extrabold text-sm sm:text-base">
            {formatKHR(activeBetsTotal)}
          </span>
        </div>
      </div>

      {/* Latest Results Section (លទ្ធផលចុងក្រោយ) */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#e2e8f0] text-slate-800 font-extrabold border-y border-[#cbd5e1]">
          <span className="text-sm sm:text-base font-extrabold">លទ្ធផលចុងក្រោយ</span>
          <button
            onClick={onRefreshResults}
            className="text-slate-600 hover:text-blue-700 transition-transform active:rotate-180"
            title="Refresh Results"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Results List */}
        <div className="divide-y divide-slate-100 bg-white">
          {latestResults.slice(0, 5).map((res, idx) => {
            const isBig = res.size === 'big';
            const colorBadgeBg =
              res.color === 'red'
                ? 'bg-[#ef4444]'
                : res.color === 'green'
                ? 'bg-[#16a34a]'
                : 'bg-[#1e40af]';

            const colorKhmer =
              res.color === 'red' ? 'ក្រហម' : res.color === 'green' ? 'បៃតង' : 'ខៀវ';

            const isNewest = idx === 0;

            return (
              <div
                key={`${res.roundId}-${res.timestamp || idx}`}
                className={`px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm transition-colors ${
                  isNewest ? 'bg-amber-50/80 border-l-4 border-amber-500 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs sm:text-sm">
                  {isNewest && (
                    <span className="px-1.5 py-0.5 bg-red-600 text-yellow-200 text-[10px] font-black rounded-sm animate-pulse shadow-xs">
                      ថ្មី
                    </span>
                  )}
                  <span className="tracking-tight">{res.roundId}</span>
                  <span className="text-slate-500 font-medium text-[11px] sm:text-xs">{res.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Size Pill */}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-black text-white shadow-xs ${
                      isBig ? 'bg-[#ec4899]' : 'bg-[#06b6d4]'
                    }`}
                  >
                    {isBig ? 'ធំ' : 'តូច'}
                  </span>

                  <span className="text-slate-300 text-xs">|</span>

                  {/* Color Pill */}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-black text-white shadow-xs ${colorBadgeBg}`}
                  >
                    {colorKhmer}
                  </span>

                  <span className="text-slate-300 text-xs">|</span>

                  {/* Winning Number */}
                  <span className="font-black text-slate-900 text-xs sm:text-sm md:text-base">
                    លេខ {res.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Bets Section (ប្រវត្តិភ្នាល់ / Recent Bets) */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#e2e8f0] text-slate-800 font-extrabold border-y border-[#cbd5e1] mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base">ប្រវត្តិភ្នាល់</span>
            <span className="bg-white text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-slate-300">
              {recentBets.length}
            </span>
            <span className="text-slate-500 text-xs font-medium">(History)</span>
          </div>
          <div className="flex items-center gap-2">
            {recentBets.length > 0 && onClearBetsHistory && (
              <button
                type="button"
                onClick={onClearBetsHistory}
                className="text-slate-500 hover:text-rose-600 transition-colors text-xs underline font-semibold"
                title="លុបប្រវត្តិភ្នាល់ (Clear History)"
              >
                លុប
              </button>
            )}
            <button
              type="button"
              onClick={onRefreshResults}
              className="text-slate-600 hover:text-blue-700 transition-transform active:rotate-180"
              title="Refresh Results"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Recent Bets List */}
        <div className="divide-y divide-slate-100 bg-white max-h-[320px] overflow-y-auto scrollbar-thin">
          {recentBets.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm italic">
              មិនទាន់មានប្រវត្តិភ្នាល់នៅឡើយទេ
            </div>
          ) : (
            recentBets.slice(0, 6).map((bet) => {
              const primaryBet = bet.bets[0];
              const betLabel = bet.bets.map((b) => b.label).join(', ') || 'ការភ្នាល់';
              const potentialWin =
                bet.totalPotentialPayout ||
                (primaryBet?.potentialWin ?? Math.round(bet.totalStake * (primaryBet?.odds || 1.95)));

              return (
                <div
                  key={bet.id}
                  className="p-3 flex flex-col gap-1.5 text-xs hover:bg-slate-50 transition-colors"
                >
                  {/* Top Row: Round ID, Time & Status */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-blue-700">{bet.roundId}</span>
                      <span className="text-xs text-slate-500 font-medium">{bet.time}</span>
                    </div>
                    {/* Status Badge: Won, Lost, or Pending */}
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-xs border ${
                        bet.status === 'won'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : bet.status === 'lost'
                          ? 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold tracking-wide'
                          : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                      }`}
                    >
                      {bet.status === 'won'
                        ? 'ឈ្នះ (Won)'
                        : bet.status === 'lost'
                        ? 'Lost'
                        : 'កំពុងរង់ចាំ (Pending)'}
                    </span>
                  </div>

                  {/* Middle Row: Bet Details & Odds */}
                  <div className="flex justify-between items-center text-slate-800">
                    <span className="font-bold text-sm text-slate-900 truncate max-w-[170px]" title={betLabel}>
                      {betLabel}
                    </span>
                    <span className="text-xs text-blue-700 font-extrabold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      x{primaryBet?.odds || 1.95}
                    </span>
                  </div>

                  {/* Bottom Row: Wagered Amount & Potential Winnings / Payout */}
                  <div className="flex justify-between items-center text-slate-600 pt-1.5 border-t border-dashed border-slate-200 text-xs">
                    <div>
                      ភ្នាល់: <strong className="text-slate-900 text-xs sm:text-sm font-bold">{formatKHR(bet.totalStake)}</strong>
                    </div>
                    <div>
                      {bet.status === 'pending' ? (
                        <span className="text-emerald-700 font-medium text-xs">
                          អាចឈ្នះ: <strong className="font-extrabold text-xs sm:text-sm text-emerald-800">{formatKHR(potentialWin)}</strong>
                        </span>
                      ) : bet.status === 'won' ? (
                        <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">
                          +{formatKHR(bet.totalPayout)}
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold text-xs bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          Lost (-{formatKHR(bet.totalStake)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
