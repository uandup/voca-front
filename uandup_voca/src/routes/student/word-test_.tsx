import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/word-test_')({
  component: lazyRouteComponent(() => import('@/pages/student/word-test/WordTestPage')),
});
