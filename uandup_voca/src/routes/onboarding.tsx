import { createFileRoute } from '@tanstack/react-router';
import OnboardingPage from '@/pages/common/onboarding/OnboardingPage';
import { requireAuth } from '@/entities/auth';

export const Route = createFileRoute('/onboarding')({
  beforeLoad: requireAuth,
  component: OnboardingPage,
});
