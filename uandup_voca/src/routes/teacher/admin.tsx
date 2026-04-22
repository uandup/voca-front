import { createFileRoute } from '@tanstack/react-router';
import AdminPage from '@/pages/teacher/admin/AdminPage';

export const Route = createFileRoute('/teacher/admin')({
  component: AdminPage,
});
