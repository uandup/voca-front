import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageTitle } from '@/shared/ui/PageTitle';
import { getPendingCount } from '@/entities/member';
import { ADMIN_CARDS, type AdminModalKey } from './model/constants';
import PendingApprovalsModal from './ui/pendingApprovals';
import { ClassManageModal } from './ui/ClassManageModal';
import { TeacherPermissionModal } from './ui/TeacherPermissionModal';
import { TeacherManageModal } from './ui/TeacherManageModal';
import { ParentManageModal } from './ui/ParentManageModal';
import { GradeBulkModal } from './ui/GradeBulkModal';

export default function AdminPage() {
  const [modal, setModal] = useState<AdminModalKey | null>(null);

  const { data: pendingCountRes } = useQuery({
    queryKey: ['admin', 'pending-count'],
    queryFn: getPendingCount,
    refetchInterval: 30_000,
  });
  const pendingCount = pendingCountRes?.data ?? 0;

  return (
    <main>
      <PageTitle title="Admin" />

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {ADMIN_CARDS.map((card) => {
          const stat = card.key === 'pending' ? String(pendingCount) : card.stat;
          const description = card.key === 'pending' ? `${pendingCount} waiting` : card.description;

          return (
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
                {stat}
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
                {description}
              </span>
            </button>
          );
        })}
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
