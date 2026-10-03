import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { getTokenPayload } from '@/entities/auth';

export const Route = createFileRoute('/student/personal-words/')({
  // /student 레이아웃이 STUDENT·PARENT를 모두 통과시키지만, 개인 단어장은 학생 본인과 선생님만
  // 접근 가능하다 — 서버도 학부모를 403으로 막으므로 화면도 같은 기준으로 막는다.
  beforeLoad: () => {
    if (getTokenPayload()?.role === 'PARENT') {
      throw redirect({ to: '/student/dashboard' });
    }
  },
  component: lazyRouteComponent(
    () => import('@/pages/student/personal-word-sets/PersonalWordSetListPage'),
  ),
});
