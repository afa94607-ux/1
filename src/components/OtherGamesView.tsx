import React from 'react';
import { MainTab } from './HeaderNav';
import { Sparkles, ArrowLeft, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface OtherGamesViewProps {
  tab: MainTab;
  onReturnTo12: () => void;
}

export const OtherGamesView: React.FC<OtherGamesViewProps> = ({ tab, onReturnTo12 }) => {
  const getTabInfo = () => {
    switch (tab) {
      case 'home':
        return {
          title: 'ទំព័រដើម (Portal Home)',
          desc: 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធឆ្នោតស្តង់ដារអន្តរជាតិ។ សូមជ្រើសរើស "ឆ្នោត 12" ដើម្បីចូលរួមការភ្នាល់ផ្ទាល់។',
        };
      case 'images':
        return {
          title: 'វិចិត្រសាលរូបភាព (Photo Gallery)',
          desc: 'ផ្ទាំងរូបភាពនិមិត្តសញ្ញា 12 សត្វ និងពានមាសសំណាង។',
        };
      case 'lottery_5':
        return {
          title: 'ឆ្នោត 5 (Lottery 5)',
          desc: 'ការចាប់រង្វាន់លេខ ៥ ខ្ទង់រៀងរាល់ ១៥ នាទី។',
        };
      case 'lottery_6_36':
        return {
          title: 'ឆ្នោត 6/36 (Lottery 6/36)',
          desc: 'ការជ្រើសរើស ៦ លេខក្នុងចំណោម ៣៦ លេខ ជាមួយរង្វាន់ Jackpot ធំសម្បើម។',
        };
      case 'lottery_90':
        return {
          title: 'ឆ្នោត 90 (Lottery 90)',
          desc: 'ឆ្នោតលេខធំ ៩០ គ្រាប់ ជាមួយប្រព័ន្ធបង្វិលស្វ័យប្រវត្តិ។',
        };
      case 'lotto_5d':
        return {
          title: 'ឡូតូ 5D (Lotto 5D)',
          desc: 'ការភ្នាល់លេខ 5D កន្ទុយលេខរង្វាន់ធំ។',
        };
      case 'lottery_1_12':
        return {
          title: 'ឆ្នោត 1/12 (Lottery 1/12)',
          desc: 'ការភ្នាល់ ១ ក្នុងចំណោម ១២ សត្វ។',
        };
      case 'lottery_1_99':
        return {
          title: 'ឆ្នោត 1/99 (Lottery 1/99)',
          desc: 'ឆ្នោតលេខពិសេស ១ ដល់ ៩៩។',
        };
      case 'report':
        return {
          title: 'របាយការណ៍សរុប (Total Reports)',
          desc: 'របាយការណ៍សរុបប្រចាំថ្ងៃ សប្តាហ៍ និងខែ សម្រាប់គណនី AADPDPP004។',
        };
      case 'password':
        return {
          title: 'ពាក្យសម្ងាត់ និងសុវត្ថិភាព (Account Security)',
          desc: 'គ្រប់គ្រងលេខសម្ងាត់ PIN ចូលប្រព័ន្ធ និងការផ្ទៀងផ្ទាត់ ២ ជាន់។',
        };
      case 'image_results':
        return {
          title: 'លទ្ធផល រូបភាព (Image Results)',
          desc: 'រូបភាពផ្ទៀងផ្ទាត់ផ្លូវការនៃលទ្ធផលឆ្នោត 12 សត្វ។',
        };
      default:
        return {
          title: 'ម៉ូឌុលឆ្នោត',
          desc: 'កំពុងដំណើរការ...',
        };
    }
  };

  const info = getTabInfo();

  return (
    <div className="flex-1 bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{info.title}</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">{info.desc}</p>
        <button
          onClick={onReturnTo12}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ត្រឡប់ទៅ ឆ្នោត 12 (Go to Lottery 12)</span>
        </button>
      </div>
    </div>
  );
};
