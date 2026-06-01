import { useState } from 'react';
import { ConfirmDialog } from '@/shared/ui/Modal';

export function PendingList<T>({
  empty,
  items,
  renderItem,
}: {
  empty: boolean;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <div className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] h-full">
      {empty ? <EmptyState /> : items.map(renderItem)}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-16">
      <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
      <p className="text-sm font-bold">All caught up!</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full text-on-surface-variant/50 py-16">
      <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
    </div>
  );
}

export function ApproveRejectButtons({
  onApprove,
  onReject,
}: {
  onApprove: () => void;
  onReject: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setConfirmOpen(true)}
          className="px-4 py-1.5 rounded-lg text-xs font-bold border border-outline-variant/30 text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={onApprove}
          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity"
        >
          Approve
        </button>
      </div>

      {/* Reject 확인 모달 — 실수로 누르는 것을 방지한다. */}
      {confirmOpen && (
        <ConfirmDialog
          title="Reject this member?"
          description="The member will be denied access and must re-apply to join."
          confirmLabel="Reject"
          variant="danger"
          onConfirm={onReject}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
