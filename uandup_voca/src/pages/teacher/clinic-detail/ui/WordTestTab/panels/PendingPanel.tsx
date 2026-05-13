import { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { SuccessModal } from '@/shared/ui/SuccessModal';

// 시험이 아직 생성되지 않은 단계에서 렌더링된다.
// inferPhase가 'pending'을 반환하는 경우 — 구체적으로 step.status가
//   - 'pending'  : 아직 시험 생성 전
//   - 'locked'   : 이전 단계 미통과로 잠긴 상태
// 주된 액션: Generate Test (createExam 호출). 설정 편집 중일 때는 Apply 먼저 요구.
// 소유 모달: SuccessModal (생성 성공 시).

interface Props {
  isEditing: boolean;
  create: UseMutationResult<unknown, Error, void>;
}

export function PendingPanel({ isEditing, create }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);

  function handleGenerate() {
    create.mutate(undefined, {
      onSuccess: () => setShowSuccess(true),
    });
  }

  return (
    <>
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

      {showSuccess && (
        <SuccessModal
          message="Test Generated!"
          description="The test has been successfully created."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
