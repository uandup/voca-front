import { createFileRoute } from '@tanstack/react-router';
import VocabularyBankPage from '@/pages/teacher/vocabulary-bank/VocabularyBankPage';

export const Route = createFileRoute('/teacher/vocabulary-bank')({
  component: VocabularyBankPage,
});
