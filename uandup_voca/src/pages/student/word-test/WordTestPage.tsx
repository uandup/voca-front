import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import CycleRow from './ui/CycleRow';
import { MOCK_CYCLES } from '@/entities/test';
import type { TestCycle } from '@/entities/test';

const TABS = ['Active', 'History'] as const;
type Tab = (typeof TABS)[number];

function isCompleted(cycle: TestCycle) {
  return cycle.steps.every((s) => s.status === 'passed');
}

export default function WordTestPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Active');

  const activeCycles = MOCK_CYCLES.filter((c) => !isCompleted(c));
  const historyCycles = MOCK_CYCLES.filter((c) => isCompleted(c));
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

      {displayed.length > 0 ? (
        <div className="flex flex-col gap-6">
          {displayed.map((cycle, idx) => (
            <CycleRow key={idx} {...cycle} />
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
