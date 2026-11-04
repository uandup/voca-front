import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/student/personal-test/$studySetId/words')({
  component: lazyRouteComponent(
    () => import('@/pages/student/study-set-words/routeWrappers'),
    'PersonalTestStudySetWordsRoute',
  ),
});
