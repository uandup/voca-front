import { useCallback, useEffect, useRef, useState } from 'react';
import type { WordCardData } from '@/entities/word';

interface WordFlashcardProps {
  words: WordCardData[];
  bookmarkedIds?: Set<number>;
  onToggleBookmark?: (wordId: number) => void;
}

type FrontFace = 'word' | 'meaning';

const FRONT_FACE_KEY = 'flashcard:frontFace';

function loadFrontFace(): FrontFace {
  const stored = localStorage.getItem(FRONT_FACE_KEY);
  return stored === 'meaning' ? 'meaning' : 'word';
}

export function WordFlashcard({ words, bookmarkedIds, onToggleBookmark }: WordFlashcardProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // transition을 일시적으로 비활성화하는 플래그. 카드 전환 시 flip-back 애니메이션 없이 즉시 스냅.
  const [animated, setAnimated] = useState(true);
  const [frontFace, setFrontFace] = useState<FrontFace>(loadFrontFace);
  // 진행바 드래그(스크럽) 중 미리보기 인덱스. null이면 드래그 중 아님.
  // 드래그 중에는 상단 숫자/진행바만 갱신하고, 손을 뗄 때 실제 카드로 점프한다.
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const total = words.length;
  // words prop이 줄어들어 index가 범위를 벗어날 수 있으므로 렌더 시점에 clamp
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const word = words[safeIndex];
  // 드래그 중이면 미리보기 인덱스를, 아니면 실제 인덱스를 표시에 사용
  const displayIndex = dragIndex ?? safeIndex;

  // 키보드 이벤트 핸들러에서 최신 상태를 참조하기 위한 ref
  const stateRef = useRef({ index: safeIndex, flipped, total });
  useEffect(() => {
    stateRef.current = { index: safeIndex, flipped, total };
  });

  const navigateTo = useCallback((newIndex: number) => {
    if (stateRef.current.flipped) {
      setAnimated(false);
      setFlipped(false);
      setIndex(newIndex);
      // 두 프레임 후 transition 복원 (브라우저가 스냅 상태를 적용한 뒤)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    } else {
      setIndex(newIndex);
    }
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

  const goPrev = useCallback(() => {
    navigateTo(Math.max(0, stateRef.current.index - 1));
  }, [navigateTo]);

  const goNext = useCallback(() => {
    navigateTo(Math.min(stateRef.current.total - 1, stateRef.current.index + 1));
  }, [navigateTo]);

  function toggleFrontFace(face: FrontFace) {
    setFrontFace(face);
    localStorage.setItem(FRONT_FACE_KEY, face);
    // 설정 변경 시 현재 카드를 앞면으로 리셋
    setAnimated(false);
    setFlipped(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
  }

  // 진행바 드래그(스크럽) 핸들러 — pointer capture로 바 밖에서도 부드럽게 추적
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
    // 손을 떼는 순간 실제 카드로 점프하고 미리보기 종료
    navigateTo(indexFromClientX(e.clientX));
    setDragIndex(null);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // input/textarea 포커스 중에는 무시
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext]);

  // 모든 hook 이후 — words가 빈 배열인 경우 방어 (부모에서 통상 막지만 안전망)
  if (!word) return null;

  function faceStyle(isBack: boolean): React.CSSProperties {
    return isBack
      ? { backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }
      : { backfaceVisibility: 'hidden' };
  }

  function WordPanel({ isBack }: { isBack: boolean }) {
    return (
      <div
        className="absolute inset-0 bg-white border border-outline-variant/40 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3 px-10 select-none"
        style={faceStyle(isBack)}
      >
        <h2 className="font-bold text-4xl text-primary text-center">{word.word}</h2>
      </div>
    );
  }

  function MeaningPanel({ isBack }: { isBack: boolean }) {
    return (
      <div
        className="absolute inset-0 bg-white border border-outline-variant/40 rounded-2xl shadow-md flex flex-col justify-center gap-5 px-12 select-none"
        style={faceStyle(isBack)}
      >
        <div>
          <p className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1.5">
            Meaning
          </p>
          <p className="text-primary font-bold text-2xl leading-snug">{word.korMeaning}</p>
          <p className="text-on-surface-variant text-sm mt-1.5 leading-relaxed">
            {word.engMeaning}
          </p>
        </div>
        {word.synonyms.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold mb-2">
              Synonyms
            </p>
            <div className="flex flex-wrap gap-2">
              {word.synonyms.map((syn) => (
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

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress bar + front face toggle */}
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-end mb-1.5">
          <div className="flex flex-col gap-1">
            <div className="flex mb-3 items-center gap-1 p-0.5 bg-surface-container rounded-lg border border-outline-variant/30 w-fit">
              <button
                onClick={() => toggleFrontFace('word')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  frontFace === 'word'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Word first
              </button>
              <button
                onClick={() => toggleFrontFace('meaning')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  frontFace === 'meaning'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Meaning first
              </button>
            </div>
            <span
              className={`text-xs font-semibold tabular-nums ${
                dragIndex !== null ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {displayIndex + 1} / {total}
            </span>
          </div>

          <span className="text-xs text-on-surface-variant/60">
            Space to flip · ← → to navigate · drag bar to jump
          </span>
        </div>
        {/* 드래그 가능한 진행바(스크럽) — touch-none으로 터치 드래그 시 페이지 스크롤 방지 */}
        <div
          ref={barRef}
          onPointerDown={handleBarPointerDown}
          onPointerMove={handleBarPointerMove}
          onPointerUp={handleBarPointerUp}
          className="relative py-2 -my-2 cursor-pointer touch-none select-none"
        >
          <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className={`h-full bg-primary rounded-full ${
                dragIndex !== null ? '' : 'transition-all duration-300'
              }`}
              style={{ width: `${((displayIndex + 1) / total) * 100}%` }}
            />
          </div>
          {/* 드래그 중에만 나타나는 손잡이 — 진행바 끝(fill edge)에 위치 */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow transition-opacity ${
              dragIndex !== null ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ left: `${((displayIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      {/* 태블릿 전용 버튼을 카드 바깥에 배치 — 버튼 너비가 상단 progress 영역에 영향을 주지 않도록
          카드는 max-w-3xl 고정, 버튼은 카드 외부에서 absolute로 세로 중앙 정렬. */}
      <div className="w-full max-w-3xl relative">
        {/* 태블릿 전용 좌측 버튼 */}
        <button
          onClick={goPrev}
          disabled={safeIndex === 0}
          className="xl:hidden absolute top-0 bottom-0 -left-22 w-20 flex items-center justify-center rounded-xl bg-white border border-outline-variant/40 shadow-sm text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            arrow_back
          </span>
        </button>

        <div
          className="relative w-full cursor-pointer"
          style={{ perspective: '1200px' }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div
            className={`relative w-full ${animated ? 'transition-transform duration-300' : ''}`}
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              height: '320px',
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
                onToggleBookmark(word.id);
              }}
              className="absolute top-3 right-3 z-10 p-1 rounded-lg leading-none hover:bg-surface-container transition-colors"
              aria-label={bookmarkedIds.has(word.id) ? 'Remove bookmark' : 'Add bookmark'}
            >
              <span
                className={`material-symbols-outlined ${bookmarkedIds.has(word.id) ? 'text-amber-400' : 'text-outline/40 hover:text-outline'}`}
                style={{
                  fontSize: '30px',
                  fontVariationSettings: bookmarkedIds.has(word.id) ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                bookmark
              </span>
            </button>
          )}
        </div>

        {/* 태블릿 전용 우측 버튼 */}
        <button
          onClick={goNext}
          disabled={safeIndex === total - 1}
          className="xl:hidden absolute top-0 bottom-0 -right-22 w-20 flex items-center justify-center rounded-xl bg-white border border-outline-variant/40 shadow-sm text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            arrow_forward
          </span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateTo(0)}
          disabled={safeIndex === 0}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            first_page
          </span>
        </button>

        <button
          onClick={goPrev}
          disabled={safeIndex === 0}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_back
          </span>
        </button>

        <div className="flex items-baseline gap-1 px-4 py-1.5 bg-surface-container rounded-xl border border-outline-variant/30 tabular-nums">
          <span className="text-lg font-bold text-primary">{safeIndex + 1}</span>
          <span className="text-xs font-medium text-on-surface-variant/50">/ {total}</span>
        </div>

        <button
          onClick={goNext}
          disabled={safeIndex === total - 1}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_forward
          </span>
        </button>

        <button
          onClick={() => navigateTo(total - 1)}
          disabled={safeIndex === total - 1}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            last_page
          </span>
        </button>
      </div>
    </div>
  );
}
