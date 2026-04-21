import { createFileRoute } from '@tanstack/react-router';
import { WordTestPage } from '@/pages/student/word-test/ui/WordTestPage';

export const Route = createFileRoute('/student/word-test')({
  component: WordTestPage,
});
