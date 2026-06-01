import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  // 백드롭 클릭 시 닫힘 비활성 — 폼 모달이 사용자 입력을 잃지 않도록 보호할 때 false.
  closeOnBackdrop?: boolean;
  // 백드롭 padding. 모달이 거의 화면 전체를 차지할 때 p-2 등으로 조정.
  backdropPadding?: string;
}

// 백드롭 + 본문 스크롤 잠금 + 백드롭 클릭 닫힘을 묶은 표준 모달 셸.
//
// 동작 규약:
// - 백드롭 클릭으로 닫힘 (기본 활성). closeOnBackdrop=false로 차단 가능.
// - ESC 키로 닫히지 않음 (기존 동작 유지).
// - 마운트된 동안 document.body의 스크롤을 잠금 — 모달 내부 스크롤이 배경 페이지로 빠지지 않게 한다.
// - 부모는 `{isOpen && <Modal ...>...</Modal>}`처럼 조건부 렌더링한다.
//
// 컨테이너 박스(max-w/배경/radius)는 children이 직접 책임진다 — primitive는 백드롭만 제공.
// 단순 confirm/alert는 `ConfirmDialog`(이 폴더), 본문이 풍부한 모달은 children에서 박스를 그린다.
export function Modal({
  onClose,
  children,
  closeOnBackdrop = true,
  backdropPadding = 'p-4',
}: ModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 flex items-center justify-center ${backdropPadding}`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div className="contents" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
