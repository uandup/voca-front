import { useState, useRef, useEffect } from 'react';

export interface ColumnToggleOption {
  key: string;
  label: string;
  // Name처럼 행 식별에 필수라 숨길 수 없는 컬럼은 토글 비활성으로 잠근다.
  locked?: boolean;
}

interface Props {
  options: ColumnToggleOption[];
  // 현재 보이는 컬럼 key 집합.
  visible: Set<string>;
  onToggle: (key: string) => void;
}

// 테이블 컬럼 표시 여부를 체크박스 목록으로 토글하는 드롭다운.
// 버튼 클릭으로 열고, 바깥 클릭 시 닫힌다.
export function ColumnToggleDropdown({ options, visible, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-on-surface-variant bg-surface-container-lowest border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-colors font-medium"
      >
        <span className="material-symbols-outlined text-lg">view_column</span>
        Columns
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-20 w-48 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg py-1.5">
          {options.map((opt) => {
            const checked = visible.has(opt.key);
            return (
              <label
                key={opt.key}
                className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                  opt.locked
                    ? 'text-on-surface-variant/50 cursor-not-allowed'
                    : 'text-on-surface hover:bg-surface-container-low cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={opt.locked}
                  onChange={() => onToggle(opt.key)}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
