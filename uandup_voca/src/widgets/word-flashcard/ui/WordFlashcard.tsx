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

  const word = words[index];
  const total = words.length;

  // 키보드 이벤트 핸들러에서 최신 상태를 참조하기 위한 ref
  const stateRef = useRef({ index, flipped, total });
  useEffect(() => {
    stateRef.current = { index, flipped, total };
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
            <span className="text-xs font-semibold text-on-surface-variant">
              {index + 1} / {total}
            </span>
          </div>

          <span className="text-xs text-on-surface-variant/60">
            Space to flip · ← → to navigate
          </span>
        </div>
        <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
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
          disabled={index === 0}
          className="xl:hidden absolute top-0 bottom-0 -left-22 w-20 flex items-center justify-center rounded-xl bg-white border border-outline-variant/40 shadow-sm text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            arrow_back
          </span>
        </button>

        <div
          className="w-full cursor-pointer"
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
        </div>

        {/* 태블릿 전용 우측 버튼 */}
        <button
          onClick={goNext}
          disabled={index === total - 1}
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
          disabled={index === 0}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            first_page
          </span>
        </button>

        <button
          onClick={goPrev}
          disabled={index === 0}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_back
          </span>
        </button>

        <div className="flex items-baseline gap-1 px-4 py-1.5 bg-surface-container rounded-xl border border-outline-variant/30 tabular-nums">
          <span className="text-lg font-bold text-primary">{index + 1}</span>
          <span className="text-xs font-medium text-on-surface-variant/50">/ {total}</span>
        </div>

        <button
          onClick={goNext}
          disabled={index === total - 1}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_forward
          </span>
        </button>

        <button
          onClick={() => navigateTo(total - 1)}
          disabled={index === total - 1}
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
