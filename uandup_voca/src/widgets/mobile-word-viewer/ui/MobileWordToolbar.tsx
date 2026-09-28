import { WordMaskButtons } from '@/entities/word';

export type MobileWordView = 'list' | 'cards';

interface Props {
  view: MobileWordView;
  onChangeView: (view: MobileWordView) => void;
  bookmarkFilterActive: boolean;
  bookmarkCount: number;
  onToggleBookmarkFilter: () => void;
  // 셔플 미지원 소스(개인 단어)는 넘기지 않는다 → 버튼이 사라진다.
  onShuffle?: () => void;
  // 플래시카드 미지원 소스(개인 단어)는 false → List/Cards 전환이 사라진다.
  showViewToggle?: boolean;
  hideWord: boolean;
  hideMeaning: boolean;
  onToggleHideWord: () => void;
  onToggleHideMeaning: () => void;
}

/**
 * 모바일 단어 화면 상단 툴바.
 *
 * entities/word의 WordBookmarkFilterButton·WordShuffleButton을 재사용하지 않고 아이콘 전용
 * 버튼을 여기 따로 둔다. 그 둘은 "Bookmarked" / "Shuffle" 글자를 포함해 폭을 많이 먹는데,
 * 폰(360px)에서는 List/Cards 전환까지 한 줄에 들어가지 않아 줄바꿈으로 깨진다.
 * 두 컴포넌트는 데스크탑 학생·선생님 화면이 공유하므로 거기에 모바일용 분기를 넣지 않는다.
 *
 * 글자가 없으므로 aria-label과 title로 의미를 남긴다.
 */
export function MobileWordToolbar({
  view,
  onChangeView,
  bookmarkFilterActive,
  bookmarkCount,
  onToggleBookmarkFilter,
  onShuffle,
  showViewToggle = true,
  hideWord,
  hideMeaning,
  onToggleHideWord,
  onToggleHideMeaning,
}: Props) {
  return (
    <div className="mb-4 space-y-3">
      {/* 아이콘만 쓰므로 한 줄에 확실히 들어간다 — flex-wrap 없이 고정 한 줄로 둔다. */}
      <div className="flex items-center gap-2">
        <IconToggle
          icon="bookmark"
          label={bookmarkFilterActive ? 'Show all words' : 'Show bookmarked words only'}
          active={bookmarkFilterActive}
          badge={bookmarkCount}
          onClick={onToggleBookmarkFilter}
        />
        {onShuffle && <IconToggle icon="shuffle" label="Shuffle order" onClick={onShuffle} />}

        {showViewToggle && (
          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/30 ml-auto">
            <ViewToggle
              icon="list"
              label="List view"
              active={view === 'list'}
              onClick={() => onChangeView('list')}
            />
            <ViewToggle
              icon="style"
              label="Flashcard view"
              active={view === 'cards'}
              onClick={() => onChangeView('cards')}
            />
          </div>
        )}
      </div>

      {/* 단어/뜻 가리기 — List 모드 전용. Flashcard는 자체 가리기(뒤집기)가 있어 중복이다.
          여기는 아이콘만 남기지 않는다: 두 토글이 같은 눈 아이콘이라 Word/Meaning 글자가 없으면
          어느 쪽을 가리는지 구분할 수 없다. 별도 줄이라 폭도 충분하다. */}
      {view === 'list' && (
        <WordMaskButtons
          hideWord={hideWord}
          hideMeaning={hideMeaning}
          onToggleWord={onToggleHideWord}
          onToggleMeaning={onToggleHideMeaning}
        />
      )}
    </div>
  );
}

// 44px 정사각 아이콘 버튼 (터치 타깃 최소치).
function IconToggle({
  icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  // 0이면 배지를 그리지 않는다.
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`relative w-11 h-11 flex items-center justify-center rounded-xl border transition-colors touch-manipulation ${
        active
          ? 'bg-amber-50 border-amber-300 text-amber-600'
          : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: '20px',
          fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {icon}
      </span>
      {badge !== undefined && badge > 0 && (
        // rounded-full이 이 프로젝트에선 12px이라 원형 배지는 값을 명시한다.
        <span
          className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 flex items-center justify-center rounded-[999px] text-[10px] font-bold tabular-nums ${
            active ? 'bg-amber-500 text-white' : 'bg-outline text-white'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function ViewToggle({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`w-10 h-9 flex items-center justify-center rounded-lg transition-colors touch-manipulation ${
        active ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
        {icon}
      </span>
    </button>
  );
}
