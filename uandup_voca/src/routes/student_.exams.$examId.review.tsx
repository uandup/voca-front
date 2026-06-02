import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';
import { requireStudentArea } from '@/entities/auth';
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

// 학생 시험 결과 확인 페이지.
// returnTo: Exit 시 history.replace로 돌아갈 학생 리스트 페이지 URL.
// allExamIds: comma-separated examId 목록. 복수 시도가 있을 때 상단 탭 전환 UI를 활성화한다.
interface ExamReviewSearch {
  returnTo?: string;
  examType?: ExamType;
  allExamIds?: string;
}

export const Route = createFileRoute('/student_/exams/$examId/review')({
  beforeLoad: requireStudentArea,
  component: lazyRouteComponent(() => import('@/pages/student/exam-review/ExamReviewPage')),
  validateSearch: (search: Record<string, unknown>): ExamReviewSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
    allExamIds: typeof search.allExamIds === 'string' ? search.allExamIds : undefined,
  }),
});
