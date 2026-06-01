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

// 학생 응시·결과 통합 페이지. examType은 invalidation 분기 + sentence/vocab variant 결정에 사용.
// returnTo: Exit 시 history.replace로 돌아갈 학생 리스트 페이지 URL.
interface ExamTakeSearch {
  returnTo?: string;
  examType?: ExamType;
}

export const Route = createFileRoute('/student_/exams/$examId/take')({
  // /student 레이아웃을 우회하는 라우트라 가드를 명시적으로 적용한다.
  beforeLoad: requireStudentArea,
  component: lazyRouteComponent(() => import('@/pages/student/exam-take/ExamTakePage')),
  validateSearch: (search: Record<string, unknown>): ExamTakeSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
  }),
});
