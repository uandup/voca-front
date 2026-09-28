import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { requireStudentArea, getTokenPayload } from '@/entities/auth';
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

// 학생 응시·결과 통합 페이지. examType은 invalidation 분기 + sentence/vocab variant 결정에 사용.
// returnTo: Exit 시 history.replace로 돌아갈 학생 리스트 페이지 URL.
// allExamIds: comma-separated examId 목록. 복수 시도가 있을 때 상단 탭 전환 UI를 활성화한다.
interface ExamTakeSearch {
  returnTo?: string;
  examType?: ExamType;
  allExamIds?: string;
}

export const Route = createFileRoute('/student_/exams/$examId/take')({
  // /student 레이아웃을 우회하는 라우트라 가드를 명시적으로 적용한다.
  // PARENT는 응시 불가 — 같은 시험의 결과 확인 페이지(/review)로 리다이렉트한다.
  beforeLoad: ({ params, search }) => {
    requireStudentArea();
    // 이 라우트는 /student 레이아웃 밖이라 거기 걸린 모바일 리다이렉트가 적용되지 않는다.
    // 폰에서는 시험 자체를 막는다 — 모바일 Safari는 전체화면 진입이 불가능해 감시 가림막이
    // 뜨면 학생이 시험에 갇힌다(useExamProctor.ts 주석의 PR #31 revert 사고).
    if (shouldRedirectToMobile()) {
      throw redirect({ to: '/m/unsupported' });
    }
    if (getTokenPayload()?.role === 'PARENT') {
      throw redirect({
        to: '/student/exams/$examId/review',
        params: { examId: params.examId },
        search: { returnTo: search.returnTo, examType: search.examType },
      });
    }
  },
  component: lazyRouteComponent(() => import('@/pages/student/exam-take/ExamTakePage')),
  validateSearch: (search: Record<string, unknown>): ExamTakeSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
    allExamIds: typeof search.allExamIds === 'string' ? search.allExamIds : undefined,
  }),
});
