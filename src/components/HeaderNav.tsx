import React from 'react';
import { Volume2, VolumeX, Shield, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';

export type MainTab =
  | 'home'
  | 'images'
  | 'lottery_5'
  | 'lottery_6_36'
  | 'lottery_12'
  | 'lottery_90'
  | 'lotto_5d'
  | 'lottery_1_12'
  | 'lottery_1_99'
  | 'report'
  | 'password'
  | 'image_results'
  | 'admin';

export type SubTab = 'lottery' | 'win_loss' | 'results';

interface HeaderNavProps {
  activeMainTab: MainTab;
  onSelectMainTab: (tab: MainTab) => void;
  activeSubTab: SubTab;
  onSelectSubTab: (tab: SubTab) => void;
  onOpenHelp?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeMainTab,
  onSelectMainTab,
  activeSubTab,
  onSelectSubTab,
  onOpenHelp,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const mainTabs: { id: MainTab; label: string; isAdmin?: boolean }[] = [
    { id: 'lottery_12', label: 'ឆ្នោត 12' },
    { id: 'lottery_1_99', label: 'ឆ្នោត 1/99' },
    { id: 'report', label: 'របាយការណ៍សរុប' },
    { id: 'admin', label: '🛡️ ផ្ទាំងគ្រប់គ្រង (Admin)', isAdmin: true },
  ];

  return (
    <header className="w-full select-none shadow-sm">
      {/* Top Main Navigation Bar */}
      <div className="bg-[#cbd5e1] border-b border-[#94a3b8] px-2 flex items-center overflow-x-auto scrollbar-thin">
        <div className="flex items-center space-x-1 py-1 min-w-max text-xs sm:text-sm font-semibold">
          {mainTabs.map((tab) => {
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playButton();
                  onSelectMainTab(tab.id);
                }}
                className={`px-3 py-1.5 transition-all duration-150 rounded-t-sm whitespace-nowrap ${
                  isActive
                    ? tab.isAdmin
                      ? 'bg-purple-700 text-yellow-300 font-extrabold shadow-sm ring-1 ring-purple-400'
                      : 'bg-[#3b82f6] text-white font-bold shadow-xs'
                    : tab.isAdmin
                    ? 'text-purple-900 bg-purple-100 hover:bg-purple-200 font-bold border border-purple-300/60'
                    : 'text-[#1e293b] hover:bg-slate-300 hover:text-blue-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right side utility icons */}
        <div className="ml-auto flex items-center gap-2 pl-3">
          <button
            onClick={handleToggleSound}
            className="p-1 rounded text-slate-700 hover:text-blue-700 hover:bg-slate-300 transition-colors"
            title={isMuted ? 'បើកសំឡេង (Unmute)' : 'បិទសំឡេង (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="p-1 rounded text-slate-700 hover:text-blue-700 hover:bg-slate-300 transition-colors"
              title="ជំនួយ (Rules & Odds)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sub Bar (Steel Blue) */}
      <div className="bg-[#5c7cba] px-4 py-1.5 flex items-center justify-between text-xs sm:text-sm font-bold shadow-inner">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              sound.playButton();
              onSelectSubTab('lottery');
            }}
            className={`transition-colors flex items-center gap-1 ${
              activeSubTab === 'lottery'
                ? 'text-[#fde047] drop-shadow-sm scale-105'
                : 'text-white hover:text-blue-100 opacity-90'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            ឆ្នោត
          </button>

          <button
            onClick={() => {
              sound.playButton();
              onSelectSubTab('win_loss');
            }}
            className={`transition-colors ${
              activeSubTab === 'win_loss'
                ? 'text-[#fde047] drop-shadow-sm scale-105'
                : 'text-white hover:text-blue-100 opacity-90'
            }`}
          >
            ឈ្នះចាញ់
          </button>

          <button
            onClick={() => {
              sound.playButton();
              onSelectSubTab('results');
            }}
            className={`transition-colors ${
              activeSubTab === 'results'
                ? 'text-[#fde047] drop-shadow-sm scale-105'
                : 'text-white hover:text-blue-100 opacity-90'
            }`}
          >
            លទ្ធផល
          </button>
        </div>

        {/* Live system state tag */}
        <div className="text-[11px] text-white/90 font-normal flex items-center gap-1.5 hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>ផ្សាយផ្ទាល់ ២៤/៧</span>
        </div>
      </div>
    </header>
  );
};
