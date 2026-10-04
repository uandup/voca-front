import type { ReactNode } from 'react';
import { WordBookmarkButton } from '@/entities/word';
import { MobileWordCard } from './MobileWordCard';
import type { MobileWordItem } from '../model/types';

interface Props {
  items: MobileWordItem[];
  showSentence?: boolean;
  bookmarkedIds: Set<number>;
  onToggleBookmark: (wordId: number) => void;
  hideWord: boolean;
  hideMeaning: boolean;
  /**
   * 주면 카드 우상단(extraInfo)에 북마크 대신 이걸 그린다.
   * 개인 단어의 Edit 모드가 쓴다 — 북마크와 수정·삭제를 한 모서리에 같이 넣으면
   * 360px에서 아이콘 세 개가 단어 제목을 밀어낸다. 그래서 자리를 바꿔 쓴다.
   * Edit 모드는 일시적이라 그 동안 북마크를 못 누르는 건 감당할 수 있다.
   */
  renderActions?: (item: MobileWordItem) => ReactNode;
}

export function MobileWordList({
  items,
  showSentence,
  bookmarkedIds,
  onToggleBookmark,
  hideWord,
  hideMeaning,
  renderActions,
}: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <MobileWordCard
          key={item.id}
          item={item}
          showSentence={showSentence}
          hideWord={hideWord}
          hideMeaning={hideMeaning}
          extraInfo={
            renderActions ? (
              renderActions(item)
            ) : (
              <WordBookmarkButton
                bookmarked={bookmarkedIds.has(item.id)}
                onToggle={() => onToggleBookmark(item.id)}
              />
            )
          }
        />
      ))}
    </div>
  );
}
