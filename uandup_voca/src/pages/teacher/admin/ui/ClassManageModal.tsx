import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { useClassManage } from '../model/useClassManage';

interface Props {
  onClose: () => void;
}

export function ClassManageModal({ onClose }: Props) {
  const { classList, isLoading, isAddPending, isDeletePending, add, edit, remove } =
    useClassManage();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed || classList.some((c) => c.name === trimmed)) return;
    add(trimmed, { onSuccess: () => setNewName('') });
  }

  function handleEditStart(id: number, name: string) {
    setEditingId(id);
    setEditingName(name);
  }

  function handleEditSave(id: number, originalName: string) {
    const trimmed = editingName.trim();
    if (!trimmed || (trimmed !== originalName && classList.some((c) => c.name === trimmed))) {
      setEditingId(null);
      return;
    }
    edit({ id, name: trimmed }, { onSuccess: () => setEditingId(null) });
  }

  function handleDeleteConfirm(id: number) {
    remove(id, { onSuccess: () => setDeletingId(null) });
  }

  return (
    <Modal onClose={onClose} backdropPadding="p-6">
      <div
        className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '500px' }}
      >
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Class Management</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{classList.length} classes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-7 py-4 border-b border-outline-variant/20 shrink-0">
          <div className="flex gap-2">
            <input
              className="flex-1 min-w-0 bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="New class name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newName.trim() || isAddPending}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        <ul
          className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]"
          style={{ height: '400px' }}
        >
          {isLoading ? (
            <li className="flex items-center justify-center h-full text-on-surface-variant/50">
              <span className="material-symbols-outlined text-3xl animate-spin">
                progress_activity
              </span>
            </li>
          ) : classList.length === 0 ? (
            <li className="flex items-center justify-center h-full text-sm text-on-surface-variant">
              No classes yet
            </li>
          ) : (
            classList.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-7 py-3.5 min-h-14">
                {editingId === item.id ? (
                  <input
                    autoFocus
                    className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSave(item.id, item.name);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onBlur={() => handleEditSave(item.id, item.name)}
                  />
                ) : deletingId === item.id ? (
                  <>
                    <p className="flex-1 text-sm text-error font-bold">Delete "{item.name}"?</p>
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
                        onClick={() => handleDeleteConfirm(item.id)}
                        disabled={isDeletePending}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-on-surface">{item.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          handleEditStart(item.id, item.name);
                          setDeletingId(null);
                        }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingId(item.id);
                          setEditingId(null);
                        }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          delete
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </Modal>
  );
}
