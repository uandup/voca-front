import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { requireStudentArea, getTokenPayload } from '@/entities/auth';
import { shouldRedirectToMobile } from '@/shared/lib/viewport';

// 개인 단어 세트로 보는 자체 시험(연습용). StudySet 자체 시험과 같은 화면을 쓰고 단어 출처만 다르다.
// returnTo: Exit 시 history.replace로 돌아갈 세트 상세 페이지 URL.
interface PersonalSelfTestSearch {
  returnTo?: string;
}

export const Route = createFileRoute('/student_/personal-self-test/$personalWordSetId')({
  // /student 레이아웃(사이드바)을 우회해 전체 화면으로 보여주는 라우트라 가드를 명시적으로 적용한다.
  beforeLoad: () => {
    requireStudentArea();
    // /student 레이아웃 밖이라 모바일 리다이렉트를 여기서 다시 건다.
    if (shouldRedirectToMobile()) {
      throw redirect({ to: '/m/unsupported' });
    }
    // 개인 단어장은 학생 본인과 선생님만 접근 가능하다(서버도 학부모를 403으로 막는다).
    if (getTokenPayload()?.role === 'PARENT') {
      throw redirect({ to: '/student/dashboard' });
    }
  },
  component: lazyRouteComponent(
    () => import('@/pages/student/self-test/routeWrappers'),
    'PersonalSetSelfTestRoute',
  ),
  validateSearch: (search: Record<string, unknown>): PersonalSelfTestSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
  }),
});
