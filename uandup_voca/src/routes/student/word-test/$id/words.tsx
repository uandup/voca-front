import { createFileRoute } from '@tanstack/react-router';
import { WordTestStudySetWordsRoute } from '@/pages/student/study-set-words/routeWrappers';

export const Route = createFileRoute('/student/word-test/$id/words')({
  component: WordTestStudySetWordsRoute,
});
