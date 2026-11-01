import React, { useState } from 'react';
import { DrawResult, ANIMALS_DATA } from '../types';
import { Filter, PieChart, BarChart2 } from 'lucide-react';

interface ResultsViewProps {
  history: DrawResult[];
  onBackToGame: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ history, onBackToGame }) => {
  const [filter, setFilter] = useState<'all' | 'small' | 'big' | 'red' | 'green' | 'blue' | 'odd' | 'even'>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'small') return item.size === 'small';
    if (filter === 'big') return item.size === 'big';
    if (filter === 'red') return item.color === 'red';
    if (filter === 'green') return item.color === 'green';
    if (filter === 'blue') return item.color === 'blue';
    if (filter === 'odd') return item.parity === 'odd';
    if (filter === 'even') return item.parity === 'even';
    return true;
  });

  // Calculate stats
  const total = history.length || 1;
  const bigCount = history.filter((h) => h.size === 'big').length;
  const smallCount = history.filter((h) => h.size === 'small').length;
  const redCount = history.filter((h) => h.color === 'red').length;
  const greenCount = history.filter((h) => h.color === 'green').length;
  const blueCount = history.filter((h) => h.color === 'blue').length;
  const oddCount = history.filter((h) => h.parity === 'odd').length;
  const evenCount = history.filter((h) => h.parity === 'even').length;

  return (
    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ប្រវត្តិលទ្ធផលឆ្នោត 12 (Draw Results History)</h2>
          <p className="text-xs text-slate-500">ស្ថិតិប្រវត្តិលទ្ធផលចេញសរុប {history.length} ជុំចុងក្រោយ</p>
        </div>
        <button
          onClick={onBackToGame}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs shadow"
        >
          ត្រឡប់ទៅការភ្នាល់
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Big / Small Distribution */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>ស្ថិតិ ធំ / តូច</span>
            <span className="text-[11px] text-slate-400">{history.length} ជុំ</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-100 mb-2">
            <div
              style={{ width: `${(bigCount / total) * 100}%` }}
              className="bg-[#ec4899] text-[10px] text-white flex items-center justify-center font-bold"
            >
              {Math.round((bigCount / total) * 100)}%
            </div>
            <div
              style={{ width: `${(smallCount / total) * 100}%` }}
              className="bg-[#06b6d4] text-[10px] text-white flex items-center justify-center font-bold"
            >
              {Math.round((smallCount / total) * 100)}%
            </div>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#ec4899]">ធំ (Big): {bigCount} លើក</span>
            <span className="text-[#06b6d4]">តូច (Small): {smallCount} លើក</span>
          </div>
        </div>

        {/* Colors Distribution */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>ស្ថិតិ ពណ៌ (Colors)</span>
            <span className="text-[11px] text-slate-400">ក្រហម/បៃតង/ខៀវ</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-100 mb-2">
            <div
              style={{ width: `${(redCount / total) * 100}%` }}
              className="bg-[#ef4444] text-[10px] text-white flex items-center justify-center font-bold"
            >
              {Math.round((redCount / total) * 100)}%
            </div>
            <div
              style={{ width: `${(greenCount / total) * 100}%` }}
              className="bg-[#22c55e] text-[10px] text-white flex items-center justify-center font-bold"
            >
              {Math.round((greenCount / total) * 100)}%
            </div>
            <div
              style={{ width: `${(blueCount / total) * 100}%` }}
              className="bg-[#2563eb] text-[10px] text-white flex items-center justify-center font-bold"
            >
              {Math.round((blueCount / total) * 100)}%
            </div>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#ef4444]">ក្រហម: {redCount}</span>
            <span className="text-[#22c55e]">បៃតង: {greenCount}</span>
            <span className="text-[#2563eb]">ខៀវ: {blueCount}</span>
          </div>
        </div>

        {/* Parity Distribution */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>ស្ថិតិ សេស / គូ (Odd/Even)</span>
            <span className="text-[11px] text-slate-400">1.95x</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-100 mb-2">
            <div
              style={{ width: `${(oddCount / total) * 100}%` }}
              className="bg-[#f97316] text-[10px] text-white flex items-center justify-center font-bold"
            >
              {Math.round((oddCount / total) * 100)}%
            </div>
            <div
              style={{ width: `${(evenCount / total) * 100}%` }}
              className="bg-[#3b82f6] text-[10px] text-white flex items-center justify-center font-bold"
            >
              {Math.round((evenCount / total) * 100)}%
            </div>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#f97316]">សេស (Odd): {oddCount} លើក</span>
            <span className="text-[#3b82f6]">គូ (Even): {evenCount} លើក</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto text-xs font-semibold">
        <span className="text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> តម្រង:
        </span>
        {[
          { id: 'all', label: 'ទាំងអស់ (All)' },
          { id: 'small', label: 'តូច (Small)' },
          { id: 'big', label: 'ធំ (Big)' },
          { id: 'red', label: 'ក្រហម (Red)' },
          { id: 'green', label: 'បៃតង (Green)' },
          { id: 'blue', label: 'ខៀវ (Blue)' },
          { id: 'odd', label: 'សេស (Odd)' },
          { id: 'even', label: 'គូ (Even)' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id as any)}
            className={`px-3 py-1 rounded-full transition-all ${
              filter === btn.id
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">លេខជុំ (Round)</th>
                <th className="py-2.5 px-3">ម៉ោង (Time)</th>
                <th className="py-2.5 px-3">លេខចេញ (Number)</th>
                <th className="py-2.5 px-3">សត្វ (Zodiac Animal)</th>
                <th className="py-2.5 px-3">ទំហំ (Size)</th>
                <th className="py-2.5 px-3">ពណ៌ (Color)</th>
                <th className="py-2.5 px-3">លក្ខណៈ (Parity)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item) => {
                const animal = ANIMALS_DATA[item.number];
                const isBig = item.size === 'big';
                const isOdd = item.parity === 'odd';
                const colorBadgeClass =
                  item.color === 'red'
                    ? 'bg-red-500 text-white'
                    : item.color === 'green'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white';

                return (
                  <tr key={item.roundId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-blue-700">{item.roundId}</td>
                    <td className="py-2.5 px-3 text-slate-500">{item.time}</td>
                    <td className="py-2.5 px-3">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-yellow-300 font-black text-sm shadow-xs">
                        {item.number}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      {animal?.khmerName} ({animal?.animalEn})
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-xs ${
                          isBig ? 'bg-[#ec4899]' : 'bg-[#06b6d4]'
                        }`}
                      >
                        {isBig ? 'ធំ (Big)' : 'តូច (Small)'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${colorBadgeClass}`}>
                        {item.color === 'red' ? 'ក្រហម' : item.color === 'green' ? 'បៃតង' : 'ខៀវ'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-xs ${
                          isOdd ? 'bg-orange-500' : 'bg-amber-600'
                        }`}
                      >
                        {isOdd ? 'សេស (Odd)' : 'គូ (Even)'}
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
  );
};
