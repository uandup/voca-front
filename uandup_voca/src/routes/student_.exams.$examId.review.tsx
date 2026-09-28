import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { requireStudentArea } from '@/entities/auth';
import { shouldRedirectToMobile } from '@/shared/lib/viewport';
import type { ExamType } from '@/entities/test';

const EXAM_TYPES: readonly ExamType[] = [
  'WORD',
  'EXAMPLE',
  'REVIEW1',
  'REVIEW2',
  'REVIEW3',
  'REVIEW_DECK',
  'LEVEL_TEST',
  'PERSONAL',
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
  beforeLoad: () => {
    requireStudentArea();
    // /student 레이아웃 밖이라 모바일 리다이렉트를 여기서 다시 건다.
    // 결과 화면은 시험 문항을 그대로 보여주는 데스크탑 전용 레이아웃이라 폰에서는 막는다.
    if (shouldRedirectToMobile()) {
      throw redirect({ to: '/m/unsupported' });
    }
  },
  component: lazyRouteComponent(() => import('@/pages/student/exam-review/ExamReviewPage')),
  validateSearch: (search: Record<string, unknown>): ExamReviewSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
    allExamIds: typeof search.allExamIds === 'string' ? search.allExamIds : undefined,
  }),
});
