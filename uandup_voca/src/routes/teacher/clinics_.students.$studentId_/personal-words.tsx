import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/clinics_/students/$studentId_/personal-words')({
  component: lazyRouteComponent(
    () => import('@/pages/teacher/personal-word-management/PersonalWordManagementPage'),
  ),
});
