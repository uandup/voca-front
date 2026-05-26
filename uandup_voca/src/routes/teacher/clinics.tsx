import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/clinics')({
  component: lazyRouteComponent(() => import('@/pages/teacher/clinics/ClinicsPage')),
});
