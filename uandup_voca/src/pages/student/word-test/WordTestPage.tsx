import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import CycleRow, { type CycleRowData } from './ui/CycleRow';

const MOCK_CYCLES: CycleRowData[] = [
  {
    id: '1',
    level: 7,
    wordCount: 50,
    steps: [
      { key: 'word', label: 'Word', status: 'waiting', totalScore: '100' },
      { key: 'sentence', label: 'Sentence', status: 'available', totalScore: '100' },
      { key: 'review1', label: 'Review 1', status: 'grading', totalScore: '100' },
      {
        key: 'review2',
        label: 'Review 2',
        status: 'passed',
        scores: ['98'],
        totalScore: '100',
        gradedDate: '23.10.23',
      },
      {
        key: 'review3',
        label: 'Review 3',
        status: 'fail',
        scores: ['62'],
        totalScore: '100',
        gradedDate: '23.10.24',
      },
    ],
  },
  {
    id: '2',
    level: 3,
    wordCount: 47,
    steps: [
      { key: 'word', label: 'Word', status: 'fail', scores: ['62'], totalScore: '100' },
      { key: 'sentence', label: 'Sentence', status: 'locked' },
      { key: 'review1', label: 'Review 1', status: 'locked' },
      { key: 'review2', label: 'Review 2', status: 'locked' },
      { key: 'review3', label: 'Review 3', status: 'locked' },
    ],
  },
  {
    id: '3',
    level: 5,
    wordCount: 30,
    steps: [
      {
        key: 'word',
        label: 'Word',
        status: 'passed',
        scores: ['95'],
        totalScore: '100',
        gradedDate: '23.09.10',
      },
      {
        key: 'sentence',
        label: 'Sentence',
        status: 'passed',
        scores: ['55', '88'],
        totalScore: '100',
        gradedDate: '23.09.11',
      },
      {
        key: 'review1',
        label: 'Review 1',
        status: 'passed',
        scores: ['60', '72', '92'],
        totalScore: '100',
        gradedDate: '23.09.12',
      },
      {
        key: 'review2',
        label: 'Review 2',
        status: 'passed',
        scores: ['96'],
        totalScore: '100',
        gradedDate: '23.09.13',
      },
      {
        key: 'review3',
        label: 'Review 3',
        status: 'passed',
        scores: ['100'],
        totalScore: '100',
        gradedDate: '23.09.14',
      },
    ],
  },
];

const TABS = ['Active', 'History'] as const;
type Tab = (typeof TABS)[number];

function isCompleted(cycle: CycleRowData) {
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
