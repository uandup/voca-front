import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { getTokenPayload } from '@/entities/auth';

export const Route = createFileRoute('/student/personal-words/$personalWordSetId')({
  // 목록과 같은 이유로 학부모를 차단한다(서버도 403).
  beforeLoad: () => {
    if (getTokenPayload()?.role === 'PARENT') {
      throw redirect({ to: '/student/dashboard' });
    }
  },
  component: lazyRouteComponent(
    () => import('@/pages/student/personal-word-set-detail/PersonalWordSetDetailPage'),
  ),
});
