import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/review-deck/words')({
  component: lazyRouteComponent(
    () => import('@/pages/student/wrong-word-list/WrongWordListPage'),
  ),
});
