import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

// 개인 단어는 리스트 전용이라 view search param이 없다
// (단어·한글뜻뿐이라 뒤집을 내용이 빈약하다 — routeWrappers의 주석 참고).
export const Route = createFileRoute('/m/words/personal')({
  component: lazyRouteComponent(
    () => import('@/pages/mobile/word-list/routeWrappers'),
    'MobilePersonalWordsRoute',
  ),
});
