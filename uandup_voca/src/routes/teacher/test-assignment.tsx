import { createFileRoute } from '@tanstack/react-router';
import { TestAssignmentPage } from '@/pages/teacher/test-assignment/ui/TestAssignmentPage';

export const Route = createFileRoute('/teacher/test-assignment')({
  component: TestAssignmentPage,
});
