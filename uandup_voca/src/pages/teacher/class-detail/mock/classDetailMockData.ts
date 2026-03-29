export interface ScoreEntry {
  correct: number;
  total: number;
}

export interface StudentRow {
  id: string;
  name: string;
  grade: string;
  assignedLevels: (1 | 2 | 3 | 4)[];
  scores: ScoreEntry[]; // 오름차순 [오래된순 → 최근순], 최대 3개
  accuracy: string;
  trend: "up" | "down" | "flat";
  memo?: string;
}

export interface ClassDetailData {
  classId: string;
  className: string;
  subtitle: string;
  classAverage: string;
  studentCount: number;
  capacity: number;
  students: StudentRow[];
}

export const CLASS_DETAIL_MOCK: ClassDetailData = {
  classId: "g10-english-a",
  className: "G10 English A",
  subtitle: "Linguistic Rhetoric & Advanced Vocabulary Mastery",
  classAverage: "88.5%",
  studentCount: 24,
  capacity: 30,
  students: [
    {
      id: "1",
      name: "고세규",
      grade: "10th",
      assignedLevels: [4],
      scores: [
        { correct: 34, total: 40 },
        { correct: 36, total: 40 },
        { correct: 38, total: 40 },
      ],
      accuracy: "95.0%",
      trend: "up",
      memo: "심화 과정 추천",
    },
    {
      id: "2",
      name: "이은수",
      grade: "11th",
      assignedLevels: [1, 2, 3, 4],
      scores: [
        { correct: 31, total: 40 },
        { correct: 32, total: 40 },
      ],
      accuracy: "82.4%",
      trend: "down",
      memo: "메모의 길이는 어느정도가 될것인가?메모의 길이는 어느정도가 될것인가?메모의 길이는 어느정도가 될것인가?메모의 길이는 어느정도가 될것인가?메모의 길이는 어느정도가 될것인가?",
    },
    {
      id: "3",
      name: "박지현",
      grade: "10th",
      assignedLevels: [3, 4],
      scores: [
        { correct: 32, total: 40 },
        { correct: 34, total: 40 },
        { correct: 36, total: 40 },
      ],
      accuracy: "91.2%",
      trend: "up",
      memo: "꾸준한 향상세",
    },
    {
      id: "4",
      name: "김민준",
      grade: "9th",
      assignedLevels: [2],
      scores: [{ correct: 30, total: 40 }],
      accuracy: "76.8%",
      trend: "flat",
    },
  ],
};
