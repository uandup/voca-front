import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/vocabulary-bank')({
  component: lazyRouteComponent(
    () => import('@/pages/teacher/vocabulary-bank/VocabularyBankPage'),
  ),
});
