import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { getTokenPayload } from '@/entities/auth';

// 세트 하나의 단어 목록(폰).
// List ⇄ Flashcard를 별도 라우트가 아니라 search param으로 둔다 — 배정 단어 라우트와 같은 방식.
interface MobileWordsSearch {
  view: 'list' | 'cards';
}

export const Route = createFileRoute('/m/words/personal/$personalWordSetId')({
  // 목록과 같은 이유로 학부모를 차단한다.
  beforeLoad: () => {
    if (getTokenPayload()?.role === 'PARENT') {
      throw redirect({ to: '/m/library' });
    }
  },
  component: lazyRouteComponent(
    () => import('@/pages/mobile/word-list/routeWrappers'),
    'MobilePersonalWordSetWordsRoute',
  ),
  validateSearch: (search: Record<string, unknown>): MobileWordsSearch => ({
    view: search.view === 'cards' ? 'cards' : 'list',
  }),
});
