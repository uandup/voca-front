import { SentencePreviewRow } from './SentencePreviewRow';

export interface SentencePreviewItem {
  id: number;
  sentence: string;
  answer: string;
}

interface SentencePreviewTableProps {
  items: SentencePreviewItem[];
}

export function SentencePreviewTable({ items }: SentencePreviewTableProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <SentencePreviewRow
            key={item.id}
            id={item.id}
            sentence={item.sentence}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}
