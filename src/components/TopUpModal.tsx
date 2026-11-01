import React, { useState } from 'react';
import { X, DollarSign, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onAddFunds: (amount: number) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onAddFunds,
}) => {
  const [customAmount, setCustomAmount] = useState<string>('500000');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const presets = [
    { label: '+50,000៛', value: 50000 },
    { label: '+100,000៛', value: 100000 },
    { label: '+500,000៛', value: 500000 },
    { label: '+1,000,000៛', value: 1000000 },
    { label: '+5,000,000៛', value: 5000000 },
  ];

  const handleAdd = (amount: number) => {
    sound.playChip();
    onAddFunds(amount);
    setSuccessMsg(`បានបញ្ចូលទឹកប្រាក់ ${amount.toLocaleString()}៛ ដោយជោគជ័យ!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-base">បញ្ចូលទឹកប្រាក់ (Add Balance)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          {/* Current balance */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
            <span className="text-slate-600 font-medium">សមតុល្យបច្ចុប្បន្ន:</span>
            <span className="text-lg font-black text-green-600">
              {currentBalance.toLocaleString()}៛
            </span>
          </div>

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-md flex items-center gap-2 font-bold animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Presets */}
          <div>
            <label className="block text-slate-700 font-semibold mb-2">
              ជ្រើសរើសចំនួនទឹកប្រាក់រហ័ស (Quick Presets):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handleAdd(p.value)}
                  className="py-2 px-3 bg-slate-100 hover:bg-blue-50 hover:border-blue-400 border border-slate-200 text-slate-800 font-bold rounded-lg transition-all active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              ឬ បញ្ចូលចំនួនតាមបំណង (Custom KHR):
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                step="10000"
                min="1000"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAdd(Number(customAmount) || 100000)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
              >
                បញ្ចូល
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded text-xs"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
