import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/review-deck/')({
  component: lazyRouteComponent(
    () => import('@/pages/student/wrong-word-bank/WrongWordBankPage'),
    'WrongWordBankPage',
  ),
});
