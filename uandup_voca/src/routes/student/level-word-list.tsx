import { createFileRoute } from '@tanstack/react-router';
import LevelWordListPage from '@/pages/student/level-word-list/LevelWordListPage';

export const Route = createFileRoute('/student/level-word-list')({
  component: LevelWordListPage,
});
