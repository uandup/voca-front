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
}

export function MobileWordList({
  items,
  showSentence,
  bookmarkedIds,
  onToggleBookmark,
  hideWord,
  hideMeaning,
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
            <WordBookmarkButton
              bookmarked={bookmarkedIds.has(item.id)}
              onToggle={() => onToggleBookmark(item.id)}
            />
          }
        />
      ))}
    </div>
  );
}
