import { useState } from 'react';
import { ConfirmDialog } from '@/shared/ui/Modal/ConfirmDialog';
import { useCancelAssignment } from '../../model/useCancelAssignment';

// 잘못 배정한 단어 묶음을 통째로 취소하는 선생님 전용 액션.
// 채점 완료된 시험 기록까지 함께 삭제되고 되돌릴 수 없으므로 ConfirmDialog(danger)로 한 번 확인한다.
// 에러(400 STUDY_SET_CANNOT_CANCEL 등)는 queryClient의 전역 MutationCache.onError가
// 서버 메시지를 AlertDialog로 표시하므로 여기서 별도 처리하지 않는다.

interface Props {
  studySetId: number;
}

export function CancelAssignmentButton({ studySetId }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancel = useCancelAssignment(studySetId);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={cancel.isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline/30 text-xs font-semibold text-error hover:bg-error/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          cancel
        </span>
        {cancel.isPending ? 'Cancelling...' : 'Cancel Assignment'}
      </button>

      {isConfirmOpen && (
        <ConfirmDialog
          title="Cancel this assignment?"
          description="All exams in this assignment — including graded ones — will be deleted. These words go back to the assignment queue. This cannot be undone."
          confirmLabel="Cancel Assignment"
          cancelLabel="Keep"
          variant="danger"
          onConfirm={() => cancel.mutate()}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </>
  );
}
