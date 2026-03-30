export interface ClinicStudent {
  id: string;
  name: string;
  grade: string;
  assignedLevels: (1 | 2 | 3 | 4)[];
  wordCount: number;
  memo?: string;
}

export interface ClinicSession {
  id: string;
  timeSlot: string; // "10:00 - 12:00"
  enrolled: number;
  capacity: number;
  students: ClinicStudent[];
}

export interface ClinicData {
  sessions: ClinicSession[];
}

export const CLINIC_MOCK: ClinicData = {
  sessions: [
    {
      id: "s1",
      timeSlot: "10:00 - 12:00",
      enrolled: 6,
      capacity: 6,
      students: [
        {
          id: "s1-1",
          name: "김민수",
          grade: "11th",
          assignedLevels: [1, 2, 3, 4],
          wordCount: 40,
          memo: "단어 암기 속도가 매우 빠름. 고급 어휘 위주로 학습 중.",
        },
        {
          id: "s1-2",
          name: "이영희",
          grade: "9th",
          assignedLevels: [1],
          wordCount: 20,
          memo: "재시험 예정. 혼동 어휘 정리가 필요함.",
        },
        {
          id: "s1-3",
          name: "박지민",
          grade: "12th",
          assignedLevels: [2, 3],
          wordCount: 20,
          memo: "꾸준한 성적 향상 보임. 집중력이 좋음.",
        },
        {
          id: "s1-4",
          name: "최수연",
          grade: "10th",
          assignedLevels: [2],
          wordCount: 90,
          memo: "학습 진도 빠름. 다음 단계 교재 준비 권장.",
        },
        {
          id: "s1-5",
          name: "정도현",
          grade: "11th",
          assignedLevels: [4],
          wordCount: 50,
        },
        {
          id: "s1-6",
          name: "강지수",
          grade: "10th",
          assignedLevels: [1, 2],
          wordCount: 40,
          memo: "기초 어휘 보완 중.",
        },
      ],
    },
    {
      id: "s2",
      timeSlot: "13:00 - 15:00",
      enrolled: 5,
      capacity: 6,
      students: [
        {
          id: "s2-1",
          name: "오세훈",
          grade: "9th",
          assignedLevels: [1],
          wordCount: 40,
        },
        {
          id: "s2-2",
          name: "임채원",
          grade: "10th",
          assignedLevels: [2, 3],
          wordCount: 60,
          memo: "중간고사 대비 집중 학습 필요.",
        },
        {
          id: "s2-3",
          name: "한소희",
          grade: "11th",
          assignedLevels: [3],
          wordCount: 80,
        },
        {
          id: "s2-4",
          name: "윤재혁",
          grade: "12th",
          assignedLevels: [4],
          wordCount: 80,
          memo: "심화 과정 진행 중.",
        },
        {
          id: "s2-5",
          name: "송미래",
          grade: "10th",
          assignedLevels: [2],
          wordCount: 70,
        },
      ],
    },
    {
      id: "s3",
      timeSlot: "15:00 - 17:00",
      enrolled: 4,
      capacity: 6,
      students: [
        {
          id: "s3-1",
          name: "김민수",
          grade: "11th",
          assignedLevels: [3, 4],
          wordCount: 40,
          memo: "단어 암기 속도가 매우 빠름. 고급 어휘 위주로 학습 중.",
        },
        {
          id: "s3-2",
          name: "이영희",
          grade: "9th",
          assignedLevels: [1],
          wordCount: 20,
          memo: "재시험 예정. 혼동 어휘 정리가 필요함.",
        },
        {
          id: "s3-3",
          name: "박지민",
          grade: "12th",
          assignedLevels: [2, 3],
          wordCount: 20,
          memo: "꾸준한 성적 향상 보임. 집중력이 좋음.",
        },
        {
          id: "s3-4",
          name: "최수연",
          grade: "10th",
          assignedLevels: [2],
          wordCount: 90,
          memo: "학습 진도 빠름. 다음 단계 교재 준비 권장.",
        },
      ],
    },
    {
      id: "s4",
      timeSlot: "18:00 - 20:00",
      enrolled: 3,
      capacity: 6,
      students: [
        {
          id: "s4-1",
          name: "정도현",
          grade: "11th",
          assignedLevels: [4],
          wordCount: 50,
        },
        {
          id: "s4-2",
          name: "강지수",
          grade: "10th",
          assignedLevels: [1, 2],
          wordCount: 40,
          memo: "기초 어휘 보완 중.",
        },
        {
          id: "s4-3",
          name: "오세훈",
          grade: "9th",
          assignedLevels: [1],
          wordCount: 30,
        },
      ],
    },
    {
      id: "s5",
      timeSlot: "20:00 - 22:00",
      enrolled: 1,
      capacity: 6,
      students: [
        {
          id: "s5-1",
          name: "임채원",
          grade: "10th",
          assignedLevels: [2, 3],
          wordCount: 60,
          memo: "중간고사 대비 집중 학습 필요.",
        },
      ],
    },
  ],
};
