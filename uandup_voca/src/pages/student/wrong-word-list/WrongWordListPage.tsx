import { useState } from 'react';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useRouter } from '@tanstack/react-router';
import {
  WordCard,
  WordBookmarkButton,
  WordBookmarkFilterButton,
  useWordBookmarks,
} from '@/entities/word';
import { useReviewDeckWords } from '@/entities/review-deck';
import { useCurrentStudentId } from '@/entities/auth';
import { WordFlashcard } from '@/widgets/word-flashcard';

type ViewMode = 'list' | 'flashcard';

export default function WrongWordListPage() {
  const router = useRouter();
  const studentId = useCurrentStudentId() ?? 0;
  const { data: words = [], isLoading } = useReviewDeckWords(studentId, studentId > 0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(`wrongwords_${studentId}`);

  const visibleWords = showBookmarkedOnly ? words.filter((w) => bookmarkedIds.has(w.id)) : words;

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <BreadcrumbPageTitle
          parents={[{ label: 'Review Deck', onClick: () => router.history.back() }]}
          title="Word List"
        />

        {words.length > 0 && (
          <div className="flex items-center gap-3">
            {/* 북마크 필터 토글 */}
            <WordBookmarkFilterButton
              active={showBookmarkedOnly}
              count={bookmarkedIds.size}
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
      ) : visibleWords.length === 0 ? (
        <EmptyState title="No words yet." />
      ) : viewMode === 'flashcard' ? (
        <WordFlashcard words={visibleWords} />
      ) : (
        <div className="space-y-5">
          {visibleWords.map((word) => (
            <WordCard
              key={word.id}
              {...word}
              showSentence
              extraInfo={
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center justify-center px-2 py-2 bg-error/5 border border-error/20 rounded-lg">
                    <span className="text-[8px] uppercase tracking-widest font-bold text-error/60">
                      Wrong
                    </span>
                    <span className="text-base font-bold text-error">{word.wrongCount}</span>
                  </div>
                  <WordBookmarkButton
                    bookmarked={bookmarkedIds.has(word.id)}
                    onToggle={() => toggleBookmark(word.id)}
                  />
                </div>
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
