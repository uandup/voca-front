import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/level-test/')({
  component: lazyRouteComponent(
    () => import('@/pages/student/level-test/LevelTestPage'),
    'LevelTestPage',
  ),
});
