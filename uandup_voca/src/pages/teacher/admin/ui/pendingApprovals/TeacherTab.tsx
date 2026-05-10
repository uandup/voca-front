import { usePendingTeachers } from '../../model/hooks/usePendingApprovals';
import { PendingList, LoadingState, ApproveRejectButtons } from './PendingListUI';

export function TeacherTab() {
  const { list, isLoading, approve, reject } = usePendingTeachers();

  if (isLoading) return <LoadingState />;

  return (
    <PendingList
      empty={list.length === 0}
      items={list}
      renderItem={(t) => (
        <div key={t.id} className="flex items-center justify-between px-7 py-4 min-h-17">
          <div>
            <p className="text-sm font-bold text-on-surface">{t.name}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{t.englishName}</p>
          </div>
          <ApproveRejectButtons onApprove={() => approve(t.id)} onReject={() => reject(t.id)} />
        </div>
      )}
    />
  );
}
