import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import WordTestCycleRow from './ui/WordTestCycleRow';
import { toStudySetRow, toStudentTestBundleRow, toReviewCadence } from '@/entities/student';
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
          {displayed.map((cycle, i) => (
            <WordTestCycleRow
              key={cycle.id}
              // 서버가 active 목록을 id DESC · 페이징 없이 반환하는 것을 계약으로 보장하므로
              // 화면에 그리는 순서(index + 1)가 곧 복습 회차 판정의 행 번호다.
              // History는 이미 복습을 다 끝낸 배정이라 회차 개념이 없다 → null.
              cadence={activeTab === 'Active' ? toReviewCadence(cycle.steps, i + 1) : null}
              {...cycle}
            />
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
