import type { Sentence } from '@/entities/word';
import type { SentenceTestAnswer } from '@/entities/test';
import { SentenceReviewRow } from './SentenceReviewRow';

interface SentenceReviewTableProps {
  items: Sentence[];
  answers: Record<number, SentenceTestAnswer>;
  wrongIds: Set<number>;
  readOnly?: boolean;
  hideCheckbox?: boolean;
  onToggleWrong: (id: number) => void;
}

export function SentenceReviewTable({
  items,
  answers,
  wrongIds,
  readOnly = false,
  hideCheckbox = false,
  onToggleWrong,
}: SentenceReviewTableProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <SentenceReviewRow
            key={item.id}
            id={item.id}
            sentence={item.sentence}
            answerWord={item.word}
            studentWord={answers[item.id]?.answer ?? ''}
            isWrong={wrongIds.has(item.id)}
            readOnly={readOnly}
            hideCheckbox={hideCheckbox}
            onToggleWrong={onToggleWrong}
          />
        ))}
      </div>
    </div>
  );
}
