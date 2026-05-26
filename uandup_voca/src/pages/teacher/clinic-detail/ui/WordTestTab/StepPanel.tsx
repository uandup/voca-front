import { useState } from 'react';
import type { StepCardVM, StudySetExamType } from '@/entities/test';
import { SuccessModal } from '@/shared/ui/SuccessModal';
import { useStudentOverview } from '@/entities/student';
import { useStudySetDetail } from '../../model/useStudySetDetail';
import { useExamActions } from '../../model/useExamActions';
import { inferPhase } from '../../model/mapper';
import { TestConfigSection } from './TestConfigSection';
import { PendingPanel } from './panels/PendingPanel';
import { CreatedPanel } from './panels/CreatedPanel';
import { FailPanel } from './panels/FailPanel';
import { PassedPanel } from './panels/PassedPanel';

interface StepPanelProps {
  step: StepCardVM;
  studySetId: number;
  studentId: number;
  examType: StudySetExamType;
}

export default function StepPanel({ step, studySetId, studentId, examType }: StepPanelProps) {
  const phase = inferPhase(step);

  const { data: student } = useStudentOverview(studentId);
  const { data: examHistory } = useStudySetDetail(studySetId, examType, phase !== 'pending');
  const currentExamId = examHistory?.currentExamId ?? null;

  const [isConfigEditing, setIsConfigEditing] = useState(false);
  // SuccessModal state는 PendingPanel이 아니라 StepPanel이 소유한다.
  // create 성공 직후 invalidate → step.status 변경 → phase 전환으로 PendingPanel이 언마운트되면서
  // 모달이 깜빡이고 사라지는 문제를 방지하기 위함. StepPanel은 phase와 무관하게 마운트가 유지된다.
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  const { create, startOnline, cancel, gradeOnline, gradeOffline } = useExamActions({
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
        showEditButton={phase === 'pending'}
        onEditingChange={setIsConfigEditing}
      />

      {phase === 'pending' && (
        <PendingPanel
          isEditing={isConfigEditing}
          create={create}
          onCreateSuccess={() => setShowCreateSuccess(true)}
        />
      )}
      {phase === 'created' && (
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
      {phase === 'fail' && (
        <FailPanel
          step={step}
          currentExamId={currentExamId}
          studentId={studentId}
          studySetId={studySetId}
          examType={examType}
          failedAttempts={examHistory?.failedAttempts ?? []}
          testType={initialConfig.testType}
          includeSynonyms={initialConfig.includeSynonyms}
          create={create}
          onGradeOnline={handleGradeOnline}
          onGradeOffline={handleGradeOffline}
        />
      )}
      {phase === 'passed' && (
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
        <SuccessModal
          message="Test Generated!"
          description="The test has been successfully created."
          onClose={() => setShowCreateSuccess(false)}
        />
      )}
    </div>
  );
}
