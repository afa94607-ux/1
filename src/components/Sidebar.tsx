import React from 'react';
import { DrawResult, BetHistoryRecord } from '../types';

interface SidebarProps {
  balance: number;
  activeBetsTotal: number;
  latestResults: DrawResult[];
  recentBets: BetHistoryRecord[];
  onAddBalance: () => void;
  onRefreshResults: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  balance,
  activeBetsTotal,
  latestResults,
  recentBets,
  onAddBalance,
  onRefreshResults,
}) => {
  // Format KHR currency (e.g. 50,000៛)
  const formatKHR = (amount: number) => {
    return `${amount.toLocaleString()}៛`;
  };

  return (
    <div className="w-full lg:w-[260px] xl:w-[280px] bg-white border-r border-[#94a3b8] flex flex-col select-none text-xs">
      {/* Top Account Header Card */}
      <div className="p-3 border-b border-[#cbd5e1] bg-slate-50">
        <div className="flex items-center justify-between text-[#1e40af] font-bold text-xs mb-2">
          <span>2026-11-01 (KHR) AADPDPP004</span>
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
        <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-200">
          <span className="text-slate-700 font-medium">សមតុល្យទឹកប្រាក់</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#16a34a] font-bold text-sm">
              {formatKHR(balance)}
            </span>
            <button
              onClick={onAddBalance}
              className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded shadow-xs"
              title="បញ្ចូលទឹកប្រាក់ (Add Funds)"
            >
              +
            </button>
          </div>
        </div>

        {/* Row 2: Betting in play (លុយកំពុងភ្នាល់) */}
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-700 font-medium">លុយកំពុងភ្នាល់</span>
          <span className="text-[#16a34a] font-bold text-sm">
            {formatKHR(activeBetsTotal)}
          </span>
        </div>
      </div>

      {/* Latest Results Section (លទ្ធផលចុងក្រោយ) */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#e2e8f0] text-slate-800 font-bold border-y border-[#cbd5e1]">
          <span className="text-sm">លទ្ធផលចុងក្រោយ</span>
          <button
            onClick={onRefreshResults}
            className="text-slate-600 hover:text-blue-700 transition-transform active:rotate-180"
            title="Refresh Results"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Results List */}
        <div className="divide-y divide-slate-100 bg-white">
          {latestResults.slice(0, 5).map((res) => {
            const isBig = res.size === 'big';
            const colorBadgeBg =
              res.color === 'red'
                ? 'bg-[#ef4444]'
                : res.color === 'green'
                ? 'bg-[#16a34a]'
                : 'bg-[#1e40af]';

            const colorKhmer =
              res.color === 'red' ? 'ក្រហម' : res.color === 'green' ? 'បៃតង' : 'ខៀវ';

            return (
              <div
                key={res.roundId}
                className="px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 text-xs"
              >
                <div className="font-semibold text-slate-700">
                  {res.roundId} <span className="text-slate-500 font-normal">{res.time}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Size Pill */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold text-white shadow-xs ${
                      isBig ? 'bg-[#ec4899]' : 'bg-[#06b6d4]'
                    }`}
                  >
                    {isBig ? 'ធំ' : 'តូច'}
                  </span>

                  <span className="text-slate-300">|</span>

                  {/* Color Pill */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold text-white shadow-xs ${colorBadgeBg}`}
                  >
                    {colorKhmer}
                  </span>

                  <span className="text-slate-300">|</span>

                  {/* Winning Number */}
                  <span className="font-bold text-slate-800">
                    លេខ {res.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent 3 Bets Section (ទើបភ្នាល់ 3 ជើងចុងក្រោយ) */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#e2e8f0] text-slate-800 font-bold border-y border-[#cbd5e1] mt-2">
          <div className="flex items-center gap-1">
            <span>ទើបភ្នាល់</span>
            <span className="bg-white text-slate-700 px-1 rounded text-[10px] font-bold">
              {recentBets.length}
            </span>
            <span>ជើងចុងក្រោយ</span>
          </div>
          <button
            onClick={onRefreshResults}
            className="text-slate-600 hover:text-blue-700 transition-transform active:rotate-180"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Recent Bets List */}
        <div className="divide-y divide-slate-100 bg-white">
          {recentBets.length === 0 ? (
            <div className="p-3 text-center text-slate-400 text-xs italic">
              មិនទាន់មានការភ្នាល់នៅឡើយទេ
            </div>
          ) : (
            recentBets.slice(0, 3).map((bet) => (
              <div
                key={bet.id}
                className="p-2 flex flex-col gap-0.5 text-[11px] hover:bg-slate-50"
              >
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-bold text-blue-700">{bet.roundId}</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      bet.status === 'won'
                        ? 'bg-green-100 text-green-700'
                        : bet.status === 'lost'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {bet.status === 'won'
                      ? 'ឈ្នះ'
                      : bet.status === 'lost'
                      ? 'ចាញ់'
                      : 'កំពុងរង់ចាំ'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>ភ្នាល់: {formatKHR(bet.totalStake)}</span>
                  <span
                    className={`font-bold ${
                      bet.status === 'won' ? 'text-green-600' : 'text-slate-600'
                    }`}
                  >
                    {bet.status === 'won' ? `+${formatKHR(bet.totalPayout)}` : '-'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Graphic Illustration / Quick Summary */}
        <div className="mt-auto p-4 flex flex-col items-center justify-center border-t border-slate-200 bg-slate-50/60">
          <svg className="w-28 h-20 text-slate-400 drop-shadow-sm" viewBox="0 0 120 80" fill="none">
            {/* Monitor */}
            <rect x="25" y="10" width="70" height="48" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <line x1="30" y1="20" x2="85" y2="20" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="30" y1="28" x2="65" y2="28" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Trend chart on screen */}
            <polyline points="32,45 45,35 55,42 70,30 85,38" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Stand */}
            <rect x="55" y="58" width="10" height="10" fill="#94a3b8" />
            <line x1="45" y1="68" x2="75" y2="68" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            {/* Small plant beside */}
            <path d="M 98 68 L 106 68 L 104 56 L 100 56 Z" fill="#b45309" />
            <path d="M 102 56 C 96 46, 102 38, 108 40" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <path d="M 102 52 C 108 44, 114 48, 112 52" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
            {/* Phone beside */}
            <rect x="10" y="32" width="12" height="26" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="16" cy="54" r="1.5" fill="#94a3b8" />
          </svg>
          <div className="text-[11px] text-slate-500 font-medium text-center mt-1">
            ប្រព័ន្ធឆ្នោតស្តង់ដារអនឡាញ
          </div>
        </div>
      </div>
    </div>
  );
};
