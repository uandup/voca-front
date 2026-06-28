import { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { ConfirmDialog } from '@/shared/ui/Modal/ConfirmDialog';

// 선생님이 시험 없이 현재 단계를 스킵하는 보조 액션 버튼.
// 확정적 액션이므로 ConfirmDialog로 한 번 확인한 뒤 호출한다.
// 에러(예: STUDY_STAGE_HAS_ACTIVE_EXAM)는 queryClient의 전역 MutationCache.onError가
// 서버 메시지를 AlertDialog로 표시하므로 여기서 별도 처리하지 않는다.

interface Props {
  // useExamActions에서 내려오는 skip mutation. examType은 이미 mutation에 바인딩되어 있다.
  skip: UseMutationResult<unknown, Error, void>;
}

export function SkipStepButton({ skip }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={skip.isPending}
        className="px-4 py-2 rounded-xl border border-outline/30 text-xs font-bold text-on-surface-variant hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {skip.isPending ? 'Skipping...' : 'Skip step'}
      </button>

      {isConfirmOpen && (
        <ConfirmDialog
          title="Skip this step?"
          description="This unlocks the next step without a test. This cannot be undone."
          confirmLabel="Skip"
          onConfirm={() => skip.mutate()}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </>
  );
}
