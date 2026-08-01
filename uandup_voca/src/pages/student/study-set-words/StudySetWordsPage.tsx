import { useState } from 'react';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import {
  WordCard,
  WordBookmarkButton,
  WordBookmarkFilterButton,
  WordShuffleButton,
  WordMaskButtons,
  useWordBookmarks,
  useWordShuffle,
  useWordMask,
} from '@/entities/word';
import { useAssignedWords } from '@/entities/student';
import { WordFlashcard } from '@/widgets/word-flashcard';

type ViewMode = 'list' | 'flashcard';

interface Props {
  studySetId: number;
  // BreadcrumbPageTitle의 parents 배열. 여러 단계(e.g. Student Management > 이름) 지원.
  parents: { label: string; onClick?: () => void }[];
  // breadcrumb의 현재 페이지 제목. 미전달 시 "Words".
  title?: string;
  // 셔플 버튼 노출 여부. 학생 화면은 기본 true, 선생님 조회 뷰에서만 false로 숨긴다.
  showShuffle?: boolean;
}

// 한 study-set에 배정된 단어 목록을 학생에게 보여주는 공통 페이지.
// word-test cycle / review-deck exam / level-test exam 세 곳에서 모두 동일한 흐름이라 재사용.
export function StudySetWordsPage({
  studySetId,
  parents,
  title = 'Words',
  showShuffle = true,
}: Props) {
  // 학생 화면이므로 예문 노출은 서버의 exampleVisible을 따른다
  // (NORMAL 배정은 예문시험 채점 완료 후에만 true).
  const { data, isLoading } = useAssignedWords(studySetId, studySetId > 0);
  const words = data?.words ?? [];
  const exampleVisible = data?.exampleVisible ?? false;

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(`studyset_${studySetId}`);
  const { orderedWords, shuffle, shuffleCount } = useWordShuffle(words);
  const { hideWord, hideMeaning, toggleHideWord, toggleHideMeaning } = useWordMask();

  // 셔플 순서를 먼저 적용하고 그 위에 북마크 필터를 얹는다
  // (필터 토글이 재섞기를 유발하지 않도록 순서가 중요).
  const visibleWords = showBookmarkedOnly
    ? orderedWords.filter((w) => bookmarkedIds.has(w.id))
    : orderedWords;

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <BreadcrumbPageTitle parents={parents} title={title} />

        {words.length > 0 && (
          <div className="flex items-center gap-3">
            {/* 북마크 필터 토글 */}
            <WordBookmarkFilterButton
              active={showBookmarkedOnly}
              count={bookmarkedIds.size}
              onToggle={() => setShowBookmarkedOnly((v) => !v)}
            />

            {/* 셔플 — 학생 화면만 노출. 누를 때마다 새 순서로 섞는다 */}
            {showShuffle && <WordShuffleButton onShuffle={shuffle} />}

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
            key={shuffleCount}
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
              <WordCard
                key={word.id}
                {...word}
                showSentence={exampleVisible}
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
