import { useState } from 'react';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useRouter } from '@tanstack/react-router';
import {
  WordCard,
  WordBookmarkButton,
  WordBookmarkFilterButton,
  WordMaskButtons,
  useWordBookmarks,
  useWordMask,
  toWordKey,
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
  // 오답 뱅크엔 공용 단어와 개인 단어장 시험 오답이 섞인다 — 북마크·key는 출처 포함 키(toWordKey)로.
  // 예전(숫자) 북마크는 전부 공용 단어 오답이었으므로 기본 legacySource('WORD')로 변환된다.
  const { bookmarkedKeys, toggleBookmark } = useWordBookmarks(`wrongwords_${studentId}`);
  const { hideWord, hideMeaning, toggleHideWord, toggleHideMeaning } = useWordMask();

  // 배지 숫자와 필터 결과를 같은 목록에서 낸다. 저장된 북마크 전체(bookmarkedKeys.size)로 세면
  // 오답 시험에서 맞혀 리뷰덱에서 빠진 단어까지 세어 "북마크 6개인데 단어 없음"이 된다.
  const bookmarkedWords = words.filter((w) => bookmarkedKeys.has(toWordKey(w)));
  const visibleWords = showBookmarkedOnly ? bookmarkedWords : words;

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
              count={bookmarkedWords.length}
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
        <WordFlashcard
            words={visibleWords}
            bookmarkedKeys={bookmarkedKeys}
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
              <WordCard
                key={toWordKey(word)}
                {...word}
                showSentence
                hideWord={hideWord}
                hideMeaning={hideMeaning}
                extraInfo={
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center justify-center px-2 py-2 bg-error/5 border border-error/20 rounded-lg">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-error/60">
                        Wrong
                      </span>
                      <span className="text-base font-bold text-error">{word.wrongCount}</span>
                    </div>
                    <WordBookmarkButton
                      bookmarked={bookmarkedKeys.has(toWordKey(word))}
                      onToggle={() => toggleBookmark(toWordKey(word))}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
