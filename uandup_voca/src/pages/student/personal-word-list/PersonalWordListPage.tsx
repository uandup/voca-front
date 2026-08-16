import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import {
  WordBookmarkButton,
  WordBookmarkFilterButton,
  WordMaskButtons,
  useWordBookmarks,
  useWordMask,
} from '@/entities/word';
import { usePersonalWords, PersonalWordCard } from '@/entities/personal-word';
import { useCurrentStudentId } from '@/entities/auth';
import { PersonalWordFlashcard } from './ui/PersonalWordFlashcard';

type ViewMode = 'list' | 'flashcard';

// 학생의 개인단어장 단어 목록 — WrongWordListPage(review-deck)와 동일한 구조.
// PersonalWord는 study-set에 속하지 않는 학생 단위 플랫 리스트라 StudySetWordsPage 대신
// 이 패턴(단일 studentId 기반 조회)을 따른다.
export default function PersonalWordListPage() {
  const router = useRouter();
  const studentId = useCurrentStudentId() ?? 0;
  const { data: words = [], isLoading } = usePersonalWords(studentId, studentId > 0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(`personalwords_${studentId}`);
  const { hideWord, hideMeaning, toggleHideWord, toggleHideMeaning } = useWordMask();

  const visibleWords = showBookmarkedOnly ? words.filter((w) => bookmarkedIds.has(w.id)) : words;

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <BreadcrumbPageTitle
          parents={[{ label: 'Personal Words', onClick: () => router.history.back() }]}
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
        <PersonalWordFlashcard
          words={visibleWords}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      ) : (
        <>
          {/* 단어/뜻 가리기 — List 모드 전용. Flashcard는 자체 가리기(뒤집기)가 있어 중복이다 */}
          <WordMaskButtons
            hideWord={hideWord}
            hideMeaning={hideMeaning}
            onToggleWord={toggleHideWord}
            onToggleMeaning={toggleHideMeaning}
          />
          <div className="space-y-5">
            {visibleWords.map((word) => (
              <PersonalWordCard
                key={word.id}
                {...word}
                hideWord={hideWord}
                hideMeaning={hideMeaning}
                extraInfo={
                  <WordBookmarkButton
                    bookmarked={bookmarkedIds.has(word.id)}
                    onToggle={() => toggleBookmark(word.id)}
                  />
                }
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
