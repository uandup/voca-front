import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/dashboard')({
  component: lazyRouteComponent(() => import('@/pages/student/dashboard/DashboardPage')),
});
