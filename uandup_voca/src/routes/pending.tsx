import { createFileRoute } from '@tanstack/react-router';
import PendingPage from '@/pages/common/pending/PendingPage';
import { requireAuth } from '@/entities/auth';

export const Route = createFileRoute('/pending')({
  beforeLoad: requireAuth,
  component: PendingPage,
});
