import { useState } from 'react';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import {
  WordCard,
  WordBookmarkButton,
  WordBookmarkFilterButton,
  useWordBookmarks,
} from '@/entities/word';
import { usePendingReviews } from '@/entities/student';
import { WordFlashcard } from '@/widgets/word-flashcard';

type ViewMode = 'list' | 'flashcard';

// 'YYYY-MM-DD' → 'MMM DD, YYYY' (예: May 28, 2026)
function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface Props {
  studentId: number;
  // BreadcrumbPageTitle의 parents 배열. 여러 단계(e.g. Student Management > 이름) 지원.
  parents: { label: string; onClick?: () => void }[];
}

export function PendingReviewsPage({ studentId, parents }: Props) {
  const { data: reviews, isLoading } = usePendingReviews(studentId);

  // 드롭다운에서 선택된 날짜 — 초기값은 첫 번째 날짜
  const dates = [...new Set((reviews ?? []).map((r) => r.scheduledDate))];
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(`pending_${studentId}`);

  // selectedDate가 없으면(초기) 첫 번째 날짜를 사용
  const activeDate = selectedDate ?? dates[0];
  const activeWords = (reviews ?? [])
    .filter((r) => r.scheduledDate === activeDate)
    .flatMap((r) => r.words);

  const visibleWords = showBookmarkedOnly
    ? activeWords.filter((w) => bookmarkedIds.has(w.id))
    : activeWords;

  // 현재 날짜 단어 중 북마크된 개수 — 날짜가 바뀌면 자동으로 재계산됨
  const bookmarkedActiveCount = activeWords.filter((w) => bookmarkedIds.has(w.id)).length;

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <BreadcrumbPageTitle parents={parents} title="Words to Review" />

        {!isLoading && activeWords.length > 0 && (
          <div className="flex items-center gap-3">
            {/* 북마크 필터 토글 */}
            <WordBookmarkFilterButton
              active={showBookmarkedOnly}
              count={bookmarkedActiveCount}
              onToggle={() => setShowBookmarkedOnly((v) => !v)}
            />

            {/* List / Flashcard 전환 */}
            <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/30">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  list
                </span>
                List
              </button>
              <button
                onClick={() => setViewMode('flashcard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  viewMode === 'flashcard'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  style
                </span>
                Flashcard
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : dates.length === 0 ? (
        <EmptyState title="No words to review." />
      ) : (
        <>
          {/* 날짜 드롭다운 필터 */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Scheduled Date
            </span>
            <div className="relative">
              <select
                className="appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 pr-9 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                value={activeDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setViewMode('list');
                  setShowBookmarkedOnly(false);
                }}
              >
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {formatDate(d)}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
                expand_more
              </span>
            </div>
            <span className="text-sm font-semibold text-on-surface-variant">
              {activeWords.length} word{activeWords.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* 단어 목록 / 플래시카드 */}
          {visibleWords.length === 0 ? (
            <EmptyState title="No words yet." />
          ) : viewMode === 'flashcard' ? (
            <WordFlashcard words={visibleWords} />
          ) : (
            <div className="space-y-5">
              {visibleWords.map((word) => (
                <WordCard
                  key={word.id}
                  {...word}
                  showSentence={true}
                  extraInfo={
                    <WordBookmarkButton
                      bookmarked={bookmarkedIds.has(word.id)}
                      onToggle={() => toggleBookmark(word.id)}
                    />
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
