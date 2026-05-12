import type { ExamType } from '../model/types';

export const testKeys = {
  all: ['tests'] as const,
  examDetail: (examId: number) => [...testKeys.all, 'exam', examId] as const,
  history: (studySetId: number, examType: ExamType) =>
    [...testKeys.all, 'history', studySetId, examType] as const,
};
