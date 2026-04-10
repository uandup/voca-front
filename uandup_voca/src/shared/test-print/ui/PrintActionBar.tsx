export interface ColumnToggle {
  key: string;
  label: string;
  visible: boolean;
}

interface PrintActionBarProps {
  onClose: () => void;
  onPrint: () => void;
  title?: string;
  page?: number;
  totalPages?: number;
  onPrev?: () => void;
  onNext?: () => void;
  columns?: ColumnToggle[];
  onColumnToggle?: (key: string) => void;
}

export function PrintActionBar({
  onClose,
  onPrint,
  title = 'Document Preview',
  page,
  totalPages,
  onPrev,
  onNext,
  columns,
  onColumnToggle,
}: PrintActionBarProps) {
  const hasPagination = totalPages !== undefined && totalPages > 1;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 bg-white border-b border-black/10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="bg-black/5 hover:bg-black/10 text-black p-2 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="font-headline font-bold text-lg">{title}</h2>
      </div>

      {columns && columns.length > 0 && (
        <div className="flex items-center gap-1 px-4 py-2 bg-black/5 rounded-lg">
          <span className="text-xs font-bold text-black/40 uppercase tracking-widest mr-2">
            표시
          </span>
          {columns.map((col) => (
            <label
              key={col.key}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer select-none transition-colors hover:bg-black/10"
            >
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => onColumnToggle?.(col.key)}
                className="w-3.5 h-3.5 accent-black cursor-pointer"
              />
              <span className="text-xs font-bold">{col.label}</span>
            </label>
          ))}
        </div>
      )}

      {hasPagination && (
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={page === 1}
            className="p-1 rounded hover:bg-black/5 disabled:opacity-30 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-sm font-bold tabular-nums">
            {page} / {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={page === totalPages}
            className="p-1 rounded hover:bg-black/5 disabled:opacity-30 transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-gray-100 transition-all font-bold text-sm"
      >
        <span className="material-symbols-outlined text-lg">print</span>
        Print
      </button>
    </div>
  );
}
