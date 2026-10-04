import { createFileRoute, redirect } from '@tanstack/react-router';
import LandingPage from '@/pages/common/landing/LandingPage';
import { shouldRedirectToMobile } from '@/shared/lib/viewport';

export const Route = createFileRoute('/')({
  // 폰에서는 마케팅 랜딩 대신 간결한 로그인 화면으로 보낸다.
  // 컴포넌트 안에서 갈라지 않고 여기서 리다이렉트하는 이유: 그래야 랜딩의 7개 섹션이
  // 모바일 번들에 들어가지 않는다(lazy 경계 유지).
  // 데스크탑은 분기에 걸리지 않고 아래 LandingPage로 그대로 떨어진다.
  beforeLoad: () => {
    // URL은 /m/login이지만 라우트 파일이 m_.login.tsx라 /m 레이아웃·가드는 타지 않는다.
    if (shouldRedirectToMobile()) {
      throw redirect({ to: '/m/login' });
    }
  },
  component: LandingPage,
});
