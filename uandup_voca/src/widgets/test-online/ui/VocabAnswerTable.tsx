import type { WordTestType } from '@/entities/test';
import type { WordTestItem as TestWord } from '@/entities/word';
import { VocabAnswerRow, type Answer } from './VocabAnswerRow';

interface VocabAnswerTableProps {
  items: TestWord[];
  testType: WordTestType;
  showSynonym: boolean;
  answers: Record<number, Answer>;
  onAnswerChange: (id: number, field: keyof Answer, value: string) => void;
  currentPage: number;
  totalPages: number;
  // 채점 전(submitted) 상태 — input을 read-only span으로 렌더링한다.
  readOnly?: boolean;
}

export function VocabAnswerTable({
  items,
  testType,
  showSynonym,
  answers,
  onAnswerChange,
  currentPage,
  totalPages,
  readOnly = false,
}: VocabAnswerTableProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-4">
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <VocabAnswerRow
            key={item.id}
            id={item.id}
            word={item.word}
            korMeaning={item.korMeaning}
            engMeaning={item.engMeaning}
            testType={testType}
            // 개인 단어 문항(동의어 없음)은 시험 설정과 무관하게 동의어 칸을 끈다
            showSynonym={showSynonym && !item.synonymDisabled}
            answer={answers[item.id]}
            onAnswerChange={onAnswerChange}
            isLast={index === items.length - 1 && currentPage === totalPages}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
