import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/personal-exams/')({
  component: lazyRouteComponent(
    () => import('@/pages/student/personal-exam-history/PersonalExamHistoryPage'),
    'PersonalExamHistoryPage',
  ),
});
