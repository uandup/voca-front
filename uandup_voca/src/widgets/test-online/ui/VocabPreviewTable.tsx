import type { VocabReviewItem } from '@/entities/word';
import { VocabPreviewRow } from './VocabPreviewRow';

interface VocabPreviewTableProps {
  items: VocabReviewItem[];
  showSynonym: boolean;
}

export function VocabPreviewTable({ items, showSynonym }: VocabPreviewTableProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <VocabPreviewRow
            key={item.id}
            id={item.id}
            word={item.word}
            korMeaning={item.korMeaning}
            engMeaning={item.engMeaning}
            synonymAnswer={item.synonymAnswer}
            showSynonym={showSynonym}
          />
        ))}
      </div>
    </div>
  );
}
