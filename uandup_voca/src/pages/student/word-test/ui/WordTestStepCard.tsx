import type { StepCardVM, StepStatus } from '@/entities/test';
import { ReviewStepChip, type ReviewStepSignal } from '@/entities/student';

interface StepCardProps {
  step: StepCardVM;
  // 복습 회차 신호(DUE NOW / OVERDUE / Opens at #N). 날짜 칩 자리를 대체한다.
  signal: ReviewStepSignal;
  // status별 단일 액션 버튼(active=Start Online Test, passed/fail=View Results)에서 호출.
  // examId가 없는 단계(locked/pending)는 호출되지 않는다.
  onAction?: () => void;
  // pending/active/grading 상태에서 이전 fail 기록을 탭 뷰로 보여주는 버튼에서 호출.
  onViewResults?: () => void;
}

const containerClass: Record<StepStatus, string> = {
  locked: 'border border-primary/30 bg-primary/5',
  pending: 'border border-primary/30 bg-primary/5',
  active: 'border border-primary/30 bg-primary/5',
  // 이미 응시함(재응시 불가) — 중립색, 학생 액션 없음.
  attempted: 'border border-outline/20 bg-slate-50',
  grading: 'border border-primary/30 bg-primary/5',
  // 학생 side에서 SUBMITTED는 toStudentStepCardVM에 의해 'grading'으로 매핑되어 이 케이스에 도달하지 않음
  submitted: 'border border-primary/30 bg-primary/5',
  fail: 'border border-error/20 bg-error/5',
  passed: 'border border-success/30 bg-success/5',
  // 선생님이 시험 없이 스킵한 단계 — 중립색, 학생 액션 없음.
  skipped: 'border border-outline/20 bg-slate-50',
};

export default function WordTestStepCard({
  step,
  signal,
  onAction,
  onViewResults,
}: StepCardProps) {
  const { status, name, lastScore, maxScore: totalScore, completedAt, retakeCount } = step;

  return (
    <div
      className={`flex-1 min-w-0 h-36 xl:h-44 rounded-2xl p-3 xl:p-4 flex flex-col gap-1.5 xl:gap-2 ${containerClass[status]}`}
    >
      <div className="flex items-center gap-1 xl:gap-2 flex-wrap">
        {/* 날짜 기반 시절의 "Due {날짜}" 칩 자리 — 이제 배정 회차 기준 신호가 들어간다. */}
        <span className="text-xs xl:text-sm font-bold leading-tight text-on-surface">{name}</span>
        <ReviewStepChip signal={signal} compact />
      </div>

      {completedAt && (
        <span className="text-[11px] xl:text-xs text-on-surface-variant">Grade: {completedAt}</span>
      )}

      {lastScore !== null && (
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xs xl:text-sm font-bold ${status === 'passed' ? 'text-success' : 'text-error'}`}
          >
            {lastScore} / {totalScore ?? 'N'}
          </span>
          {retakeCount > 0 && (
            <span className="text-[10px] xl:text-[12px] font-semibold text-error">
              ( +{retakeCount} retake{retakeCount > 1 ? 's' : ''} )
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-1.5 xl:gap-2">
        {status === 'locked' && (
          <button
            disabled
            className="w-full py-1.5 xl:py-2.5 rounded-xl border border-outline/20 text-xs xl:text-base font-medium"
          >
            Locked
          </button>
        )}
        {status === 'pending' && (
          <>
            <button
              disabled
              className={`w-full rounded-xl border text-gray-400 border-outline/20 font-medium text-xs ${lastScore !== null ? 'py-1 xl:py-1.5' : 'xl:text-base py-1.5 xl:py-2.5'}`}
            >
              Pending Test
            </button>
            {lastScore !== null && onViewResults && (
              <button
                onClick={onViewResults}
                className="w-full py-1 xl:py-1.5 rounded-xl border border-outline/30 text-xs font-medium text-on-surface-variant hover:bg-slate-100 transition-colors"
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
              className={`w-full rounded-xl bg-primary text-white hover:opacity-90 transition-opacity font-medium text-xs ${lastScore !== null ? 'py-1 xl:py-1.5' : 'xl:text-base py-1.5 xl:py-2.5'}`}
            >
              Start Online Test
            </button>
            {lastScore !== null && onViewResults && (
              <button
                onClick={onViewResults}
                className="w-full py-1 xl:py-1.5 rounded-xl border border-outline/30 text-xs font-medium text-on-surface-variant hover:bg-slate-100 transition-colors"
              >
                View Results
              </button>
            )}
          </>
        )}
        {status === 'attempted' && (
          // 이미 응시(또는 응시 후 포기)한 시험 — 재응시 불가. 비활성 표시.
          <button
            disabled
            className="w-full py-1.5 xl:py-2.5 rounded-xl border border-outline/20 text-gray-400 text-xs xl:text-base font-medium"
          >
            Attempted
          </button>
        )}
        {status === 'grading' && (
          // 제출 완료 → 채점 대기 중. 클릭 시 제출 답안을 read-only로 확인할 수 있다.
          // 과거 기록이 있으면 탭 전환으로 접근 가능하므로 View Results 버튼은 표시하지 않는다.
          <button
            onClick={onAction}
            className="w-full py-1.5 xl:py-2.5 rounded-xl border border-primary/30 text-primary text-xs xl:text-base font-medium hover:bg-primary/5 transition-colors"
          >
            Awaiting Grading
          </button>
        )}
        {status === 'passed' && (
          <button
            onClick={onAction}
            className="w-full py-1.5 xl:py-2.5 rounded-xl border border-outline/30 text-xs xl:text-base text-on-surface-variant hover:bg-slate-100 transition-colors font-medium"
          >
            View Results
          </button>
        )}
        {status === 'skipped' && (
          <button
            disabled
            className="w-full py-1.5 xl:py-2.5 rounded-xl border border-outline/20 text-gray-400 text-xs xl:text-base font-medium"
          >
            Skipped
          </button>
        )}
        {status === 'fail' && (
          <>
            <button
              disabled
              className="w-full py-1 xl:py-1.5 rounded-xl border text-gray-400 border-outline/20 text-xs font-medium"
            >
              Pending Re-Test
            </button>
            <button
              onClick={onAction}
              className="w-full py-1 xl:py-1.5 rounded-xl border border-outline/30 text-xs font-medium text-on-surface-variant hover:bg-slate-100 transition-colors"
            >
              View Results
            </button>
          </>
        )}
      </div>
    </div>
  );
}
