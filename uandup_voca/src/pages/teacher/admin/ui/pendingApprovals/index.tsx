import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { usePendingCounts } from '../../model/usePendingApprovals';
import { useChildMatching } from '../../model/useChildMatching';
import type { PendingParent } from '../../model/types';
import { StudentTab } from './StudentTab';
import { ParentTab } from './ParentTab';
import { TeacherTab } from './TeacherTab';
import { StudentMatchPanel } from './StudentMatchPanel';

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
  // 학생 매칭 패널은 모달 옆에 붙는 SidePanel 형태로 보여주기 위해 이 레벨에서 상태를 관리
  const [matchingParent, setMatchingParent] = useState<PendingParent | null>(null);

  // 학부모별 자녀 매칭 상태 — ParentTab과 StudentMatchPanel이 공유하므로 이 레벨에서 보유한다.
  const { matchedChildren, addChild, removeChild, getSelectedIds } = useChildMatching();

  return (
    <Modal onClose={onClose} backdropPadding="p-6">
      {/* relative wrapper — StudentMatchPanel이 absolute로 우측에 붙는 기준점. 폭은 여기서 고정하여 탭별 콘텐츠에 따라 모달 너비가 흔들리지 않도록 한다. */}
      <div className="relative w-full max-w-lg">
        <div
          className="w-full bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
            {tab === 'parent' && (
              <ParentTab
                onMatchStudent={setMatchingParent}
                matchedChildren={matchedChildren}
                onRemoveChild={removeChild}
                onApprove={() => setMatchingParent(null)}
              />
            )}
            {tab === 'teacher' && <TeacherTab />}
          </div>
        </div>

        {/* 학생 매칭 사이드 패널 — 편집 모달 오른쪽에 absolute로 고정 */}
        {matchingParent && (
          <StudentMatchPanel
            parent={matchingParent}
            selectedIds={getSelectedIds(matchingParent.id)}
            onSelect={(student) => addChild(matchingParent.id, student)}
            onClose={() => setMatchingParent(null)}
          />
        )}
      </div>
    </Modal>
  );
}
