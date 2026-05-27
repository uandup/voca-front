import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/dashboard_/pending-reviews')({
  component: lazyRouteComponent(
    () => import('@/pages/student/pending-reviews/PendingReviewsPage'),
  ),
});
