import type { StepCardVM } from '@/entities/test';
import { ReviewStepChip, type ReviewStepSignal } from '@/entities/student';

interface StepCardProps {
  step: StepCardVM;
  // 복습 회차 신호(DUE NOW / OVERDUE / Opens at #N). 날짜 칩 자리를 대체한다.
  signal: ReviewStepSignal;
  isSelected: boolean;
  onClick: () => void;
}

export default function ClinicStepCard({ step, signal, isSelected, onClick }: StepCardProps) {
  const isPassed = step.status === 'passed';
  const isFail = step.status === 'fail';
  const isLocked = step.status === 'locked';
  const isSubmitted = step.status === 'submitted';
  const isSkipped = step.status === 'skipped';
  // ONLINE_STARTED(=teacher 'grading') 중 학생이 응시를 시작한 시험 — 진행 중이거나 제출 없이 나간 포기 상태.
  // (제출되면 status가 'submitted'로 바뀌므로 여기 안 걸린다.) 색·시각으로 "학생이 열었음"을 구분한다.
  const isAttempted = step.status === 'grading' && !!step.attemptStartedAt;

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative flex-1 min-w-0 h-full min-h-30 rounded-2xl p-4 flex flex-col gap-2 overflow-hidden transition-all text-left
        ${isSelected ? `ring-2 ring-inset ${isFail ? 'ring-error' : isSubmitted ? 'ring-amber-400' : isAttempted ? 'ring-sky-400' : 'ring-primary'}` : ''}
        ${
          isFail
            ? 'bg-error/5 border border-error/20 cursor-pointer hover:border-error/40'
            : isLocked
              ? 'border border-outline/10 bg-slate-50/80'
              : isSubmitted
                ? 'bg-amber-50 border border-amber-300 cursor-pointer hover:border-amber-400 hover:shadow-sm'
                : isAttempted
                  ? 'bg-sky-50 border border-sky-300 cursor-pointer hover:border-sky-400 hover:shadow-sm'
                  : isSkipped
                    ? 'border border-outline/20 bg-slate-50 cursor-pointer hover:border-outline/40 hover:shadow-sm'
                    : 'border border-outline/20 bg-surface cursor-pointer hover:border-outline/40 hover:shadow-sm'
        }`}
    >
      {/* 날짜 기반 시절의 "Due {날짜}" 칩 자리 — 이제 배정 회차 기준 신호가 들어간다. */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-sm font-bold leading-tight ${isLocked ? 'text-slate-400' : 'text-on-surface'}`}
        >
          {step.name}
        </span>
        <ReviewStepChip signal={signal} />
      </div>

      {/* Created On / Started On / Submitted On — 세 줄을 묶어 줄간격을 좁히고 글자를 살짝 줄여 카드 여백 확보.
          응시 시작·제출 일시는 값이 없으면 '-'로 표시해 항상 같은 줄 수를 유지한다(카드 높이 균일 → 비교 용이).
          Started On이 '-'면 학생이 아직 시험을 열지 않은 것. 값이 있는데 Submitted On이 '-'면
          응시 중이거나 제출 없이 나간 포기 상태. */}
      {step.createdAt && (
        <div
          className={`flex flex-col gap-0.5 text-[11px] leading-tight ${isLocked ? 'text-slate-400' : 'text-on-surface-variant'}`}
        >
          <span>Created On {step.createdAt}</span>
          <span>Started On {step.attemptStartedAt ?? '-'}</span>
          <span>Submitted On {step.submittedAt ?? '-'}</span>
        </div>
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

      {isSkipped && (
        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            redo
          </span>
          Skipped
        </span>
      )}
    </button>
  );
}
