import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/admin')({
  component: lazyRouteComponent(() => import('@/pages/teacher/admin/AdminPage')),
});
