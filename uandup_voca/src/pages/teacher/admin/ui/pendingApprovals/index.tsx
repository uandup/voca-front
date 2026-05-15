import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { usePendingCounts } from '../../model/hooks/usePendingApprovals';
import { StudentTab } from './StudentTab';
import { ParentTab } from './ParentTab';
import { TeacherTab } from './TeacherTab';

interface Props {
  onClose: () => void;
}

type Tab = 'student' | 'parent' | 'teacher';

const TAB_LABELS: Record<Tab, string> = {
  student: 'Student',
  parent: 'Parent',
  teacher: 'Teacher',
};

export default function PendingApprovalsModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('student');
  const counts = usePendingCounts();

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div
        className="w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '500px' }}
      >
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <h2 className="font-headline text-xl font-bold text-primary">Pending Approvals</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex border-b border-outline-variant/20 shrink-0">
          {(['student', 'parent', 'teacher'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative ${
                tab === t ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {TAB_LABELS[t]}
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

        <div className="flex-1 overflow-hidden relative">
          {tab === 'student' && <StudentTab />}
          {tab === 'parent' && <ParentTab />}
          {tab === 'teacher' && <TeacherTab />}
        </div>
      </div>
    </ModalBackdrop>
  );
}
