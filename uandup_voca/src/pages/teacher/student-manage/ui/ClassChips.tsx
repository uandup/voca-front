import { useRef, useLayoutEffect, useState } from 'react';

interface ClassChipsProps {
  classes: string[];
  onRemove: (name: string) => void;
}

export function ClassChips({ classes, onRemove }: ClassChipsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // null = 아직 측정 전 (전체 렌더), number = 측정 완료
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  useLayoutEffect(() => {
    setVisibleCount(null); // classes 바뀌면 전체 렌더로 리셋
  }, [classes]);

  useLayoutEffect(() => {
    if (visibleCount !== null) return; // 이미 측정됨
    const container = containerRef.current;
    if (!container) return;

    const chips = Array.from(container.querySelectorAll<HTMLElement>('[data-chip]'));
    if (chips.length === 0) {
      setVisibleCount(0);
      return;
    }

    const firstTop = chips[0].getBoundingClientRect().top;
    let count = 0;
    for (const chip of chips) {
      if (chip.getBoundingClientRect().top > firstTop + 2) break;
      count++;
    }
    setVisibleCount(count);
  });

  // 측정 전: 전체 렌더 (보이지 않게)
  if (visibleCount === null) {
    return (
      <div
        ref={containerRef}
        className="flex flex-wrap gap-1.5"
        style={{ visibility: 'hidden', pointerEvents: 'none' }}
      >
        {classes.map((c) => (
          <span
            key={c}
            data-chip
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold whitespace-nowrap shrink-0"
          >
            {c}
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
              close
            </span>
          </span>
        ))}
      </div>
    );
  }

  const visible = classes.slice(0, visibleCount);
  const hidden = classes.length - visibleCount;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold whitespace-nowrap shrink-0"
        >
          {c}
          <button
            type="button"
            onClick={() => onRemove(c)}
            className="hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
              close
            </span>
          </button>
        </span>
      ))}
      {hidden > 0 && (
        <span className="inline-flex items-center px-2.5 py-1 bg-surface-container border border-outline-variant/30 rounded-full text-xs font-bold text-on-surface-variant shrink-0">
          +{hidden}
        </span>
      )}
    </div>
  );
}
