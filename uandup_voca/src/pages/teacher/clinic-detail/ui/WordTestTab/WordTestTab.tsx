import { useState } from 'react';
import ClinicCycleRow from './ClinicCycleRow';
import { toTestBundleRow } from '@/entities/student';
import type { StudySetRow } from '@/entities/student';
import type { TestBundleRow } from '@/entities/test';

const TABS = ['Active', 'History'] as const;
type Tab = (typeof TABS)[number];

function isCompleted(cycle: TestBundleRow) {
  return cycle.steps.every((s) => s.status === 'passed');
}

interface Props {
  studySets: StudySetRow[];
  studentId: number;
}

export default function WordTestTab({ studySets, studentId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Active');

  const cycles: TestBundleRow[] = studySets.map(toTestBundleRow);
  const activeCycles = cycles.filter((c) => !isCompleted(c));
  const historyCycles = cycles.filter((c) => isCompleted(c));
  const displayed = activeTab === 'Active' ? activeCycles : historyCycles;

  return (
    <div className="flex flex-col gap-4">
      {/* Active / History 토글 */}
      <div className="flex justify-start">
        <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/30">
          {TABS.map((tab) => {
            const count = tab === 'Active' ? activeCycles.length : historyCycles.length;
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
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
      </div>

      {displayed.length > 0 ? (
        displayed.map((cycle) => {
          const set = studySets.find((s) => String(s.studySetId) === cycle.id)!;
          return (
            <ClinicCycleRow
              key={cycle.id}
              studySetId={set.studySetId}
              studentId={studentId}
              {...cycle}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3">inbox</span>
          <p className="text-sm font-medium">No {activeTab.toLowerCase()} tests.</p>
        </div>
      )}
    </div>
  );
}
