import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

// 세트 하나의 단어를 관리하는 선생님 페이지. 세트 목록은 클리닉 상세의 personalWords 탭이 담당하므로
// 세트 목록용 라우트는 따로 두지 않는다.
export const Route = createFileRoute(
  '/teacher/clinics_/students/$studentId_/personal-words/$personalWordSetId',
)({
  component: lazyRouteComponent(
    () => import('@/pages/teacher/personal-word-management/PersonalWordManagementPage'),
  ),
});
