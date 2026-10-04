import { useState, type ReactNode } from 'react';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useWordBookmarks, useWordShuffle, useWordMask } from '@/entities/word';
import { MobileScreenHeader } from '@/widgets/mobile-nav';
import {
  MobileWordList,
  MobileWordFlashcard,
  MobileWordToolbar,
  type MobileWordItem,
  type MobileWordView,
} from '@/widgets/mobile-word-viewer';

interface Props {
  title: string;
  items: MobileWordItem[];
  isLoading: boolean;
  /**
   * 북마크 저장 스코프. 데스크탑 화면과 **같은 키**를 넘겨야 한다
   * (studyset_{id} / wrongwords_{studentId} / personalwords_{studentId}).
   * 그래야 같은 브라우저에서 데스크탑에 찍어둔 북마크가 폰에서도 보인다.
   */
  scopeKey: string;
  showSentence?: boolean;
  onBack: () => void;
  // 현재 보기 모드와 변경 핸들러. 라우트 search param에 묶여 있어 상위(wrapper)가 소유한다.
  view: MobileWordView;
  onChangeView: (view: MobileWordView) => void;
  // 플래시카드/셔플을 지원하지 않는 소스(개인 단어)는 false.
  supportsFlashcard?: boolean;
  supportsShuffle?: boolean;
  /**
   * 헤더 우측 액션(단어 추가·세트 메뉴 등). 이 화면은 내용을 모르고 자리만 빌려준다.
   * 로딩·빈 목록 분기 **밖**에 그린다 — 빈 세트에 첫 단어를 넣는 경로가 이것뿐이다.
   */
  headerAction?: ReactNode;
  /**
   * 주면 툴바에 Edit 토글이 생기고, 켜는 동안 각 카드 우상단이 북마크 대신 수정·삭제가 된다.
   * 개인 단어만 넘긴다 — 배정·오답 단어는 학생이 고칠 대상이 아니다.
   * 이 화면이 개인 단어를 아는 게 아니라, 쓰기를 가진 소스가 핸들러를 들고 오는 구조다.
   */
  wordActions?: {
    onEdit: (item: MobileWordItem) => void;
    onDelete: (item: MobileWordItem) => void;
  };
}

/**
 * 세 단어 소스(배정/오답/개인)가 공유하는 모바일 단어 화면.
 * 데이터 fetch는 routeWrappers가 맡고, 이 화면은 표시 상태(북마크·셔플·가리기·보기모드)만 소유한다.
 */
export function MobileWordListPage({
  title,
  items,
  isLoading,
  scopeKey,
  showSentence = false,
  onBack,
  view,
  onChangeView,
  supportsFlashcard = true,
  supportsShuffle = true,
  headerAction,
  wordActions,
}: Props) {
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { bookmarkedIds, toggleBookmark } = useWordBookmarks(scopeKey);
  const { orderedWords, shuffle, shuffleCount } = useWordShuffle(items);
  const { hideWord, hideMeaning, toggleHideWord, toggleHideMeaning } = useWordMask();

  // 셔플 순서를 먼저 적용하고 그 위에 북마크 필터를 얹는다
  // (필터 토글이 재섞기를 유발하지 않도록 순서가 중요 — 데스크탑 StudySetWordsPage와 동일한 불변식).
  const visibleItems = showBookmarkedOnly
    ? orderedWords.filter((w) => bookmarkedIds.has(w.id))
    : orderedWords;

  // 개인 단어처럼 플래시카드를 지원하지 않는 소스는 URL에 ?view=cards가 들어와도 리스트로 강제한다.
  const effectiveView: MobileWordView = supportsFlashcard ? view : 'list';

  // Edit 토글은 리스트 뷰에서만 보인다 — 플래시카드는 넘기며 외우는 화면이라
  // 거기에 수정·삭제를 얹으면 스와이프·탭과 손짓이 겹친다.
  const canEdit = wordActions !== undefined && effectiveView === 'list';

  return (
    <div className="px-4 pt-4">
      <MobileScreenHeader
        title={title}
        onBack={onBack}
        subtitle={items.length > 0 ? `${items.length} words` : undefined}
        action={headerAction}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon="inbox" title="No words yet." />
      ) : (
        <>
          <MobileWordToolbar
            view={effectiveView}
            onChangeView={onChangeView}
            bookmarkFilterActive={showBookmarkedOnly}
            bookmarkCount={bookmarkedIds.size}
            onToggleBookmarkFilter={() => setShowBookmarkedOnly((v) => !v)}
            onShuffle={supportsShuffle ? shuffle : undefined}
            showViewToggle={supportsFlashcard}
            editMode={editMode}
            onToggleEditMode={canEdit ? () => setEditMode((v) => !v) : undefined}
            hideWord={hideWord}
            hideMeaning={hideMeaning}
            onToggleHideWord={toggleHideWord}
            onToggleHideMeaning={toggleHideMeaning}
          />

          {visibleItems.length === 0 ? (
            <EmptyState icon="bookmark" title="No bookmarked words." />
          ) : effectiveView === 'cards' ? (
            // 셔플할 때마다 리마운트해 첫 카드로 되돌린다.
            <MobileWordFlashcard
              key={shuffleCount}
              items={visibleItems}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <MobileWordList
              items={visibleItems}
              showSentence={showSentence}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
              hideWord={hideWord}
              hideMeaning={hideMeaning}
              renderActions={
                canEdit && editMode && wordActions
                  ? (item) => (
                      <div className="flex items-center gap-0.5">
                        <WordActionButton
                          icon="edit"
                          label={`Edit ${item.word}`}
                          onClick={() => wordActions.onEdit(item)}
                        />
                        <WordActionButton
                          icon="delete"
                          label={`Delete ${item.word}`}
                          danger
                          onClick={() => wordActions.onDelete(item)}
                        />
                      </div>
                    )
                  : undefined
              }
            />
          )}
        </>
      )}
    </div>
  );
}

/**
 * Edit 모드에서 카드 우상단에 들어가는 아이콘 버튼.
 *
 * 36px로 둔다 — 툴바 버튼(44px)보다 작다. 카드 모서리에 두 개가 나란히 들어가야 하고
 * (44px씩이면 88px로 단어 제목을 밀어낸다), 같은 자리의 북마크 버튼과 크기를 맞춰야 한다.
 * 모서리 버튼은 주변이 전부 여백이라 44px 규칙에서 가장 양보해도 되는 자리다.
 */
function WordActionButton({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: string;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-9 h-9 flex items-center justify-center rounded-lg touch-manipulation active:bg-surface-container transition-colors ${
        danger ? 'text-error' : 'text-on-surface-variant'
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
        {icon}
      </span>
    </button>
  );
}
