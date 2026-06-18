interface Props {
  active: boolean;
  count: number;
  onToggle: () => void;
}

export function WordBookmarkFilterButton({ active, count, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-colors ${
        active
          ? 'bg-amber-50 border-amber-300 text-amber-600'
          : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: '16px',
          fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        bookmark
      </span>
      Bookmarked
      {count > 0 && (
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
            active
              ? 'bg-amber-200 text-amber-700'
              : 'bg-surface-container-highest text-on-surface-variant'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
