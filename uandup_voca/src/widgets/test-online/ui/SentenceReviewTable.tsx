import type { SentenceTestItem } from '@/entities/word';
import type { SentenceTestAnswer } from '@/entities/test';
import { SentenceReviewRow } from './SentenceReviewRow';

interface SentenceReviewTableProps {
  items: SentenceTestItem[];
  // 학생이 제출한 답안. itemOrder(=item.id) 키 기준.
  answers: Record<number, SentenceTestAnswer>;
  // 정답 단어 — itemOrder(=item.id) 키 기준. examDetail.items의 word 필드에서 생성.
  correctAnswers: Record<number, string>;
  wrongIds: Set<number>;
  readOnly?: boolean;
  hideCheckbox?: boolean;
  onToggleWrong: (id: number) => void;
}

export function SentenceReviewTable({
  items,
  answers,
  correctAnswers,
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
            answerWord={correctAnswers[item.id] ?? ''}
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
