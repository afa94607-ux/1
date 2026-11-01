import React from 'react';
import { X, HelpCircle, Award, Check } from 'lucide-react';

interface HelpRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpRulesModal: React.FC<HelpRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-base">ច្បាប់និងការទូទាត់ឆ្នោត 12 (Rules & Payouts)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Overview */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-1 text-sm">អំពីប្រព័ន្ធឆ្នោត 12 សត្វ</h4>
            <p>
              ឆ្នោត 12 ជាល្បែងឆ្នោតប្រពៃណីដែលមាន ១២ សត្វ (លេខ ១ ដល់ ១២) តំណាងឱ្យពានមាសទាំង ១២។
              ក្នុងមួយជុំមានរយៈពេល ៧០ វិនាទីក្នុងការភ្នាល់ ហើយប្រព័ន្ធនឹងចាប់ឆ្នោតដោយស្វ័យប្រវត្តិ។
            </p>
          </div>

          {/* Odds & Payouts */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> អត្រាសង (Odds & Multipliers)
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900">ចាក់លេខសត្វទោល (១ ដល់ ១២):</span>
                  <div className="text-[11px] text-slate-500">ភ្នាល់លើសត្វណាមួយជាក់លាក់</div>
                </div>
                <span className="font-black text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  11x (ភ្នាល់ 1,000 សង 11,000៛)
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900">តូច (Small / 1 ដល់ 6) ឬ ធំ (Big / 7 ដល់ 12):</span>
                  <div className="text-[11px] text-slate-500">ទំហំលេខសរុប</div>
                </div>
                <span className="font-black text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  1.95x
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900">សេស (Odd) ឬ គូ (Even):</span>
                  <div className="text-[11px] text-slate-500">លេខសេស: 1,3,5,7,9,11 | គូ: 2,4,6,8,10,12</div>
                </div>
                <span className="font-black text-sm text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  1.95x
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900">ពណ៌ (ក្រហម / បៃតង / ខៀវ):</span>
                  <div className="text-[11px] text-slate-500">
                    ក្រហម (1,4,7,10) | បៃតង (2,5,8,11) | ខៀវ (3,6,9,12)
                  </div>
                </div>
                <span className="font-black text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  2.95x
                </span>
              </div>
            </div>
          </div>

          {/* Animals Map */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-sm">តារាងលេខសត្វទាំង ១២</h4>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <div className="p-1.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                1. ជូត (Rat) - ក្រហម | តូច | សេស
              </div>
              <div className="p-1.5 rounded bg-green-50 text-green-700 font-bold border border-green-200">
                2. ឆ្លូវ (Ox) - បៃតង | តូច | គូ
              </div>
              <div className="p-1.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                3. ខាល (Tiger) - ខៀវ | តូច | សេស
              </div>
              <div className="p-1.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                4. ថោះ (Rabbit) - ក្រហម | តូច | គូ
              </div>
              <div className="p-1.5 rounded bg-green-50 text-green-700 font-bold border border-green-200">
                5. រោង (Dragon) - បៃតង | តូច | សេស
              </div>
              <div className="p-1.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                6. ម្សាញ់ (Snake) - ខៀវ | តូច | គូ
              </div>
              <div className="p-1.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                7. មមី (Horse) - ក្រហម | ធំ | សេស
              </div>
              <div className="p-1.5 rounded bg-green-50 text-green-700 font-bold border border-green-200">
                8. មមែ (Goat) - បៃតង | ធំ | គូ
              </div>
              <div className="p-1.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                9. វក (Monkey) - ខៀវ | ធំ | សេស
              </div>
              <div className="p-1.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                10. រកា (Rooster) - ក្រហម | ធំ | គូ
              </div>
              <div className="p-1.5 rounded bg-green-50 text-green-700 font-bold border border-green-200">
                11. ច (Dog) - បៃតង | ធំ | សេស
              </div>
              <div className="p-1.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                12. កុរ (Pig) - ខៀវ | ធំ | គូ
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs"
          >
            យល់ព្រម (Understood)
          </button>
        </div>
      </div>
    </div>
  );
};
