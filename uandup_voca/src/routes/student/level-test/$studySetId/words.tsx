import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/level-test/$studySetId/words')({
  component: lazyRouteComponent(
    () => import('@/pages/student/study-set-words/routeWrappers'),
    'LevelTestStudySetWordsRoute',
  ),
});
