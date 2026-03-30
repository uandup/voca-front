import type { GridCell, TimeSlotDef } from "./types";
import { NUM_COLS } from "../mock/timetableMockData";

/** break row(점심·저녁 휴식)를 NUM_COLS 개의 빈 GridCell 배열로 변환한다 */
function expandBreakRow(): GridCell[] {
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

/**
 * 일반 시간대 row의 CellDef 배열을 GridCell 배열로 변환한다.
 * colSpan이 있는 셀은 뒤따르는 칸을 skip=true로 채워 grid 위치를 맞춘다.
 * 정의되지 않은 나머지 칸은 빈 셀로 padding한다.
 */
function expandNormalRow(slot: TimeSlotDef): GridCell[] {
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
      classId: cell?.classId,
    });
    // colSpan만큼 뒤따르는 칸은 이미 차지했으므로 skip 처리
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

  // 열 수가 NUM_COLS에 미치지 못하면 빈 셀로 채운다
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
}

/**
 * 같은 열에서 연속으로 동일한 label·style을 가진 셀을 rowSpan으로 병합한다.
 * 병합된 하위 셀은 skip=true로 마킹해 렌더링에서 제외한다.
 */
function mergeConsecutiveRows(grid: GridCell[][]): void {
  const numRows = grid.length;

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
}

/**
 * TimeSlotDef 배열을 CSS grid 렌더링에 사용할 GridCell 2D 배열로 변환한다.
 * 1. 각 slot을 GridCell 배열로 펼친다 (expandBreakRow / expandNormalRow)
 * 2. 연속된 동일 수업을 rowSpan으로 병합한다 (mergeConsecutiveRows)
 */
export function buildGrid(slots: TimeSlotDef[]): GridCell[][] {
  const grid = slots.map((slot) =>
    slot.isBreak ? expandBreakRow() : expandNormalRow(slot)
  );

  mergeConsecutiveRows(grid);

  return grid;
}
