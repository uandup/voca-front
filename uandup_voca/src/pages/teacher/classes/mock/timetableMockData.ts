import type { TimeSlotDef } from "../model/types";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const NUM_COLS = 6;

export const TIME_SLOTS_DEF: TimeSlotDef[] = [
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
