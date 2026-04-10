import type { TestConfig, MemoItem } from "@/pages/teacher/student-manage/mock/studentManageMockData";

export interface ClinicStudent {
  id: string;
  nameLastKo: string;
  nameFirstKo: string;
  nameLastEn: string;
  nameFirstEn: string;
  grade: string;
  assignedLevel: number;
  assignedWordCount: number;
  testQuestionCount: number;
  testConfig: TestConfig;
  memos: MemoItem[];
}

export interface ClinicSession {
  id: string;
  timeSlot: string;
  enrolled: number;
  students: ClinicStudent[];
}

export interface ClinicData {
  sessions: ClinicSession[];
}

export const CLINIC_MOCK: ClinicData = {
  sessions: [
    {
      id: "s1",
      timeSlot: "09:00 - 10:00",
      enrolled: 3,
      students: [
        { id: "s1-1", nameLastKo: "김", nameFirstKo: "민수", nameLastEn: "Kim", nameFirstEn: "Minsu", grade: "G11", assignedLevel: 7, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: "W→EN", includeSynonyms: true }, memos: [{ id: 1, date: "2026.04.08", content: "단어 암기 속도가 빠름." }, { id: 2, date: "2026.04.01", content: "고급 어휘 위주 학습 권장." }] },
        { id: "s1-2", nameLastKo: "이", nameFirstKo: "영희", nameLastEn: "Lee", nameFirstEn: "Younghee", grade: "G9", assignedLevel: 3, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [{ id: 3, date: "2026.04.07", content: "재시험 예정." }] },
        { id: "s1-3", nameLastKo: "박", nameFirstKo: "지민", nameLastEn: "Park", nameFirstEn: "Jimin", grade: "G12", assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "M→W", includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: "s2",
      timeSlot: "10:00 - 11:00",
      enrolled: 4,
      students: [
        { id: "s2-1", nameLastKo: "최", nameFirstKo: "수연", nameLastEn: "Choi", nameFirstEn: "Suyeon", grade: "G10", assignedLevel: 4, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "W→KR", includeSynonyms: true }, memos: [] },
        { id: "s2-2", nameLastKo: "정", nameFirstKo: "도현", nameLastEn: "Jung", nameFirstEn: "Dohyun", grade: "G11", assignedLevel: 8, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: "W→EN", includeSynonyms: true }, memos: [{ id: 4, date: "2026.04.09", content: "집중력 좋음." }] },
        { id: "s2-3", nameLastKo: "강", nameFirstKo: "지수", nameLastEn: "Kang", nameFirstEn: "Jisu", grade: "G10", assignedLevel: 2, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [{ id: 5, date: "2026.04.05", content: "기초 어휘 보완 중." }, { id: 6, date: "2026.03.28", content: "발음 교정 필요." }] },
        { id: "s2-4", nameLastKo: "오", nameFirstKo: "세훈", nameLastEn: "Oh", nameFirstEn: "Sehun", grade: "G9", assignedLevel: 1, assignedWordCount: 20, testQuestionCount: 15, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: "s3",
      timeSlot: "11:00 - 12:00",
      enrolled: 2,
      students: [
        { id: "s3-1", nameLastKo: "한", nameFirstKo: "소희", nameLastEn: "Han", nameFirstEn: "Sohee", grade: "G11", assignedLevel: 6, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: "M→W", includeSynonyms: true }, memos: [] },
        { id: "s3-2", nameLastKo: "송", nameFirstKo: "미래", nameLastEn: "Song", nameFirstEn: "Mirae", grade: "G10", assignedLevel: 4, assignedWordCount: 40, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: "s4",
      timeSlot: "13:00 - 14:00",
      enrolled: 3,
      students: [
        { id: "s4-1", nameLastKo: "임", nameFirstKo: "채원", nameLastEn: "Lim", nameFirstEn: "Chaewon", grade: "G10", assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "W→EN", includeSynonyms: false }, memos: [{ id: 7, date: "2026.04.08", content: "중간고사 대비 집중 학습 필요." }] },
        { id: "s4-2", nameLastKo: "윤", nameFirstKo: "재혁", nameLastEn: "Yoon", nameFirstEn: "Jaehyuk", grade: "G12", assignedLevel: 9, assignedWordCount: 60, testQuestionCount: 35, testConfig: { type: "W→EN", includeSynonyms: true }, memos: [{ id: 8, date: "2026.04.06", content: "심화 과정 진행 중." }] },
        { id: "s4-3", nameLastKo: "박", nameFirstKo: "지민", nameLastEn: "Park", nameFirstEn: "Jimin", grade: "G12", assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "M→W", includeSynonyms: false }, memos: [{ id: 14, date: "2026.04.04", content: "꾸준한 성적 향상." }] },
      ],
    },
    {
      id: "s5",
      timeSlot: "14:00 - 15:00",
      enrolled: 2,
      students: [
        { id: "s5-1", nameLastKo: "김", nameFirstKo: "민수", nameLastEn: "Kim", nameFirstEn: "Minsu", grade: "G11", assignedLevel: 7, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: "W→EN", includeSynonyms: true }, memos: [{ id: 9, date: "2026.04.07", content: "고급 어휘 위주 학습." }] },
        { id: "s5-2", nameLastKo: "최", nameFirstKo: "수연", nameLastEn: "Choi", nameFirstEn: "Suyeon", grade: "G10", assignedLevel: 4, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "W→KR", includeSynonyms: true }, memos: [] },
      ],
    },
    {
      id: "s6",
      timeSlot: "15:00 - 16:00",
      enrolled: 2,
      students: [
        { id: "s6-1", nameLastKo: "강", nameFirstKo: "지수", nameLastEn: "Kang", nameFirstEn: "Jisu", grade: "G10", assignedLevel: 2, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [{ id: 11, date: "2026.04.03", content: "기초 보완 진행 중." }] },
        { id: "s6-2", nameLastKo: "이", nameFirstKo: "영희", nameLastEn: "Lee", nameFirstEn: "Younghee", grade: "G9", assignedLevel: 3, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: "s7",
      timeSlot: "16:00 - 17:00",
      enrolled: 1,
      students: [
        { id: "s7-1", nameLastKo: "정", nameFirstKo: "도현", nameLastEn: "Jung", nameFirstEn: "Dohyun", grade: "G11", assignedLevel: 8, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: "W→EN", includeSynonyms: true }, memos: [] },
      ],
    },
    {
      id: "s8",
      timeSlot: "18:00 - 19:00",
      enrolled: 2,
      students: [
        { id: "s8-1", nameLastKo: "오", nameFirstKo: "세훈", nameLastEn: "Oh", nameFirstEn: "Sehun", grade: "G9", assignedLevel: 1, assignedWordCount: 20, testQuestionCount: 15, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [] },
        { id: "s8-2", nameLastKo: "한", nameFirstKo: "소희", nameLastEn: "Han", nameFirstEn: "Sohee", grade: "G11", assignedLevel: 6, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: "M→W", includeSynonyms: true }, memos: [{ id: 13, date: "2026.04.01", content: "야간 자습 병행." }] },
      ],
    },
    {
      id: "s9",
      timeSlot: "19:00 - 20:00",
      enrolled: 3,
      students: [
        { id: "s9-1", nameLastKo: "임", nameFirstKo: "채원", nameLastEn: "Lim", nameFirstEn: "Chaewon", grade: "G10", assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "W→EN", includeSynonyms: false }, memos: [] },
        { id: "s9-2", nameLastKo: "윤", nameFirstKo: "재혁", nameLastEn: "Yoon", nameFirstEn: "Jaehyuk", grade: "G12", assignedLevel: 9, assignedWordCount: 60, testQuestionCount: 35, testConfig: { type: "W→EN", includeSynonyms: true }, memos: [{ id: 12, date: "2026.04.02", content: "심화 과정." }] },
        { id: "s9-3", nameLastKo: "강", nameFirstKo: "지수", nameLastEn: "Kang", nameFirstEn: "Jisu", grade: "G10", assignedLevel: 2, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: "s10",
      timeSlot: "20:00 - 21:00",
      enrolled: 2,
      students: [
        { id: "s10-1", nameLastKo: "송", nameFirstKo: "미래", nameLastEn: "Song", nameFirstEn: "Mirae", grade: "G10", assignedLevel: 4, assignedWordCount: 40, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [] },
        { id: "s10-2", nameLastKo: "박", nameFirstKo: "지민", nameLastEn: "Park", nameFirstEn: "Jimin", grade: "G12", assignedLevel: 5, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "M→W", includeSynonyms: false }, memos: [] },
      ],
    },
    {
      id: "s11",
      timeSlot: "21:00 - 22:00",
      enrolled: 2,
      students: [
        { id: "s11-1", nameLastKo: "김", nameFirstKo: "민수", nameLastEn: "Kim", nameFirstEn: "Minsu", grade: "G11", assignedLevel: 7, assignedWordCount: 50, testQuestionCount: 30, testConfig: { type: "W→EN", includeSynonyms: true }, memos: [] },
        { id: "s11-2", nameLastKo: "이", nameFirstKo: "영희", nameLastEn: "Lee", nameFirstEn: "Younghee", grade: "G9", assignedLevel: 3, assignedWordCount: 30, testQuestionCount: 20, testConfig: { type: "W→KR", includeSynonyms: false }, memos: [{ id: 15, date: "2026.04.05", content: "야간 수업 집중도 양호." }] },
      ],
    },
    {
      id: "s12",
      timeSlot: "22:00 - 23:00",
      enrolled: 1,
      students: [
        { id: "s12-1", nameLastKo: "최", nameFirstKo: "수연", nameLastEn: "Choi", nameFirstEn: "Suyeon", grade: "G10", assignedLevel: 4, assignedWordCount: 40, testQuestionCount: 25, testConfig: { type: "W→KR", includeSynonyms: true }, memos: [] },
      ],
    },
  ],
};
