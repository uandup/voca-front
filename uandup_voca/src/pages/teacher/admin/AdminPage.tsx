import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { PendingApprovalsModal } from './ui/modals/PendingApprovalsModal';
import { ClassManageModal } from './ui/modals/ClassManageModal';
import { TeacherPermissionModal } from './ui/modals/TeacherPermissionModal';
import { TeacherManageModal } from './ui/modals/TeacherManageModal';
import { ParentManageModal } from './ui/modals/ParentManageModal';
import { GradeBulkModal } from './ui/modals/GradeBulkModal';
import {
  PENDING_STUDENTS_MOCK as PENDING_STUDENTS,
  PENDING_PARENTS_MOCK as PENDING_PARENTS,
  PENDING_TEACHERS_MOCK as PENDING_TEACHERS,
  TEACHER_MOCK,
  PARENT_MOCK,
} from '@/entities/member';

const totalPending = PENDING_STUDENTS.length + PENDING_PARENTS.length + PENDING_TEACHERS.length;

type ModalType =
  | 'pending'
  | 'class'
  | 'teacher'
  | 'grade'
  | 'teacher-manage'
  | 'parent-manage'
  | null;

const CARDS = [
  {
    key: 'pending' as const,
    icon: 'person_add',
    label: 'Pending Approvals',
    badge: `${totalPending} waiting`,
    count: String(totalPending),
    dark: true,
  },
  {
    key: 'class' as const,
    icon: 'school',
    label: 'Class Management',
    badge: 'Add / Edit / Delete',
    count: 'Class',
    dark: false,
  },
  {
    key: 'teacher' as const,
    icon: 'manage_accounts',
    label: 'Teacher Permissions',
    badge: 'Manage roles',
    count: 'Role',
    dark: true,
  },
  {
    key: 'grade' as const,
    icon: 'upgrade',
    label: 'Grade Bulk Update',
    badge: 'Bulk adjust',
    count: '±1',
    dark: false,
  },
  {
    key: 'teacher-manage' as const,
    icon: 'person_edit',
    label: 'Teacher Management',
    badge: 'Edit / Delete',
    count: String(TEACHER_MOCK.length),
    dark: true,
  },
  {
    key: 'parent-manage' as const,
    icon: 'family_restroom',
    label: 'Parent Management',
    badge: 'Edit / Delete',
    count: String(PARENT_MOCK.length),
    dark: false,
  },
];

export default function AdminPage() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <main>
      <PageTitle title="Admin" />

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map((card) => (
          <button
            key={card.key}
            onClick={() => setModal(card.key)}
            className={`group flex flex-col items-start p-7 rounded-2xl text-left border shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
              card.dark
                ? 'bg-linear-to-br from-primary to-primary-container border-transparent'
                : 'bg-surface-container-lowest border-outline-variant/20'
            }`}
          >
            <span
              className={`material-symbols-outlined mb-5 p-2 rounded-xl text-xl ${
                card.dark ? 'bg-white/15 text-white' : 'bg-primary/10 text-primary'
              }`}
            >
              {card.icon}
            </span>
            <span
              className={`text-3xl font-headline font-black mb-1 ${
                card.dark ? 'text-white' : 'text-primary'
              }`}
            >
              {card.count}
            </span>
            <span
              className={`text-sm font-bold mb-4 ${
                card.dark ? 'text-white/80' : 'text-on-surface-variant'
              }`}
            >
              {card.label}
            </span>
            <span
              className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-colors ${
                card.dark
                  ? 'bg-white/20 text-white group-hover:bg-white group-hover:text-primary'
                  : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
              }`}
            >
              {card.badge}
            </span>
          </button>
        ))}
      </section>

      {modal === 'pending' && <PendingApprovalsModal onClose={() => setModal(null)} />}
      {modal === 'class' && <ClassManageModal onClose={() => setModal(null)} />}
      {modal === 'teacher' && <TeacherPermissionModal onClose={() => setModal(null)} />}
      {modal === 'grade' && <GradeBulkModal onClose={() => setModal(null)} />}
      {modal === 'teacher-manage' && <TeacherManageModal onClose={() => setModal(null)} />}
      {modal === 'parent-manage' && <ParentManageModal onClose={() => setModal(null)} />}
    </main>
  );
}
