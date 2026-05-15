import { createFileRoute } from '@tanstack/react-router';
import ExamTakePage from '@/pages/student/exam-take/ExamTakePage';
import type { ExamType } from '@/entities/test';

const EXAM_TYPES: readonly ExamType[] = [
  'WORD',
  'EXAMPLE',
  'REVIEW1',
  'REVIEW2',
  'REVIEW3',
  'REVIEW_DECK',
  'LEVEL_TEST',
];

function isExamType(v: unknown): v is ExamType {
  return typeof v === 'string' && (EXAM_TYPES as readonly string[]).includes(v);
}

// 학생 응시·결과 통합 페이지. examType은 invalidation 분기 + sentence/vocab variant 결정에 사용.
// returnTo: Exit 시 history.replace로 돌아갈 학생 리스트 페이지 URL.
interface ExamTakeSearch {
  returnTo?: string;
  examType?: ExamType;
}

export const Route = createFileRoute('/student_/exams/$examId/take')({
  component: ExamTakePage,
  validateSearch: (search: Record<string, unknown>): ExamTakeSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
  }),
});
