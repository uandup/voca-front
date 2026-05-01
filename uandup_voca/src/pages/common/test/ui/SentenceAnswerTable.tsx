import type { SentenceItem } from '@/entities/test';
import { SentenceAnswerRow, type SentenceAnswer } from './SentenceAnswerRow';

interface SentenceAnswerTableProps {
  items: SentenceItem[];
  answers: Record<number, SentenceAnswer>;
  onAnswerChange: (id: number, value: string) => void;
  currentPage: number;
  totalPages: number;
}

export function SentenceAnswerTable({
  items,
  answers,
  onAnswerChange,
  currentPage,
  totalPages,
}: SentenceAnswerTableProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <SentenceAnswerRow
            key={item.id}
            id={item.id}
            sentence={item.sentence}
            answer={answers[item.id]}
            onAnswerChange={onAnswerChange}
            isLast={index === items.length - 1 && currentPage === totalPages}
          />
        ))}
      </div>
    </div>
  );
}
