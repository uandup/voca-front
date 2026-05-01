import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { TEACHER_MOCK, type Teacher as TeacherInfo } from '@/entities/member';

interface Props {
  onClose: () => void;
}

type Tab = 'teacher' | 'admin';

export function TeacherPermissionModal({ onClose }: Props) {
  const [teachers, setTeachers] = useState<TeacherInfo[]>(TEACHER_MOCK);
  const [tab, setTab] = useState<Tab>('teacher');

  function handleToggleAdmin(id: number) {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, isAdmin: !t.isAdmin } : t)));
  }

  const filtered = teachers.filter((t) => (tab === 'admin' ? t.isAdmin : !t.isAdmin));

  const counts: Record<Tab, number> = {
    teacher: teachers.filter((t) => !t.isAdmin).length,
    admin: teachers.filter((t) => t.isAdmin).length,
  };

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div
        className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '460px' }}
      >
        {/* 헤더 */}
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

        {/* 탭 */}
        <div className="flex border-b border-outline-variant/20 shrink-0">
          {(['teacher', 'admin'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative ${
                tab === t ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t === 'teacher' ? 'Teacher' : 'Admin'}
              {counts[t] > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    tab === t
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {counts[t]}
                </span>
              )}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 목록 */}
        <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]">
          {filtered.length === 0 ? (
            <li className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-16">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p className="text-sm font-bold">No {tab === 'admin' ? 'admins' : 'teachers'} yet</p>
            </li>
          ) : (
            filtered.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-7 py-4 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">{t.nameLastKo}{t.nameFirstKo}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">{t.nameLastEn} {t.nameFirstEn}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleAdmin(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 transition-all ${
                    t.isAdmin
                      ? 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:border-error/40 hover:text-error'
                      : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {t.isAdmin ? 'shield_lock' : 'shield'}
                  </span>
                  {t.isAdmin ? 'Switch to Teacher' : 'Switch to Admin'}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </ModalBackdrop>
  );
}
