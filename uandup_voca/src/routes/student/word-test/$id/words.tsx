import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/word-test/$id/words')({
  component: lazyRouteComponent(
    () => import('@/pages/student/study-set-words/routeWrappers'),
    'WordTestStudySetWordsRoute',
  ),
});
