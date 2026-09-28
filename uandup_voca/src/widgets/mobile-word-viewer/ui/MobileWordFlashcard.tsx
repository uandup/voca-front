import { useCallback, useEffect, useRef, useState } from 'react';
import type { MobileWordItem } from '../model/types';

interface Props {
  items: MobileWordItem[];
  bookmarkedIds?: Set<number>;
  onToggleBookmark?: (wordId: number) => void;
}

type FrontFace = 'word' | 'meaning';

// 데스크탑 WordFlashcard와 **같은 키**를 쓴다 — 같은 브라우저라면 "단어 먼저/뜻 먼저" 취향이
// 데스크탑과 모바일 사이에 이어진다.
const FRONT_FACE_KEY = 'flashcard:frontFace';

function loadFrontFace(): FrontFace {
  try {
    return localStorage.getItem(FRONT_FACE_KEY) === 'meaning' ? 'meaning' : 'word';
  } catch {
    return 'word';
  }
}

/**
 * 폰 전용 플래시카드.
 *
 * 데스크탑 widgets/word-flashcard를 고치지 않고 따로 만든 이유:
 * 원본은 이전/다음 버튼이 `xl:hidden absolute -left-22 / -right-22`로 **카드 바깥 88px**에
 * 붙어 있어 1280px 미만에서 보이면서 화면 밖으로 나간다. 거기에 height 320px 고정,
 * px-10/px-12 패딩, 키보드 핸들러, 5버튼 푸터까지 데스크탑 전제가 얽혀 있다.
 * 또 원본은 WordCardData 필드를 직접 읽어 개인 단어를 못 그린다 —
 * 이쪽은 MobileWordItem을 받아 세 소스를 하나로 처리한다.
 *
 * 원본에서 그대로 가져온 것: frontFace 저장 키, 뒤집기(preserve-3d + backface-visibility),
 * 진행바 pointer capture 스크럽.
 */
