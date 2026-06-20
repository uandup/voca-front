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
import { useAssignedWords } from '@/entities/student';
import { WordFlashcard } from '@/widgets/word-flashcard';

type ViewMode = 'list' | 'flashcard';

interface Props {
  studySetId: number;
  // BreadcrumbPageTitle의 parents 배열. 여러 단계(e.g. Student Management > 이름) 지원.
  parents: { label: string; onClick?: () => void }[];
  // breadcrumb의 현재 페이지 제목. 미전달 시 "Words".
  title?: string;
}

// 한 study-set에 배정된 단어 목록을 학생에게 보여주는 공통 페이지.
// word-test cycle / review-deck exam / level-test exam 세 곳에서 모두 동일한 흐름이라 재사용.
export function StudySetWordsPage({ studySetId, parents, title = 'Words' }: Props) {
  // 학생 화면이므로 예문 노출은 서버의 exampleVisible을 따른다
  // (NORMAL 배정은 예문시험 채점 완료 후에만 true).
  const { data, isLoading } = useAssignedWords(studySetId, studySetId > 0);
  const words = data?.words ?? [];
  const exampleVisible = data?.exampleVisible ?? false;

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(`studyset_${studySetId}`);

  const visibleWords = showBookmarkedOnly ? words.filter((w) => bookmarkedIds.has(w.id)) : words;

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
      ) : words.length === 0 ? (
        <EmptyState title="No words assigned." />
      ) : viewMode === 'flashcard' ? (
        <WordFlashcard words={visibleWords} />
      ) : visibleWords.length === 0 ? (
        <EmptyState title="No bookmarked words yet." />
      ) : (
        <div className="space-y-5">
          {visibleWords.map((word) => (
            <WordCard
              key={word.id}
              {...word}
              showSentence={exampleVisible}
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
    </main>
  );
}
