import type { ClinicStudentRow } from '@/entities/member';

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
      memos: [
        { id: 1, date: '2026.04.08', content: '단어 암기 속도가 빠름.' },
        { id: 2, date: '2026.04.01', content: '고급 어휘 위주 학습 권장.' },
      ],
      latestMemoContent: '단어 암기 속도가 빠름.',
    },
  ],
};
