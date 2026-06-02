import type { StepCardVM, ExamDetail, WordTestType } from '@/entities/test';
import { WordTestModal, SentenceModal } from '@/widgets/test-offline';
import { toWordTestItems } from '@/entities/test';
import { isSentenceStep, toESRows } from '../../../model/mapper';

// Print/Preview 모달의 Word/Sentence variant 분기를 흡수한다.
// step.name === 'Sentence'면 SentenceModal, 그 외엔 WordTestModal.
// examDetail.items의 행 변환(toESRows / toWordTestItems)도 이 컴포넌트가 책임진다.

interface Props {
  step: StepCardVM;
  examDetail: ExamDetail | undefined;
  testType: WordTestType;
  includeSynonyms: boolean;
  studentName: string;
  studentEnglishName: string;
  onClose: () => void;
}

export function TestPrintModal({
  step,
  examDetail,
  testType,
  includeSynonyms,
  studentName,
  studentEnglishName,
  onClose,
}: Props) {
  const items = examDetail?.items ?? [];

  if (isSentenceStep(step)) {
    return (
      <SentenceModal
        onClose={onClose}
        rows={toESRows(items)}
        studentName={studentName}
        studentEnglishName={studentEnglishName}
      />
    );
  }
  return (
    <WordTestModal
      onClose={onClose}
      rows={toWordTestItems(items)}
      testType={testType}
      includeSynonyms={includeSynonyms}
      studentName={studentName}
      studentEnglishName={studentEnglishName}
    />
  );
}
