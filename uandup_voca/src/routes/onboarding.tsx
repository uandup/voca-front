import { createFileRoute } from "@tanstack/react-router";
import OnboardingPage from "@/pages/common/onboarding/OnboardingPage";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});
