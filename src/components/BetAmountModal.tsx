import React, { useState, useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import { BetCategory } from '../types';
import { sound } from '../utils/sound';

interface BetAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBet: (
    category: BetCategory,
    amount: number,
    label: string,
    odds: number,
    singlePost: boolean
  ) => void;
  currentRoundId: string;
  currentRoundTime: string;
  betCategory: BetCategory | null;
  betLabel: string;
  betOdds: number;
  balance: number;
  onOpenTopUp?: () => void;
  isBettingClosed?: boolean;
}

interface ChipItem {
  value: number;
  labelKhmer: string;
}

const PRESET_CHIPS: ChipItem[] = [
  { value: 1000, labelKhmer: '1ពាន់' },
  { value: 2000, labelKhmer: '2ពាន់' },
  { value: 5000, labelKhmer: '5ពាន់' },
  { value: 10000, labelKhmer: '1ម៉ឺន' },
  { value: 20000, labelKhmer: '2ម៉ឺន' },
  { value: 50000, labelKhmer: '5ម៉ឺន' },
  { value: 200000, labelKhmer: '20ម៉ឺន' },
  { value: 500000, labelKhmer: '50ម៉ឺន' },
];

export const BetAmountModal: React.FC<BetAmountModalProps> = ({
  isOpen,
  onClose,
  onConfirmBet,
  currentRoundId,
  currentRoundTime,
  betCategory,
  betLabel,
  betOdds,
  balance,
  onOpenTopUp,
  isBettingClosed = false,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [singlePost, setSinglePost] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveTime, setLiveTime] = useState<string>('21:49:22');

  // Sync live Cambodian/local time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reset or initialize state whenever modal opens with a new bet
  useEffect(() => {
    if (isOpen) {
      setAmount(0);
      setErrorMessage(null);
    }
  }, [isOpen, betCategory]);

  if (!isOpen || !betCategory) return null;

  const handleChipClick = (val: number) => {
    sound.playChip();
    setErrorMessage(null);
    setAmount((prev) => {
      const next = prev + val;
      return next > 1000000 ? 1000000 : next;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
    if (isNaN(val)) {
      setAmount(0);
    } else if (val > 1000000) {
      setAmount(1000000);
    } else {
      setAmount(val);
    }
  };

  const handleClear = () => {
    sound.playButton();
    if (amount > 0) {
      setAmount(0);
      setErrorMessage(null);
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (isBettingClosed) {
      setErrorMessage('ការទទួលការភ្នាល់ត្រូវបានបិទសម្រាប់ជុំនេះ! សូមរង់ចាំជុំបន្ទាប់');
      sound.playBlocked();
      return;
    }
    if (amount < 100) {
      setErrorMessage('ចំនួនតិចផុតគឺ 100៛');
      sound.playButton();
      return;
    }
    if (amount > 1000000) {
      setErrorMessage('ចំនួនច្រើនផុតគឺ 1,000,000៛');
      sound.playButton();
      return;
    }
    if (balance < amount) {
      setErrorMessage('ទឹកប្រាក់របស់អ្នកមិនគ្រប់គ្រាន់ទេ! សូមបញ្ចូលទឹកប្រាក់បន្ថែម');
      sound.playButton();
      if (onOpenTopUp) {
        setTimeout(() => onOpenTopUp(), 1200);
      }
      return;
    }

    sound.playChip();
    onConfirmBet(betCategory, amount, betLabel, betOdds, singlePost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-fadeIn select-none">
      {/* Modal Card - Exact Match of image_f977baed.png */}
      <div className="w-full max-w-[480px] bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-300">
        {/* 1. Header Bar (Dark Navy Blue) */}
        <div className="bg-[#1b2a6b] px-3 pt-2.5 pb-2 text-white">
          {/* Top Line: Round ID + Time (Left) & Print + Close 'X' (Right) */}
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
              <span>
                {currentRoundId} {currentRoundTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Print Button (Green square with printer icon) */}
              <button
                type="button"
                onClick={() => {
                  sound.playButton();
                  window.print();
                }}
                className="w-7 h-7 bg-[#15803d] hover:bg-[#16a34a] active:scale-95 text-white flex items-center justify-center rounded shadow transition-all"
                title="Print ticket"
              >
                <Printer className="w-4 h-4" />
              </button>
              {/* Close 'X' Button (Red square with bold X) */}
              <button
                type="button"
                onClick={() => {
                  sound.playButton();
                  onClose();
                }}
                className="w-7 h-7 bg-[#dc2626] hover:bg-[#ef4444] active:scale-95 text-white flex items-center justify-center rounded font-black text-sm shadow transition-all"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Sub-Header Row: 3 Bordered Columns */}
          <div className="grid grid-cols-3 border border-blue-400/50 bg-[#152358] text-xs font-semibold">
            {/* Column 1: ប្រភេទភ្នាល់: (Bet Category) */}
            <div className="flex items-center border-r border-blue-400/50">
              <span className="bg-[#1e347e] text-white px-1.5 py-1 font-bold whitespace-nowrap border-r border-blue-400/50">
                ប្រភេទភ្នាល់:
              </span>
              <span className="flex-1 px-1.5 py-1 text-[#22c55e] font-bold text-center truncate">
                {betLabel || 'ពូ 0'}
              </span>
            </div>

            {/* Column 2: ពន្ធភ្នាល់: (Odds) */}
            <div className="flex items-center border-r border-blue-400/50">
              <span className="bg-[#1e347e] text-white px-1.5 py-1 font-bold whitespace-nowrap border-r border-blue-400/50">
                ពន្ធភ្នាល់:
              </span>
              <span className="flex-1 px-1.5 py-1 text-[#22c55e] font-bold text-center font-mono">
                {betOdds}
              </span>
            </div>

            {/* Column 3: ម៉ោង: (Time) */}
            <div className="flex items-center">
              <span className="bg-[#1e347e] text-white px-1.5 py-1 font-bold whitespace-nowrap border-r border-blue-400/50">
                ម៉ោង:
              </span>
              <span className="flex-1 px-1.5 py-1 text-[#22c55e] font-bold text-center font-mono text-[11px] sm:text-xs">
                {liveTime}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Deep Blue Box (Exact match with image_f977baed.png) */}
        <div className="p-3 bg-white">
          <div className="bg-[#1e328a] rounded-xl p-3.5 sm:p-4 text-white shadow-inner">
            {/* Input Row: លុយភ្នាល់: + White Input Field */}
            <div className="flex items-center gap-3 mb-4">
              <label
                htmlFor="bet-amount-input"
                className="font-bold text-sm sm:text-base text-white whitespace-nowrap"
              >
                លុយភ្នាល់:
              </label>
              <div className="flex-1 relative flex items-center">
                <input
                  id="bet-amount-input"
                  type="text"
                  inputMode="numeric"
                  value={amount === 0 ? '0' : amount.toLocaleString()}
                  onChange={handleInputChange}
                  className="w-full bg-white text-[#16a34a] font-black text-xl sm:text-2xl px-3 py-1.5 pr-8 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-left tracking-wide shadow-inner"
                  autoFocus
                />
                <span className="absolute right-3 font-black text-lg text-[#16a34a] pointer-events-none select-none">
                  ៛
                </span>
              </div>
            </div>

            {/* Preset 8 Yellow Circular Chips (2 rows x 4 columns) */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 justify-items-center">
              {PRESET_CHIPS.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => handleChipClick(chip.value)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#ffe500] hover:bg-[#ffd700] active:scale-95 transition-all flex items-center justify-center font-black text-[#dc2626] text-xs sm:text-sm border-2 border-[#eab308] shadow-[0_4px_10px_rgba(0,0,0,0.35)] cursor-pointer select-none"
                  title={`បន្ថែម ${chip.value.toLocaleString()}៛`}
                >
                  <span className="drop-shadow-xs font-black tracking-tight">
                    {chip.labelKhmer}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMessage && (
            <div className="mt-2 text-center text-xs font-bold text-red-600 bg-red-50 p-1.5 rounded border border-red-200 animate-shake">
              {errorMessage}
            </div>
          )}

          {/* 3. Footer Limits & Options (White Background) */}
          <div className="mt-3 text-slate-800 text-xs sm:text-sm font-bold">
            {/* Min / Max Info with ៛ */}
            <div className="flex items-center justify-between px-2 mb-2 font-semibold text-slate-900">
              <span>ចំនួនតិចផុត: 100៛</span>
              <span>ចំនួនច្រើនផុត: 1,000,000៛</span>
            </div>

            {/* Checkbox: បញ្ជូនមួយប៉ុស្តិ៍ */}
            <div className="px-2 mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={singlePost}
                  onChange={(e) => setSinglePost(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-bold text-xs sm:text-sm">បញ្ជូនមួយប៉ុស្តិ៍</span>
              </label>
            </div>

            {/* Two Action Buttons: Green ភ្នាល់ (Place Bet) and Red លុប (Clear / Cancel) */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 pt-1 pb-1">
              {/* Green Button: ភ្នាល់ */}
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 max-w-[150px] py-2 sm:py-2.5 bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white font-black text-sm sm:text-base rounded-md shadow-md transition-all text-center tracking-wider"
              >
                ភ្នាល់
              </button>

              {/* Red Button: លុប */}
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 max-w-[150px] py-2 sm:py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 text-white font-black text-sm sm:text-base rounded-md shadow-md transition-all text-center tracking-wider"
              >
                លុប
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
