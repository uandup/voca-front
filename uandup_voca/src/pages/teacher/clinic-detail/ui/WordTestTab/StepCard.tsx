import type { TestStep } from './types';

interface StepCardProps {
  step: TestStep;
  isLast: boolean;
}

export default function StepCard({ step, isLast }: StepCardProps) {
  const isDone = step.status === 'done';
  const isFail = step.status === 'fail';
  const isActive = step.status === 'active';
  const isLocked = step.status === 'locked';

  return (
    <div className="flex items-center flex-1 min-w-0">
      {/* 카드 */}
      <div
        className={`relative flex-1 min-w-0 rounded-2xl p-4 flex flex-col gap-2 overflow-hidden transition-all ${
          isFail
            ? 'bg-error/5 border border-error/20'
            : isActive
              ? 'border-2 border-primary bg-white shadow-lg shadow-primary/10'
              : isDone
                ? 'border border-outline/20 bg-surface'
                : 'border border-outline/10 bg-slate-50/80'
        }`}
      >
        {/* 불합격 왼쪽 세로 바 */}
        {isFail && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error rounded-l-2xl" />
        )}

        {/* 라벨 + 자물쇠 */}
        <div className="flex items-start justify-between gap-1">
          <span
            className={`text-sm font-bold leading-tight ${isLocked ? 'text-slate-400' : 'text-on-surface'}`}
          >
            {step.label}
          </span>
          {isLocked && (
            <span className="material-symbols-outlined text-slate-300 text-base shrink-0">
              lock
            </span>
          )}
        </div>

        {/* 날짜 */}
        {step.date && (
          <span className={`text-xs ${isLocked ? 'text-slate-400' : 'text-on-surface-variant'}`}>
            {step.date}
          </span>
        )}

        {/* TestType */}
        {step.testType && !isLocked && (
          <span className="text-[10px] text-on-surface-variant">{step.testType}</span>
        )}

        {/* 점수 */}
        {(isDone || isFail) && step.score && (
          <span className={`text-sm font-bold ${isDone && step.isPassed ? 'text-primary' : 'text-error'}`}>
            {step.score}
          </span>
        )}

        {/* subLabel (Pending / Unlocks in 4h 등) */}
        {step.subLabel && (
          <span
            className={`text-xs font-medium ${
              isActive ? 'text-primary font-semibold' : 'text-slate-400'
            }`}
          >
            {step.subLabel}
          </span>
        )}

        {/* 버튼 */}
        {isDone && (
          <button className="mt-1 w-full rounded-xl border border-outline/30 py-2 text-xs font-bold text-on-surface hover:bg-slate-100 transition-colors">
            Review Results
          </button>
        )}
        {isFail && (
          <button className="mt-1 w-full rounded-xl bg-error py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity">
            Re-generate
          </button>
        )}
        {isActive && (
          <button className="mt-1 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
            Start Now
          </button>
        )}
      </div>

      {/* 화살표 연결 */}
      {!isLast && (
        <span className="material-symbols-outlined text-slate-300 text-base shrink-0 mx-1">
          chevron_right
        </span>
      )}
    </div>
  );
}
