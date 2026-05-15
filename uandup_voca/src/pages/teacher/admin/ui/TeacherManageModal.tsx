import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import type { TeacherManageRow } from '@/entities/teacher';
import { useTeacherManage } from '../model/hooks/useTeacherManage';

interface Props {
  onClose: () => void;
}

export function TeacherManageModal({ onClose }: Props) {
  const { teachers, isLoading, isEditPending, isDeletePending, edit, remove } = useTeacherManage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', nameFirstEn: '', nameLastEn: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleEditStart(t: TeacherManageRow) {
    setEditingId(t.id);
    setEditForm({ name: t.name, nameFirstEn: t.nameFirstEn, nameLastEn: t.nameLastEn });
    setDeletingId(null);
  }

  function handleEditSave(id: number) {
    if (!editForm.name.trim()) return;
    edit(
      {
        id,
        name: editForm.name.trim(),
        nameFirstEn: editForm.nameFirstEn.trim(),
        nameLastEn: editForm.nameLastEn.trim(),
      },
      { onSuccess: () => setEditingId(null) },
    );
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div
        className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '500px' }}
      >
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Teacher Management</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{teachers.length} teachers</p>
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
          ) : teachers.length === 0 ? (
            <li className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-16">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p className="text-sm font-bold">No teachers</p>
            </li>
          ) : (
            teachers.map((t) => (
              <li key={t.id} className="px-7 py-4">
                {editingId === t.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Korean name"
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(t.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <input
                        className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="First name"
                        value={editForm.nameFirstEn}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, nameFirstEn: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(t.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <input
                        className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Last name"
                        value={editForm.nameLastEn}
                        onChange={(e) => setEditForm((f) => ({ ...f, nameLastEn: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(t.id);
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
                        onClick={() => handleEditSave(t.id)}
                        disabled={isEditPending}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : deletingId === t.id ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-error font-bold">Delete {t.name}?</p>
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
                        onClick={() => remove(t.id, { onSuccess: () => setDeletingId(null) })}
                        disabled={isDeletePending}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-on-surface truncate">{t.name}</p>
                        {t.isAdmin && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '11px' }}
                            >
                              shield_lock
                            </span>
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                        {t.nameFirstEn} {t.nameLastEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditStart(t)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingId(t.id);
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
    </ModalBackdrop>
  );
}
