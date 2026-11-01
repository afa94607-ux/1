import React from 'react';
import { BetHistoryRecord } from '../types';
import { TrendingUp, TrendingDown, Award, DollarSign } from 'lucide-react';

interface WinLossViewProps {
  records: BetHistoryRecord[];
  onBackToGame: () => void;
}

export const WinLossView: React.FC<WinLossViewProps> = ({ records, onBackToGame }) => {
  const formatKHR = (amount: number) => {
    return `${amount.toLocaleString()}៛`;
  };

  // KPI Calculations
  const totalStake = records.reduce((acc, r) => acc + r.totalStake, 0);
  const totalPayout = records.reduce((acc, r) => acc + r.totalPayout, 0);
  const netProfit = totalPayout - totalStake;
  const wonCount = records.filter((r) => r.status === 'won').length;
  const winRate = records.length > 0 ? ((wonCount / records.length) * 100).toFixed(1) : '0';

  return (
    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">របាយការណ៍ ឈ្នះ-ចាញ់ (Win/Loss Report)</h2>
          <p className="text-xs text-slate-500">គណនី: AADPDPP004 | កាលបរិច្ឆេទ: 2026-11-01</p>
        </div>
        <button
          onClick={onBackToGame}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs shadow"
        >
          ត្រឡប់ទៅការភ្នាល់ (Return to Game)
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-blue-50 text-blue-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">ទឹកប្រាក់ភ្នាល់សរុប</div>
            <div className="text-base font-bold text-slate-800">{formatKHR(totalStake)}</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">ទឹកប្រាក់ឈ្នះសរុប</div>
            <div className="text-base font-bold text-emerald-600">{formatKHR(totalPayout)}</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div
            className={`p-2.5 rounded-full ${
              netProfit >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {netProfit >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">ចំណេញ / ខាត សុទ្ធ</div>
            <div
              className={`text-base font-bold ${
                netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {netProfit >= 0 ? `+${formatKHR(netProfit)}` : `-${formatKHR(Math.abs(netProfit))}`}
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-purple-50 text-purple-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">អត្រាឈ្នះ (Win Rate)</div>
            <div className="text-base font-bold text-purple-700">{winRate}%</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 font-bold text-sm text-slate-800 bg-slate-50">
          ប្រវត្តិការភ្នាល់ទាំងអស់ ({records.length} ជុំ)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">លេខជុំ (Round)</th>
                <th className="py-2.5 px-3">ម៉ោង (Time)</th>
                <th className="py-2.5 px-3">លទ្ធផលចេញ (Drawn)</th>
                <th className="py-2.5 px-3">ជម្រើសភ្នាល់ (Placed Bets)</th>
                <th className="py-2.5 px-3 text-right">ទឹកប្រាក់ភ្នាល់ (Stake)</th>
                <th className="py-2.5 px-3 text-right">ទឹកប្រាក់ទូទាត់ (Payout)</th>
                <th className="py-2.5 px-3 text-right">ចំណេញ/ខាត (P/L)</th>
                <th className="py-2.5 px-3 text-center">ស្ថានភាព (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    មិនទាន់មានទិន្នន័យភ្នាល់នៅក្នុងប្រព័ន្ធនៅឡើយទេ
                  </td>
                </tr>
              ) : (
                records.map((rec) => {
                  const profit = rec.totalPayout - rec.totalStake;
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-blue-700">{rec.roundId}</td>
                      <td className="py-2.5 px-3 text-slate-500">{rec.time}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {rec.resultNumber ? `លេខ ${rec.resultNumber}` : '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {rec.bets.map((b, idx) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                b.won
                                  ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {b.label}: {formatKHR(b.amount)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">{formatKHR(rec.totalStake)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                        {formatKHR(rec.totalPayout)}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          profit > 0
                            ? 'text-green-600'
                            : profit < 0
                            ? 'text-rose-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {profit > 0
                          ? `+${formatKHR(profit)}`
                          : profit < 0
                          ? `-${formatKHR(Math.abs(profit))}`
                          : '0៛'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'won'
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : rec.status === 'lost'
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-amber-100 text-amber-700 border border-amber-300'
                          }`}
                        >
                          {rec.status === 'won'
                            ? 'ឈ្នះ'
                            : rec.status === 'lost'
                            ? 'ចាញ់'
                            : 'កំពុងដំណើរការ'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
