import { createFileRoute } from '@tanstack/react-router';
import VocabListPage from '@/pages/student/vocab-list/VocabListPage';

export const Route = createFileRoute('/student/word-test/$id/vocabulary')({
  component: VocabListPage,
});
