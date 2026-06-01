import type { ReactNode } from 'react';

interface TestHeaderProps {
  onExit?: () => void;
  // Submit 버튼은 onSubmit이 주어진 경우에만 표시 — 선생님 Preview에선 생략.
  onSubmit?: () => void;
  // 헤더 중앙 슬롯 — Attempt 탭, 경고 문구 등 호출처가 자유롭게 주입.
  center?: ReactNode;
}

export function TestHeader({ onExit, onSubmit, center }: TestHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-outline-variant/30 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            logout
          </span>
          Exit
        </button>
      </div>

      <div className="flex items-center gap-2">{center}</div>

      <div className="flex items-center gap-3">
        {onSubmit && (
          <button
            onClick={onSubmit}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              task_alt
            </span>
            Submit
          </button>
        )}
      </div>
    </header>
  );
}
