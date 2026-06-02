import type { SentenceTestAnswer, WordTestType, ExamMode } from '@/entities/test';
import type { WordTestItem, VocabReviewItem, SentenceTestItem } from '@/entities/word';
import {
  VocabAnswerTable,
  VocabReviewTable,
  SentenceReviewTable,
  SentencePreviewTable,
  type Answer,
} from '@/widgets/test-online';

interface VocabData {
  // submitted 모드에서 VocabAnswerTable(readOnly) 사용
  pageItems: WordTestItem[];
  // review 모드에서 VocabReviewTable 사용
  reviewItems: VocabReviewItem[];
  answers: Record<number, Answer>;
  reviewAnswers: Record<number, Answer>;
  wrongIds: Set<number>;
}

interface SentenceData {
  pageItems: SentenceTestItem[];
  answers: Record<number, SentenceTestAnswer>;
  correctAnswers: Record<number, string>;
}

interface ExamReviewTableProps {
  mode: ExamMode;
  isSentence: boolean;
  testType: WordTestType;
  showSynonym: boolean;
  currentPage: number;
  totalPages: number;
  vocab: VocabData;
  sentence: SentenceData;
}

// review/submitted 모드 × vocab/sentence 조합에 따라 테이블 컴포넌트를 선택하는 조건부 렌더러.
export function ExamReviewTable({
  mode,
  isSentence,
  testType,
  showSynonym,
  currentPage,
  totalPages,
  vocab,
  sentence,
}: ExamReviewTableProps) {
  if (mode === 'review') {
    return isSentence ? (
      <SentenceReviewTable
        items={sentence.pageItems}
        answers={sentence.answers}
        correctAnswers={sentence.correctAnswers}
        wrongIds={vocab.wrongIds}
        readOnly
        hideCheckbox
        onToggleWrong={() => {}}
      />
    ) : (
      <VocabReviewTable
        items={vocab.reviewItems}
        testType={testType}
        showSynonym={showSynonym}
        answers={vocab.reviewAnswers}
        wrongIds={vocab.wrongIds}
        readOnly
        hideCheckbox
        onToggleWrong={() => {}}
      />
    );
  }

  // submitted: 채점 대기 — 정답 없이 학생 제출 답만 read-only로 표시.
  return isSentence ? (
    <SentencePreviewTable
      items={sentence.pageItems.map((item) => ({
        id: item.id,
        sentence: item.sentence,
        answer: sentence.answers[item.id]?.answer ?? '',
      }))}
    />
  ) : (
    <VocabAnswerTable
      items={vocab.pageItems}
      testType={testType}
      showSynonym={showSynonym}
      answers={vocab.answers}
      onAnswerChange={() => {}}
      currentPage={currentPage}
      totalPages={totalPages}
      readOnly
    />
  );
}
