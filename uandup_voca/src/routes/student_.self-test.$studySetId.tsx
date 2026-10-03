import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { requireStudentArea, getTokenPayload } from '@/entities/auth';
import { shouldRedirectToMobile } from '@/shared/lib/viewport';

// 학생 자체 시험(연습용) 페이지. 서버에 아무것도 저장하지 않는 클라이언트 전용 단어 시험이다.
// returnTo: Exit 시 history.replace로 돌아갈 단어 목록 페이지 URL.
interface SelfTestSearch {
  returnTo?: string;
}

export const Route = createFileRoute('/student_/self-test/$studySetId')({
  // /student 레이아웃(사이드바)을 우회해 실제 시험과 같은 전체 화면으로 보여주는 라우트라
  // 가드를 명시적으로 적용한다. PARENT는 열람 전용이라 연습 응시도 막고 대시보드로 보낸다.
  beforeLoad: () => {
    requireStudentArea();
    // /student 레이아웃 밖이라 모바일 리다이렉트를 여기서 다시 건다.
    // 자체 시험도 시험 UI를 그대로 쓰므로 폰에서는 단어 조회 화면으로 안내한다.
    if (shouldRedirectToMobile()) {
      throw redirect({ to: '/m/unsupported' });
    }
    if (getTokenPayload()?.role === 'PARENT') {
      throw redirect({ to: '/student/dashboard' });
    }
  },
  component: lazyRouteComponent(
    () => import('@/pages/student/self-test/routeWrappers'),
    'StudySetSelfTestRoute',
  ),
  validateSearch: (search: Record<string, unknown>): SelfTestSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
  }),
});
