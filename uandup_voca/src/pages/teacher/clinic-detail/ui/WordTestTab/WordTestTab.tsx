import { useState } from 'react';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import ClinicCycleRow from './ClinicCycleRow';
import {
  toStudySetRow,
  toTestBundleRow,
  useActiveStudySetList,
  useStudySetHistory,
} from '@/entities/student';

const TABS = ['Active', 'History'] as const;
type Tab = (typeof TABS)[number];

interface Props {
  studentId: number;
}

export default function WordTestTab({ studentId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Active');

  const { data: activeSets = [], isLoading: activeLoading } = useActiveStudySetList(studentId);
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: historyLoading,
  } = useStudySetHistory(studentId);

  const activeCycles = activeSets.map(toTestBundleRow);

  const historySets = (historyData?.pages ?? []).flatMap((page) =>
    (page.data?.content ?? []).map(toStudySetRow),
  );
  const historyCycles = historySets.map(toTestBundleRow);

  const isLoading = activeTab === 'Active' ? activeLoading : historyLoading;
  const displayed = activeTab === 'Active' ? activeCycles : historyCycles;

  return (
    <div className="flex flex-col gap-4">
      {/* Active / History 토글 */}
      <div className="flex justify-start">
        <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/30">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : displayed.length > 0 ? (
        <>
          {displayed.map((cycle) => {
            const set =
              activeTab === 'Active'
                ? activeSets.find((s) => String(s.studySetId) === cycle.id)!
                : historySets.find((s) => String(s.studySetId) === cycle.id)!;
            return (
              <ClinicCycleRow
                key={cycle.id}
                studySetId={set.studySetId}
                studentId={studentId}
                {...cycle}
              />
            );
          })}
          {activeTab === 'History' && hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="self-center px-6 py-2.5 rounded-xl border border-outline/30 text-sm font-semibold text-on-surface-variant hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3">inbox</span>
          <p className="text-sm font-medium">No {activeTab.toLowerCase()} tests.</p>
        </div>
      )}
    </div>
  );
}
