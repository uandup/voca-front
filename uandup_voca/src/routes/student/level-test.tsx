import { createFileRoute } from '@tanstack/react-router';
import { LevelTestPage } from '@/pages/student/level-test/ui/LevelTestPage';

export const Route = createFileRoute('/student/level-test')({
  component: LevelTestPage,
});
