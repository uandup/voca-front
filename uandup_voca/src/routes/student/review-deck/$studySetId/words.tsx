import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/review-deck/$studySetId/words')({
  component: lazyRouteComponent(
    () => import('@/pages/student/study-set-words/routeWrappers'),
    'ReviewDeckStudySetWordsRoute',
  ),
});
