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
import {
  usePendingReviews,
  useActiveStudySetList,
  type PendingReviewItem,
  type StudySetRow,
} from '@/entities/student';
import { WordFlashcard } from '@/widgets/word-flashcard';

type ViewMode = 'list' | 'flashcard';

// 복습 예정일이 사라져(날짜 → 배정 회차 기준 전환) 날짜로 묶을 수 없으므로 배정(StudySet) 단위로 묶는다.
interface ReviewGroup {
  studySetId: number;
  // 이 배정 이후로 몇 번 더 배정되었는지. 0이면 가장 최근 배정.
  // active 목록에서 못 찾으면 null (구조상 일어나지 않지만 방어적으로 둔다).
  setsAgo: number | null;
  // 지금 활성인 복습 단계 1~3. 못 찾으면 null.
  reviewNo: number | null;
  words: PendingReviewItem['words'];
}

// 이 배정의 어느 복습 칸에 해당 시험이 들어 있는지 찾는다 — pending-reviews 응답엔 복습 단계가 없다.
function findReviewNo(set: StudySetRow, examId: number): number | null {
  const stages = [set.review1, set.review2, set.review3];
  const index = stages.findIndex((exams) => exams.some((e) => e.examId === examId));
  return index === -1 ? null : index + 1;
}

// 예: "3 sets ago · Review 2 · 20 words"
// 회차는 새 배정이 들어오면 함께 밀리는 상대값이다 — 그게 곧 "얼마나 밀렸는지"를 뜻한다.
function groupLabel(group: ReviewGroup): string {
  const when =
    group.setsAgo === null
      ? 'Set'
      : group.setsAgo === 0
        ? 'Latest'
        : `${group.setsAgo} set${group.setsAgo > 1 ? 's' : ''} ago`;
  const review = group.reviewNo === null ? '' : ` · Review ${group.reviewNo}`;
  return `${when}${review} · ${group.words.length} words`;
}

interface Props {
  studentId: number;
  // BreadcrumbPageTitle의 parents 배열. 여러 단계(e.g. Student Management > 이름) 지원.
  parents: { label: string; onClick?: () => void }[];
}

export function PendingReviewsPage({ studentId, parents }: Props) {
  const { data: reviews, isLoading } = usePendingReviews(studentId);
  // "몇 회 전 배정인지"와 복습 단계는 배정 현황 목록에만 있어 studySetId로 이어 붙인다.
  // 같은 queryKey(studentKeys.studySets)를 Word Test 화면·대시보드도 쓰므로 대체로 캐시가 따뜻하다.
  const { data: activeSets = [] } = useActiveStudySetList(studentId);

  // pending-reviews는 활성 복습 시험 1건당 한 항목이고, 복습은 순차 잠금이라
  // 한 배정에 활성 복습은 최대 1개다 → 항목 하나가 곧 배정 하나다.
  // 응답은 studySetId ASC(오래된 배정 먼저)라 가장 많이 밀린 배정이 위에 온다.
  const groups: ReviewGroup[] = (reviews ?? []).map((item) => {
    // active 목록은 서버가 id DESC · 페이징 없이 반환하는 것을 계약으로 보장하므로
    // 배열 index가 곧 "이 배정 이후 추가된 배정 수"다.
    const setIndex = activeSets.findIndex((s) => s.studySetId === item.studySetId);
    return {
      studySetId: item.studySetId,
      setsAgo: setIndex === -1 ? null : setIndex,
      reviewNo: setIndex === -1 ? null : findReviewNo(activeSets[setIndex], item.examId),
      words: item.words,
    };
  });

  // 드롭다운에서 선택된 배정 — 'all'이 기본. 날짜 기반 시절엔 "오늘 몫만 보기"가 기본이었지만
  // 회차 기반에선 밀린 복습을 한 번에 훑는 게 자연스럽다.
  const [selectedSetId, setSelectedSetId] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(`pending_${studentId}`);

  // 선택한 배정이 목록에서 사라졌으면(복습 통과 등) 전체 보기로 되돌린다.
  const activeSetId = groups.some((g) => g.studySetId === selectedSetId) ? selectedSetId : 'all';
  const activeWords =
    activeSetId === 'all'
      ? groups.flatMap((g) => g.words)
      : (groups.find((g) => g.studySetId === activeSetId)?.words ?? []);

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
      ) : groups.length === 0 ? (
        <EmptyState title="No words to review." />
      ) : (
        <>
          {/* 배정 드롭다운 필터 — 오래된(= 많이 밀린) 배정이 위 */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Review Set
            </span>
            <div className="relative">
              <select
                className="appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 pr-9 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                value={activeSetId}
                onChange={(e) => {
                  const { value } = e.target;
                  setSelectedSetId(value === 'all' ? 'all' : Number(value));
                  setViewMode('list');
                  setShowBookmarkedOnly(false);
                }}
              >
                <option value="all">All sets</option>
                {groups.map((g) => (
                  <option key={g.studySetId} value={g.studySetId}>
                    {groupLabel(g)}
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
            <WordFlashcard
                words={visibleWords}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
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
