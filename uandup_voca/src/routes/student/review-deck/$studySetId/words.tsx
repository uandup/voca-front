import { createFileRoute } from '@tanstack/react-router';
import { ReviewDeckStudySetWordsRoute } from '@/pages/student/study-set-words/routeWrappers';

export const Route = createFileRoute('/student/review-deck/$studySetId/words')({
  component: ReviewDeckStudySetWordsRoute,
});
