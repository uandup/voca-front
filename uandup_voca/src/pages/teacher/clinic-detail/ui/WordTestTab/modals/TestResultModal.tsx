import type { StepCardVM, ExamDetail, WordTestType } from '@/entities/test';
import { WordResultModal, SentenceResultModal } from '@/widgets/test-offline';
import { toVocabReviewItems } from '@/entities/test';
import { isSentenceStep, toESRows } from '../../../model/mapper';

// Result 모달의 Word/Sentence variant 분기를 흡수한다.
// wrongIndices(채점된 결과에서 오답 인덱스) 계산도 이 컴포넌트가 책임진다.

interface Props {
  step: StepCardVM;
  examDetail: ExamDetail | undefined;
  testType: WordTestType;
  includeSynonyms: boolean;
  onClose: () => void;
}

export function TestResultModal({ step, examDetail, testType, includeSynonyms, onClose }: Props) {
  const items = examDetail?.items ?? [];
  const wrongIndices = items
    .map((item, i) => (item.isCorrect === false ? i : -1))
    .filter((i) => i !== -1);

  if (isSentenceStep(step)) {
    return (
      <SentenceResultModal onClose={onClose} rows={toESRows(items)} wrongIndices={wrongIndices} />
    );
  }
  return (
    <WordResultModal
      onClose={onClose}
      rows={toVocabReviewItems(items)}
      testType={testType}
      includeSynonyms={includeSynonyms}
      wrongIndices={wrongIndices}
    />
  );
}
