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

  // 시험이 이미 생성되었으면 시험에 캡처된 설정을, 그렇지 않으면 학생의 현재 설정을 사용.
  // examHistory 로드 전(transition 중)에도 student 값으로 fallback하여 panel 자체가 사라지지 않게 한다.
  // examHistory 도착 후엔 configKey가 바뀌면서 TestConfigSection이 re-mount되어 exam-captured 값으로 갱신된다.
  const initialConfig =
    examHistory && phase !== 'pending'
      ? {
          testQty: examHistory.currentQuestionCount ?? student.testQuestionCount,
          testType: examHistory.currentSubType ?? student.testType,
          includeSynonyms: examHistory.currentIncludeSynonym ?? student.includeSynonyms,
        }
      : {
          testQty: student.testQuestionCount,
          testType: student.testType,
          includeSynonyms: student.includeSynonyms,
        };

  // re-mount 트리거 키 — phase/시험 전환 시 새 initialConfig 반영.
  //   pending           → 'pending'   (학생 설정 기반)
  //   transition 중      → 'loading'  (examHistory 도착 전, 학생 설정 fallback)
  //   examHistory 도착  → currentExamId (exam-captured 값)
  const configKey =
    phase === 'pending' ? 'pending' : !examHistory ? 'loading' : (examHistory.currentExamId ?? 'no-current');

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
          key={configKey}
          studentId={studentId}
          initialConfig={initialConfig}
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
