import React, { useMemo } from 'react';
import { DrawResult } from '../types';

interface RoadGridProps {
  history: DrawResult[];
}

export const RoadGrid: React.FC<RoadGridProps> = ({ history }) => {
  const NUM_COLS = 16;
  const NUM_ROWS = 6;

  // Build Big Road (Streak by Big/Small) for "លេខ / តូចធំ"
  // When result has same SizeGroup (big vs small), stack downwards. When it flips, move to next column.
  const bigSmallRoad = useMemo(() => {
    // Array of columns, each containing up to NUM_ROWS cells
    const cols: (DrawResult | null)[][] = Array.from({ length: NUM_COLS }, () =>
      Array(NUM_ROWS).fill(null)
    );

    let col = 0;
    let row = 0;
    let lastSize: string | null = null;

    // Process from oldest to newest (up to last 60 results)
    const items = [...history].reverse();

    for (const item of items) {
      if (col >= NUM_COLS) break;

      if (lastSize === null) {
        cols[col][row] = item;
        lastSize = item.size;
      } else if (item.size === lastSize) {
        if (row + 1 < NUM_ROWS && cols[col][row + 1] === null) {
          row++;
          cols[col][row] = item;
        } else {
          // Dragon tail or move right if full
          col++;
          if (col >= NUM_COLS) break;
          cols[col][row] = item;
        }
      } else {
        // Size flipped! Move to next column, start at row 0
        col++;
        row = 0;
        if (col >= NUM_COLS) break;
        cols[col][row] = item;
        lastSize = item.size;
      }
    }

    return cols;
  }, [history]);

  // Build Streak Road for "ពណ៌ / សេសគូ" (Color / Odd-Even)
  // Stack downwards on same color or parity
  const colorParityRoad = useMemo(() => {
    const cols: (DrawResult | null)[][] = Array.from({ length: NUM_COLS }, () =>
      Array(NUM_ROWS).fill(null)
    );

    let col = 0;
    let row = 0;
    let lastKey: string | null = null;

    const items = [...history].reverse();

    for (const item of items) {
      if (col >= NUM_COLS) break;

      // Group key: Parity + Color
      const key = `${item.parity}-${item.color}`;

      if (lastKey === null) {
        cols[col][row] = item;
        lastKey = key;
      } else if (item.parity === items[items.indexOf(item) - 1]?.parity) {
        if (row + 1 < NUM_ROWS && cols[col][row + 1] === null) {
          row++;
          cols[col][row] = item;
        } else {
          col++;
          if (col >= NUM_COLS) break;
          cols[col][row] = item;
        }
      } else {
        col++;
        row = 0;
        if (col >= NUM_COLS) break;
        cols[col][row] = item;
        lastKey = key;
      }
    }

    return cols;
  }, [history]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 border-t-2 border-[#94a3b8] bg-[#f8fafc]">
      {/* Left: លេខ / តូចធំ (Number / Small-Big Road) */}
      <div className="border-r border-[#94a3b8] flex flex-col">
        {/* Header */}
        <div className="bg-[#cbd5e1] text-[#334155] font-bold text-center py-1 text-sm tracking-wider border-b border-[#94a3b8]">
          លេខ / តូចធំ
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto p-1 bg-white">
          <div className="inline-grid grid-rows-6 grid-flow-col gap-0 border border-[#cbd5e1] min-w-full">
            {Array.from({ length: NUM_ROWS }).map((_, rIdx) => (
              <div key={rIdx} className="flex">
                {Array.from({ length: NUM_COLS }).map((_, cIdx) => {
                  const item = bigSmallRoad[cIdx]?.[rIdx];
                  const isBig = item?.size === 'big';
                  return (
                    <div
                      key={cIdx}
                      className="w-7 h-7 sm:w-8 sm:h-8 border-b border-r border-[#e2e8f0] flex items-center justify-center bg-[#fdfdfd]"
                    >
                      {item && (
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform hover:scale-110 ${
                            isBig
                              ? 'bg-[#ec4899] border border-[#db2777]' // Pink for ធំ (Big)
                              : 'bg-[#06b6d4] border border-[#0891b2]' // Cyan for តូច (Small)
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
        <div className="bg-[#cbd5e1] text-[#334155] font-bold text-center py-1 text-sm tracking-wider border-b border-[#94a3b8]">
          ពណ៌ / សេសគូ
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto p-1 bg-white">
          <div className="inline-grid grid-rows-6 grid-flow-col gap-0 border border-[#cbd5e1] min-w-full">
            {Array.from({ length: NUM_ROWS }).map((_, rIdx) => (
              <div key={rIdx} className="flex">
                {Array.from({ length: NUM_COLS }).map((_, cIdx) => {
                  const item = colorParityRoad[cIdx]?.[rIdx];
                  const isOdd = item?.parity === 'odd';
                  const colorClass =
                    item?.color === 'red'
                      ? 'bg-[#ef4444] border-[#dc2626]'
                      : item?.color === 'green'
                      ? 'bg-[#16a34a] border-[#15803d]'
                      : 'bg-[#2563eb] border-[#1d4ed8]';

                  return (
                    <div
                      key={cIdx}
                      className="w-7 h-7 sm:w-8 sm:h-8 border-b border-r border-[#e2e8f0] flex items-center justify-center bg-[#fdfdfd]"
                    >
                      {item && (
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-sm transition-transform hover:scale-110 border ${colorClass}`}
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
