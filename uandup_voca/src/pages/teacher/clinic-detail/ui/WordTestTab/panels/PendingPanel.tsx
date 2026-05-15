import type { UseMutationResult } from '@tanstack/react-query';

// 시험이 아직 생성되지 않은 단계에서 렌더링된다.
// inferPhase가 'pending'을 반환하는 경우 — 구체적으로 step.status가
//   - 'pending'  : 아직 시험 생성 전
//   - 'locked'   : 이전 단계 미통과로 잠긴 상태
// 주된 액션: Generate Test (createExam 호출). 설정 편집 중일 때는 Apply 먼저 요구.
// SuccessModal은 mutation 성공 직후 phase 전환으로 PendingPanel이 언마운트되어 모달이 사라지는 문제 때문에
// 상위(StepPanel)가 소유한다. 여기서는 onCreateSuccess 콜백으로만 알린다.

interface Props {
  isEditing: boolean;
  create: UseMutationResult<unknown, Error, void>;
  onCreateSuccess: () => void;
}

export function PendingPanel({ isEditing, create, onCreateSuccess }: Props) {
  function handleGenerate() {
    create.mutate(undefined, {
      onSuccess: () => onCreateSuccess(),
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isEditing || create.isPending}
        onClick={handleGenerate}
        className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {create.isPending ? 'Generating...' : 'Generate Test'}
      </button>
      {isEditing && (
        <p className="text-xs text-error">Please apply the configuration before generating.</p>
      )}
    </div>
  );
}
