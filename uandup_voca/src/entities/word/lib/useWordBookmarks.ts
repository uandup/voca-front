import { useState } from 'react';
import type { WordSource } from '../model/types';
import { toWordKey } from './wordKey';

const PREFIX = 'word_bookmarks_';

// 저장값은 출처 포함 단어 키(`WORD-5` / `PERSONAL-5`, toWordKey) 배열이다.
// 출처 구분 도입 전에는 단어 id 숫자 배열로 저장했으므로, 숫자 항목은 그 스코프의 원래 출처(legacySource)로
// 보고 키로 바꾼 뒤 한 번 다시 저장한다 — 기존 북마크를 잃지 않는다.
function readFromStorage(scopeKey: string, legacySource: WordSource): Set<string> {
  const raw = localStorage.getItem(PREFIX + scopeKey);
  if (!raw) return new Set();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Set();
  }
  if (!Array.isArray(parsed)) return new Set();

  let migrated = false;
  const keys = parsed.flatMap((entry): string[] => {
    if (typeof entry === 'number') {
      migrated = true;
      return [toWordKey({ id: entry, wordSource: legacySource })];
    }
    return typeof entry === 'string' ? [entry] : [];
  });
  const result = new Set(keys);
  if (migrated) {
    localStorage.setItem(PREFIX + scopeKey, JSON.stringify([...result]));
  }
  return result;
}

/**
 * scopeKey 단위로 단어 북마크를 localStorage에 저장·조회하는 hook.
 *
 * 호출부가 스코프를 결정한다:
 *   - StudySetWordsPage  → `studyset_${studySetId}`
 *   - PendingReviewsPage → `pending_${studentId}`
 *   - WrongWordListPage  → `wrongwords_${studentId}`
 *
 * 북마크는 단어 id가 아니라 출처 포함 키(toWordKey)로 저장한다 — 오답 뱅크처럼 공용 단어와 개인 단어가
 * 섞이는 목록에서 같은 id의 두 단어가 함께 북마크되지 않도록.
 * legacySource: 이 스코프의 예전(숫자) 북마크가 가리키던 출처. 개인 단어장 스코프만 'PERSONAL', 나머지는 기본 'WORD'.
 */
export function useWordBookmarks(scopeKey: string, legacySource: WordSource = 'WORD') {
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string>>(() =>
    readFromStorage(scopeKey, legacySource),
  );

  function toggleBookmark(wordKey: string) {
    setBookmarkedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(wordKey)) next.delete(wordKey);
      else next.add(wordKey);
      localStorage.setItem(PREFIX + scopeKey, JSON.stringify([...next]));
      return next;
    });
  }

  return { bookmarkedKeys, toggleBookmark };
}
