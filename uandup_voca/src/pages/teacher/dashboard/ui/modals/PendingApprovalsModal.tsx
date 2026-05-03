import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { MOCK_PENDING_APPROVALS } from '@/entities/member';

interface PendingApprovalsModalProps {
  onClose: () => void;
}

export function PendingApprovalsModal({ onClose }: PendingApprovalsModalProps) {
  const [decided, setDecided] = useState<Record<number, 'approved' | 'rejected'>>({});

  const pending = MOCK_PENDING_APPROVALS.filter((s) => !decided[s.id]);

  function handleApprove(id: number) {
    setDecided((prev) => ({ ...prev, [id]: 'approved' }));
  }

  function handleReject(id: number) {
    setDecided((prev) => ({ ...prev, [id]: 'rejected' }));
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Pending Approvals</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {pending.length} student{pending.length !== 1 ? 's' : ''} waiting for approval
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* List — 5명 높이 고정 스크롤 (행 높이 72px × 5) */}
        <div
          className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40"
          style={{ height: '360px' }}
        >
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant/50">
              <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
              <p className="text-sm font-bold">All caught up!</p>
            </div>
          ) : (
            pending.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between px-7 py-4"
                style={{ minHeight: '72px' }}
              >
                <div>
                  <p className="font-headline font-bold text-sm text-on-surface">
                    {student.nameKo}
                    <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                      ( {student.name} · G{student.grade} )
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(student.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold border border-outline-variant/30 text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(student.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}
