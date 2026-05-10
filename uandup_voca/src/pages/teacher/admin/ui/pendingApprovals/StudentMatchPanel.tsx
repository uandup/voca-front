import { useState } from 'react';
import type { PendingParent } from '../../model/types';

interface Props {
  parent: PendingParent;
  onClose: () => void;
}

export function StudentMatchPanel({ parent, onClose }: Props) {
  const [search, setSearch] = useState('');

  return (
    <div className="absolute inset-0 bg-surface flex flex-col">
      <div className="px-7 py-4 border-b border-outline-variant/20 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-extrabold text-primary">Match Student</p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <p className="text-xs text-on-surface-variant">
          Parent: <span className="font-bold text-on-surface">{parent.name}</span> → Child:{' '}
          <span className="font-bold text-on-surface">{parent.requestedChildName}</span>
        </p>
      </div>

      <div className="px-7 py-3 border-b border-outline-variant/20 shrink-0">
        <input
          autoFocus
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Search student name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 flex items-center justify-center text-xs text-on-surface-variant">
        Student matching will be available via API
      </div>
    </div>
  );
}
