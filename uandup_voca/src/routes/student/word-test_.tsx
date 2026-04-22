import { createFileRoute } from '@tanstack/react-router';
import WordTestPage from '@/pages/student/word-test/WordTestPage';

export const Route = createFileRoute('/student/word-test_')({
  component: WordTestPage,
});
