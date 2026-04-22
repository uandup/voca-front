import { createFileRoute } from '@tanstack/react-router';
import { TestAssignmentDetailPage } from '@/pages/teacher/test-assignment/ui/TestAssignmentDetailPage';

export const Route = createFileRoute('/teacher/test-assignment_/$studentId')({
  component: TestAssignmentDetailPage,
});
