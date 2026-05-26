import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/students')({
  component: lazyRouteComponent(() => import('@/pages/teacher/student-manage/StudentManagePage')),
});
