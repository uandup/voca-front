import { useNavigate } from "@tanstack/react-router";
import { PageTitle } from "@/shared/ui/PageTitle";
import { DAYS, NUM_COLS, TIME_SLOTS_DEF } from "./mock/timetableMockData";
import { buildGrid } from "./model/buildGrid";
import { cellCardStyles } from "./ui/timetableStyles";

// "10~11" 형식의 시간 슬롯이 현재 시각을 포함하는지 확인
function isCurrentSlot(time: string): boolean {
  const hour = new Date().getHours();
  const [startStr, endStr] = time.split("~");
  const start = parseInt(startStr);
  const end = parseInt(endStr) === 0 ? 24 : parseInt(endStr); // "9~10"에서 end가 0이면 자정(24)으로 처리
  return hour >= start && hour < end;
}

export default function ClassesPage() {
  const navigate = useNavigate();
  const grid = buildGrid(TIME_SLOTS_DEF);
  const numRows = TIME_SLOTS_DEF.length;

  const dataRowTemplate = TIME_SLOTS_DEF.map((s) =>
    s.isBreak ? "40px" : "60px",
  ).join(" ");

  return (
    <main>
      {/* Header */}
      <div className="flex items-center gap-4">
        <PageTitle title="Class" />
        {/* <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2 -mt-8">
          <span className="material-symbols-outlined text-primary">
            calendar_month
          </span>
          <span className="font-bold text-sm">October 24, 2023</span>
        </div> */}
      </div>

      {/* Timetable — 단일 CSS grid */}
      <div
        className="bg-surface-container-lowest rounded-md shadow-[0_8px_32px_rgba(0,21,80,0.1)] border border-outline-variant/30 overflow-hidden"
        style={{
          display: "grid",
          gridTemplateColumns: `60px repeat(${NUM_COLS}, 1fr)`,
          gridTemplateRows: `48px ${dataRowTemplate}`,
        }}
      >
        {/* 헤더 행 */}
        <div className="bg-white border-b border-r border-outline-variant/30" />
        {DAYS.map((day) => (
          <div
            key={day}
            className="p-4 text-center border-r text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest bg-white border-b border-outline-variant/30"
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
              <div
                key={`time-${slot.time}`}
                className={`px-3 justify-center flex items-center border-r border-outline-variant/30 font-headline font-semibold text-xs ${
                  isBreak
                    ? "bg-surface-container-low text-on-surface-variant/40"
                    : "bg-white text-outline"
                } ${rowIdx < numRows - 1 ? "border-b border-outline-variant/30" : ""}`}
                style={{ gridRow, gridColumn: 1 }}
              >
                {slot.time}
              </div>

              {isBreak ? (
                <div
                  key={`break-${slot.time}`}
                  className="bg-surface-container-low"
                  style={{ gridRow, gridColumn: "2 / -1" }}
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
                      className={`p-2 border-r border-outline-variant/30 ${isLastCol ? "border-r-0" : ""} border-b border-outline-variant/30`}
                      style={{
                        gridRow: `${gridRow} / ${gridRowEnd}`,
                        gridColumn: `${gridColStart} / ${gridColEnd}`,
                      }}
                    >
                      {cell.label && (
                        <div
                          className={`h-full rounded-xl p-3 flex items-center justify-center transition-colors cursor-pointer ${v.card} ${isCurrentSlot(slot.time) ? "ring-2 ring-primary" : ""}`}
                          onClick={() =>
                            cell.classId &&
                            navigate({
                              to: "/teacher/class/$classId",
                              params: { classId: String(cell.classId) },
                            })
                          }
                        >
                          <span className={v.text}>{cell.label}</span>
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
    </main>
  );
}
