import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

// List ⇄ Flashcard를 별도 라우트가 아니라 search param으로 둔다.
// 같은 데이터·같은 화면이라 재조회가 없고, history에 쌓이므로 안드로이드 뒤로가기로
// 카드 → 목록 복귀가 된다. __root.tsx의 스크롤 리셋은 pathname 변경에만 반응하므로
// 보기 전환 시 목록 스크롤 위치도 보존된다.
interface MobileWordsSearch {
  view: 'list' | 'cards';
}

export const Route = createFileRoute('/m/words/assigned/$studySetId')({
  component: lazyRouteComponent(
    () => import('@/pages/mobile/word-list/routeWrappers'),
    'MobileAssignedWordsRoute',
  ),
  validateSearch: (search: Record<string, unknown>): MobileWordsSearch => ({
    view: search.view === 'cards' ? 'cards' : 'list',
  }),
});
