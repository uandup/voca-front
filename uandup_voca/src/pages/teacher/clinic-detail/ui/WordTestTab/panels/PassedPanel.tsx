import type { StepCardVM } from '@/entities/test';

// 채점이 완료되어 통과한 단계에서 렌더링된다.
// inferPhase가 'passed'를 반환하는 경우 — step.status === 'passed'
// (서버 상태 COMPLETED + isPassed=true).
// 주된 액션: View Results (읽기 전용).

interface Props {
  step: StepCardVM;
  onOpenResult: () => void;
}

export function PassedPanel({ step, onOpenResult }: Props) {
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
              <span className="font-semibold text-success">
                {step.lastScore} / {step.maxScore ?? 'N'}
              </span>
            ) : (
              <span>- / {step.maxScore ?? 'N'}</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenResult}
          className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors"
        >
          View Results
        </button>
      </div>
    </>
  );
}
