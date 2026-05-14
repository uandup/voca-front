import { useNavigate } from '@tanstack/react-router';
import type { StepCardVM, WordTestType, ExamType, ExamAttempt } from '@/entities/test';
// 통합 후 미사용 — modal 기반 결과 화면 복귀 시 다시 활성화.
// import { useState } from 'react';
// import { useExamDetail } from '../../../model/hooks/useExamDetail';
// import { TestResultModal } from '../modals/TestResultModal';

// 채점이 완료되어 통과한 단계에서 렌더링된다.
// inferPhase가 'passed'를 반환하는 경우 — step.status === 'passed'
// (서버 상태 COMPLETED + isPassed=true).
// 주된 액션: View Results — /review 페이지로 이동(COMPLETED 상태이므로 자동으로 result 모드 표시).
// TestResultModal은 /review 페이지로 통합되어 미사용.

interface Props {
  step: StepCardVM;
  currentExamId: number | null;
  studentId: number;
  studySetId: number;
  examType: ExamType;
  // 통과 전까지의 실패한 시도들. 점수 history 표시에 사용.
  failedAttempts: ExamAttempt[];
  // 통합 후 미사용 — StepPanel 시그니처와의 호환 유지를 위해 props는 보존.
  testType: WordTestType;
  includeSynonyms: boolean;
}

export function PassedPanel({
  step,
  currentExamId,
  studentId,
  studySetId,
  examType,
  failedAttempts,
  testType: _testType,
  includeSynonyms: _includeSynonyms,
}: Props) {
  const navigate = useNavigate();
  // const [showResult, setShowResult] = useState(false);
  // const { data: examDetail } = useExamDetail(showResult ? currentExamId : null);

  // 통합: View Results는 /review 페이지로 이동(online 양식 + result 모드).
  function goViewResults() {
    if (currentExamId === null) return;
    const returnTo = window.location.pathname + window.location.search;
    navigate({
      to: '/teacher/exams/$examId/review',
      params: { examId: String(currentExamId) },
      search: { returnTo, studentId, studySetId, examType },
    });
  }

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
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span className="flex items-center gap-1.5 flex-wrap">
            Score : {/* 이전 실패 시도들(빨강) + 현재 통과 시험(초록). */}
            {[
              ...failedAttempts.map((a) => ({
                key: String(a.examId),
                score: a.correctCount,
                max: a.totalCount,
                isPassed: false,
              })),
              {
                key: 'current',
                score: step.lastScore,
                max: step.maxScore,
                isPassed: true,
              },
            ].map((entry, i, arr) => (
              <span key={entry.key} className="flex items-center">
                <span
                  className={
                    entry.isPassed ? 'text-success font-semibold' : 'text-error font-semibold'
                  }
                >
                  {entry.score ?? '-'} / {entry.max ?? 'N'}
                </span>
                {i < arr.length - 1 && <span className="text-on-surface-variant">,</span>}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={goViewResults}
          disabled={currentExamId === null}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          View Results
        </button>
        {/* 통합 이전 modal 기반 결과 화면 — 보존용 주석. */}
        {/*
        <button
          onClick={() => setShowResult(true)}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
        */}
      </div>

      {/*
      {showResult && (
        <TestResultModal
          step={step}
          examDetail={examDetail}
          testType={testType}
          includeSynonyms={includeSynonyms}
          onClose={() => setShowResult(false)}
        />
      )}
      */}
    </>
  );
}
