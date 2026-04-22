import { createFileRoute } from '@tanstack/react-router';
import PendingPage from '@/pages/common/pending/PendingPage';

export const Route = createFileRoute('/pending')({
  component: PendingPage,
});
