import type { StepCardVM, StepStatus } from '@/entities/test';

interface StepCardProps {
  step: StepCardVM;
  // status별 단일 액션 버튼(active=Start Online Test, passed/fail=View Results)에서 호출.
  // examId가 없는 단계(locked/pending)는 호출되지 않는다.
  onAction?: () => void;
}

const containerClass: Record<StepStatus, string> = {
  locked: 'border border-primary/30 bg-primary/5',
  grading: 'border border-primary/30 bg-primary/5',
  fail: 'border border-error/20 bg-error/5',
  passed: 'border border-success/30 bg-success/5',
  active: 'border border-primary/30 bg-primary/5',
  pending: 'border border-primary/30 bg-primary/5',
};

export default function WordTestStepCard({ step, onAction }: StepCardProps) {
  const {
    status,
    name,
    lastScore,
    maxScore: totalScore,
    createdAt: gradedDate,
    retakeCount,
  } = step;

  return (
    <div
      className={`flex-1 min-w-0 h-44 rounded-2xl p-4 flex flex-col gap-2 ${containerClass[status]}`}
    >
      <span className="text-sm font-bold leading-tight text-on-surface">{name}</span>

      <span className="text-xs text-on-surface-variant">{gradedDate ?? ''}</span>

      {(status === 'fail' || status === 'passed') && lastScore && (
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-sm font-bold ${status === 'passed' ? 'text-success' : 'text-error'}`}
          >
            {lastScore} / {totalScore ?? 'N'}
          </span>
          {retakeCount > 0 && (
            <span className="text-[12px] font-semibold text-error">
              ( +{retakeCount} retake{retakeCount > 1 ? 's' : ''} )
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2">
        {status === 'locked' && (
          <button
            disabled
            className="w-full py-2.5 rounded-xl border border-outline/20 text-md font-medium"
          >
            Locked
          </button>
        )}
        {status === 'pending' && (
          <button
            disabled
            className="w-full py-2.5 rounded-xl border text-gray-400 border-outline/20 text-md font-medium"
          >
            Pending Test
          </button>
        )}
        {status === 'active' && (
          <button
            onClick={onAction}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-md hover:opacity-90 transition-opacity font-medium"
          >
            Start Online Test
          </button>
        )}
        {status === 'grading' && (
          <button
            disabled
            className="w-full py-2.5 rounded-xl border border-outline/20 text-md font-medium"
          >
            Awaiting Grading
          </button>
        )}
        {status === 'passed' && (
          <button
            onClick={onAction}
            className="w-full py-2.5 rounded-xl border border-outline/30 text-md  text-on-surface-variant hover:bg-slate-100 transition-colors font-medium"
          >
            View Results
          </button>
        )}
        {status === 'fail' && (
          <>
            <button
              disabled
              className="w-full py-1.5 rounded-xl border text-gray-400 border-outline/20 text-xs font-semibold"
            >
              Pending Re-Test
            </button>
            <button
              onClick={onAction}
              className="w-full py-1.5 rounded-xl border border-outline/30 text-xs font-semibold text-on-surface-variant hover:bg-slate-100 transition-colors"
            >
              View Results
            </button>
          </>
        )}
      </div>
    </div>
  );
}
