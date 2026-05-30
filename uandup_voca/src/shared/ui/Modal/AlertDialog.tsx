import { Modal } from './Modal';

type AlertVariant = 'success' | 'error' | 'info' | 'warning';

interface AlertDialogProps {
  /** 상태 변형 — 아이콘 색상과 아이콘 종류가 달라진다. */
  variant?: AlertVariant;
  /** 모달 제목 */
  title: string;
  /** 제목 아래 보조 설명 (선택) */
  description?: string;
  /** OK 버튼 레이블 (기본 "OK") */
  okLabel?: string;
  onClose: () => void;
}

const VARIANT_CONFIG: Record<AlertVariant, { icon: string; iconColor: string; bgColor: string }> = {
  success: {
    icon: 'check_circle',
    iconColor: 'text-[color:var(--color-success,#22c55e)]',
    bgColor: 'bg-[color:var(--color-success,#22c55e)]/10',
  },
  error: {
    icon: 'cancel',
    iconColor: 'text-error',
    bgColor: 'bg-error/10',
  },
  info: {
    icon: 'info',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  warning: {
    icon: 'warning',
    iconColor: 'text-[color:var(--color-warning,#f59e0b)]',
    bgColor: 'bg-[color:var(--color-warning,#f59e0b)]/10',
  },
};

/**
 * 행위 완료/결과를 사용자에게 알려주는 알림 다이얼로그.
 * OK 버튼으로만 닫힌다 (백드롭 클릭 비활성).
 *
 * 사용 패턴:
 *   {isOpen && (
 *     <AlertDialog
 *       variant="success"
 *       title="Member Approved"
 *       description="The member now has full access."
 *       onClose={() => setIsOpen(false)}
 *     />
 *   )}
 */
export function AlertDialog({
  variant = 'info',
  title,
  description,
  okLabel = 'OK',
  onClose,
}: AlertDialogProps) {
  const { icon, iconColor, bgColor } = VARIANT_CONFIG[variant];

  return (
    // 결과 안내 모달 — 실수로 백드롭 클릭해서 닫히지 않도록 closeOnBackdrop=false.
    <Modal onClose={onClose} closeOnBackdrop={false}>
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm px-6 py-6 flex flex-col items-center gap-4 text-center">
        {/* 상태 아이콘 */}
        <div className={`rounded-full p-3 ${bgColor}`}>
          <span
            className={`material-symbols-outlined ${iconColor}`}
            style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>

        {/* 제목 + 설명 */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-on-surface">{title}</h2>
          {description && (
            <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
          )}
        </div>

        {/* OK 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity"
        >
          {okLabel}
        </button>
      </div>
    </Modal>
  );
}
