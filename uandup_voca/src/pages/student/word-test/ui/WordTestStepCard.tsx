import type { StepCardVM, StepStatus } from '@/entities/test';

interface StepCardProps {
  step: StepCardVM;
  // status별 단일 액션 버튼(active=Start Online Test, passed/fail=View Results)에서 호출.
  // examId가 없는 단계(locked/pending)는 호출되지 않는다.
  onAction?: () => void;
  // pending/active/grading 상태에서 이전 fail 기록을 탭 뷰로 보여주는 버튼에서 호출.
  onViewResults?: () => void;
}

// 'YYYY-MM-DD' → 'May 30'
function formatScheduledDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const containerClass: Record<StepStatus, string> = {
  locked: 'border border-primary/30 bg-primary/5',
  grading: 'border border-primary/30 bg-primary/5',
  fail: 'border border-error/20 bg-error/5',
  passed: 'border border-success/30 bg-success/5',
  active: 'border border-primary/30 bg-primary/5',
  pending: 'border border-primary/30 bg-primary/5',
};

export default function WordTestStepCard({ step, onAction, onViewResults }: StepCardProps) {
  const {
    status,
    name,
    lastScore,
    maxScore: totalScore,
    completedAt,
    retakeCount,
    scheduledDate,
  } = step;

  return (
    <div
      className={`flex-1 min-w-0 h-44 rounded-2xl p-4 flex flex-col gap-2 ${containerClass[status]}`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold leading-tight text-on-surface">{name}</span>
        {/* Review 시험의 복습 예정일 — scheduledDate가 있을 때만 name 오른쪽에 표시 */}
        {scheduledDate && (
          <span className="text-[11px] font-semibold text-primary/70 bg-primary/8 rounded-md px-2">
            Due {formatScheduledDate(scheduledDate)}
          </span>
        )}
      </div>

      {completedAt && (
        <span className="text-xs text-on-surface-variant">Graded At {completedAt}</span>
      )}

      {lastScore !== null && (
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
          <>
            <button
              disabled
              className={`w-full rounded-xl border text-gray-400 border-outline/20 font-semibold ${lastScore !== null ? 'py-1.5 text-xs' : 'py-2.5 text-md font-medium'}`}
            >
              Pending Test
            </button>
            {lastScore !== null && onViewResults && (
              <button
                onClick={onViewResults}
                className="w-full py-1.5 rounded-xl border border-outline/30 text-xs font-semibold text-on-surface-variant hover:bg-slate-100 transition-colors"
              >
                View Results
              </button>
            )}
          </>
        )}
        {status === 'active' && (
          <>
            <button
              onClick={onAction}
              className={`w-full rounded-xl bg-primary text-white hover:opacity-90 transition-opacity font-medium ${lastScore !== null ? 'py-1.5 text-xs' : 'py-2.5 text-md'}`}
            >
              Start Online Test
            </button>
            {lastScore !== null && onViewResults && (
              <button
                onClick={onViewResults}
                className="w-full py-1.5 rounded-xl border border-outline/30 text-xs font-semibold text-on-surface-variant hover:bg-slate-100 transition-colors"
              >
                View Results
              </button>
            )}
          </>
        )}
        {status === 'grading' && (
          // 제출 완료 → 채점 대기 중. 클릭 시 제출 답안을 read-only로 확인할 수 있다.
          // 과거 기록이 있으면 탭 전환으로 접근 가능하므로 View Results 버튼은 표시하지 않는다.
          <button
            onClick={onAction}
            className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-md font-medium hover:bg-primary/5 transition-colors"
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
