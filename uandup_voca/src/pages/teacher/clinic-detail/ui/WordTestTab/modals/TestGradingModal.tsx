import type { StepCardVM, ExamDetail, WordTestType } from '@/entities/test';
import { WordGradingModal, SentenceGradingModal } from '@/widgets/test-offline';
import { toVocabReviewItems } from '@/entities/test';
import { isSentenceStep, toESRows } from '../../../model/mapper';

// Grading 모달의 Word/Sentence variant 분기를 흡수한다.
// step.name === 'Sentence'면 SentenceGradingModal, 그 외엔 WordGradingModal.

interface Props {
  step: StepCardVM;
  examDetail: ExamDetail | undefined;
  testType: WordTestType;
  includeSynonyms: boolean;
  onClose: () => void;
  onGrade: () => void;
}

export function TestGradingModal({
  step,
  examDetail,
  testType,
  includeSynonyms,
  onClose,
  onGrade,
}: Props) {
  const items = examDetail?.items ?? [];

  if (isSentenceStep(step)) {
    return <SentenceGradingModal onClose={onClose} onGrade={onGrade} rows={toESRows(items)} />;
  }
  return (
    <WordGradingModal
      onClose={onClose}
      onGrade={onGrade}
      rows={toVocabReviewItems(items)}
      testType={testType}
      includeSynonyms={includeSynonyms}
    />
  );
}
