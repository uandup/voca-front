import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';

interface Props {
  onClose: () => void;
}

export function GradeBulkModal({ onClose }: Props) {
  const [delta, setDelta] = useState<-1 | 1 | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function handleApply() {
    setConfirmed(true);
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Grade Bulk Update</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Apply grade change to all students
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-7 py-6 flex flex-col gap-3">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Adjustment
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setDelta(-1);
                setConfirmed(false);
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                delta === -1
                  ? 'bg-error text-white border-error'
                  : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              -1 Grade Down
            </button>
            <button
              type="button"
              onClick={() => {
                setDelta(1);
                setConfirmed(false);
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                delta === 1
                  ? 'bg-primary text-on-primary border-primary'
                  : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              +1 Grade Up
            </button>
          </div>
        </div>

        <div className="px-7 py-4 border-t border-outline-variant/20 flex items-center justify-between shrink-0">
          {confirmed ? (
            <p className="text-xs font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Applied successfully
            </p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleApply}
            disabled={delta === null}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-sm disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
