import React from 'react';
import { AnimalArtwork } from './AnimalIllustrations';
import { ANIMALS_DATA, BetCategory, DrawResult } from '../types';

interface BettingBoardProps {
  countdown: number;
  currentRoundId: string;
  currentRoundTime: string;
  activeBets: Record<string, number>;
  onPlaceBet: (category: BetCategory, defaultOdds: number, label: string) => void;
  selectedChip: number;
  latestResult: DrawResult | null;
  isRevealing: boolean;
  onRefreshRound?: () => void;
}

export const BettingBoard: React.FC<BettingBoardProps> = ({
  countdown,
  currentRoundId,
  currentRoundTime,
  activeBets,
  onPlaceBet,
  selectedChip,
  latestResult,
  isRevealing,
  onRefreshRound,
}) => {
  // Live clock display in Cambodian / local time
  const [liveTime, setLiveTime] = React.useState<string>('16:21:08');

  React.useEffect(() => {
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

  // Format currency
  const formatBetAmount = (amt: number) => {
    if (amt >= 1000000) return `${(amt / 1000000).toFixed(1)}M៛`;
    if (amt >= 1000) return `${amt / 1000}K៛`;
    return `${amt}៛`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#ffffff] select-none">
      {/* Top Header Bar */}
      <div className="flex h-12 w-full shadow-sm">
        {/* Big Red Countdown Block */}
        <div
          className={`w-24 sm:w-28 flex items-center justify-center font-black text-2xl sm:text-3xl text-white tracking-wider transition-colors ${
            countdown <= 5 && countdown > 0 ? 'bg-red-700 animate-pulse' : 'bg-[#c51d24]'
          }`}
        >
          {countdown}
        </div>

        {/* Center / Right Navy Header */}
        <div className="flex-1 bg-[#23497d] flex items-center justify-between px-3 text-white text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshRound}
              className="p-1 hover:bg-white/10 rounded transition-transform active:rotate-180"
              title="Refresh Round"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <span className="tracking-wide">
              {currentRoundId} {currentRoundTime}
            </span>
          </div>

          <div className="font-mono text-sm sm:text-base tracking-wider text-slate-100">
            {liveTime}
          </div>
        </div>
      </div>

      {/* Top Betting Grid: Small/Big, Odd/Even, Colors */}
      <div className="p-1 sm:p-2 bg-[#ffffff]">
        <div className="grid grid-cols-5 gap-1 text-center font-bold">
          {/* Col 1 & 2: Small & Big, Odd & Even */}
          <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-1 h-28 sm:h-32">
            {/* តូច (Small / 1-6) */}
            <button
              onClick={() => onPlaceBet('small', 1.95, 'តូច (Small)')}
              className="relative bg-[#29b6f6] hover:bg-[#0288d1] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group"
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">តូច</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#0288d1] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['small'] && (
                <div className="absolute top-1 right-1 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow animate-scaleIn">
                  {formatBetAmount(activeBets['small'])}
                </div>
              )}
            </button>

            {/* ធំ (Big / 7-12) */}
            <button
              onClick={() => onPlaceBet('big', 1.95, 'ធំ (Big)')}
              className="relative bg-[#ec4899] hover:bg-[#db2777] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group"
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">ធំ</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#db2777] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['big'] && (
                <div className="absolute top-1 right-1 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow animate-scaleIn">
                  {formatBetAmount(activeBets['big'])}
                </div>
              )}
            </button>

            {/* សេស (Odd) */}
            <button
              onClick={() => onPlaceBet('odd', 1.95, 'សេស (Odd)')}
              className="relative bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group"
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">សេស</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#ea580c] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['odd'] && (
                <div className="absolute top-1 right-1 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow animate-scaleIn">
                  {formatBetAmount(activeBets['odd'])}
                </div>
              )}
            </button>

            {/* គូ (Even) */}
            <button
              onClick={() => onPlaceBet('even', 1.95, 'គូ (Even)')}
              className="relative bg-[#fb923c] hover:bg-[#f97316] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group"
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">គូ</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#ea580c] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['even'] && (
                <div className="absolute top-1 right-1 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow animate-scaleIn">
                  {formatBetAmount(activeBets['even'])}
                </div>
              )}
            </button>
          </div>

          {/* Col 3: ក្រហម (Red) */}
          <button
            onClick={() => onPlaceBet('color_red', 2.95, 'ក្រហម (Red)')}
            className="relative bg-[#ef4444] hover:bg-[#dc2626] active:scale-[0.98] text-white flex flex-col items-center justify-between rounded p-2 transition-all shadow-sm h-28 sm:h-32"
          >
            <div>
              <div className="text-base sm:text-lg font-black drop-shadow-sm">ក្រហម</div>
              <div className="text-[10px] sm:text-xs tracking-wider opacity-90 mt-0.5 font-semibold">
                1 &nbsp; 4 &nbsp; 7 &nbsp; 10
              </div>
            </div>
            <div className="w-full flex justify-center">
              <span className="px-3 py-0.5 bg-white text-[#dc2626] text-xs font-bold rounded-full shadow-inner">
                2.95
              </span>
            </div>
            {activeBets['color_red'] && (
              <div className="absolute top-1 right-1 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow animate-scaleIn">
                {formatBetAmount(activeBets['color_red'])}
              </div>
            )}
          </button>

          {/* Col 4: បៃតង (Green) */}
          <button
            onClick={() => onPlaceBet('color_green', 2.95, 'បៃតង (Green)')}
            className="relative bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] text-white flex flex-col items-center justify-between rounded p-2 transition-all shadow-sm h-28 sm:h-32"
          >
            <div>
              <div className="text-base sm:text-lg font-black drop-shadow-sm">បៃតង</div>
              <div className="text-[10px] sm:text-xs tracking-wider opacity-90 mt-0.5 font-semibold">
                2 &nbsp; 5 &nbsp; 8 &nbsp; 11
              </div>
            </div>
            <div className="w-full flex justify-center">
              <span className="px-3 py-0.5 bg-white text-[#16a34a] text-xs font-bold rounded-full shadow-inner">
                2.95
              </span>
            </div>
            {activeBets['color_green'] && (
              <div className="absolute top-1 right-1 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow animate-scaleIn">
                {formatBetAmount(activeBets['color_green'])}
              </div>
            )}
          </button>

          {/* Col 5: ខៀវ (Blue) */}
          <button
            onClick={() => onPlaceBet('color_blue', 2.95, 'ខៀវ (Blue)')}
            className="relative bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] text-white flex flex-col items-center justify-between rounded p-2 transition-all shadow-sm h-28 sm:h-32"
          >
            <div>
              <div className="text-base sm:text-lg font-black drop-shadow-sm">ខៀវ</div>
              <div className="text-[10px] sm:text-xs tracking-wider opacity-90 mt-0.5 font-semibold">
                3 &nbsp; 6 &nbsp; 9 &nbsp; 12
              </div>
            </div>
            <div className="w-full flex justify-center">
              <span className="px-3 py-0.5 bg-white text-[#1d4ed8] text-xs font-bold rounded-full shadow-inner">
                2.95
              </span>
            </div>
            {activeBets['color_blue'] && (
              <div className="absolute top-1 right-1 bg-yellow-400 text-slate-900 border border-yellow-500 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow animate-scaleIn">
                {formatBetAmount(activeBets['color_blue'])}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 12 Animals Grid (2 rows of 6 cards each) */}
      <div className="p-1 sm:p-2 bg-[#ffffff] flex-1">
        <div className="grid grid-cols-6 gap-1 h-full min-h-[190px]">
          {Array.from({ length: 12 }).map((_, idx) => {
            const num = idx + 1;
            const animal = ANIMALS_DATA[num];
            const betKey = `animal_${num}`;
            const betAmount = activeBets[betKey] || 0;
            const isWinner = isRevealing && latestResult?.number === num;

            // Number color based on color group: Red (1,4,7,10), Green (2,5,8,11), Blue (3,6,9,12)
            const numColorClass =
              animal.color === 'red'
                ? 'text-[#dc2626]'
                : animal.color === 'green'
                ? 'text-[#16a34a]'
                : 'text-[#1e40af]';

            return (
              <div
                key={num}
                onClick={() =>
                  onPlaceBet(betKey as BetCategory, animal.odds, `${num}. ${animal.khmerName}`)
                }
                className={`relative flex flex-col justify-between ${
                  num === 1 ? 'p-0 overflow-hidden' : 'p-1'
                } rounded-md border cursor-pointer transition-all duration-150 select-none bg-[#fefce8] hover:bg-[#fef9c3] active:scale-[0.97] aspect-square ${
                  isWinner
                    ? 'ring-4 ring-yellow-400 bg-yellow-100 border-yellow-500 shadow-xl animate-bounce z-20'
                    : 'border-[#cbd5e1] hover:border-blue-400 shadow-xs'
                }`}
              >
                {num === 1 ? (
                  <img
                    src="/assets/aistudio/image_56958bf8.png"
                    alt="1. ជូត"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : (
                  <>
                    {/* Top Left: Khmer Zodiac Name */}
                    <div className="text-xs sm:text-sm font-bold text-[#b45309] leading-none">
                      {animal.khmerName}
                    </div>

                    {/* Center SVG Illustration */}
                    <div className="w-full flex-1 flex items-center justify-center my-0.5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14">
                        <AnimalArtwork number={num} />
                      </div>
                    </div>

                    {/* Bottom Row: Big Bold Number (Left) and Odds 11 (Right) */}
                    <div className="flex items-end justify-between leading-none">
                      <span className={`text-2xl sm:text-3xl font-black ${numColorClass}`}>
                        {num}
                      </span>
                      <span className="text-[10px] sm:text-xs font-black text-red-600 mb-0.5">
                        11
                      </span>
                    </div>
                  </>
                )}

                {/* Active Bet Chip on this animal */}
                {betAmount > 0 && (
                  <div className="absolute top-1 right-1 bg-amber-400 text-slate-900 border border-amber-600 rounded-full text-[10px] px-1.5 py-0.2 font-black shadow-md animate-scaleIn z-10">
                    {formatBetAmount(betAmount)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
