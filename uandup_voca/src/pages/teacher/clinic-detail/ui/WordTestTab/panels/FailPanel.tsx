import { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { StepCardVM, WordTestType } from '@/entities/test';
import { useExamDetail } from '../../../model/hooks/useExamDetail';
import { isSentenceStep } from '../../../model/mapper';
import { TestGradingModal } from '../modals/TestGradingModal';
import { TestResultModal } from '../modals/TestResultModal';

// 채점이 완료되었으나 통과하지 못한 단계에서 렌더링된다.
// inferPhase가 'fail'을 반환하는 경우 — step.status === 'fail'
// (서버 상태 COMPLETED + isPassed=false).
// 주된 액션: Retake Test (createExam 재호출), View Results, Grade(재채점).
// 소유 모달: TestGradingModal (재채점), TestResultModal (결과 확인).

interface Props {
  step: StepCardVM;
  currentExamId: number | null;
  testType: WordTestType;
  includeSynonyms: boolean;
  create: UseMutationResult<unknown, Error, void>;
  onGradeOnline: () => void;
  onGradeOffline: () => void;
}

export function FailPanel({
  step,
  currentExamId,
  testType,
  includeSynonyms,
  create,
  onGradeOnline,
  onGradeOffline,
}: Props) {
  const [showGrading, setShowGrading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { data: examDetail } = useExamDetail(showGrading || showResult ? currentExamId : null);

  function handleGradeOnline() {
    onGradeOnline();
    setShowGrading(false);
  }
  function handleGradeOffline() {
    onGradeOffline();
    setShowGrading(false);
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
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span className="flex items-center gap-1.5">
            Score :{' '}
            {step.lastScore !== null ? (
              <span className="text-error font-semibold">
                {step.lastScore} / {step.maxScore ?? 'N'}
              </span>
            ) : (
              <span className="text-error font-semibold">- / {step.maxScore ?? 'N'}</span>
            )}
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
          onClick={() => setShowResult(true)}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
        <div className="ml-auto">
          <button
            onClick={() => setShowGrading(true)}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade
          </button>
        </div>
      </div>

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

      {showResult && (
        <TestResultModal
          step={step}
          examDetail={examDetail}
          testType={testType}
          includeSynonyms={includeSynonyms}
          onClose={() => setShowResult(false)}
        />
      )}
    </>
  );
}
