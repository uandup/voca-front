import { useState } from 'react';
import type { StepCardVM, StudySetExamType } from '@/entities/test';
import { AlertDialog } from '@/shared/ui/Modal/AlertDialog';
import { useStudentOverview } from '@/entities/student';
import { useStudySetDetail } from '../../model/useStudySetDetail';
import { useExamActions } from '../../model/useExamActions';
import { inferPhase } from '../../model/mapper';
import { TestConfigSection } from './TestConfigSection';
import { SkipStepButton } from './SkipStepButton';
import { PendingPanel } from './panels/PendingPanel';
import { CreatedPanel } from './panels/CreatedPanel';
import { FailPanel } from './panels/FailPanel';
import { PassedPanel } from './panels/PassedPanel';

interface StepPanelProps {
  step: StepCardVM;
  studySetId: number;
  studentId: number;
  examType: StudySetExamType;
  // 이 StudySet에 실제 배정된 단어 수 — 시험 문항 수의 상한.
  wordCount: number;
}

export default function StepPanel({
  step,
  studySetId,
  studentId,
  examType,
  wordCount,
}: StepPanelProps) {
  const phase = inferPhase(step);
  // 스킵된 단계는 시험이 없으므로 phase 패널(Generate Test 등) 대신 안내만 노출한다.
  // inferPhase는 'skipped'를 모르고 'pending'을 반환하므로 이 플래그로 분기를 가른다.
  const isSkipped = step.status === 'skipped';

  const { data: student } = useStudentOverview(studentId);
  const { data: examHistory } = useStudySetDetail(studySetId, examType, phase !== 'pending');
  const currentExamId = examHistory?.currentExamId ?? null;

  const [isConfigEditing, setIsConfigEditing] = useState(false);
  // SuccessModal state는 PendingPanel이 아니라 StepPanel이 소유한다.
  // create 성공 직후 invalidate → step.status 변경 → phase 전환으로 PendingPanel이 언마운트되면서
  // 모달이 깜빡이고 사라지는 문제를 방지하기 위함. StepPanel은 phase와 무관하게 마운트가 유지된다.
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  const { create, startOnline, cancel, gradeOnline, gradeOffline, skip } = useExamActions({
    studySetId,
    studentId,
    examType,
    currentExamId,
  });

  function handleGradeOnline() {
    gradeOnline.mutate({ results: [], isPassed: false });
  }

  function handleGradeOffline() {
    gradeOffline.mutate({ results: [], isPassed: false });
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
    phase === 'pending'
      ? 'pending'
      : !examHistory
        ? 'loading'
        : (examHistory.currentExamId ?? 'no-current');

  return (
    <div className="bg-slate-50 border border-outline/20 rounded-2xl p-5 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
      <TestConfigSection
        key={configKey}
        studentId={studentId}
        initialConfig={initialConfig}
        showEditButton={!isSkipped && (phase === 'pending' || phase === 'fail')}
        onEditingChange={setIsConfigEditing}
        // 이 StudySet에 실제 배정된 단어 수를 시험 문항 수의 상한으로 전달한다.
        // (학생의 현재 글로벌 설정값이 아니라 해당 StudySet 고유의 단어 수여야 한다.)
        maxQty={wordCount}
      />

      {isSkipped && (
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '18px' }}>
            redo
          </span>
          <span>This step was skipped. The next step is unlocked.</span>
        </div>
      )}
      {!isSkipped && phase === 'pending' && (
        <PendingPanel
          isEditing={isConfigEditing}
          // 저장된 Quantity가 0이면 Generate Test 자체를 막는다.
          testQtyIsZero={initialConfig.testQty === 0}
          // 저장된 Quantity가 이 StudySet의 배정 단어 수를 초과하면 Generate Test를 막는다.
          testQtyExceedsMax={initialConfig.testQty > wordCount}
          create={create}
          onCreateSuccess={() => setShowCreateSuccess(true)}
          // 잠긴 단계가 아니면 Generate Test와 같은 행 우측에 Skip step 버튼을 함께 노출한다.
          skipSlot={step.status !== 'locked' ? <SkipStepButton skip={skip} /> : undefined}
        />
      )}
      {!isSkipped && phase === 'created' && (
        <CreatedPanel
          step={step}
          currentExamId={currentExamId}
          studentId={studentId}
          studySetId={studySetId}
          examType={examType}
          currentQuestionCount={examHistory?.currentQuestionCount ?? null}
          currentStatus={examHistory?.currentStatus ?? null}
          failedAttempts={examHistory?.failedAttempts ?? []}
          testType={initialConfig.testType}
          includeSynonyms={initialConfig.includeSynonyms}
          studentName={student.nameKo}
          studentEnglishName={student.englishName}
          startOnline={startOnline}
          cancel={cancel}
          onGradeOffline={handleGradeOffline}
        />
      )}
      {!isSkipped && phase === 'fail' && (
        <FailPanel
          step={step}
          currentExamId={currentExamId}
          studentId={studentId}
          studySetId={studySetId}
          examType={examType}
          failedAttempts={examHistory?.failedAttempts ?? []}
          testType={initialConfig.testType}
          includeSynonyms={initialConfig.includeSynonyms}
          isConfigEditing={isConfigEditing}
          create={create}
          onGradeOnline={handleGradeOnline}
          onGradeOffline={handleGradeOffline}
          // Retake Test와 같은 행 우측에 Skip step 버튼을 함께 노출한다.
          skipSlot={<SkipStepButton skip={skip} />}
        />
      )}
      {!isSkipped && phase === 'passed' && (
        <PassedPanel
          step={step}
          currentExamId={currentExamId}
          studentId={studentId}
          studySetId={studySetId}
          examType={examType}
          failedAttempts={examHistory?.failedAttempts ?? []}
          testType={initialConfig.testType}
          includeSynonyms={initialConfig.includeSynonyms}
        />
      )}

      {showCreateSuccess && (
        <AlertDialog
          variant="success"
          title="Test Generated!"
          description="The test has been successfully created."
          onClose={() => setShowCreateSuccess(false)}
        />
      )}
    </div>
  );
}
