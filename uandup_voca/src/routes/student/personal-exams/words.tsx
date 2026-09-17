import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/personal-exams/words')({
  component: lazyRouteComponent(
    () => import('@/pages/student/personal-word-list/PersonalWordListPage'),
  ),
});
