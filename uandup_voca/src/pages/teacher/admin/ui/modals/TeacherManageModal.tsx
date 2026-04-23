import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { TEACHER_MOCK, type TeacherInfo } from '../../mock/adminMockData';

interface Props {
  onClose: () => void;
}

export function TeacherManageModal({ onClose }: Props) {
  const [teachers, setTeachers] = useState<TeacherInfo[]>(TEACHER_MOCK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nameKo: '', name: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleEditStart(t: TeacherInfo) {
    setEditingId(t.id);
    setEditForm({ nameKo: t.nameKo, name: t.name });
    setDeletingId(null);
  }

  function handleEditSave(id: number) {
    const nameKo = editForm.nameKo.trim();
    const name = editForm.name.trim();
    if (!nameKo || !name) return;
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, nameKo, name } : t)));
    setEditingId(null);
  }

  function handleDelete(id: number) {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    setDeletingId(null);
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div
        className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '500px' }}
      >
        {/* 헤더 */}
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

        {/* 목록 */}
        <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]">
          {teachers.length === 0 && (
            <li className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-16">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p className="text-sm font-bold">No teachers</p>
            </li>
          )}

          {teachers.map((t) => (
            <li key={t.id} className="px-7 py-4">
              {editingId === t.id ? (
                /* 편집 폼 */
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Korean name"
                      value={editForm.nameKo}
                      onChange={(e) => setEditForm((f) => ({ ...f, nameKo: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(t.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <input
                      className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="English name"
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
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
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : deletingId === t.id ? (
                /* 삭제 확인 */
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-error font-bold">Delete {t.nameKo}?</p>
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
                      onClick={() => handleDelete(t.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-white hover:opacity-90 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                /* 기본 행 */
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on-surface truncate">{t.nameKo}</p>
                      {t.isAdmin && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                          <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>
                            shield_lock
                          </span>
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{t.name}</p>
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
          ))}
        </ul>
      </div>
    </ModalBackdrop>
  );
}
