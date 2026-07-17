import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

// /teacher 레이아웃 하위라 requireTeacher 가드를 상속한다(teacher.tsx beforeLoad).
export const Route = createFileRoute('/teacher/grading')({
  component: lazyRouteComponent(() => import('@/pages/teacher/grading-queue/GradingQueuePage')),
});
