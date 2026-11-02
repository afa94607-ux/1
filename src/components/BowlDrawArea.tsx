import React from 'react';
import { AnimalArtwork } from './AnimalIllustrations';
import { DrawResult, ANIMALS_DATA } from '../types';
import { CountdownSyncSegment } from '../utils/countdownAudioSync';

interface BowlDrawAreaProps {
  countdown: number;
  isRevealing: boolean;
  revealStep: number; // 0: closed, 1..6: row 1, 7..11: row 2, 12: row 3 final result
  latestResult: DrawResult | null;
  onBowlClick?: (index: number) => void;
  onTriggerDraw?: () => void;
  audioSyncSegment?: CountdownSyncSegment | null;
  isBettingClosed?: boolean;
  onTrigger10sCountdown?: () => void;
  onBlockedAttempt?: () => void;
}

export const BowlDrawArea: React.FC<BowlDrawAreaProps> = ({
  isRevealing,
  revealStep,
  latestResult,
  onBowlClick,
  audioSyncSegment,
  isBettingClosed = false,
  onBlockedAttempt,
}) => {
  return (
    <div className="flex-1 bg-[#ffffff] p-2.5 sm:p-3 flex flex-col items-center justify-between min-h-[400px] border-r border-[#94a3b8] relative overflow-hidden select-none">
      {/* Background radial soft aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/40 via-slate-50/20 to-white pointer-events-none" />

      {/* Row 1 Dishes: Numbers 1–6 (Sequential Interval: 1,100ms) */}
      <div className="w-full flex flex-col items-center z-10 mb-1">
        <div className="w-full flex justify-center gap-1.5 sm:gap-2">
          {Array.from({ length: 6 }).map((_, idx) => {
            const num = idx + 1;
            const isOpen = isRevealing && revealStep >= num;
            const isWinningBowl = isRevealing && revealStep >= 12 && latestResult?.number === num;
            const isJustOpened = isRevealing && revealStep === num;

            return (
              <div
                key={num}
                onClick={() => {
                  if (isBettingClosed) {
                    onBlockedAttempt?.();
                    return;
                  }
                  onBowlClick?.(num);
                }}
                className={`p-0.5 sm:p-1 bg-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xs overflow-hidden relative ${
                  isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                } ${
                  isWinningBowl
                    ? 'scale-110 shadow-xl ring-4 ring-yellow-400 z-20 animate-bounce'
                    : isJustOpened
                    ? 'scale-105 shadow-md z-15 ring-2 ring-blue-400'
                    : ''
                }`}
                title={
                  isBettingClosed
                    ? `បិទការទទួលការភ្នាល់ (Betting Closed) - ពានលេខ ${num}`
                    : `ពានលេខ ${num} (${ANIMALS_DATA[num].khmerName})`
                }
              >
                {/* 3D Flip Card Container: Top Covered Bowls Grid (85px × 83px approx 1:1 square with rounded corners) */}
                <div className="w-[50px] h-[49px] sm:w-[68px] sm:h-[66px] md:w-[85px] md:h-[83px] [perspective:800px]">
                  <div
                    className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${
                      isOpen ? '[transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]'
                    }`}
                  >
                    {/* Front Face: Animal Artwork & Number */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-lg overflow-hidden bg-[#fefce8] flex items-center justify-center border border-amber-300/60 shadow-xs">
                      <AnimalArtwork number={num} className="w-full h-full object-cover pointer-events-none" />
                      {/* Victory Tag */}
                      {isWinningBowl && (
                        <div className="absolute bottom-0 inset-x-0 bg-red-600 text-yellow-200 text-[8px] sm:text-[9px] font-black text-center py-0.5 shadow-xs">
                          ឈ្នះ 👑
                        </div>
                      )}
                    </div>

                    {/* Back Face: Hidden Dish Cover Image (Rendered Display Dimensions: 85px × 83px, 1:1 square with rounded corners) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden shadow-xs bg-white relative">
                      <img
                        src="/assets/aistudio/f8a5d8e0-4865-44e6-94ab-7b9f436a53fd_3aa68070.jpg"
                        alt={`ពានលេខ ${num}`}
                        className="w-full h-full object-cover rounded-lg pointer-events-none"
                      />
                      {/* Number Tag on Closed Cover */}
                      <div className="absolute top-0.5 left-0.5 bg-black/70 text-yellow-300 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-yellow-400/40 pointer-events-none">
                        {num}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2 Dishes: Numbers 7–11 (Sequential Interval: 1,100ms each) */}
      <div className="w-full flex flex-col items-center z-10 mb-2">
        <div className="w-full flex justify-center gap-1.5 sm:gap-2">
          {Array.from({ length: 5 }).map((_, idx) => {
            const num = idx + 7;
            const isOpen = isRevealing && revealStep >= num;
            const isWinningBowl = isRevealing && revealStep >= 12 && latestResult?.number === num;
            const isJustOpened = isRevealing && revealStep === num;

            return (
              <div
                key={num}
                onClick={() => {
                  if (isBettingClosed) {
                    onBlockedAttempt?.();
                    return;
                  }
                  onBowlClick?.(num);
                }}
                className={`p-0.5 sm:p-1 bg-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xs overflow-hidden relative ${
                  isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                } ${
                  isWinningBowl
                    ? 'scale-110 shadow-xl ring-4 ring-yellow-400 z-20 animate-bounce'
                    : isJustOpened
                    ? 'scale-105 shadow-md z-15 ring-2 ring-blue-400'
                    : ''
                }`}
                title={
                  isBettingClosed
                    ? `បិទការទទួលការភ្នាល់ (Betting Closed) - ពានលេខ ${num}`
                    : `ពានលេខ ${num} (${ANIMALS_DATA[num].khmerName})`
                }
              >
                {/* 3D Flip Card Container: Top Covered Bowls Grid (85px × 83px approx 1:1 square with rounded corners) */}
                <div className="w-[50px] h-[49px] sm:w-[68px] sm:h-[66px] md:w-[85px] md:h-[83px] [perspective:800px]">
                  <div
                    className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${
                      isOpen ? '[transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]'
                    }`}
                  >
                    {/* Front Face: Animal Artwork & Number */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-lg overflow-hidden bg-[#fefce8] flex items-center justify-center border border-amber-300/60 shadow-xs">
                      <AnimalArtwork number={num} className="w-full h-full object-cover pointer-events-none" />
                      {/* Victory Tag */}
                      {isWinningBowl && (
                        <div className="absolute bottom-0 inset-x-0 bg-red-600 text-yellow-200 text-[8px] sm:text-[9px] font-black text-center py-0.5 shadow-xs">
                          ឈ្នះ 👑
                        </div>
                      )}
                    </div>

                    {/* Back Face: Hidden Dish Cover Image (Rendered Display Dimensions: 85px × 83px, 1:1 square with rounded corners) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden shadow-xs bg-white relative">
                      <img
                        src="/assets/aistudio/f8a5d8e0-4865-44e6-94ab-7b9f436a53fd_3aa68070.jpg"
                        alt={`ពានលេខ ${num}`}
                        className="w-full h-full object-cover rounded-lg pointer-events-none"
                      />
                      {/* Number Tag on Closed Cover */}
                      <div className="absolute top-0.5 left-0.5 bg-black/70 text-yellow-300 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-yellow-400/40 pointer-events-none">
                        {num}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3 (Final Result / Number 12): Central Box revealing the winning animal and number 1,100ms after number 11 */}
      <div className="w-full flex flex-col items-center justify-center z-10 mb-2">
        <div
          className="relative group cursor-pointer"
          onClick={() => {
            if (isBettingClosed) {
              onBlockedAttempt?.();
              return;
            }
            onBowlClick?.(12);
          }}
          title={
            isBettingClosed
              ? `បិទការទទួលការភ្នាល់ (Betting Closed) - ពានលេខ ១២`
              : `ពានលេខ ១២ (${ANIMALS_DATA[12].khmerName}) - លទ្ធផលចុងក្រោយ`
          }
        >
          {/* Central Box 3D Container */}
          <div
            className={`p-1 sm:p-1.5 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 rounded-2xl shadow-lg border-2 border-amber-400/80 transition-all duration-500 transform hover:scale-105 active:scale-95 ${
              isRevealing && revealStep >= 12
                ? 'scale-105 shadow-2xl ring-4 ring-yellow-400 animate-pulse'
                : 'hover:shadow-xl'
            }`}
          >
            {/* 3D Flip Card Container: Desktop 224px × 224px (w-56 h-56), Mobile/Tablet 176px × 176px to 208px × 208px (w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56) */}
            <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 [perspective:1000px]">
              <div
                className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${
                  isRevealing && revealStep >= 12
                    ? '[transform:rotateY(0deg)]'
                    : '[transform:rotateY(180deg)]'
                }`}
              >
                {/* Front Face: Winning Animal Artwork & Final Result */}
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden bg-gradient-to-b from-amber-50 to-yellow-100 flex flex-col items-center justify-center border-2 border-yellow-400 shadow-inner p-1">
                  {latestResult ? (
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                      <div className="w-full h-[78%] rounded-lg overflow-hidden bg-white/80 shadow-xs flex items-center justify-center">
                        <AnimalArtwork number={latestResult.number} className="w-full h-full object-cover pointer-events-none" />
                      </div>
                      <div className="w-full mt-1 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-yellow-200 text-[11px] sm:text-xs md:text-sm font-black text-center py-0.5 rounded-md shadow-xs flex items-center justify-center gap-1">
                        <span>👑</span>
                        <span>{latestResult.number}. {latestResult.animal}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs font-medium">រង់ចាំចាប់ឆ្នោត</div>
                  )}
                </div>

                {/* Back Face: Image for New Result (Cover) */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden shadow-md bg-slate-900 border border-amber-300 relative">
                  <img
                    src="/assets/aistudio/f8a5d8e0-4865-44e6-94ab-7b9f436a53fd_3aa68070.jpg"
                    alt="រូបភាពលទ្ធផលថ្មី - New Result Dish Cover"
                    className="w-full h-full object-cover pointer-events-none rounded-xl"
                  />
                  {/* Subtle decorative gold badge */}
                  <div className="absolute top-1 right-1 bg-black/60 text-yellow-300 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full border border-yellow-400/50 backdrop-blur-xs">
                    ★ ១២
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Dynamic Status Banners (10s audio voice countdown & Winner reveal announcement) */}
      <div className="z-20 w-full flex flex-col items-center justify-center min-h-[50px]">
        {audioSyncSegment ? (
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold shadow-xl border-2 border-yellow-300 flex flex-col items-center gap-1 animate-pulse">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-yellow-200">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
              <span>🚫 បិទការទទួលការភ្នាល់ (Betting Closed)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-yellow-300 drop-shadow">
                {audioSyncSegment.number === 0 ? '០' : audioSyncSegment.number}
              </span>
              <span className="text-base sm:text-xl font-black text-white drop-shadow">
                {audioSyncSegment.khmerWord}
              </span>
              <span className="text-xs sm:text-sm text-yellow-200 font-bold">
                ({audioSyncSegment.romanized})
              </span>
            </div>
          </div>
        ) : isRevealing && revealStep >= 12 && latestResult ? (
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-900 font-extrabold text-xs sm:text-sm tracking-wide shadow-xl border-2 border-yellow-200 animate-pulse flex items-center gap-2">
            <span className="text-base">🏆</span>
            <span>
              លទ្ធផលឈ្នះ: លេខ {latestResult.number} ({latestResult.animal}) - {latestResult.size === 'big' ? 'ធំ' : 'តូច'} | {latestResult.parity === 'odd' ? 'សេស' : 'គូ'}
            </span>
            <span className="text-base">✨</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
