import { createFileRoute } from '@tanstack/react-router';
import WrongWordListPage from '@/pages/student/wrong-word-list/WrongWordListPage';

export const Route = createFileRoute('/student/review-deck/words')({
  component: WrongWordListPage,
});
