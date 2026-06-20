interface Props {
  bookmarked: boolean;
  onToggle: () => void;
}

export function WordBookmarkButton({ bookmarked, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="p-1 rounded-lg leading-none hover:bg-surface-container transition-colors"
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <span
        className={`material-symbols-outlined ${bookmarked ? 'text-amber-400' : 'text-outline/40 hover:text-outline'}`}
        style={{
          fontSize: '30px',
          fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        bookmark
      </span>
    </button>
  );
}
