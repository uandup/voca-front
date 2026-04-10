import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '@/pages/common/login/LoginPage';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
