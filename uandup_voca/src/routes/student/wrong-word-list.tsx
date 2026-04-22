import { createFileRoute } from '@tanstack/react-router';
import WrongWordListPage from '@/pages/student/wrong-word-list/WrongWordListPage';

export const Route = createFileRoute('/student/wrong-word-list')({
  component: WrongWordListPage,
});
