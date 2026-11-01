import React from 'react';
import { GoldIngotIcon, AnimalArtwork } from './AnimalIllustrations';
import { DrawResult, ANIMALS_DATA } from '../types';

interface BowlDrawAreaProps {
  countdown: number;
  isRevealing: boolean;
  latestResult: DrawResult | null;
  onBowlClick?: (index: number) => void;
}

export const BowlDrawArea: React.FC<BowlDrawAreaProps> = ({
  countdown,
  isRevealing,
  latestResult,
  onBowlClick,
}) => {
  const isUrgent = countdown <= 5 && countdown > 0;

  return (
    <div className="flex-1 bg-[#ffffff] p-3 flex flex-col items-center justify-between min-h-[380px] border-r border-[#94a3b8] relative overflow-hidden select-none">
      {/* Background radial soft aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/30 to-white pointer-events-none" />

      {/* Row 1: 6 Bowls (1 to 6) */}
      <div className="w-full flex justify-center gap-1.5 sm:gap-2 z-10">
        {Array.from({ length: 6 }).map((_, idx) => {
          const num = idx + 1;
          const isWinningBowl = isRevealing && latestResult?.number === num;

          return (
            <div
              key={num}
              onClick={() => onBowlClick?.(num)}
              className={`p-1 bg-white rounded-md border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm ${
                isWinningBowl
                  ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-70 scale-110 shadow-lg animate-bounce'
                  : 'border-[#3b82f6] hover:border-blue-700'
              }`}
              title={`ពានលេខ ${num} (${ANIMALS_DATA[num].khmerName})`}
            >
              <GoldIngotIcon size={46} className="sm:w-[54px] sm:h-[54px]" />
            </div>
          );
        })}
      </div>

      {/* Row 2: 5 Bowls (7 to 11) */}
      <div className="w-full flex justify-center gap-1.5 sm:gap-2 z-10 mt-1">
        {Array.from({ length: 5 }).map((_, idx) => {
          const num = idx + 7;
          const isWinningBowl = isRevealing && latestResult?.number === num;

          return (
            <div
              key={num}
              onClick={() => onBowlClick?.(num)}
              className={`p-1 bg-white rounded-md border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm ${
                isWinningBowl
                  ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-70 scale-110 shadow-lg animate-bounce'
                  : 'border-[#3b82f6] hover:border-blue-700'
              }`}
              title={`ពានលេខ ${num} (${ANIMALS_DATA[num].khmerName})`}
            >
              <GoldIngotIcon size={46} className="sm:w-[54px] sm:h-[54px]" />
            </div>
          );
        })}
      </div>

      {/* Center: Main Draw Chamber / Ingot 12 */}
      <div className="relative my-2 z-10 flex flex-col items-center">
        {/* Urgent or Revealing Status Indicator Banner */}
        {isRevealing ? (
          <div className="mb-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-900 font-bold text-xs sm:text-sm tracking-wide shadow-md animate-pulse">
            ✨ លទ្ធផលចេញ: លេខ {latestResult?.number} ({latestResult?.animal}) ✨
          </div>
        ) : isUrgent ? (
          <div className="mb-2 px-3 py-0.5 rounded-full bg-red-600 text-white font-bold text-xs shadow animate-pulse">
            ⏳ ត្រៀមចេញលទ្ធផល ({countdown}វិនាទី)
          </div>
        ) : (
          <div className="mb-2 px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold">
            កំពុងរង់ចាំការចាប់ឆ្នោតបន្ទាប់
          </div>
        )}

        {/* Big Central Card */}
        <div
          className={`relative p-2.5 bg-white rounded-xl border-3 shadow-md transition-all duration-300 ${
            isRevealing
              ? 'border-yellow-400 shadow-2xl ring-4 ring-yellow-400/50'
              : isUrgent
              ? 'border-red-500 shadow-lg animate-[wiggle_0.3s_ease-in-out_infinite]'
              : 'border-[#2563eb] hover:shadow-lg'
          }`}
        >
          {/* Main Ingot or Revealing Winning Number */}
          {isRevealing && latestResult ? (
            <div className="w-[130px] h-[130px] sm:w-[155px] sm:h-[155px] rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 border-4 border-yellow-400 flex flex-col items-center justify-center p-2 shadow-2xl relative overflow-hidden animate-[spin_0.8s_ease-out_1]">
              <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
              <div className="w-12 h-12 mb-1">
                <AnimalArtwork number={latestResult.number} />
              </div>
              <div
                className={`text-2xl sm:text-3xl font-black ${
                  latestResult.color === 'red'
                    ? 'text-red-700'
                    : latestResult.color === 'green'
                    ? 'text-green-700'
                    : 'text-blue-800'
                }`}
              >
                {latestResult.number}
              </div>
              <div className="text-[11px] font-bold text-slate-800 tracking-wider">
                {latestResult.animal}
              </div>
            </div>
          ) : (
            <div
              className={`transition-transform duration-200 ${
                isUrgent ? 'scale-105' : ''
              }`}
            >
              <GoldIngotIcon
                size={135}
                className="sm:w-[155px] sm:h-[155px]"
              />
            </div>
          )}
        </div>

        {/* Prompt hint */}
        <div className="text-[11px] text-[#64748b] font-medium mt-1 text-center">
          {isRevealing
            ? `ជុំបន្ទាប់នឹងចាប់ផ្តើមឆាប់ៗនេះ`
            : `ចុចលើជម្រើសភ្នាល់ដើម្បីចាក់ (Odds 1.95 / 2.95 / 11)`}
        </div>
      </div>
    </div>
  );
};
