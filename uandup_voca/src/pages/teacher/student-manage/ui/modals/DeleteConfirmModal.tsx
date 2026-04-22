import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import type { ManagedStudent } from '../../mock/studentManageMockData';

interface DeleteConfirmModalProps {
  student: ManagedStudent;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export function DeleteConfirmModal({ student, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-110 bg-white rounded-3xl premium-shadow overflow-hidden flex flex-col">
        {/* Modal Content */}
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-3 tracking-tight">
            Delete Student?
          </h2>
          <p className="text-on-surface-variant font-body leading-relaxed text-sm">
            This action will permanently remove{' '}
            <span className="font-bold text-on-surface">
              "{student.nameLastKo}
              {student.nameFirstKo}"
            </span>{' '}
            from the roster. This cannot be undone.
          </p>
        </div>

        {/* Deletion Context Block */}
        <div className="mx-8 mb-8 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <div className="flex flex-col gap-1 items-start text-left">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-label">
              Confirming Deletion for:
            </p>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg text-primary">
                {student.nameLastKo}
                {student.nameFirstKo}
              </span>
              <span className="text-sm text-on-surface-variant">
                {student.nameFirstEn} {student.nameLastEn}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={() => {
              onConfirm(student.id);
              onClose();
            }}
            className="w-full bg-error text-white px-6 py-4 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all text-base font-headline"
          >
            Delete Student
          </button>
          <button
            onClick={onClose}
            className="w-full bg-surface-container-high hover:bg-surface-dim text-on-surface font-bold px-6 py-4 rounded-2xl transition-all active:scale-[0.98] text-base font-headline"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
