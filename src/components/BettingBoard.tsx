import React from 'react';
import { AnimalArtwork } from './AnimalIllustrations';
import { ANIMALS_DATA, BetCategory, DrawResult } from '../types';
import { CountdownSyncSegment } from '../utils/countdownAudioSync';

interface BettingBoardProps {
  countdown: number;
  currentRoundId: string;
  currentRoundTime: string;
  activeBets: Record<string, number>;
  onPlaceBet: (category: BetCategory, defaultOdds: number, label: string) => void;
  selectedChip: number;
  latestResult: DrawResult | null;
  isRevealing: boolean;
  revealStep?: number;
  onRefreshRound?: () => void;
  audioSyncSegment?: CountdownSyncSegment | null;
  isBettingClosed?: boolean;
  onBlockedAttempt?: () => void;
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
  revealStep = 0,
  onRefreshRound,
  audioSyncSegment,
  isBettingClosed = false,
  onBlockedAttempt,
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

  // Format currency with standard Khmer Riel symbol ៛
  const formatBetAmount = (amt: number) => {
    return `${amt.toLocaleString()}៛`;
  };

  const handleAttemptBet = (category: BetCategory, odds: number, label: string) => {
    if (isBettingClosed) {
      onBlockedAttempt?.();
      return;
    }
    onPlaceBet(category, odds, label);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#ffffff] select-none">
      {/* Top Header Bar */}
      <div className="flex h-12 w-full shadow-sm">
        {/* Countdown / Audio Figure Sync Block */}
        {audioSyncSegment ? (
          <div className="w-24 sm:w-28 flex flex-col items-center justify-center font-black text-white bg-gradient-to-b from-red-600 via-rose-700 to-red-800 border-r-2 border-yellow-300 p-0.5 animate-pulse">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-300 drop-shadow leading-none">
              {audioSyncSegment.number === 0 ? '០' : audioSyncSegment.number}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-white tracking-tight drop-shadow truncate max-w-full">
              {audioSyncSegment.khmerWord}
            </div>
          </div>
        ) : isRevealing ? (
          <div className="w-24 sm:w-28 flex flex-col items-center justify-center font-black text-white bg-[#c51d24] transition-all">
            {revealStep >= 12 && latestResult ? (
              <div className="flex flex-col items-center justify-center leading-tight">
                <span className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider">ឈ្នះ 👑</span>
                <span className="text-sm sm:text-base font-black text-yellow-200 truncate px-1">
                  {latestResult.number}. {latestResult.animal}
                </span>
              </div>
            ) : (
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider animate-pulse">
                OPEN
              </span>
            )}
          </div>
        ) : isBettingClosed ? (
          <div className="w-24 sm:w-28 flex flex-col items-center justify-center font-black text-white bg-red-700 animate-pulse">
            <div className="text-lg sm:text-xl leading-none">0:{String(countdown).padStart(2, '0')}</div>
            <div className="text-[9px] text-yellow-200 uppercase font-bold mt-0.5">បិទភ្នាល់</div>
          </div>
        ) : (
          <div className="w-24 sm:w-28 flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl text-white tracking-wider bg-[#c51d24]">
            {`${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`}
          </div>
        )}

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
            <button
              onClick={() => handleAttemptBet('small', 1.95, 'តូច (Small)')}
              className={`ml-2 px-3 py-1 text-white text-xs sm:text-sm font-black rounded shadow transition-all flex items-center gap-1 ${
                isBettingClosed
                  ? 'bg-slate-500 hover:bg-slate-600 cursor-not-allowed opacity-80'
                  : 'bg-[#16a34a] hover:bg-[#15803d] active:scale-95 cursor-pointer'
              }`}
              title={isBettingClosed ? 'បិទការទទួលការភ្នាល់ (Betting Closed)' : 'ចុចដើម្បីភ្នាល់ (Click to place bet)'}
            >
              <span>{isBettingClosed ? 'បិទភ្នាល់' : 'ភ្នាល់'}</span>
            </button>
          </div>

          <div className="font-mono text-sm sm:text-base tracking-wider text-slate-100">
            {liveTime}
          </div>
        </div>
      </div>

      {/* Prominent Betting Closed Alert Banner */}
      {isBettingClosed && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-yellow-200 text-xs sm:text-sm font-black py-1.5 px-3 flex items-center justify-center gap-2 border-b border-red-700 shadow-xs animate-pulse">
          <span className="text-base">🚫</span>
          <span>បិទការទទួលការភ្នាល់! (Betting Closed - មិនទទួលការភ្នាល់ថ្មីក្នុងអំឡុងពេលរាប់ថយក្រោយឡើយ)</span>
          {audioSyncSegment && (
            <span className="ml-2 bg-yellow-400 text-red-900 px-2 py-0.5 rounded-full text-xs font-black shadow-xs">
              {audioSyncSegment.number}: {audioSyncSegment.khmerWord}
            </span>
          )}
        </div>
      )}

