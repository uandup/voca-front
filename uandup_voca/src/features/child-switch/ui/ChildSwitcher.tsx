import { useState, useRef, useEffect } from 'react';
import { useChildSwitcher } from '../model/useChildSwitcher';

interface Props {
  // 사이드바 접힘 상태 — 접혔을 땐 아이콘만, 펼쳤을 땐 이름+드롭다운을 보인다.
  collapsed: boolean;
}

// 학부모가 열람할 자녀를 전환하는 사이드바 상단 드롭다운.
// 학부모가 아니거나 자녀 목록이 비어 있으면 아무것도 렌더하지 않는다.
export function ChildSwitcher({ collapsed }: Props) {
  const { children, activeChild, switchChild } = useChildSwitcher();
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

  // 학부모가 아니면 children이 빈 배열 — 이 경우 학생 본인 세션이므로 전환 UI를 숨긴다.
  if (children.length === 0) return null;

  // 접힌 사이드바에서는 라벨/드롭다운을 펼칠 공간이 없어 아이콘만 보인다.
  if (collapsed) {
    return (
      <div className="flex justify-center mb-2" title={activeChild?.name ?? 'Child'}>
        <span className="material-symbols-outlined text-slate-600">child_care</span>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-base shrink-0 text-slate-500">
            child_care
          </span>
          <span className="truncate font-medium">{activeChild?.name ?? 'Select child'}</span>
        </span>
        <span className="material-symbols-outlined text-base shrink-0 text-slate-400">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
          {children.map((child) => {
            const isActive = child.studentId === activeChild?.studentId;
            return (
              <button
                key={child.studentId}
                type="button"
                onClick={() => {
                  switchChild(child.studentId);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-blue-900 font-bold bg-slate-50'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">
                  {child.name}
                  <span className="text-xs font-medium text-slate-400 ml-1.5">G{child.grade}</span>
                </span>
                {isActive && (
                  <span className="material-symbols-outlined text-base shrink-0">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
