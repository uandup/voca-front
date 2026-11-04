import type { components } from '@/shared/api/schema.gen';
import type { PersonalTestExamRow, PersonalTestExamStatus } from './types';

type PersonalExamListResponse = components['schemas']['PersonalExamListResponse'];

const VALID_STATUSES = new Set<PersonalTestExamStatus>([
  'READY',
  'IN_PROGRESS',
  'SUBMITTED',
  'PASSED',
  'FAILED',
]);

function toPersonalTestExamStatus(value: string | undefined): PersonalTestExamStatus {
  if (value && VALID_STATUSES.has(value as PersonalTestExamStatus)) {
    return value as PersonalTestExamStatus;
  }
  return 'READY';
}

export function toPersonalTestExamRow(r: PersonalExamListResponse): PersonalTestExamRow {
  const status = toPersonalTestExamStatus(r.status);
  const graded = status === 'PASSED' || status === 'FAILED';
  return {
    examId: r.examId ?? 0,
    studySetId: r.studySetId ?? 0,
    createdAt: r.createdAt ?? '',
    personalWordSetId: r.personalWordSetId ?? null,
    personalWordSetName: r.personalWordSetName ?? null,
    personalWordSetDeleted: r.personalWordSetDeleted ?? false,
    rangeStart: r.rangeStart ?? null,
    rangeEnd: r.rangeEnd ?? null,
    wordCount: r.wordCount ?? 0,
    questionCount: r.questionCount ?? 0,
    status,
    correctCount: graded ? (r.correctCount ?? null) : null,
    totalCount: graded ? (r.questionCount ?? null) : null,
    attempted: r.attemptStartedAt != null,
  };
}
