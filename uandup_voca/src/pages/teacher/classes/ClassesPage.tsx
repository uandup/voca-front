// ─── 타입 ─────────────────────────────────────────────────────────────────
interface CellDef {
  label: string;
  style: string;
  colSpan?: number;
}

interface TimeSlotDef {
  time: string;
  isBreak?: boolean;
  cols?: (CellDef | null)[];
}

// ─── 데이터 ───────────────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const NUM_COLS = 6;

const TIME_SLOTS_DEF: TimeSlotDef[] = [
  {
    time: "10~11",
    cols: [
      { label: "G10 English", style: "class-active" },
      { label: "PreSAT Reading", style: "class-active" },
      null,
      { label: "PreSAT Reading", style: "class-active" },
      { label: "G10 English", style: "class-active" },
      null,
    ],
  },
  {
    time: "11~12",
    cols: [
      { label: "G10 English", style: "class-active" },
      { label: "PreSAT Reading", style: "class-active" },
      { label: "Essay", style: "class-essay" },
      { label: "PreSAT Reading", style: "class-active" },
      { label: "G10 English", style: "class-active" },
      null,
    ],
  },
  { time: "12~1", isBreak: true },
  {
    time: "1~2",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6 }],
  },
  {
    time: "2~3",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6 }],
  },
  {
    time: "3~4",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6 }],
  },
  {
    time: "4~5",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6 }],
  },
  { time: "5~6", isBreak: true },
  {
    time: "6~7",
    cols: [
      { label: "G6 Literature", style: "class-lit" },
      { label: "G7 Literature", style: "class-lit" },
      { label: "G8 Literature", style: "class-lit" },
      { label: "SL English", style: "class-sl" },
      { label: "G9 English", style: "class-sl" },
      { label: "SL English", style: "class-sl" },
    ],
  },
  {
    time: "7~8",
    cols: [null, null, null, null, null, null],
  },
  {
    time: "8~9",
    cols: [{ label: "SAT Q&A", style: "class-qa", colSpan: 6 }],
  },
  {
    time: "9~10",
    cols: [null, null, null, null, null, null],
  },
];

// ─── 스타일 ───────────────────────────────────────────────────────────────
const cellCardStyles: Record<string, { card: string; text: string }> = {
  "class-active": {
    card: "bg-primary-container/10  hover:bg-primary-container/20",
    text: "text-primary font-headline font-bold text-sm",
  },
  "class-essay": {
    card: "bg-surface-container-highest hover:bg-surface-container-high",
    text: "text-on-surface font-headline font-bold text-sm",
  },
  "class-sat": {
    card: "bg-surface-container-highest hover:bg-surface-container-high",
    text: "text-on-surface font-headline font-extrabold text-sm tracking-widest",
  },
  "class-lit": {
    card: "bg-tertiary-fixed/40  hover:bg-tertiary-fixed/60",
    text: "text-tertiary font-headline font-bold text-sm",
  },
  "class-sl": {
    card: "bg-primary-container/10  hover:bg-primary-container/20",
    text: "text-primary font-headline font-bold text-sm",
  },
  "class-qa": {
    card: "bg-secondary-container/30  hover:bg-secondary-container/50",
    text: "text-on-secondary-fixed-variant font-headline font-bold text-sm",
  },
  empty: { card: "", text: "" },
};

// ─── 전처리: 단일 flat grid 생성 ──────────────────────────────────────────
// grid는 TIME_SLOTS_DEF 행 수 × NUM_COLS 열의 2D 배열
// skip=true → 위 셀의 rowSpan에 포함되므로 렌더링하지 않음

interface GridCell {
  label: string;
  style: string;
  colSpan: number;
  rowSpan: number;
  skip: boolean;
  isBreak: boolean;
}

function buildGrid(): GridCell[][] {
  const numRows = TIME_SLOTS_DEF.length;

  // 초기화
  const grid: GridCell[][] = TIME_SLOTS_DEF.map((slot) => {
    if (slot.isBreak) {
      return Array(NUM_COLS)
        .fill(null)
        .map(() => ({
          label: "",
          style: "empty",
          colSpan: 1,
          rowSpan: 1,
          skip: false,
          isBreak: true,
        }));
    }

    const expanded: GridCell[] = [];
    for (const cell of slot.cols ?? []) {
      const span = cell?.colSpan ?? 1;
      expanded.push({
        label: cell?.label ?? "",
        style: cell?.style ?? "empty",
        colSpan: span,
        rowSpan: 1,
        skip: false,
        isBreak: false,
      });
      for (let k = 1; k < span; k++) {
        expanded.push({
          label: "",
          style: "empty",
          colSpan: 1,
          rowSpan: 1,
          skip: true,
          isBreak: false,
        });
      }
    }
    while (expanded.length < NUM_COLS) {
      expanded.push({
        label: "",
        style: "empty",
        colSpan: 1,
        rowSpan: 1,
        skip: false,
        isBreak: false,
      });
    }
    return expanded;
  });

  // 컬럼별 연속 동일 셀 → rowSpan 병합 (break row는 병합 대상 아님)
  for (let c = 0; c < NUM_COLS; c++) {
    let r = 0;
    while (r < numRows) {
      const cell = grid[r][c];
      if (cell.skip || cell.isBreak || !cell.label) {
        r++;
        continue;
      }

      let span = 1;
      while (
        r + span < numRows &&
        !grid[r + span][c].isBreak &&
        !grid[r + span][c].skip &&
        grid[r + span][c].label === cell.label &&
        grid[r + span][c].style === cell.style
      ) {
        grid[r + span][c].skip = true;
        span++;
      }
      cell.rowSpan = span;
      r += span;
    }
  }

  return grid;
}

import { PageTitle } from "@/shared/ui/PageTitle";

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ClassesPage() {
  const grid = buildGrid();
  const numRows = TIME_SLOTS_DEF.length;

  // CSS grid row template: 헤더(1행) + 데이터 행들
  // 각 데이터 행 높이: break row는 작게, 일반 row는 동일
  const dataRowTemplate = TIME_SLOTS_DEF.map((s) =>
    s.isBreak ? "40px" : "60px",
  ).join(" ");

  return (
    <main>
      {/* Header */}
      <div className="flex items-center gap-4">
        <PageTitle title="Classes" />
        <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2 -mt-8">
          <span className="material-symbols-outlined text-primary">
            calendar_month
          </span>
          <span className="font-bold text-sm">October 24, 2023</span>
        </div>
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
        {/* ── 헤더 행 (row 1) ── */}
        <div className="bg-white border-b border-r border-outline-variant/30" />
        {DAYS.map((day) => (
          <div
            key={day}
            className="p-4 text-center border-r text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest bg-white border-b border-outline-variant/30"
          >
            {day}
          </div>
        ))}

        {/* ── 데이터 행 (row 2 ~ numRows+1) ── */}
        {TIME_SLOTS_DEF.map((slot, rowIdx) => {
          const gridRow = rowIdx + 2; // CSS grid row (1-based, 헤더가 1)
          const isBreak = !!slot.isBreak;

          return (
            <>
              {/* 시간 레이블 셀 */}
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
                // break row: 6칸을 하나로
                <div
                  key={`break-${slot.time}`}
                  className="bg-surface-container-low"
                  style={{ gridRow, gridColumn: "2 / -1" }}
                />
              ) : (
                // 일반 row: 각 컬럼 셀 렌더링
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
                          className={`h-full rounded-xl p-3 flex items-center justify-center transition-colors cursor-pointer ${v.card}`}
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
