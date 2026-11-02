import React from 'react';
import { Check, RotateCcw, X, PlusCircle, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface ChipBarProps {
  selectedChip: number;
  onSelectChip: (amount: number) => void;
  pendingBetsTotal: number;
  onConfirmBet: () => void;
  onClearBets: () => void;
  onRepeatBets: () => void;
  onDoubleBets: () => void;
  onOpenTopUp: () => void;
  canConfirm: boolean;
  canRepeat: boolean;
}

export const ChipBar: React.FC<ChipBarProps> = ({
  selectedChip,
  onSelectChip,
  pendingBetsTotal,
  onConfirmBet,
  onClearBets,
  onRepeatBets,
  onDoubleBets,
  onOpenTopUp,
  canConfirm,
  canRepeat,
}) => {
  const chips = [
    { value: 1000, label: '1ពាន់៛', color: 'from-blue-500 to-blue-700', border: 'border-blue-300' },
    { value: 5000, label: '5ពាន់៛', color: 'from-emerald-500 to-emerald-700', border: 'border-emerald-300' },
    { value: 10000, label: '1ម៉ឺន៛', color: 'from-amber-500 to-amber-700', border: 'border-amber-300' },
    { value: 50000, label: '5ម៉ឺន៛', color: 'from-purple-500 to-purple-700', border: 'border-purple-300' },
    { value: 100000, label: '10ម៉ឺន៛', color: 'from-rose-500 to-rose-700', border: 'border-rose-300' },
    { value: 500000, label: '50ម៉ឺន៛', color: 'from-slate-700 to-slate-900', border: 'border-yellow-400' },
  ];

  const formatKHR = (amount: number) => {
    return `${amount.toLocaleString()}៛`;
  };

  return (
    <div className="bg-[#1e293b] text-white px-3 py-2 border-t-2 border-[#3b82f6] shadow-lg flex flex-wrap items-center justify-between gap-2 select-none">
      {/* Chips Selection */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-xs font-semibold text-slate-300 hidden md:inline">
          ជ្រើសរើសបន្ទះឈីប:
        </span>
        <div className="flex items-center gap-1.5">
          {chips.map((chip) => {
            const isSelected = selectedChip === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => {
                  sound.playChip();
                  onSelectChip(chip.value);
                }}
                className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b ${chip.color} border-2 ${
                  chip.border
                } flex items-center justify-center font-black text-[11px] sm:text-xs shadow-md transition-all duration-150 transform ${
                  isSelected
                    ? 'scale-115 ring-2 ring-yellow-400 -translate-y-1 shadow-yellow-500/50'
                    : 'opacity-85 hover:opacity-100 hover:scale-105'
                }`}
              >
                {/* Dashed poker chip rim */}
                <div className="absolute inset-0.5 rounded-full border border-dashed border-white/50 pointer-events-none" />
                <span className="text-white drop-shadow">{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stake & Action Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Total in hand */}
        <div className="bg-slate-900 px-3 py-1 rounded border border-slate-700 flex items-center gap-2">
          <span className="text-xs text-slate-400">សរុបភ្នាល់:</span>
          <span className="text-sm font-bold text-yellow-400">
            {formatKHR(pendingBetsTotal)}
          </span>
        </div>

        {/* Double x2 */}
        <button
          onClick={() => {
            sound.playButton();
            onDoubleBets();
          }}
          disabled={pendingBetsTotal === 0}
          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
          title="ទ្វេដងទឹកប្រាក់ (Double x2)"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>ទ្វេដង x2</span>
        </button>

        {/* Repeat Bet */}
        <button
          onClick={() => {
            sound.playButton();
            onRepeatBets();
          }}
          disabled={!canRepeat}
          className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
          title="ភ្នាល់ដូចជុំមុន"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ភ្នាល់សារឡើងវិញ</span>
        </button>

        {/* Clear All */}
        <button
          onClick={() => {
            sound.playButton();
            onClearBets();
          }}
          disabled={pendingBetsTotal === 0}
          className="px-2.5 py-1.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
          title="លុបការភ្នាល់"
        >
          <X className="w-3.5 h-3.5" />
          <span>លុប</span>
        </button>

        {/* Confirm Bet */}
        <button
          onClick={() => {
            sound.playChip();
            onConfirmBet();
          }}
          disabled={!canConfirm}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded text-xs sm:text-sm font-black transition-all flex items-center gap-1 shadow-md animate-pulse"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>បញ្ជាក់ការភ្នាល់</span>
        </button>

        {/* Top-up Balance */}
        <button
          onClick={onOpenTopUp}
          className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1"
          title="បញ្ចូលទឹកប្រាក់ (Add Test Balance)"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">បញ្ចូលប្រាក់</span>
        </button>
      </div>
    </div>
  );
};
