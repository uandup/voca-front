import type { components } from '@/shared/api/schema.gen';
import type { WordDifficultyLevel } from '@/entities/word/@x/level-test';
import type { LevelTestExamRow, LevelTestExamStatus } from './types';

type LevelExamListResponse = components['schemas']['LevelExamListResponse'];

const VALID_STATUSES = new Set<LevelTestExamStatus>([
  'READY',
  'IN_PROGRESS',
  'SUBMITTED',
  'PASSED',
  'FAILED',
]);

function toLevelTestExamStatus(value: string | undefined): LevelTestExamStatus {
  if (value && VALID_STATUSES.has(value as LevelTestExamStatus)) {
    return value as LevelTestExamStatus;
  }
  return 'READY';
}

export function toLevelTestExamRow(r: LevelExamListResponse): LevelTestExamRow {
  return {
    examId: r.examId ?? 0,
    studySetId: r.studySetId ?? 0,
    createdAt: r.createdAt ?? '',
    level: (r.level ?? 1) as WordDifficultyLevel,
    wordCount: r.wordCount ?? 0,
    questionCount: r.questionCount ?? 0,
    status: toLevelTestExamStatus(r.status),
    correctCount: r.correctCount ?? null,
    totalCount: r.questionCount ?? null,
  };
}
