import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import WordTestCycleRow from './ui/WordTestCycleRow';
import { toStudentTestBundleRow } from '@/entities/student';
import type { TestBundleRow } from '@/entities/test';
import { useStudySetList } from '@/entities/student';
import { useCurrentStudentId } from '@/entities/auth';

const TABS = ['Active', 'History'] as const;
type Tab = (typeof TABS)[number];

function isCompleted(cycle: TestBundleRow) {
  return cycle.steps.every((s) => s.status === 'passed');
}

export default function WordTestPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Active');

  const studentId = useCurrentStudentId() ?? 0;
  const { data: studySets = [], isLoading } = useStudySetList(studentId);
  // study-set 응답은 최신순. mock과 동일하게 클라이언트에서는 active/history만 분기.
  const cycles: TestBundleRow[] = studySets.map(toStudentTestBundleRow);

  const activeCycles = cycles.filter((c) => !isCompleted(c));
  const historyCycles = cycles.filter((c) => isCompleted(c));
  const displayed = activeTab === 'Active' ? activeCycles : historyCycles;

  return (
    <main>
      <PageTitle title="Word Test" />

      <div className="flex gap-1 mb-6 border-b border-outline/20">
        {TABS.map((tab) => {
          const count = tab === 'Active' ? activeCycles.length : historyCycles.length;
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                isSelected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : displayed.length > 0 ? (
        <div className="flex flex-col gap-6">
          {displayed.map((cycle) => (
            <WordTestCycleRow key={cycle.id} {...cycle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3">inbox</span>
          <p className="text-sm font-medium">No {activeTab.toLowerCase()} tests.</p>
        </div>
      )}
    </main>
  );
}
