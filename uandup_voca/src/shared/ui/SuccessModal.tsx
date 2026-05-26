import { Modal } from './Modal';

interface SuccessModalProps {
  message: string;
  description?: string;
  onClose: () => void;
}

// 단순 성공 알림 모달 — 큰 체크 아이콘 + 메시지 + Confirm 버튼.
// ConfirmDialog와 시각 톤이 달라서 별도 컴포넌트로 유지한다 (큰 primary 아이콘 + 단일 버튼 alert 패턴).
export function SuccessModal({ message, description, onClose }: SuccessModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 min-w-70">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>
          check_circle
        </span>
        <p className="text-base font-bold text-on-surface">{message}</p>
        {description && (
          <p className="text-xs text-on-surface-variant text-center">{description}</p>
        )}
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
