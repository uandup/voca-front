import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/students_/$studentId_/pending-reviews')({
  component: lazyRouteComponent(
    () => import('@/pages/student/pending-reviews/routeWrappers'),
    'TeacherPendingReviewsRoute',
  ),
});
