import { useMemo, useState, useCallback } from 'react';

interface WordBankItem {
  id: number;
  word: string;
}

interface SentenceWordBankProps {
  items: WordBankItem[];
}

export function SentenceWordBank({ items }: SentenceWordBankProps) {
  // 알파벳 순 정렬 — 문제 순서와 무관하게 단어를 찾기 쉽게.
  const sorted = useMemo(() => [...items].sort((a, b) => a.word.localeCompare(b.word)), [items]);

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
    <div className="sticky top-14 xl:top-16 z-5 bg-white border border-outline-variant/30 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-wrap gap-2.5">
        {sorted.map((item) => {
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
