import { createFileRoute } from '@tanstack/react-router';
import OnboardingPage from '@/pages/common/onboarding/OnboardingPage';
import { requireAuth } from '@/entities/auth';

// 인증 흐름 페이지 — lazy하지 않고 초기 번들에 포함시킨다.
// PROFILE_INCOMPLETE 회원이 로그인 직후 거치는 경로라 청크 대기가 UX에 노출된다.
export const Route = createFileRoute('/onboarding')({
  beforeLoad: requireAuth,
  component: OnboardingPage,
});
