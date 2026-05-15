import { useState } from 'react';
import { usePendingParents } from '../../model/hooks/usePendingApprovals';
import { EmptyState, ApproveRejectButtons } from './PendingListUI';
import { StudentMatchPanel } from './StudentMatchPanel';

export function ParentTab() {
  const { list, isLoading, approve, reject } = usePendingParents();
  const [matchingId, setMatchingId] = useState<number | null>(null);

  const matchingParent = list.find((p) => p.id === matchingId) ?? null;

  if (isLoading) return null;

  return (
    <div className="relative flex h-full">
      <div
        className={`flex-1 overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] transition-all ${matchingId !== null ? 'opacity-40 pointer-events-none' : ''}`}
      >
        {list.length === 0 ? (
          <EmptyState />
        ) : (
          list.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-7 py-4 min-h-19 gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-on-surface">
                  {p.name}
                  <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                    ( {p.phoneNumber} )
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-on-surface-variant">
                    Child: {p.requestedChildName} (G{p.requestedChildGrade})
                  </span>
                  <button
                    type="button"
                    onClick={() => setMatchingId(p.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                      person_search
                    </span>
                    Match Student
                  </button>
                </div>
              </div>
              <ApproveRejectButtons onApprove={() => approve(p.id)} onReject={() => reject(p.id)} />
            </div>
          ))
        )}
      </div>

      {matchingId !== null && matchingParent && (
        <StudentMatchPanel parent={matchingParent} onClose={() => setMatchingId(null)} />
      )}
    </div>
  );
}
