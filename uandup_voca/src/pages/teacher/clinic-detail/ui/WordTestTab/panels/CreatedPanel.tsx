import type { StepCardVM } from '@/entities/test';

// 시험이 생성되었고 아직 채점이 완료되지 않은 단계에서 렌더링된다.
// inferPhase가 'created'를 반환하는 경우 — 구체적으로 step.status가
//   - 'active'   (서버 상태 READY)                  : 시험 생성 직후, 응시 전
//   - 'grading'  (서버 상태 ONLINE_STARTED | SUBMITTED) : 응시/제출 완료, 채점 대기
// 주된 액션: Start Online Test, Preview/Print, Grade Online/Offline, Cancel.

interface Props {
  step: StepCardVM;
  isStartPending: boolean;
  isCancelPending: boolean;
  onOpenPrint: () => void;
  onGradeOnline: () => void;
  onGradeOffline: () => void;
  onStartOnline: () => void;
  onCancel: () => void;
}

export function CreatedPanel({
  step,
  isStartPending,
  isCancelPending,
  onOpenPrint,
  onGradeOnline,
  onGradeOffline,
  onStartOnline,
  onCancel,
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
          <span>
            Score : {step.lastScore ?? '-'} / {step.maxScore ?? 'N'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onStartOnline}
            disabled={isStartPending}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-60"
          >
            {isStartPending ? 'Starting...' : 'Start Online Test'}
          </button>
          <button
            onClick={onOpenPrint}
            className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            Preview
          </button>
          <button
            onClick={onOpenPrint}
            className="p-2 rounded-xl border border-outline/30 text-on-surface-variant hover:bg-slate-100 transition-colors flex items-center"
            title="Print"
          >
            <span className="material-symbols-outlined leading-none" style={{ fontSize: '18px' }}>
              print
            </span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onGradeOnline}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade Online
          </button>
          <button
            onClick={onGradeOffline}
            className="px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Grade Offline
          </button>
          <button
            onClick={onCancel}
            disabled={isCancelPending}
            className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-60"
          >
            {isCancelPending ? 'Cancelling...' : 'Cancel Test'}
          </button>
        </div>
      </div>
    </>
  );
}
