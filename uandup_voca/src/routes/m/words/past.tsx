import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

// 과거 배정 목록(폰). /m 레이아웃 하위라 탭바가 유지되고 requireStudentArea 가드도 상속된다.
// 개인 단어장과 달리 PARENT도 볼 수 있다 — 배정 단어는 학부모 열람 대상이다.
export const Route = createFileRoute('/m/words/past')({
  component: lazyRouteComponent(
    () => import('@/pages/mobile/past-assignments/MobilePastAssignmentsPage'),
    'MobilePastAssignmentsPage',
  ),
});
