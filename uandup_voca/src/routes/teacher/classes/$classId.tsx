import { createFileRoute } from '@tanstack/react-router';
import ClassDetailPage from '@/pages/teacher/class-detail/ClassDetailPage';

export const Route = createFileRoute('/teacher/classes/$classId')({
  component: ClassDetailPage,
});
