import type { TestVocabItem, VocabTestType } from '@/entities/test';
import type { Answer } from '../../test/ui/VocabAnswerRow';
import { VocabReviewRow } from './VocabReviewRow';

interface VocabReviewTableProps {
  items: TestVocabItem[];
  testType: VocabTestType;
  showSynonym: boolean;
  answers: Record<number, Answer>;
  wrongIds: Set<number>;
  readOnly?: boolean;
  hideCheckbox?: boolean;
  onToggleWrong: (id: number) => void;
}

export function VocabReviewTable({
  items,
  testType,
  showSynonym,
  answers,
  wrongIds,
  readOnly = false,
  hideCheckbox = false,
  onToggleWrong,
}: VocabReviewTableProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <VocabReviewRow
            key={item.id}
            id={item.id}
            word={item.word}
            korMeaning={item.korMeaning}
            engMeaning={item.engMeaning}
            synonymAnswer={item.synonymAnswer ?? ''}
            testType={testType}
            showSynonym={showSynonym}
            answer={answers[item.id]}
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
