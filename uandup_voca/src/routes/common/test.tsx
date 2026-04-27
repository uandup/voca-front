import { createFileRoute } from '@tanstack/react-router';
import TestPage from '@/pages/common/test/TestPage';

export const Route = createFileRoute('/common/test')({
  component: TestPage,
});
