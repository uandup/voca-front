import type { ClinicStudentRow } from '@/entities/member/@x/clinic';

export const MOCK_SESSION_STUDENTS: Record<string, ClinicStudentRow[]> = {
  s1: [
    {
      id: 1,
      nameKo: '김민수',
      nameLastEn: 'Kim',
      nameFirstEn: 'Minsu',
      grade: 11,
      assignedLevel: 7,
      assignedWordCount: 50,
      testQuestionCount: 30,
      testConfig: { type: 'word-to-meaning', includeSynonyms: true },
      latestMemoContent: '단어 암기 속도가 빠름.',
    },
  ],
};
