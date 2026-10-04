import type { ReactNode, RefObject } from 'react';
import { Modal } from '@/shared/ui/Modal';

/**
 * 폰 폭(360px) 전용 모달 껍데기와 입력칸.
 *
 * 데스크탑 PersonalWordSetFormModal·PersonalWordEditModal을 반응형으로 고쳐 쓰지 않고 따로 둔다:
 * 그 둘은 좌우 패딩이 `px-10`(360px 중 80px)이고 제목이 `text-[28px]`이며, 세트 폼은
 * `max-h`와 스크롤이 아예 없어 키보드가 올라오면 저장 버튼에 손이 닿지 못한다.
 * 그걸 고치면 데스크탑 렌더가 함께 바뀌는데, 데스크탑 무영향이 이번 작업의 전제다.
 *
 * shared/ui가 아니라 이 폴더에 두는 이유: 지금 쓰는 곳이 같은 폴더의 두 모달뿐이다.
 * 세 번째 폰 폼이 생기면 그때 shared/ui로 올린다(그 전에 올리면 쓰지도 않는 코드의
 * blast radius가 전 코드베이스가 된다).
 */
export function MobileModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal onClose={onClose}>
      {/* max-h-[85vh] + overflow-y-auto — 키보드가 올라와 뷰포트가 절반이 되어도 버튼까지 스크롤된다.
          데스크탑 세트 폼에 없어서 폰에서 저장을 못 하던 바로 그 부분이다. */}
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl flex flex-col max-h-[85vh]">
        <div className="px-5 pt-3 pb-2 flex items-start justify-between gap-2 shrink-0">
          <h2 className="text-base font-bold text-on-surface leading-snug pt-2.5">{title}</h2>
          {/* 44px — 터치 타깃 최소치. 데스크탑 모달의 w-10 h-10(40px)보다 크다. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 w-11 h-11 flex items-center justify-center shrink-0 rounded-xl text-on-surface-variant touch-manipulation"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              close
            </span>
          </button>
        </div>

        <div className="px-5 pb-5 overflow-y-auto">{children}</div>
      </div>
    </Modal>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // 표시할 에러 문구. 빈 문자열이면 자리도 차지하지 않는다.
  error?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
  // 영단어 칸은 'none' — iOS가 첫 글자를 대문자로 바꾸면 매번 지워야 한다.
  autoCapitalize?: 'none' | 'sentences';
  onEnter?: () => void;
}

export function MobileTextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  inputRef,
  autoFocus,
  autoCapitalize = 'sentences',
  onEnter,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest block">
        {label}
      </label>
      {/* text-base = 16px. 이보다 작으면 iOS Safari가 입력칸을 탭할 때 화면을 확대하고,
          확대된 뷰포트는 사용자가 직접 되돌려야 한다. 폰 입력칸의 하한선이다.
          min-h-12(48px)는 터치 타깃. */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter();
        }}
        className={`w-full min-h-12 px-3.5 text-base bg-surface-container-low rounded-xl outline-none transition-all placeholder:text-on-surface-variant/35 ${
          error
            ? 'ring-2 ring-error/40 text-on-surface'
            : 'focus:ring-2 focus:ring-primary/25 text-on-surface'
        }`}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
