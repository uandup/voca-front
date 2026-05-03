export interface Class {
  id: number;
  name: string;
}

export interface ClassMember {
  classId: number;
  memberId: number;
}

export interface TimetableCellDef {
  label: string;
  style: string;
  colSpan?: number;
  classId?: number;
}

export interface TimetableTimeSlot {
  time: string;
  isBreak?: boolean;
  cols?: (TimetableCellDef | null)[];
}

export interface TimetableGridCell {
  label: string;
  style: string;
  colSpan: number;
  rowSpan: number;
  skip: boolean;
  isBreak: boolean;
  classId?: number;
}
