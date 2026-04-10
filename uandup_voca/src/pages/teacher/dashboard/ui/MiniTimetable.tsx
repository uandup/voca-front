import { DAYS, NUM_COLS, TIME_SLOTS_DEF } from '../../classes/mock/timetableMockData';
import { buildGrid } from '../../classes/model/buildGrid';
import { cellCardStyles } from '../../classes/ui/timetableStyles';

const grid = buildGrid(TIME_SLOTS_DEF);
const numRows = TIME_SLOTS_DEF.length;
const dataRowTemplate = TIME_SLOTS_DEF.map((s) => (s.isBreak ? '20px' : '32px')).join(' ');

export function MiniTimetable() {
  return (
    <div
      className="rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-lowest"
      style={{
        display: 'grid',
        gridTemplateColumns: `36px repeat(${NUM_COLS}, 1fr)`,
        gridTemplateRows: `28px ${dataRowTemplate}`,
      }}
    >
      {/* 헤더 행 */}
      <div className="bg-white border-b border-r border-outline-variant/30" />
      {DAYS.map((day) => (
        <div
          key={day}
          className="flex items-center justify-center border-r border-b border-outline-variant/30 bg-white text-on-surface-variant font-bold text-[9px] uppercase tracking-wider"
        >
          {day}
        </div>
      ))}

      {/* 데이터 행 */}
      {TIME_SLOTS_DEF.map((slot, rowIdx) => {
        const gridRow = rowIdx + 2;
        const isBreak = !!slot.isBreak;

        return (
          <>
            {/* 시간 레이블 */}
            <div
              key={`time-${slot.time}`}
              className={`flex items-center justify-center border-r border-outline-variant/30 font-bold text-[8px] ${
                isBreak
                  ? 'bg-surface-container-low text-on-surface-variant/30'
                  : 'bg-white text-outline'
              } ${rowIdx < numRows - 1 ? 'border-b border-outline-variant/30' : ''}`}
              style={{ gridRow, gridColumn: 1 }}
            >
              {slot.time.split('~')[0]}
            </div>

            {isBreak ? (
              <div
                key={`break-${slot.time}`}
                className="bg-surface-container-low"
                style={{ gridRow, gridColumn: '2 / -1' }}
              />
            ) : (
              grid[rowIdx].map((cell, colIdx) => {
                if (cell.skip) return null;
                const v = cellCardStyles[cell.style] ?? cellCardStyles.empty;
                const gridColStart = colIdx + 2;
                const gridColEnd = gridColStart + cell.colSpan;
                const gridRowEnd = gridRow + cell.rowSpan;
                const isLastCol = gridColEnd > NUM_COLS + 1;

                return (
                  <div
                    key={`${slot.time}-${colIdx}`}
                    className={`p-0.5 border-r border-outline-variant/30 ${isLastCol ? 'border-r-0' : ''} border-b border-outline-variant/30`}
                    style={{
                      gridRow: `${gridRow} / ${gridRowEnd}`,
                      gridColumn: `${gridColStart} / ${gridColEnd}`,
                    }}
                  >
                    {cell.label && (
                      <div className={`h-full rounded flex items-center justify-center ${v.card}`}>
                        <span className={`${v.text} !text-[8px] leading-tight text-center px-0.5`}>
                          {cell.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        );
      })}
    </div>
  );
}
