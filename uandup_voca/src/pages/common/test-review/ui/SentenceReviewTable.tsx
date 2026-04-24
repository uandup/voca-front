import type { TestSentenceItem } from '../../test/mock/testMockData';
import type { SentenceAnswer } from '../../test/ui/SentenceAnswerRow';
import { SentenceReviewRow } from './SentenceReviewRow';

interface SentenceReviewTableProps {
  items: TestSentenceItem[];
  answers: Record<number, SentenceAnswer>;
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
            answerWord={item.answerWord ?? ''}
            studentWord={answers[item.id]?.word ?? ''}
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
