import { useState } from 'react';
import type { StepCardVM, ExamType } from '@/entities/test';
import { useStudentOverview } from '../../model/hooks/useStudentOverview';
import { useStudySetDetail } from '../../model/hooks/useStudySetDetail';
import { useExamDetail } from '../../model/hooks/useExamDetail';
import { useExamActions } from '../../model/hooks/useExamActions';
import { inferPhase } from '../../model/mapper';
import { TestConfigSection } from './TestConfigSection';
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

  const { data: student } = useStudentOverview(studentId);
  const { data: examHistory } = useStudySetDetail(studySetId, examType, phase !== 'pending');
  const currentExamId = examHistory?.currentExamId ?? null;

  const [modalExamId, setModalExamId] = useState<number | null>(null);
  const { data: examDetail } = useExamDetail(modalExamId);

  const [isConfigEditing, setIsConfigEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const { create, startOnline, cancel, gradeOnline, gradeOffline } = useExamActions({
    studySetId,
    studentId,
    examType,
    currentExamId,
  });

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

  function handleOpenModal(type: 'print' | 'grading' | 'result') {
    setModalExamId(currentExamId);
    if (type === 'print') setShowPrintModal(true);
    if (type === 'grading') setShowGradingModal(true);
    if (type === 'result') setShowResultModal(true);
  }

  if (!student) return null;

  return (
    <>
      <StepModals
        step={step}
        examDetail={examDetail}
        testType={student.testType}
        includeSynonyms={student.includeSynonyms}
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
          studentId={studentId}
          initialConfig={{
            testQty: student.testQuestionCount,
            testType: student.testType,
            includeSynonyms: student.includeSynonyms,
          }}
          showEditButton={phase === 'pending'}
          onEditingChange={setIsConfigEditing}
        />

        {phase === 'pending' && (
          <PendingPanel
            isEditing={isConfigEditing}
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
