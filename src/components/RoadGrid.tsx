import React, { useMemo, useRef, useEffect } from 'react';
import { DrawResult } from '../types';

interface RoadGridProps {
  history: DrawResult[];
}

export const RoadGrid: React.FC<RoadGridProps> = ({ history }) => {
  const NUM_ROWS = 6;
  const MIN_COLS = 26;
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  // Build Big/Small Road for "លេខ / គូចធំ"
  // When result has same SizeGroup (big vs small), stack downwards.
  // If row reaches 6, continues in next column (or wraps). When size changes, move to next column at row 0.
  const bigSmallRoad = useMemo(() => {
    // Process from oldest to newest
    const items = [...history].reverse();

    // First pass to determine required columns
    let col = 0;
    let row = 0;
    let lastSize: string | null = null;

    const placements: { col: number; row: number; item: DrawResult }[] = [];

    for (const item of items) {
      if (lastSize === null) {
        placements.push({ col, row, item });
        lastSize = item.size;
      } else if (item.size === lastSize) {
        if (row + 1 < NUM_ROWS) {
          row++;
          placements.push({ col, row, item });
        } else {
          // Wrapped column on same streak
          col++;
          row = 0;
          placements.push({ col, row, item });
        }
      } else {
        // Size flipped
        col++;
        row = 0;
        placements.push({ col, row, item });
        lastSize = item.size;
      }
    }

    const maxCol = Math.max(MIN_COLS, col + 6);
    const cols: (DrawResult | null)[][] = Array.from({ length: maxCol }, () =>
      Array(NUM_ROWS).fill(null)
    );

    for (const p of placements) {
      if (p.col < maxCol && p.row < NUM_ROWS) {
        cols[p.col][p.row] = p.item;
      }
    }

    return { cols, totalCols: maxCol };
  }, [history]);

  // Build Color Streak Road for "ពណ៌ / សេសគូ"
  // Stack downwards on same Color (Red, Green, Blue). Flips column on Color change.
  // Text inside shows 'ស' (Odd) or 'គ' (Even).
  const colorParityRoad = useMemo(() => {
    const items = [...history].reverse();

    let col = 0;
    let row = 0;
    let lastColor: string | null = null;

    const placements: { col: number; row: number; item: DrawResult }[] = [];

    for (const item of items) {
      if (lastColor === null) {
        placements.push({ col, row, item });
        lastColor = item.color;
      } else if (item.color === lastColor) {
        if (row + 1 < NUM_ROWS) {
          row++;
          placements.push({ col, row, item });
        } else {
          col++;
          row = 0;
          placements.push({ col, row, item });
        }
      } else {
        col++;
        row = 0;
        placements.push({ col, row, item });
        lastColor = item.color;
      }
    }

    const maxCol = Math.max(MIN_COLS, col + 6);
    const cols: (DrawResult | null)[][] = Array.from({ length: maxCol }, () =>
      Array(NUM_ROWS).fill(null)
    );

    for (const p of placements) {
      if (p.col < maxCol && p.row < NUM_ROWS) {
        cols[p.col][p.row] = p.item;
      }
    }

    return { cols, totalCols: maxCol };
  }, [history]);

  // Sync scroll or smooth scroll on update if needed
  useEffect(() => {
    if (leftScrollRef.current && rightScrollRef.current) {
      // Keep scroll in sync or comfortable
    }
  }, [history.length]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 border-t border-[#8cb7e4] bg-[#ffffff] select-none">
      {/* Left: លេខ / គូចធំ (Number / Big-Small Road) */}
      <div className="border-r border-[#8cb7e4] flex flex-col">
        {/* Header */}
        <div className="bg-[#dae4f0] text-[#334155] font-bold text-center py-2 text-base md:text-lg tracking-wide border-b border-[#8cb7e4]">
          លេខ / គូចធំ
        </div>

        {/* Matrix Grid matching user platform image */}
        <div ref={leftScrollRef} className="overflow-x-auto p-0 bg-white">
          <div className="inline-block min-w-full">
            {Array.from({ length: NUM_ROWS }).map((_, rIdx) => (
              <div key={rIdx} className="flex">
                {Array.from({ length: bigSmallRoad.totalCols }).map((_, cIdx) => {
                  const item = bigSmallRoad.cols[cIdx]?.[rIdx];
                  const isBig = item?.size === 'big';

                  return (
                    <div
                      key={cIdx}
                      className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[44px] md:h-[44px] border-b border-r border-[#8cb7e4] flex items-center justify-center bg-white"
                    >
                      {item && (
                        <div
                          className={`w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] md:w-[37px] md:h-[37px] rounded-full flex items-center justify-center text-sm sm:text-base md:text-[17px] font-black text-slate-950 bg-white transition-transform hover:scale-110 border-[3px] md:border-[3.5px] ${
                            isBig
                              ? 'border-[#ff2a70]' // Vibrant Pink for ធំ (Big: 7-12)
                              : 'border-[#00b0ff]' // Vibrant Sky Blue for តូច (Small: 1-6)
                          }`}
                          title={`#${item.roundId} | លេខ ${item.number} (${item.animal}) - ${isBig ? 'ធំ' : 'តូច'}`}
                        >
                          {item.number}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: ពណ៌ / សេសគូ (Color / Odd-Even Road) */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-[#dae4f0] text-[#334155] font-bold text-center py-2 text-base md:text-lg tracking-wide border-b border-[#8cb7e4]">
          ពណ៌ / សេសគូ
        </div>

        {/* Matrix Grid matching user platform image */}
        <div ref={rightScrollRef} className="overflow-x-auto p-0 bg-white">
          <div className="inline-block min-w-full">
            {Array.from({ length: NUM_ROWS }).map((_, rIdx) => (
              <div key={rIdx} className="flex">
                {Array.from({ length: colorParityRoad.totalCols }).map((_, cIdx) => {
                  const item = colorParityRoad.cols[cIdx]?.[rIdx];
                  const isOdd = item?.parity === 'odd';
                  const bgClass =
                    item?.color === 'red'
                      ? 'bg-[#e50914]'
                      : item?.color === 'green'
                      ? 'bg-[#00a651]'
                      : 'bg-[#0038e0]';

                  return (
                    <div
                      key={cIdx}
                      className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[44px] md:h-[44px] border-b border-r border-[#8cb7e4] flex items-center justify-center bg-white"
                    >
                      {item && (
                        <div
                          className={`w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] md:w-[37px] md:h-[37px] rounded-full flex items-center justify-center text-sm sm:text-base md:text-[17px] font-black text-white shadow-xs transition-transform hover:scale-110 ${bgClass}`}
                          title={`#${item.roundId} | ${item.color.toUpperCase()} - ${isOdd ? 'សេស (Odd)' : 'គូ (Even)'}`}
                        >
                          {isOdd ? 'ស' : 'គ'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
