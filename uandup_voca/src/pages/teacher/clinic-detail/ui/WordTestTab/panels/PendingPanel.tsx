// 시험이 아직 생성되지 않은 단계에서 렌더링된다.
// inferPhase가 'pending'을 반환하는 경우 — 구체적으로 step.status가
//   - 'pending'  : 아직 시험 생성 전
//   - 'locked'   : 이전 단계 미통과로 잠긴 상태
// 주된 액션: Generate Test (createExam 호출). 설정 편집 중일 때는 Apply 먼저 요구.

interface Props {
  isEditing: boolean;
  isPending: boolean;
  onGenerate: () => void;
}

export function PendingPanel({ isEditing, isPending, onGenerate }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isEditing || isPending}
        onClick={onGenerate}
        className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? 'Generating...' : 'Generate Test'}
      </button>
      {isEditing && (
        <p className="text-xs text-error">Please apply the configuration before generating.</p>
      )}
    </div>
  );
}
