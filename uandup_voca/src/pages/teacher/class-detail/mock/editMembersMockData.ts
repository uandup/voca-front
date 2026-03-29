export interface MemberStudent {
  id: string;
  name: string;
  grade: string;
}

export const CURRENT_ROSTER_MOCK: MemberStudent[] = [
  { id: "1", name: "Alexander Bennett", grade: "Level 4" },
  { id: "2", name: "Sophia Martinez", grade: "Level 5" },
  { id: "3", name: "Julian Moore", grade: "Level 4" },
  { id: "4", name: "Kevin Zhang", grade: "Level 3" },
];

export const AVAILABLE_STUDENTS_MOCK: MemberStudent[] = [
  { id: "5", name: "Emma Wilson", grade: "Level 4" },
  { id: "6", name: "David Thompson", grade: "Level 3" },
  { id: "7", name: "Liam O'Connor", grade: "Level 4" },
  { id: "8", name: "Hana Tanaka", grade: "Level 5" },
  { id: "9", name: "Riley Jones", grade: "Level 4" },
];

export const GRADE_OPTIONS = ["Level 3", "Level 4", "Level 5"];
