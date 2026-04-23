import type { TestVocabItem, VocabTestType } from '../../test/mock/testMockData';
import type { Answer } from '../../test/ui/VocabAnswerRow';
import { VocabReviewRow } from './VocabReviewRow';

interface VocabReviewTableProps {
  items: TestVocabItem[];
  testType: VocabTestType;
  showSynonym: boolean;
  answers: Record<number, Answer>;
  wrongIds: Set<number>;
  onToggleWrong: (id: number) => void;
}

export function VocabReviewTable({
  items,
  testType,
  showSynonym,
  answers,
  wrongIds,
  onToggleWrong,
}: VocabReviewTableProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
      {/* Table header */}
      <div className="flex items-center gap-3 px-4 pb-2 mb-1">
        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest w-5 shrink-0 text-center">
          No
        </span>
        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest w-40 shrink-0">
          Word
        </span>
        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest flex-1">
          Definition / Meaning
        </span>
        {showSynonym && (
          <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest w-40 shrink-0">
            Synonym
          </span>
        )}
        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest w-8 text-center">
          ✕
        </span>
      </div>

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
            onToggleWrong={onToggleWrong}
          />
        ))}
      </div>
    </div>
  );
}
