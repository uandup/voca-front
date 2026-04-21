import type { TestStep } from '../types';

interface StepCardProps {
  step: TestStep;
  isSelected: boolean;
  onClick: () => void;
}

export default function StepCard({ step, isSelected, onClick }: StepCardProps) {
  const isPassed = step.status === 'passed';
  const isFail = step.status === 'fail';
  const isLocked = step.status === 'locked';

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative flex-1 min-w-0 h-full min-h-30 rounded-2xl p-4 flex flex-col gap-2 overflow-hidden transition-all text-left
        ${isSelected ? `ring-2 ring-inset ${isFail ? 'ring-error' : 'ring-primary'}` : ''}
        ${
          isFail
            ? 'bg-error/5 border border-error/20 cursor-pointer hover:border-error/40'
            : isLocked
              ? 'border border-outline/10 bg-slate-50/80'
              : 'border border-outline/20 bg-surface cursor-pointer hover:border-outline/40 hover:shadow-sm'
        }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={`text-sm font-bold leading-tight ${isLocked ? 'text-slate-400' : 'text-on-surface'}`}
        >
          {step.label}
        </span>
      </div>

      {step.date && (
        <span className={`text-xs ${isLocked ? 'text-slate-400' : 'text-on-surface-variant'}`}>
          {step.date}
        </span>
      )}

      {(isPassed || isFail) && step.scores && step.scores.length > 0 && (
        <span className={`text-sm font-bold ${isPassed ? 'text-primary' : 'text-error'}`}>
          {step.scores[step.scores.length - 1]} / {step.totalScore ?? 'N'}
        </span>
      )}

      {step.subLabel && (
        <span className={`text-xs font-medium ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
          {step.subLabel}
        </span>
      )}
    </button>
  );
}
