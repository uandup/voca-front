import { Modal } from './Modal';

interface ConfirmDialogProps {
  /** 모달 제목 */
  title: string;
  /** 제목 아래 보조 설명 (선택) */
  description?: string;
  /** 확인 버튼 레이블 (기본 "Confirm") */
  confirmLabel?: string;
  /** 취소 버튼 레이블 (기본 "Cancel") */
  cancelLabel?: string;
  /**
   * 확인 버튼 색상 변형.
   * - 'danger'  : error 색상 (삭제·거절 등 파괴적 액션)
   * - 'default' : primary 색상 (기본)
   */
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 범용 확인 다이얼로그.
 *
 * 사용 패턴:
 *   {isOpen && (
 *     <ConfirmDialog
 *       title="Reject Member?"
 *       description="This action cannot be undone."
 *       confirmLabel="Reject"
 *       variant="danger"
 *       onConfirm={handleReject}
 *       onCancel={() => setIsOpen(false)}
 *     />
 *   )}
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-error text-white hover:opacity-90'
      : 'bg-primary text-white hover:opacity-90';

  return (
    <Modal onClose={onCancel} closeOnBackdrop={true}>
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm px-6 py-5 flex flex-col gap-4">
        {/* 제목 + 설명 */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-on-surface">{title}</h2>
          {description && (
            <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
          )}
        </div>

        {/* 버튼 행 — 취소 왼쪽, 확인 오른쪽 */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel(); // 확인 후 자동으로 모달 닫기
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-opacity ${confirmBtnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
