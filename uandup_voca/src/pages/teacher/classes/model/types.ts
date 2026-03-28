export interface CellDef {
  label: string;
  style: string;
  colSpan?: number;
}

export interface TimeSlotDef {
  time: string;
  isBreak?: boolean;
  cols?: (CellDef | null)[];
}

export interface GridCell {
  label: string;
  style: string;
  colSpan: number;
  rowSpan: number;
  skip: boolean;
  isBreak: boolean;
}
