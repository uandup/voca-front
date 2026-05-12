import type { StepCardVM, ExamDetail } from '@/entities/test';
import { SuccessModal } from '@/shared/ui/SuccessModal';
import {
  WordTestModal,
  SentenceModal,
  WordGradingModal,
  WordResultModal,
  SentenceGradingModal,
  SentenceResultModal,
} from '@/widgets/test-offline';
import { isSentenceStep, toWordTestItems, toVocabReviewItems, toESRows } from '../../model/mapper';
import type { LocalTestConfig } from './TestConfigSection';

// StepPanel이 띄우는 4종 모달(Success / Print / Grading / Result)을 한 곳에서 관리한다.
// step.name이 'Sentence'인지에 따라 Sentence/Word variant를 자동 선택한다.
// examDetail의 후처리(rows·wrongIndices 계산)도 이 컴포넌트가 책임진다.

interface Props {
  step: StepCardVM;
  examDetail: ExamDetail | undefined;
  config: LocalTestConfig;
  show: {
    success: boolean;
    print: boolean;
    grading: boolean;
    result: boolean;
  };
  onClose: {
    success: () => void;
    print: () => void;
    grading: () => void;
    result: () => void;
  };
  onGradeOnline: () => void;
  onGradeOffline: () => void;
}

export function StepModals({
  step,
  examDetail,
  config,
  show,
  onClose,
  onGradeOnline,
  onGradeOffline,
}: Props) {
  const sentence = isSentenceStep(step);

  const items = examDetail?.items ?? [];
  const wordTestRows = toWordTestItems(items);
  const vocabReviewRows = toVocabReviewItems(items);
  const esRows = toESRows(items);
  const wrongIndices = items
    .map((item, i) => (item.isCorrect === false ? i : -1))
    .filter((i) => i !== -1);

  return (
    <>
      {show.success && (
        <SuccessModal
          message="Test Generated!"
          description="The test has been successfully created."
          onClose={onClose.success}
        />
      )}

      {show.print &&
        (sentence ? (
          <SentenceModal onClose={onClose.print} rows={esRows} />
        ) : (
          <WordTestModal
            onClose={onClose.print}
            rows={wordTestRows}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
          />
        ))}

      {show.grading &&
        (sentence ? (
          <SentenceGradingModal onClose={onClose.grading} onGrade={onGradeOnline} rows={esRows} />
        ) : (
          <WordGradingModal
            onClose={onClose.grading}
            onGrade={onGradeOffline}
            rows={vocabReviewRows}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
          />
        ))}

      {show.result &&
        (sentence ? (
          <SentenceResultModal onClose={onClose.result} rows={esRows} wrongIndices={wrongIndices} />
        ) : (
          <WordResultModal
            onClose={onClose.result}
            rows={vocabReviewRows}
            testType={config.testType}
            includeSynonyms={config.includeSynonyms}
            wrongIndices={wrongIndices}
          />
        ))}
    </>
  );
}
