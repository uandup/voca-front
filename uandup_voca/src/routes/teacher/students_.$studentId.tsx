import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/teacher/students_/$studentId')({
  // 파일명의 students_ suffix는 /teacher/students 목록 페이지와 레이아웃을 분리하기 위한 것이며,
  // 최종 URL은 /teacher/students/$studentId 가 된다.
  component: lazyRouteComponent(
    () => import('@/pages/teacher/student-dashboard/StudentDashboardPage'),
  ),
});
