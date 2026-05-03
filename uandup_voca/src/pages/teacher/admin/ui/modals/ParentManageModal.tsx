import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import {
  PARENT_MOCK,
  REGISTERED_STUDENTS_MOCK as REGISTERED_STUDENTS,
  type Parent as ParentInfo,
} from '@/entities/member';

interface Props {
  onClose: () => void;
}

export function ParentManageModal({ onClose }: Props) {
  const [parents, setParents] = useState<ParentInfo[]>(PARENT_MOCK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nameKo: '', phone: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleEditStart(p: ParentInfo) {
    setEditingId(p.id);
    setEditForm({ nameKo: p.nameKo, phone: p.phone });
    setDeletingId(null);
  }

  function handleEditSave(id: number) {
    if (!editForm.nameKo.trim() || !editForm.phone.trim()) return;
    setParents((prev) =>
      prev.map((p) => (p.id === id ? { ...p, nameKo: editForm.nameKo, phone: editForm.phone } : p)),
    );
    setEditingId(null);
  }

  function handleDelete(id: number) {
    setParents((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div
        className="w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '500px' }}
      >
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Parent Management</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{parents.length} parents</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]">
          {parents.length === 0 && (
            <li className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-16">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p className="text-sm font-bold">No parents</p>
            </li>
          )}

          {parents.map((p) => {
            const matched = REGISTERED_STUDENTS.find((s) => s.id === p.matchedStudentId);
            return (
              <li key={p.id} className="px-7 py-4">
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Korean name"
                        value={editForm.nameKo}
                        onChange={(e) => setEditForm((f) => ({ ...f, nameKo: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(p.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <input
                        className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(p.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditSave(p.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : deletingId === p.id ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-error font-bold">Delete {p.nameKo}?</p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-white hover:opacity-90 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-on-surface">
                        {p.nameKo}
                        <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                          ( {p.phone} )
                        </span>
                      </p>
                      <div className="mt-1.5">
                        {matched ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '12px' }}
                            >
                              link
                            </span>
                            {matched.nameKo} · G{matched.grade}
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface-variant">
                            No matched student
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditStart(p)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingId(p.id);
                          setEditingId(null);
                        }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </ModalBackdrop>
  );
}
