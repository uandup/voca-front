export interface ManagedStudent {
  id: number;
  name: string;
  nameKo: string;
  grade: number;
  joinedAt: string; // "YY.MM.DD"
  classes: string[];
  clinics: string[];
  testCount: number;
  avgAssigned: number;
  accuracy: string;
  assignedLevels: (1 | 2 | 3 | 4)[];
  assignedWordCount: number;
  memo?: string;
}

export const STUDENT_MANAGE_MOCK: ManagedStudent[] = [
  {
    id: 1,
    name: "Kim Minsu",
    nameKo: "김민수",
    grade: 11,
    joinedAt: "24.03.04",
    classes: ["G10 English", "PreSAT Reading"],
    clinics: ["MON 13~15", "THU 15~17"],
    testCount: 24,
    avgAssigned: 30.2,
    accuracy: "87%",
    assignedLevels: [3, 4],
    assignedWordCount: 30,
    memo: "단어 암기 속도가 매우 빠름. 고급 어휘 위주로 학습 중. 줄바꿈 테스트. 줄바꿈 테스트. 줄바꿈 테스트.",
  },
  {
    id: 2,
    name: "Lee Younghee",
    nameKo: "이영희",
    grade: 9,
    joinedAt: "24.05.11",
    classes: ["SAT"],
    clinics: ["TUE 13~15"],
    testCount: 18,
    avgAssigned: 27.8,
    accuracy: "92%",
    assignedLevels: [1],
    assignedWordCount: 25,
    memo: "재시험 예정. 혼동 어휘 정리가 필요함.",
  },
  {
    id: 3,
    name: "Park Jimin",
    nameKo: "박지민",
    grade: 12,
    joinedAt: "23.09.01",
    classes: ["G10 English"],
    clinics: ["MON 13~15", "WED 18~20"],
    testCount: 31,
    avgAssigned: 35.0,
    accuracy: "78%",
    assignedLevels: [2, 3],
    assignedWordCount: 35,
    memo: "꾸준한 성적 향상 보임. 집중력이 좋음.",
  },
  {
    id: 4,
    name: "Choi Suyeon",
    nameKo: "최수연",
    grade: 10,
    joinedAt: "24.01.15",
    classes: ["G9 English", "Essay"],
    clinics: ["FRI 13~15"],
    testCount: 12,
    avgAssigned: 18.9,
    accuracy: "95%",
    assignedLevels: [1, 2],
    assignedWordCount: 20,
    memo: "학습 진도 빠름. 다음 단계 교재 준비 권장.",
  },
  {
    id: 5,
    name: "Jung Dohyun",
    nameKo: "정도현",
    grade: 11,
    joinedAt: "23.03.20",
    classes: ["SAT", "SL English"],
    clinics: ["TUE 13~15", "SAT 10~12"],
    testCount: 42,
    avgAssigned: 40.2,
    accuracy: "83%",
    assignedLevels: [3, 4],
    assignedWordCount: 40,
  },
  {
    id: 6,
    name: "Kang Jisu",
    nameKo: "강지수",
    grade: 10,
    joinedAt: "25.02.28",
    classes: ["G9 English"],
    clinics: [],
    testCount: 8,
    avgAssigned: 15.0,
    accuracy: "71%",
    assignedLevels: [1],
    assignedWordCount: 15,
    memo: "기초 어휘 보완 중.",
  },
  {
    id: 7,
    name: "Yoon Jaehyuk",
    nameKo: "윤재혁",
    grade: 12,
    joinedAt: "23.11.07",
    classes: ["PreSAT Reading", "SAT"],
    clinics: ["MON 13~15"],
    testCount: 27,
    avgAssigned: 30.0,
    accuracy: "89%",
    assignedLevels: [3, 4],
    assignedWordCount: 30,
    memo: "심화 과정 진행 중.",
  },
];
