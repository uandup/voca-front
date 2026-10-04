import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { getTokenPayload } from '@/entities/auth';

/**
 * 폰 전용 로그인 화면.
 *
 * 라우트를 `m_`(trailing underscore)로 둬서 `/m` 레이아웃 밖에 두는 것이 핵심이다.
 * `/m` 하위에 두면 `/m`의 beforeLoad(requireStudentArea)가 미로그인 사용자를 `/`로 보내고,
 * `/`는 모바일이면 다시 이 화면으로 보내서 무한 리다이렉트가 된다.
 * 레이아웃 밖이라 하단 탭바도 뜨지 않는다.
 */
export const Route = createFileRoute('/m_/login')({
  beforeLoad: () => {
    // 이미 로그인한 사용자가 로그인 화면에 머물지 않게 한다.
    if (getTokenPayload()) {
      throw redirect({ to: '/m' });
    }
  },
  component: lazyRouteComponent(
    () => import('@/pages/mobile/login/MobileLoginPage'),
    'MobileLoginPage',
  ),
});
