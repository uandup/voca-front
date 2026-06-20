import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import WordTestCycleRow from './ui/WordTestCycleRow';
import { toStudySetRow, toStudentTestBundleRow } from '@/entities/student';
import { useActiveStudySetList, useStudySetHistory } from '@/entities/student';
import { useCurrentStudentId } from '@/entities/auth';

const TABS = ['Active', 'History'] as const;
type Tab = (typeof TABS)[number];

export default function WordTestPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Active');

  const studentId = useCurrentStudentId() ?? 0;

  const { data: activeSets = [], isLoading: activeLoading } = useActiveStudySetList(studentId);
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: historyLoading,
  } = useStudySetHistory(studentId);

  const activeCycles = activeSets.map(toStudentTestBundleRow);
  // 페이지별 content를 StudySetRow로 변환 후 TestBundleRow로 매핑
  const historyCycles = (historyData?.pages ?? [])
    .flatMap((page) => (page.data?.content ?? []).map(toStudySetRow))
    .map(toStudentTestBundleRow);

  const isLoading = activeTab === 'Active' ? activeLoading : historyLoading;
  const displayed = activeTab === 'Active' ? activeCycles : historyCycles;

  return (
    <main>
      <PageTitle title="Word Test" />

      <div className="flex gap-1 mb-6 border-b border-outline/20">
        {TABS.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                isSelected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
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
          {activeTab === 'History' && hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="self-center px-6 py-2.5 rounded-xl border border-outline/30 text-sm font-semibold text-on-surface-variant hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          )}
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
