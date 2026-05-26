import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import type { ParentManageRow } from '@/entities/parent';
import { useParentManage } from '../model/useParentManage';

interface Props {
  onClose: () => void;
}

export function ParentManageModal({ onClose }: Props) {
  const { parents, isLoading, isEditPending, isDeletePending, edit, remove } = useParentManage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phoneNumber: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleEditStart(p: ParentManageRow) {
    setEditingId(p.id);
    setEditForm({ name: p.name, phoneNumber: p.phoneNumber });
    setDeletingId(null);
  }

  function handleEditSave(id: number) {
    if (!editForm.name.trim() || !editForm.phoneNumber.trim()) return;
    edit(
      { id, name: editForm.name.trim(), phoneNumber: editForm.phoneNumber.trim() },
      { onSuccess: () => setEditingId(null) },
    );
  }

  return (
    <Modal onClose={onClose} backdropPadding="p-6">
      <div
        className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
          {isLoading ? (
            <li className="flex items-center justify-center h-full text-on-surface-variant/50">
              <span className="material-symbols-outlined text-3xl animate-spin">
                progress_activity
              </span>
            </li>
          ) : parents.length === 0 ? (
            <li className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-16">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p className="text-sm font-bold">No parents</p>
            </li>
          ) : (
            parents.map((p) => (
              <li key={p.id} className="px-7 py-4">
                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Name"
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(p.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <input
                        className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Phone"
                        value={editForm.phoneNumber}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))
                        }
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
                        disabled={isEditPending}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : deletingId === p.id ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-error font-bold">Delete {p.name}?</p>
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
                        onClick={() => remove(p.id, { onSuccess: () => setDeletingId(null) })}
                        disabled={isDeletePending}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-on-surface">
                        {p.name}
                        <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                          ( {p.phoneNumber} )
                        </span>
                      </p>
                      <div className="mt-1.5">
                        {p.students.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.students.map((s) => (
                              <span
                                key={s.id}
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: '12px' }}
                                >
                                  link
                                </span>
                                {s.name} · G{s.grade}
                              </span>
                            ))}
                          </div>
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
            ))
          )}
        </ul>
      </div>
    </Modal>
  );
}
