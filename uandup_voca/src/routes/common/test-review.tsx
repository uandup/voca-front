import { createFileRoute } from '@tanstack/react-router';
import TestReviewPage from '@/pages/common/test-review/TestReviewPage';

export const Route = createFileRoute('/common/test-review')({
  component: TestReviewPage,
});
