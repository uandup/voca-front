import type { SentenceTestAnswer, WordTestType } from '@/entities/test';
import type { WordTestItem, VocabReviewItem, SentenceTestItem } from '@/entities/word';
import {
  VocabAnswerTable,
  SentenceAnswerTable,
  VocabReviewTable,
  SentenceReviewTable,
  SentencePreviewTable,
  type Answer,
} from '@/widgets/test-online';
import type { ExamMode } from '../model/useExamTake';

interface VocabData {
  pageItems: WordTestItem[];
  reviewItems: VocabReviewItem[];
  answers: Record<number, Answer>;
  reviewAnswers: Record<number, Answer>;
  wrongIds: Set<number>;
  onChange: (id: number, field: keyof Answer, value: string) => void;
}

interface SentenceData {
  pageItems: SentenceTestItem[];
  answers: Record<number, SentenceTestAnswer>;
  correctAnswers: Record<number, string>;
  onChange: (id: number, value: string) => void;
}

interface ExamContentTableProps {
  mode: ExamMode;
  isSentence: boolean;
  testType: WordTestType;
  showSynonym: boolean;
  currentPage: number;
  totalPages: number;
  vocab: VocabData;
  sentence: SentenceData;
}

// mode(answer/review/submitted) × isSentence(vocab/sentence) 조합에 따라
// 적절한 테이블 컴포넌트를 선택해 렌더링하는 조건부 렌더러.
export function ExamContentTable({
  mode,
  isSentence,
  testType,
  showSynonym,
  currentPage,
  totalPages,
  vocab,
  sentence,
}: ExamContentTableProps) {
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

  if (mode === 'submitted') {
    /* submitted: 채점 대기 — 정답 없이 학생 제출 답만 read-only로 표시 (Task 21).
       sentence: SentencePreviewRow 재사용(학생 답을 answer prop으로 전달).
       vocab: VocabAnswerTable readOnly(input → span, correct answer 행 없음). */
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

  // answer: 응시 중 — 입력 가능.
  return isSentence ? (
    <SentenceAnswerTable
      items={sentence.pageItems}
      answers={sentence.answers}
      onAnswerChange={sentence.onChange}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  ) : (
    <VocabAnswerTable
      items={vocab.pageItems}
      testType={testType}
      showSynonym={showSynonym}
      answers={vocab.answers}
      onAnswerChange={vocab.onChange}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
