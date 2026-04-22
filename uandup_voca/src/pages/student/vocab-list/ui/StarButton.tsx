interface StarButtonProps {
  wordId: number;
  starred: boolean;
}

export function StarButton({ wordId, starred }: StarButtonProps) {
  const handleClick = () => {
    // TODO: 찜/찜취소 API 호출 (wordId)
    console.log(starred ? 'unstar' : 'star', wordId);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
        starred
          ? 'bg-surface-container-low text-on-tertiary-container'
          : 'bg-surface-container-low text-outline-variant hover:text-on-tertiary-container'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={starred ? { fontVariationSettings: '"FILL" 1' } : undefined}
      >
        star
      </span>
    </button>
  );
}
