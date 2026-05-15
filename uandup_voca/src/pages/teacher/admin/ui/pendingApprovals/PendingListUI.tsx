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
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={onReject}
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
  );
}
