import { useState } from 'react';
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
}: Props) {
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
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

  return (
    <div className="px-4 pt-4">
      <MobileScreenHeader
        title={title}
        onBack={onBack}
        subtitle={items.length > 0 ? `${items.length} words` : undefined}
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
            />
          )}
        </>
      )}
    </div>
  );
}