export function MobileWordFlashcard({ items, bookmarkedIds, onToggleBookmark }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // transition을 일시적으로 비활성화하는 플래그. 카드 전환 시 flip-back 애니메이션 없이 즉시 스냅.
  const [animated, setAnimated] = useState(true);
  const [frontFace, setFrontFace] = useState<FrontFace>(loadFrontFace);
  // 진행바 드래그(스크럽) 중 미리보기 인덱스. null이면 드래그 중 아님.
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  // items가 줄어들어 index가 범위를 벗어날 수 있으므로 렌더 시점에 clamp
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const item = items[safeIndex];
  const displayIndex = dragIndex ?? safeIndex;

  const navigateTo = useCallback((newIndex: number) => {
    setIndex(newIndex);
    setAnimated(false);
    setFlipped(false);
    // 두 프레임 후 transition 복원 (브라우저가 스냅 상태를 적용한 뒤)
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
  }, []);

  // 진행바 위 clientX 좌표를 단어 인덱스로 변환 (0 ~ total-1 균등 매핑)
  const indexFromClientX = useCallback(
    (clientX: number) => {
      const el = barRef.current;
      if (!el || total <= 1) return 0;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (total - 1));
    },
    [total],
  );

  function goPrev() {
    navigateTo(Math.max(0, safeIndex - 1));
  }
  function goNext() {
    navigateTo(Math.min(total - 1, safeIndex + 1));
  }

  function toggleFrontFace(face: FrontFace) {
    setFrontFace(face);
    try {
      localStorage.setItem(FRONT_FACE_KEY, face);
    } catch {
      // 저장 실패는 무시 — 이번 세션 동안만 적용된다.
    }
    setAnimated(false);
    setFlipped(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
  }

  // 진행바 드래그(스크럽) — pointer capture로 바 밖에서도 부드럽게 추적
  function handleBarPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragIndex(indexFromClientX(e.clientX));
  }
  function handleBarPointerMove(e: React.PointerEvent) {
    if (dragIndex === null) return;
    setDragIndex(indexFromClientX(e.clientX));
  }
  function handleBarPointerUp(e: React.PointerEvent) {
    if (dragIndex === null) return;
    navigateTo(indexFromClientX(e.clientX));
    setDragIndex(null);
  }

  // items가 갱신돼 목록이 짧아지면 index를 되돌린다.
  useEffect(() => {
    if (index > 0 && index >= total) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(Math.max(0, total - 1));
    }
  }, [index, total]);

  // 모든 hook 이후 — items가 빈 배열인 경우 방어 (부모에서 통상 막지만 안전망)
  if (!item) return null;

  function faceStyle(isBack: boolean): React.CSSProperties {
    return isBack
      ? { backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }
      : { backfaceVisibility: 'hidden' };
  }

  function WordPanel({ isBack }: { isBack: boolean }) {
    return (
      <div
        className="absolute inset-0 bg-white border border-outline-variant/40 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3 px-5 select-none"
        style={faceStyle(isBack)}
      >
        <h2 className="font-bold text-3xl text-primary text-center break-words">{item.word}</h2>
      </div>
    );
  }

  function MeaningPanel({ isBack }: { isBack: boolean }) {
    return (
      <div
        className="absolute inset-0 bg-white border border-outline-variant/40 rounded-2xl shadow-md flex flex-col justify-center gap-4 px-5 select-none overflow-y-auto py-6"
        style={faceStyle(isBack)}
      >
        <div>
          <p className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1.5">
            Meaning
          </p>
          <p className="text-primary font-bold text-xl leading-snug break-words">
            {item.korMeaning}
          </p>
          {/* 개인 단어는 영영뜻이 없다 — 값이 없으면 줄 자체를 그리지 않는다. */}
          {item.engMeaning && (
            <p className="text-on-surface-variant text-sm mt-1.5 leading-relaxed">
              {item.engMeaning}
            </p>
          )}
        </div>
        {item.synonyms && item.synonyms.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
              Synonyms
            </p>
            <div className="flex flex-wrap gap-2">
              {item.synonyms.map((syn) => (
                <span
                  key={syn}
                  className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-medium"
                >
                  {syn}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // frontFace 설정에 따라 앞/뒷면 할당
  const [FrontPanel, BackPanel] =
    frontFace === 'word' ? [WordPanel, MeaningPanel] : [MeaningPanel, WordPanel];

  const isBookmarked = bookmarkedIds?.has(item.id) ?? false;

  return (
    <div className="flex flex-col gap-4">
      {/* Word first / Meaning first + 진행 표시 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-0.5 bg-surface-container rounded-lg border border-outline-variant/30">
          <FaceToggle
            label="Word"
            active={frontFace === 'word'}
            onClick={() => toggleFrontFace('word')}
          />
          <FaceToggle
            label="Meaning"
            active={frontFace === 'meaning'}
            onClick={() => toggleFrontFace('meaning')}
          />
        </div>
        <span className="text-sm font-bold tabular-nums text-on-surface-variant">
          {displayIndex + 1}
          <span className="text-xs font-medium text-on-surface-variant/50"> / {total}</span>
        </span>
      </div>

      {/* 진행바 — 드래그해서 원하는 위치로 점프 */}
      <div
        ref={barRef}
        className="relative py-2 -my-2 touch-none select-none"
        onPointerDown={handleBarPointerDown}
        onPointerMove={handleBarPointerMove}
        onPointerUp={handleBarPointerUp}
        onPointerCancel={handleBarPointerUp}
      >
        <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${total <= 1 ? 100 : (displayIndex / (total - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 카드 — 탭하면 뒤집힌다. 높이는 뷰포트에 비례하되 위아래로 클램프. */}
      <div
        className="relative w-full cursor-pointer touch-manipulation"
        style={{ perspective: '1200px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`relative w-full ${animated ? 'transition-transform duration-300' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            height: 'clamp(240px, 46dvh, 420px)',
            willChange: 'transform',
          }}
        >
          <FrontPanel isBack={false} />
          <BackPanel isBack={true} />
        </div>

        {/* 북마크 버튼은 회전 컨테이너 밖에 둬야 카드를 뒤집어도 좌우로 따라 돌지 않고 우상단에 고정됨 */}
        {bookmarkedIds && onToggleBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item.id);
            }}
            className="absolute top-2 right-2 z-10 p-2 rounded-lg leading-none touch-manipulation"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <span
              className={`material-symbols-outlined ${isBookmarked ? 'text-amber-400' : 'text-outline/40'}`}
              style={{
                fontSize: '28px',
                fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              bookmark
            </span>
          </button>
        )}
      </div>

      {/* 이전/다음 — 데스크탑은 카드 바깥에 두지만 폰에서는 화면을 벗어나므로 카드 아래 한 줄로 둔다. */}
      <div className="flex items-center gap-3">
        <NavButton
          icon="arrow_back"
          label="Previous word"
          disabled={safeIndex === 0}
          onClick={goPrev}
        />
        <button
          onClick={() => setFlipped((f) => !f)}
          className="flex-1 min-h-12 flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white text-sm font-bold touch-manipulation"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            flip
          </span>
          Flip
        </button>
        <NavButton
          icon="arrow_forward"
          label="Next word"
          disabled={safeIndex >= total - 1}
          onClick={goNext}
        />
      </div>
    </div>
  );
}

function FaceToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors touch-manipulation ${
        active ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
      }`}
    >
      {label}
    </button>
  );
}

function NavButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="w-14 min-h-12 flex items-center justify-center rounded-xl bg-white border border-outline-variant/40 shadow-sm text-on-surface-variant disabled:opacity-30 touch-manipulation"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
        {icon}
      </span>
    </button>
  );
}
