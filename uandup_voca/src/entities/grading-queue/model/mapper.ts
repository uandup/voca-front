import type { components } from '@/shared/api/schema.gen';
import type { ExamType } from '@/entities/test/@x/grading-queue';
import type { GradingQueueItem } from './types';

type SubmittedExamResponse = components['schemas']['SubmittedExamResponse'];
type ServerExamType = NonNullable<SubmittedExamResponse['type']>;

// 서버 시험 유형 enum → 클라이언트 ExamType.
// 대부분 동일하나 WRONG_BANK/LEVEL만 클라이언트에서 다른 이름을 쓴다
// (REVIEW_DECK / LEVEL_TEST). 채점 화면은 클라이언트 이름 기준으로 분기한다.
const SERVER_TYPE_TO_EXAM_TYPE: Record<ServerExamType, ExamType> = {
  WORD: 'WORD',
  EXAMPLE: 'EXAMPLE',
  REVIEW1: 'REVIEW1',
  REVIEW2: 'REVIEW2',
  REVIEW3: 'REVIEW3',
  WRONG_BANK: 'REVIEW_DECK',
  LEVEL: 'LEVEL_TEST',
};

function toExamType(type: ServerExamType | undefined): ExamType {
  return type ? SERVER_TYPE_TO_EXAM_TYPE[type] : 'WORD';
}

export function toGradingQueueItem(r: SubmittedExamResponse): GradingQueueItem {
  return {
    examId: r.examId ?? 0,
    studySetId: r.studySetId ?? 0,
    studentId: r.studentId ?? 0,
    studentName: r.studentName ?? '',
    examType: toExamType(r.type),
    totalCount: r.totalCount ?? 0,
    // 미측정(null)과 0회를 구분해야 하므로 nullish 병합으로 0을 덮지 않는다.
    violationCount: r.violationCount ?? null,
    attemptStartedAt: r.attemptStartedAt ?? null,
    submittedAt: r.submittedAt ?? '',
  };
}
