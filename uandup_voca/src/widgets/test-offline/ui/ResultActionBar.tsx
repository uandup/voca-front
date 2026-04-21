interface ResultActionBarProps {
  onClose: () => void;
  onEdit: () => void;
  isEditing: boolean;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function ResultActionBar({
  onClose,
  onEdit,
  isEditing,
  page,
  totalPages,
  onPrev,
  onNext,
}: ResultActionBarProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-10 flex items-center px-8 py-4 bg-white border-b border-black/10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 왼쪽 */}
      <button
        onClick={onClose}
        className="flex items-center bg-black/5 hover:bg-black/10 text-black p-2 rounded-full transition-colors"
      >
        <span className="material-symbols-outlined leading-none">close</span>
      </button>

      {/* 가운데 */}
      {totalPages > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={page === 1}
            className="flex items-center p-1 rounded hover:bg-black/5 disabled:opacity-30 transition-colors"
          >
            <span className="material-symbols-outlined leading-none">chevron_left</span>
          </button>
          <span className="text-sm font-bold tabular-nums">
            {page} / {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={page === totalPages}
            className="flex items-center p-1 rounded hover:bg-black/5 disabled:opacity-30 transition-colors"
          >
            <span className="material-symbols-outlined leading-none">chevron_right</span>
          </button>
        </div>
      )}

      {/* 오른쪽 */}
      <div className="ml-auto">
        <button
          onClick={onEdit}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-colors ${
            isEditing
              ? 'bg-primary text-white hover:opacity-90'
              : 'border border-outline/30 text-on-surface-variant hover:bg-black/5'
          }`}
        >
          <span className="material-symbols-outlined leading-none text-lg">
            {isEditing ? 'check' : 'edit'}
          </span>
          {isEditing ? 'Apply' : 'Edit'}
        </button>
      </div>
    </div>
  );
}
