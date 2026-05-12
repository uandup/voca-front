import { useState } from 'react';
import type { StepCardVM, ExamType } from '@/entities/test';
import { useStudySetDetail } from '../../model/hooks/useStudySetDetail';
import { useExamDetail } from '../../model/hooks/useExamDetail';
import { useExamActions } from '../../model/hooks/useExamActions';
import { inferPhase } from '../../model/mapper';
import { TestConfigSection, type LocalTestConfig } from './TestConfigSection';
import { StepModals } from './StepModals';
import { PendingPanel } from './panels/PendingPanel';
import { CreatedPanel } from './panels/CreatedPanel';
import { FailPanel } from './panels/FailPanel';
import { PassedPanel } from './panels/PassedPanel';

interface StepPanelProps {
  step: StepCardVM;
  studySetId: number;
  studentId: number;
  examType: ExamType;
}

export default function StepPanel({ step, studySetId, studentId, examType }: StepPanelProps) {
  const phase = inferPhase(step);

  const { data: examHistory } = useStudySetDetail(studySetId, examType, true);
  const currentExamId = examHistory?.currentExamId ?? null;

  const [modalExamId, setModalExamId] = useState<number | null>(null);
  const { data: examDetail } = useExamDetail(modalExamId);

  const [config, setConfig] = useState<LocalTestConfig>({
    testQty: 30,
    testType: 'meaning-to-word',
    includeSynonyms: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const { create, startOnline, cancel, gradeOnline, gradeOffline, updateSettings } = useExamActions(
    { studySetId, studentId, examType, currentExamId },
  );

  function handleCreate() {
    create.mutate(undefined, {
      onSuccess: () => setShowSuccessModal(true),
    });
  }

  function handleGradeOnline() {
    gradeOnline.mutate(
      { results: [], isPassed: false },
      { onSuccess: () => setShowGradingModal(false) },
    );
  }

  function handleGradeOffline() {
    gradeOffline.mutate(
      { results: [], isPassed: false },
      { onSuccess: () => setShowGradingModal(false) },
    );
  }

  function handleApplySettings() {
    updateSettings.mutate(
      {
        examQuestionCount: config.testQty,
        examSubType: config.testType === 'word-to-meaning' ? 'WORD_TO_MEANING' : 'MEANING_TO_WORD',
        synonymIncluded: config.includeSynonyms,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleOpenModal(type: 'print' | 'grading' | 'result') {
    setModalExamId(currentExamId);
    if (type === 'print') setShowPrintModal(true);
    if (type === 'grading') setShowGradingModal(true);
    if (type === 'result') setShowResultModal(true);
  }

  return (
    <>
      <StepModals
        step={step}
        examDetail={examDetail}
        config={config}
        show={{
          success: showSuccessModal,
          print: showPrintModal,
          grading: showGradingModal,
          result: showResultModal,
        }}
        onClose={{
          success: () => setShowSuccessModal(false),
          print: () => setShowPrintModal(false),
          grading: () => setShowGradingModal(false),
          result: () => setShowResultModal(false),
        }}
        onGradeOnline={handleGradeOnline}
        onGradeOffline={handleGradeOffline}
      />

      <div className="bg-slate-50 border border-outline/20 rounded-2xl p-5 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
        <TestConfigSection
          config={config}
          isEditing={isEditing}
          showEditButton={phase === 'pending'}
          onToggleEdit={() => {
            if (isEditing) {
              handleApplySettings();
            } else {
              setIsEditing(true);
            }
          }}
          onChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
        />

        {phase === 'pending' && (
          <PendingPanel
            isEditing={isEditing}
            isPending={create.isPending}
            onGenerate={() => handleCreate()}
          />
        )}
        {phase === 'created' && (
          <CreatedPanel
            step={step}
            isStartPending={startOnline.isPending}
            isCancelPending={cancel.isPending}
            onOpenPrint={() => handleOpenModal('print')}
            onGradeOnline={() => handleOpenModal('grading')}
            onGradeOffline={() => handleOpenModal('grading')}
            onStartOnline={() => startOnline.mutate()}
            onCancel={() => cancel.mutate()}
          />
        )}
        {phase === 'fail' && (
          <FailPanel
            step={step}
            isRetakePending={create.isPending}
            onRetake={() => handleCreate()}
            onOpenGrading={() => handleOpenModal('grading')}
            onOpenResult={() => handleOpenModal('result')}
          />
        )}
        {phase === 'passed' && (
          <PassedPanel step={step} onOpenResult={() => handleOpenModal('result')} />
        )}
      </div>
    </>
  );
}
