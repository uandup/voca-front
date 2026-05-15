import { createFileRoute } from '@tanstack/react-router';
import { LevelTestStudySetWordsRoute } from '@/pages/student/study-set-words/routeWrappers';

export const Route = createFileRoute('/student/level-test/$studySetId/words')({
  component: LevelTestStudySetWordsRoute,
});
