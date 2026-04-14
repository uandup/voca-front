import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { TEACHER_MOCK, type TeacherInfo } from '../../mock/adminMockData';

interface Props {
  onClose: () => void;
}

export function TeacherPermissionModal({ onClose }: Props) {
  const [teachers, setTeachers] = useState<TeacherInfo[]>(TEACHER_MOCK);

  function handleToggleAdmin(id: number) {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, isAdmin: !t.isAdmin } : t)));
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Teacher Permissions</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Toggle admin role for teachers</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <ul
          className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]"
          style={{ height: '320px' }}
        >
          {teachers.map((t) => (
            <li key={t.id} className="flex items-center justify-between px-7 py-4 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{t.nameKo}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 truncate">{t.name}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleAdmin(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 transition-all ${
                  t.isAdmin
                    ? 'bg-primary text-on-primary border-primary hover:opacity-80'
                    : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:border-primary/40 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  {t.isAdmin ? 'shield' : 'shield_lock'}
                </span>
                {t.isAdmin ? 'Switch to Teacher' : 'Switch to Admin'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ModalBackdrop>
  );
}
