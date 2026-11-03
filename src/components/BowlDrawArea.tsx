import React from 'react';
import { AnimalArtwork } from './AnimalIllustrations';
import { DrawResult, ANIMALS_DATA } from '../types';
import { CountdownSyncSegment } from '../utils/countdownAudioSync';

interface BowlDrawAreaProps {
  countdown: number;
  isRevealing: boolean;
  revealStep: number; // 0: closed, 1..6: row 1, 7..11: row 2, 12: row 3 final result
  latestResult: DrawResult | null;
  drawMix?: number[]; // Randomized mix of numbers for each round
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
  drawMix,
  onBowlClick,
  audioSyncSegment,
  isBettingClosed = false,
  onBlockedAttempt,
}) => {
  return (
    <div className="flex-1 bg-[#ffffff] p-2.5 sm:p-3 flex flex-col items-center justify-between min-h-[400px] border-r border-[#94a3b8] relative overflow-hidden select-none">
      {/* Background radial soft aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/40 via-slate-50/20 to-white pointer-events-none" />

      {/* Row 1 Dishes: Positions 1–6 (Sequential Interval: 1,100ms each, revealing randomized mix) */}
      <div className="w-full flex flex-col items-center z-10 mb-1">
        <div className="w-full flex justify-center gap-1.5 sm:gap-2">
          {Array.from({ length: 6 }).map((_, idx) => {
            const bowlPos = idx + 1; // 1 to 6
            const isOpen = isRevealing && revealStep >= bowlPos;
            const revealedNum = drawMix?.[idx] ?? bowlPos;
            const isJustOpened = isRevealing && revealStep === bowlPos;

            return (
              <div
                key={bowlPos}
                onClick={() => {
                  if (isBettingClosed) {
                    onBlockedAttempt?.();
                    return;
                  }
                  onBowlClick?.(bowlPos);
                }}
                className={`p-0.5 sm:p-1 bg-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xs relative ${
                  isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                } ${
                  isJustOpened ? 'scale-105 shadow-md z-15 ring-2 ring-blue-400' : ''
                }`}
                title={
                  isBettingClosed
                    ? `បិទការទទួលការភ្នាល់ (Betting Closed) - ពាន ${bowlPos}`
                    : `ពាន ${bowlPos} (ចុចដើម្បីភ្នាល់)`
                }
              >
                {/* 3D Flip Card Container: Top Covered Bowls Grid (Square aspect ratio for full 4K frame display) */}
                <div className="w-[52px] h-[52px] sm:w-[70px] sm:h-[70px] md:w-[85px] md:h-[85px] aspect-square [perspective:1000px] relative">
                  <div
                    className="w-full h-full relative"
                    style={{
                      transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Face A (Image Hide Like Before): Shown by default when closed (0deg) - Full 4K uncropped */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow-xs bg-[#0b0f19] border border-amber-300/50 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                      }}
                    >
                      <img
                        src="/assets/aistudio/f8a5d8e0_4k.jpg"
                        alt={`ពាន ${bowlPos} - រូបភាពបិទបាំង (4K Full)`}
                        className="w-full h-full object-fill pointer-events-none select-none rounded-lg"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                        }}
                        loading="eager"
                      />
                      {/* Bowl Position Tag on Closed Cover */}
                      <div className="absolute top-0.5 left-0.5 bg-black/80 text-yellow-300 text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full border border-yellow-400/50 shadow-xs pointer-events-none z-10">
                        ពាន {bowlPos}
                      </div>
                    </div>

                    {/* Face B (Image for New Result): Shown when flipped open (180deg) - Full Image */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-lg overflow-hidden bg-[#0b0f19] border border-amber-300/50 shadow-md flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <AnimalArtwork
                        number={revealedNum}
                        className="w-full h-full object-fill pointer-events-none select-none rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2 Dishes: Positions 7–11 (Sequential Interval: 1,100ms each, revealing randomized mix) */}
      <div className="w-full flex flex-col items-center z-10 mb-2">
        <div className="w-full flex justify-center gap-1.5 sm:gap-2">
          {Array.from({ length: 5 }).map((_, idx) => {
            const bowlPos = idx + 7; // 7 to 11
            const isOpen = isRevealing && revealStep >= bowlPos;
            const revealedNum = drawMix?.[idx + 6] ?? bowlPos;
            const isJustOpened = isRevealing && revealStep === bowlPos;

            return (
              <div
                key={bowlPos}
                onClick={() => {
                  if (isBettingClosed) {
                    onBlockedAttempt?.();
                    return;
                  }
                  onBowlClick?.(bowlPos);
                }}
                className={`p-0.5 sm:p-1 bg-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xs relative ${
                  isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                } ${
                  isJustOpened ? 'scale-105 shadow-md z-15 ring-2 ring-blue-400' : ''
                }`}
                title={
                  isBettingClosed
                    ? `បិទការទទួលការភ្នាល់ (Betting Closed) - ពាន ${bowlPos}`
                    : `ពាន ${bowlPos} (ចុចដើម្បីភ្នាល់)`
                }
              >
                {/* 3D Flip Card Container: Top Covered Bowls Grid (Square aspect ratio for full 4K frame display) */}
                <div className="w-[52px] h-[52px] sm:w-[70px] sm:h-[70px] md:w-[85px] md:h-[85px] aspect-square [perspective:1000px] relative">
                  <div
                    className="w-full h-full relative"
                    style={{
                      transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Face A (Image Hide Like Before): Shown by default when closed (0deg) - Full 4K uncropped */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow-xs bg-[#0b0f19] border border-amber-300/50 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                      }}
                    >
                      <img
                        src="/assets/aistudio/f8a5d8e0_4k.jpg"
                        alt={`ពាន ${bowlPos} - រូបភាពបិទបាំង (4K Full)`}
                        className="w-full h-full object-fill pointer-events-none select-none rounded-lg"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                        }}
                        loading="eager"
                      />
                      {/* Bowl Position Tag on Closed Cover */}
                      <div className="absolute top-0.5 left-0.5 bg-black/80 text-yellow-300 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-yellow-400/50 shadow-xs pointer-events-none z-10">
                        ពាន {bowlPos}
                      </div>
                    </div>

                    {/* Face B (Image for New Result): Shown when flipped open (180deg) - Full Image */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-lg overflow-hidden bg-[#0b0f19] border border-amber-300/50 shadow-md flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <AnimalArtwork
                        number={revealedNum}
                        className="w-full h-full object-fill pointer-events-none select-none rounded-lg"
                      />
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
              ? `បិទការទទួលការភ្នាល់ (Betting Closed) - ពានកណ្តាល (លទ្ធផលចុងក្រោយ)`
              : `ពានកណ្តាល - លទ្ធផលចុងក្រោយ`
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
            {/* 3D Flip Card Container: Desktop 224px × 224px (w-56 h-56), Mobile/Tablet 176px × 176px to 208px × 208px (1:1 square for full 4K hide image) */}
            <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 aspect-square [perspective:1000px] relative">
              <div
                className="w-full h-full relative"
                style={{
                  transform: isRevealing && revealStep >= 12 ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Face A (Image Hide Like Before - Cover): Shown by default when closed (0deg) - Full 4K uncropped */}
                <div
                  className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-md bg-[#0b0f19] border-2 border-amber-400/80 flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <img
                    src="/assets/aistudio/f8a5d8e0_4k.jpg"
                    alt="រូបភាពលទ្ធផលថ្មី 4K - New Result Dish Cover Full"
                    className="w-full h-full object-fill pointer-events-none select-none rounded-xl"
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                    }}
                    loading="eager"
                  />
                  {/* Subtle decorative gold badge */}
                  <div className="absolute top-1.5 right-1.5 bg-black/80 text-yellow-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-yellow-400/60 backdrop-blur-xs shadow-xs z-10">
                    ★ 4K លទ្ធផលចុងក្រោយ
                  </div>
                </div>

                {/* Face B (Image for New Result): Shown when flipped open (180deg) - Full Image */}
                <div
                  className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-[#0b0f19] border-2 border-amber-400/80 shadow-2xl flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {latestResult ? (
                    <div className="w-full h-full relative rounded-xl overflow-hidden flex items-center justify-center">
                      <AnimalArtwork
                        number={latestResult.number}
                        className="w-full h-full object-fill pointer-events-none select-none rounded-xl"
                      />
                      {/* Subtle floating gold winner badge without obstructing the artwork */}
                      <div className="absolute top-1.5 right-1.5 bg-black/80 text-yellow-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-yellow-400/60 backdrop-blur-xs shadow-xs z-10">
                        👑 លទ្ធផលឈ្នះ #{latestResult.number}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs font-medium">រង់ចាំចាប់ឆ្នោត</div>
                  )}
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
