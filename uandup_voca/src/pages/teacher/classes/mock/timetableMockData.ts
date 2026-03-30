import type { TimeSlotDef } from "../model/types";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const NUM_COLS = 6;

export const TIME_SLOTS_DEF: TimeSlotDef[] = [
  {
    time: "10~11",
    cols: [
      { label: "G10 English", style: "class-active", classId: 1 },
      { label: "PreSAT Reading", style: "class-active", classId: 2 },
      null,
      { label: "PreSAT Reading", style: "class-active", classId: 2 },
      { label: "G10 English", style: "class-active", classId: 1 },
      null,
    ],
  },
  {
    time: "11~12",
    cols: [
      { label: "G10 English", style: "class-active", classId: 1 },
      { label: "PreSAT Reading", style: "class-active", classId: 2 },
      { label: "Essay", style: "class-essay", classId: 3 },
      { label: "PreSAT Reading", style: "class-active", classId: 2 },
      { label: "G10 English", style: "class-active", classId: 1 },
      null,
    ],
  },
  { time: "12~13", isBreak: true },
  {
    time: "13~14",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6, classId: 4 }],
  },
  {
    time: "14~15",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6, classId: 4 }],
  },
  {
    time: "15~16",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6, classId: 4 }],
  },
  {
    time: "16~17",
    cols: [{ label: "SAT", style: "class-sat", colSpan: 6, classId: 4 }],
  },
  { time: "17~18", isBreak: true },
  {
    time: "18~19",
    cols: [
      { label: "G6 Literature", style: "class-lit", classId: 5 },
      { label: "G7 Literature", style: "class-lit", classId: 6 },
      { label: "G8 Literature", style: "class-lit", classId: 7 },
      { label: "SL English", style: "class-sl", classId: 8 },
      { label: "G9 English", style: "class-sl", classId: 9 },
      { label: "SL English", style: "class-sl", classId: 8 },
    ],
  },
  {
    time: "19~20",
    cols: [null, null, null, null, null, null],
  },
  {
    time: "20~21",
    cols: [{ label: "SAT Q&A", style: "class-qa", colSpan: 6, classId: 10 }],
  },
  {
    time: "21~22",
    cols: [null, null, null, null, null, null],
  },
];
