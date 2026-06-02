import { useState } from 'react';
import type { WordCardData } from '@/entities/word';

interface WordFlashcardProps {
  words: WordCardData[];
}

export function WordFlashcard({ words }: WordFlashcardProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // transition을 일시적으로 비활성화하는 플래그. 카드 전환 시 flip-back 애니메이션 없이 즉시 스냅.
  const [animated, setAnimated] = useState(true);

  const word = words[index];
  const total = words.length;

  function navigateTo(newIndex: number) {
    if (flipped) {
      // transition 끄기 → 즉시 앞면으로 스냅 + 단어 교체
      setAnimated(false);
      setFlipped(false);
      setIndex(newIndex);
      // 두 프레임 후 transition 복원 (브라우저가 스냅 상태를 적용한 뒤)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    } else {
      setIndex(newIndex);
    }
  }

  function goPrev() {
    navigateTo(Math.max(0, index - 1));
  }

  function goNext() {
    navigateTo(Math.min(total - 1, index + 1));
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress bar */}
      <div className="w-full max-w-3xl">
        <div className="flex justify-between text-xs text-on-surface-variant mb-1.5">
          <span className="font-semibold">
            {index + 1} / {total}
          </span>
          <span className="text-on-surface-variant/60">Click card to flip</span>
        </div>
        <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-3xl cursor-pointer"
        style={{ perspective: '1200px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`relative w-full ${animated ? 'transition-transform duration-300' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            height: '320px',
          }}
        >
          {/* Front — word */}
          <div
            className="absolute inset-0 bg-white border border-outline-variant/40 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3 px-10 select-none"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h2 className="font-bold text-4xl text-primary text-center">{word.word}</h2>
          </div>

          {/* Back — meaning + synonyms */}
          <div
            className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-2xl shadow-md flex flex-col justify-center gap-5 px-12 select-none"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
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
        </div>
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
