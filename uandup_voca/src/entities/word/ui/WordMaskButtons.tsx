interface Props {
  hideWord: boolean;
  hideMeaning: boolean;
  onToggleWord: () => void;
  onToggleMeaning: () => void;
}

// 단어장 리스트에서 단어/뜻을 가리는 토글 2개.
// 상단 툴바가 아니라 목록 바로 위에 별도 줄로 둔다 — 툴바엔 이미 북마크·셔플·List/Flashcard가 있어
// 좁은 화면에서 줄이 넘친다. 컨테이너 스타일은 WordFlashcard의 "Word first / Meaning first" 토글과 맞춘다.
//
// 두 토글은 독립이다(배타 아님) — 세그먼트처럼 보이되 각각 켜고 끌 수 있다.
export function WordMaskButtons({ hideWord, hideMeaning, onToggleWord, onToggleMeaning }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* "Hide"가 아니라 "Hide mode" — 지금 가리는 동작이 아니라
          "가려두고 눌러서 확인하는 상태"로 전환하는 설정이기 때문. */}
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        Hide mode
      </span>
      <div className="flex items-center gap-1 p-0.5 bg-surface-container rounded-lg border border-outline-variant/30">
        <MaskToggle label="Word" active={hideWord} onToggle={onToggleWord} />
        <MaskToggle label="Meaning" active={hideMeaning} onToggle={onToggleMeaning} />
      </div>
    </div>
  );
}

function MaskToggle({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
        active ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '14px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
      >
        {active ? 'visibility_off' : 'visibility'}
      </span>
      {label}
    </button>
  );
}