      {/* Top Betting Grid: Small/Big, Odd/Even, Colors */}
      <div className="p-1 sm:p-2 bg-[#ffffff]">
        <div className="grid grid-cols-5 gap-1 text-center font-bold">
          {/* Col 1 & 2: Small & Big, Odd & Even */}
          <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-1 h-28 sm:h-32">
            {/* តូច (Small / 1-6) */}
            <button
              onClick={() => handleAttemptBet('small', 1.95, 'តូច (Small)')}
              className={`relative bg-[#29b6f6] hover:bg-[#0288d1] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group ${
                isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
              }`}
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">តូច</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#0288d1] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['small'] && (
                <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-10 whitespace-nowrap">
                  {formatBetAmount(activeBets['small'])}
                </div>
              )}
            </button>

            {/* ធំ (Big / 7-12) */}
            <button
              onClick={() => handleAttemptBet('big', 1.95, 'ធំ (Big)')}
              className={`relative bg-[#ec4899] hover:bg-[#db2777] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group ${
                isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
              }`}
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">ធំ</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#db2777] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['big'] && (
                <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-10 whitespace-nowrap">
                  {formatBetAmount(activeBets['big'])}
                </div>
              )}
            </button>

            {/* សេស (Odd) */}
            <button
              onClick={() => handleAttemptBet('odd', 1.95, 'សេស (Odd)')}
              className={`relative bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group ${
                isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
              }`}
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">សេស</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#ea580c] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['odd'] && (
                <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-10 whitespace-nowrap">
                  {formatBetAmount(activeBets['odd'])}
                </div>
              )}
            </button>

            {/* គូ (Even) */}
            <button
              onClick={() => handleAttemptBet('even', 1.95, 'គូ (Even)')}
              className={`relative bg-[#fb923c] hover:bg-[#f97316] active:scale-[0.98] text-white flex flex-col items-center justify-center rounded p-1 transition-all shadow-sm group ${
                isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
              }`}
            >
              <span className="text-lg sm:text-xl font-black drop-shadow-sm">គូ</span>
              <span className="mt-1 px-2 py-0.5 bg-white text-[#ea580c] text-xs font-bold rounded-full shadow-inner">
                1.95
              </span>
              {activeBets['even'] && (
                <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-10 whitespace-nowrap">
                  {formatBetAmount(activeBets['even'])}
                </div>
              )}
            </button>
          </div>

          {/* Col 3: ក្រហម (Red) */}
          <button
            onClick={() => handleAttemptBet('color_red', 2.95, 'ក្រហម (Red)')}
            className={`relative bg-[#ef4444] hover:bg-[#dc2626] active:scale-[0.98] text-white flex flex-col items-center justify-between rounded p-2 transition-all shadow-sm h-28 sm:h-32 ${
              isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
            }`}
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
              <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-10 whitespace-nowrap">
                {formatBetAmount(activeBets['color_red'])}
              </div>
            )}
          </button>

          {/* Col 4: បៃតង (Green) */}
          <button
            onClick={() => handleAttemptBet('color_green', 2.95, 'បៃតង (Green)')}
            className={`relative bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] text-white flex flex-col items-center justify-between rounded p-2 transition-all shadow-sm h-28 sm:h-32 ${
              isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
            }`}
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
              <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-10 whitespace-nowrap">
                {formatBetAmount(activeBets['color_green'])}
              </div>
            )}
          </button>

          {/* Col 5: ខៀវ (Blue) */}
          <button
            onClick={() => handleAttemptBet('color_blue', 2.95, 'ខៀវ (Blue)')}
            className={`relative bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] text-white flex flex-col items-center justify-between rounded p-2 transition-all shadow-sm h-28 sm:h-32 ${
              isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
            }`}
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
              <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-10 whitespace-nowrap">
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
                  handleAttemptBet(betKey as BetCategory, animal.odds, `${num}. ${animal.khmerName}`)
                }
                className={`relative flex flex-col justify-between ${
                  num >= 1 && num <= 12 ? 'p-0 overflow-hidden' : 'p-1'
                } rounded-md border transition-all duration-150 select-none bg-[#fefce8] hover:bg-[#fef9c3] active:scale-[0.97] aspect-square w-full ${
                  isBettingClosed ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                } ${
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
                ) : num === 2 ? (
                  <img
                    src="/assets/aistudio/image_db618d8c.png"
                    alt="2. ឆ្លូវ"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 3 ? (
                  <img
                    src="/assets/aistudio/image_f12e60ed.png"
                    alt="3. ខាល"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 4 ? (
                  <img
                    src="/assets/aistudio/image_da2dada5.png"
                    alt="4. ថោះ"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 5 ? (
                  <img
                    src="/assets/aistudio/image_d13f2d73.png"
                    alt="5. រោង"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 6 ? (
                  <img
                    src="/assets/aistudio/image_200a760b.png"
                    alt="6. ម្សាញ់"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 7 ? (
                  <img
                    src="/assets/aistudio/image_50856913.png"
                    alt="7. មមី"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 8 ? (
                  <img
                    src="/assets/aistudio/image_c0557994.png"
                    alt="8. មមែ"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 9 ? (
                  <img
                    src="/assets/aistudio/image_799af351.png"
                    alt="9. វក"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 10 ? (
                  <img
                    src="/assets/aistudio/image_a48a72a3.png"
                    alt="10. រកា"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 11 ? (
                  <img
                    src="/assets/aistudio/image_512554a0.png"
                    alt="11. ច"
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                ) : num === 12 ? (
                  <img
                    src="/assets/aistudio/image_64be13af.png"
                    alt="12. កុរ"
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
                  <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-slate-950 border border-amber-600 rounded-full text-[10px] sm:text-[11px] px-2 py-0.5 font-black shadow-md animate-scaleIn z-20 whitespace-nowrap">
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
