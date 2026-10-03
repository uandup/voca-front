import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { getTokenPayload } from '@/entities/auth';

// 개인 단어 세트 목록(폰). 세트를 고르면 그 세트의 단어 목록으로 들어간다.
export const Route = createFileRoute('/m/words/personal/')({
  // /m 레이아웃은 PARENT를 통과시킨다("쓰기 동작이 없다"는 전제) — 하지만 개인 단어장은
  // 학생 본인과 선생님만 열람 가능하므로(서버도 403) 이 경로만 따로 막는다.
  beforeLoad: () => {
    if (getTokenPayload()?.role === 'PARENT') {
      throw redirect({ to: '/m/library' });
    }
  },
  component: lazyRouteComponent(
    () => import('@/pages/mobile/personal-word-sets/MobilePersonalWordSetListPage'),
    'MobilePersonalWordSetListPage',
  ),
});
