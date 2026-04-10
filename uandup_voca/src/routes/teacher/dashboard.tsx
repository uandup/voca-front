import { createFileRoute } from '@tanstack/react-router';
import DashBoard from '@/pages/teacher/dashboard/DashBoard';

export const Route = createFileRoute('/teacher/dashboard')({
  component: DashBoard,
});
