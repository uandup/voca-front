import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ConfirmDialog } from '@/shared/ui/Modal';
import {
  WordBookmarkButton,
  WordBookmarkFilterButton,
  WordMaskButtons,
  useWordBookmarks,
  useWordMask,
} from '@/entities/word';
import { usePersonalWordsBySet, PersonalWordCard } from '@/entities/personal-word';
import type { PersonalWordCardData } from '@/entities/personal-word';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import { useCurrentStudentId } from '@/entities/auth';
import {
  usePersonalWordActions,
  PersonalWordBulkAddModal,
  PersonalWordEditModal,
} from '@/features/personal-word';
import { PersonalWordFlashcard } from './ui/PersonalWordFlashcard';

type ViewMode = 'list' | 'flashcard';

// 세트 하나의 단어 목록 — 암기 화면이다. List/Flashcard 전환, 단어·뜻 가리기, 북마크를 제공한다.
// 데이터 입력은 이 화면이 아니라 모달이 담당한다(추가는 엑셀 붙여넣기 표, 수정은 2필드 폼):
// 암기 화면을 편집 가능한 표로 만들면 암기 도구가 스프레드시트가 된다.
export default function PersonalWordSetDetailPage() {
  const navigate = useNavigate();
  const { personalWordSetId: setIdParam } = useParams({
    from: '/student/personal-words/$personalWordSetId',
  });
  const personalWordSetId = Number(setIdParam);
  const studentId = useCurrentStudentId() ?? 0;

  const { data: words = [], isLoading } = usePersonalWordsBySet(
    personalWordSetId,
    personalWordSetId > 0,
  );
  // 세트 이름은 목록 캐시에서 찾는다 — 세트 단건 조회 API를 따로 두지 않는다.
  const { data: sets = [] } = usePersonalWordSets(studentId, studentId > 0);
  const setName = sets.find((s) => s.id === personalWordSetId)?.name ?? '...';

  const { remove } = usePersonalWordActions({ studentId, personalWordSetId });

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<PersonalWordCardData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonalWordCardData | null>(null);

  // 북마크 스코프는 세트 단위 — studySetId를 쓰는 StudySetWordsPage와 같은 형태.
  // 학생 단위로 두면 세트를 옮겨도 북마크가 섞이고 "북마크 N개" 배지가 전체 기준이 되어 의미가 안 맞는다.
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(
    `personalwordset_${personalWordSetId}`,
  );
  const { hideWord, hideMeaning, toggleHideWord, toggleHideMeaning } = useWordMask();

  const visibleWords = showBookmarkedOnly ? words.filter((w) => bookmarkedIds.has(w.id)) : words;

  function goSelfTest() {
    navigate({
      to: '/student/personal-self-test/$personalWordSetId',
      params: { personalWordSetId: String(personalWordSetId) },
      search: { returnTo: window.location.pathname + window.location.search },
    });
  }

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <BreadcrumbPageTitle
          parents={[
            { label: 'Personal Words', onClick: () => navigate({ to: '/student/personal-words' }) },
          ]}
          title={setName}
        />

        <div className="flex items-center gap-3">
          {words.length > 0 && (
            <>
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

              {/* 자체 시험 — 보기 설정과 달리 다른 화면으로 가는 액션이라 강조 색으로 끝에 둔다
                  (StudySetWordsPage의 Self Test 버튼과 같은 배치). */}
              <button
                onClick={goSelfTest}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary/20 bg-primary/10 text-primary text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  quiz
                </span>
                Self Test
              </button>
            </>
          )}

          <button
            onClick={() => setShowBulkAdd(true)}
            className="bg-primary text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="font-bold">Add Words</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : visibleWords.length === 0 ? (
        <EmptyState
          icon="auto_stories"
          title={words.length === 0 ? 'No words in this set yet.' : 'No bookmarked words.'}
          description={
            words.length === 0
              ? 'Paste two columns from Excel to add many words at once.'
              : undefined
          }
        />
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
                  <div className="flex items-center gap-2">
                    <WordBookmarkButton
                      bookmarked={bookmarkedIds.has(word.id)}
                      onToggle={() => toggleBookmark(word.id)}
                    />
                    <button
                      onClick={() => setEditTarget(word)}
                      aria-label={`Edit ${word.word}`}
                      className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(word)}
                      aria-label={`Delete ${word.word}`}
                      className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </>
      )}

      {showBulkAdd && (
        <PersonalWordBulkAddModal
          studentId={studentId}
          personalWordSetId={personalWordSetId}
          onClose={() => setShowBulkAdd(false)}
        />
      )}

      {editTarget && (
        <PersonalWordEditModal
          studentId={studentId}
          personalWordSetId={personalWordSetId}
          word={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Word?"
          description={`Remove "${deleteTarget.word}" from this set.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
