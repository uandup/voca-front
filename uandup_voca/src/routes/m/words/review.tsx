import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

// view param의 의도는 /m/words/assigned/$studySetId.tsx 주석 참고.
interface MobileWordsSearch {
  view: 'list' | 'cards';
}

export const Route = createFileRoute('/m/words/review')({
  component: lazyRouteComponent(
    () => import('@/pages/mobile/word-list/routeWrappers'),
    'MobileReviewDeckWordsRoute',
  ),
  validateSearch: (search: Record<string, unknown>): MobileWordsSearch => ({
    view: search.view === 'cards' ? 'cards' : 'list',
  }),
});
