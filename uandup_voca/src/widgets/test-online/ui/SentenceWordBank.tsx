import { useState, useCallback, useEffect } from 'react';

interface WordBankItem {
  id: number;
  word: string;
}

interface SentenceWordBankProps {
  items: WordBankItem[];
}

export function SentenceWordBank({ items }: SentenceWordBankProps) {
  // items 로드 후 1회 셔플 — Math.random은 비순수 함수라 useEffect 안에서 실행.
  const [shuffled, setShuffled] = useState<WordBankItem[]>([]);

  useEffect(() => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffled(arr);
  }, [items]);

  // 클릭으로 토글되는 dim 상태 — 학생이 사용한 단어를 직접 표시하는 용도.
  const [dimmedIds, setDimmedIds] = useState<Set<number>>(new Set());

  const toggleDim = useCallback((id: number) => {
    setDimmedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="sticky top-14 xl:top-16 z-5 bg-white border border-outline-variant/30 rounded-2xl p-3 shadow-sm">
      <p className="text-[10px] text-on-surface-variant/80 mb-1.5 ml-1">
        Click a word to mark it as used.
      </p>
      <div className="flex flex-wrap gap-2.5">
        {shuffled.map((item: WordBankItem) => {
          const dimmed = dimmedIds.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleDim(item.id)}
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs border select-none ${
                dimmed
                  ? 'border-outline-variant/20 bg-surface-container-low/40 text-on-surface-variant/40 line-through'
                  : 'border-outline-variant/50 bg-surface-container-low text-on-surface hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {item.word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
