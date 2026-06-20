import { useState } from 'react';

const PREFIX = 'word_bookmarks_';

function readFromStorage(scopeKey: string): Set<number> {
  const raw = localStorage.getItem(PREFIX + scopeKey);
  return new Set(raw ? (JSON.parse(raw) as number[]) : []);
}

/**
 * scopeKey 단위로 단어 북마크를 localStorage에 저장·조회하는 hook.
 *
 * 호출부가 스코프를 결정한다:
 *   - StudySetWordsPage  → `studyset_${studySetId}`
 *   - PendingReviewsPage → `pending_${studentId}`
 *   - WrongWordListPage  → `wrongwords_${studentId}`
 */
export function useWordBookmarks(scopeKey: string) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => readFromStorage(scopeKey));

  function toggleBookmark(wordId: number) {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      localStorage.setItem(PREFIX + scopeKey, JSON.stringify([...next]));
      return next;
    });
  }

  return { bookmarkedIds, toggleBookmark };
}
