import type { StepCardVM } from '@/entities/test';

// 채점이 완료되었으나 통과하지 못한 단계에서 렌더링된다.
// inferPhase가 'fail'을 반환하는 경우 — step.status === 'fail'
// (서버 상태 COMPLETED + isPassed=false).
// 주된 액션: Retake Test (createExam 재호출), View Results, Grade(재채점).

interface Props {
  step: StepCardVM;
  isRetakePending: boolean;
  onRetake: () => void;
  onOpenGrading: () => void;
  onOpenResult: () => void;
}

export function FailPanel({
  step,
  isRetakePending,
  onRetake,
  onOpenGrading,
  onOpenResult,
}: Props) {
  return (
    <>
      <div className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm text-on-surface-variant">
        {step.gradedAt && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              calendar_today
            </span>
            <span>Created At : {step.gradedAt}</span>
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
          onClick={onRetake}
          disabled={isRetakePending}
          className="px-4 py-2 rounded-xl bg-error text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-error/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRetakePending ? 'Creating...' : 'Retake Test'}
        </button>
        <button
          onClick={onOpenResult}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
        <div className="ml-auto">
          <button
            onClick={onOpenGrading}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade
          </button>
        </div>
      </div>
    </>
  );
}
