interface SuccessModalProps {
  message: string;
  description?: string;
  onClose: () => void;
}

export function SuccessModal({ message, description, onClose }: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 min-w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
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
    </div>
  );
}
