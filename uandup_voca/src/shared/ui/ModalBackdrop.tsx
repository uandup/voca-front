interface ModalBackdropProps {
  onClose: () => void;
  children: React.ReactNode;
  padding?: string;
}

export function ModalBackdrop({ onClose, children, padding = 'p-4' }: ModalBackdropProps) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center ${padding}`}
      onClick={onClose}
    >
      <div className="contents" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
