import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { UseMutationResult } from '@tanstack/react-query';
import type { StepCardVM, WordTestType, ExamType } from '@/entities/test';
import { useExamDetail } from '../../../model/hooks/useExamDetail';
import { TestPrintModal } from '../modals/TestPrintModal';
// 통합 후 미사용 — modal 기반 채점 흐름 복귀 시 다시 활성화.
// import { TestGradingModal } from '../modals/TestGradingModal';

// 시험이 생성되었고 아직 채점이 완료되지 않은 단계에서 렌더링된다.
// inferPhase가 'created'를 반환하는 경우 — 구체적으로 step.status가
//   - 'active'   (서버 상태 READY)                  : 시험 생성 직후, 응시 전
//   - 'grading'  (서버 상태 ONLINE_STARTED | SUBMITTED) : 응시/제출 완료, 채점 대기
// 주된 액션:
//   - Preview        → /teacher/exams/:examId/preview 라우트 이동 (online 전용, read-only)
//   - Print(아이콘)   → TestPrintModal (offline 전용, 빈칸 인쇄)
//   - Start Online   → startOnlineExam mutation
//   - Grade         → /teacher/exams/:examId/review 라우트 이동 (채점/결과 통합 페이지)
//   - Grade Offline  → TestGradingModal (offline 전용, 종이 채점)
//   - Cancel         → cancelExam mutation
// 소유 모달: TestPrintModal (Print), TestGradingModal (Grade Offline).

interface Props {
  step: StepCardVM;
  currentExamId: number | null;
  studentId: number;
  studySetId: number;
  examType: ExamType;
  testType: WordTestType;
  includeSynonyms: boolean;
  startOnline: UseMutationResult<unknown, Error, void>;
  cancel: UseMutationResult<unknown, Error, void>;
  // 통합 후 미사용 — StepPanel 시그니처와의 호환 유지를 위해 prop은 보존.
  onGradeOffline: () => void;
}

export function CreatedPanel({
  step,
  currentExamId,
  studentId,
  studySetId,
  examType,
  testType,
  includeSynonyms,
  startOnline,
  cancel,
  onGradeOffline: _onGradeOffline,
}: Props) {
  const navigate = useNavigate();
  const [showPrint, setShowPrint] = useState(false);
  // const [showGrading, setShowGrading] = useState(false);  // 통합 후 미사용

  // Print 모달이 열려있을 때만 examDetail fetch.
  const { data: examDetail } = useExamDetail(showPrint ? currentExamId : null);

  // function handleGradeOffline() {
  //   _onGradeOffline();
  //   setShowGrading(false);
  // }

  // Exit에서 history.replace로 돌아갈 수 있도록 현재 클리닉 URL을 함께 넘긴다.
  // openSet/openStep search 파라미터도 함께 직렬화되어 펼침 상태가 그대로 복원된다.
  function currentReturnTo() {
    return window.location.pathname + window.location.search;
  }

  function goPreview() {
    if (currentExamId === null) return;
    navigate({
      to: '/teacher/exams/$examId/preview',
      params: { examId: String(currentExamId) },
      // examType은 vocab/sentence preview 분기에 사용된다.
      search: { returnTo: currentReturnTo(), examType },
    });
  }

  function goReview() {
    if (currentExamId === null) return;
    navigate({
      to: '/teacher/exams/$examId/review',
      params: { examId: String(currentExamId) },
      // studentId/studySetId/examType는 채점 후 정확한 invalidation을 위해 함께 전달한다.
      search: { returnTo: currentReturnTo(), studentId, studySetId, examType },
    });
  }

  const navDisabled = currentExamId === null;

  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.createdAt && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.createdAt}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span>
            Score : {step.lastScore ?? '-'} / {step.maxScore ?? 'N'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => startOnline.mutate()}
            disabled={startOnline.isPending}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-60"
          >
            {startOnline.isPending ? 'Starting...' : 'Start Online Test'}
          </button>
          <button
            onClick={goPreview}
            disabled={navDisabled}
            className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Preview
          </button>
          <button
            onClick={() => setShowPrint(true)}
            className="p-2 rounded-xl border border-outline/30 text-on-surface-variant hover:bg-slate-100 transition-colors flex items-center"
            title="Print"
          >
            <span className="material-symbols-outlined leading-none" style={{ fontSize: '18px' }}>
              print
            </span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={goReview}
            disabled={navDisabled}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Grade
          </button>
          {/* Grade Online/Offline 통합: 항상 online 양식(/review 페이지)을 사용한다.
              아래 Grade Offline 버튼과 TestGradingModal 흐름은 향후 재도입 가능성을 위해 주석으로 보존. */}
          {/*
          <button
            onClick={() => setShowGrading(true)}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade Offline
          </button>
          */}
          <button
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-error hover:bg-error/90 transition-colors"
          >
            Cancel Test
          </button>
        </div>
      </div>

      {showPrint && (
        <TestPrintModal
          step={step}
          examDetail={examDetail}
          testType={testType}
          includeSynonyms={includeSynonyms}
          onClose={() => setShowPrint(false)}
        />
      )}

      {/*
      {showGrading && (
        <TestGradingModal
          step={step}
          examDetail={examDetail}
          testType={testType}
          includeSynonyms={includeSynonyms}
          onClose={() => setShowGrading(false)}
          onGrade={handleGradeOffline}
        />
      )}
      */}
    </>
  );
}
