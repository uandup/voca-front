import { useNavigate } from '@tanstack/react-router';
import type { UseMutationResult } from '@tanstack/react-query';
import type { StepCardVM, WordTestType, ExamType, ExamAttempt } from '@/entities/test';
// 통합 후 미사용 — modal 기반 채점/결과 흐름 복귀 시 다시 활성화.
// import { useState } from 'react';
// import { useExamDetail } from '../../../model/hooks/useExamDetail';
// import { isSentenceStep } from '../../../model/mapper';
// import { TestGradingModal } from '../modals/TestGradingModal';
// import { TestResultModal } from '../modals/TestResultModal';

// 채점이 완료되었으나 통과하지 못한 단계에서 렌더링된다.
// inferPhase가 'fail'을 반환하는 경우 — step.status === 'fail'
// (서버 상태 COMPLETED + isPassed=false).
// 주된 액션: Retake Test (createExam 재호출), View Results, Grade — 모두 /review 페이지로 이동.
// modal 기반 TestGradingModal/TestResultModal은 /review 페이지로 통합되어 미사용.

interface Props {
  step: StepCardVM;
  currentExamId: number | null;
  studentId: number;
  studySetId: number;
  examType: ExamType;
  // 현재 시험(fail) 이전의 실패한 시도들. examHistory에서 받아온다.
  failedAttempts: ExamAttempt[];
  // 통합 후 미사용 — StepPanel 시그니처와의 호환 유지를 위해 props는 보존.
  testType: WordTestType;
  includeSynonyms: boolean;
  create: UseMutationResult<unknown, Error, void>;
  onGradeOnline: () => void;
  onGradeOffline: () => void;
}

export function FailPanel({
  step,
  currentExamId,
  studentId,
  studySetId,
  examType,
  failedAttempts,
  testType: _testType,
  includeSynonyms: _includeSynonyms,
  create,
  onGradeOnline: _onGradeOnline,
  onGradeOffline: _onGradeOffline,
}: Props) {
  const navigate = useNavigate();
  // const [showGrading, setShowGrading] = useState(false);  // 통합 후 미사용
  // const [showResult, setShowResult] = useState(false);    // 통합 후 미사용
  // const { data: examDetail } = useExamDetail(showResult ? currentExamId : null);

  // function handleGradeOnline() {
  //   _onGradeOnline();
  //   setShowGrading(false);
  // }
  // function handleGradeOffline() {
  //   _onGradeOffline();
  //   setShowGrading(false);
  // }

  // 통합: Grade와 View Results 모두 /review 페이지로 이동(online 양식).
  // 페이지가 examDetail.status === 'COMPLETED'이면 자동으로 result 모드로 진입한다.
  function goReview() {
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
            Score : {/* 이전 실패 시도들 + 현재 시험 — FailPanel에선 모두 실패이므로 전부 빨강. */}
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
                isPassed: false,
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
                {i < arr.length - 1 && <span className="text-on-surface-variant ">,</span>}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => create.mutate()}
          disabled={create.isPending}
          className="px-4 py-2 rounded-xl bg-error text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-error/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {create.isPending ? 'Creating...' : 'Retake Test'}
        </button>
        <button
          onClick={goReview}
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
        <div className="ml-auto">
          <button
            onClick={goReview}
            disabled={currentExamId === null}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Grade
          </button>
          {/* 통합 이전 modal 기반 채점 — 보존용 주석. */}
          {/*
          <button
            onClick={() => setShowGrading(true)}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade
          </button>
          */}
        </div>
      </div>

      {/*
      {showGrading && (
        <TestGradingModal
          step={step}
          examDetail={examDetail}
          testType={testType}
          includeSynonyms={includeSynonyms}
          onClose={() => setShowGrading(false)}
          onGrade={isSentenceStep(step) ? handleGradeOnline : handleGradeOffline}
        />
      )}
      */}

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
