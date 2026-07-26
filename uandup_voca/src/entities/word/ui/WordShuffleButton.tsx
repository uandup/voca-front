interface Props {
  onShuffle: () => void;
}

// 단어 표시 순서를 섞는 액션 버튼. 토글이 아니라 누를 때마다 새로 섞는다.
// 스타일은 WordBookmarkFilterButton의 비활성 상태와 동일하게 맞춘다(툴바 일관성).
export function WordShuffleButton({ onShuffle }: Props) {
  return (
    <button
      onClick={onShuffle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-colors bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
        shuffle
      </span>
      Shuffle
    </button>
  );
}
