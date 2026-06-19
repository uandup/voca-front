import type { StepCardVM } from '@/entities/test';

// 'YYYY-MM-DD' → 'May 30'
function formatScheduledDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface StepCardProps {
  step: StepCardVM;
  isSelected: boolean;
  onClick: () => void;
}

export default function ClinicStepCard({ step, isSelected, onClick }: StepCardProps) {
  const isPassed = step.status === 'passed';
  const isFail = step.status === 'fail';
  const isLocked = step.status === 'locked';
  const isSubmitted = step.status === 'submitted';

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative flex-1 min-w-0 h-full min-h-30 rounded-2xl p-4 flex flex-col gap-2 overflow-hidden transition-all text-left
        ${isSelected ? `ring-2 ring-inset ${isFail ? 'ring-error' : isSubmitted ? 'ring-amber-400' : 'ring-primary'}` : ''}
        ${
          isFail
            ? 'bg-error/5 border border-error/20 cursor-pointer hover:border-error/40'
            : isLocked
              ? 'border border-outline/10 bg-slate-50/80'
              : isSubmitted
                ? 'bg-amber-50 border border-amber-300 cursor-pointer hover:border-amber-400 hover:shadow-sm'
                : 'border border-outline/20 bg-surface cursor-pointer hover:border-outline/40 hover:shadow-sm'
        }`}
    >
      {/* Review 시험의 복습 예정일 — scheduledDate가 있을 때 name 오른쪽에 표시 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-sm font-bold leading-tight ${isLocked ? 'text-slate-400' : 'text-on-surface'}`}
        >
          {step.name}
        </span>
        {step.scheduledDate && (
          <span className="text-[11px] font-semibold text-primary/70 bg-primary/8 rounded-md px-2 py-0.5">
            Due {formatScheduledDate(step.scheduledDate)}
          </span>
        )}
      </div>

      {step.createdAt && (
        <span className={`text-xs ${isLocked ? 'text-slate-400' : 'text-on-surface-variant'}`}>
          Created At {step.createdAt}
        </span>
      )}

      {step.lastScore !== null && (
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className={`text-sm font-bold ${isPassed ? 'text-primary' : 'text-error'}`}>
            {step.lastScore} / {step.maxScore ?? 'N'}
          </span>
          {step.retakeCount > 0 && (
            <span className="text-xs font-bold text-error/70">( +{step.retakeCount} retake )</span>
          )}
        </div>
      )}

      {step.status === 'locked' && (
        <span className={`text-xs font-medium ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
          Locked
        </span>
      )}
    </button>
  );
}
