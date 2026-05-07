import { usePendingStudents } from '../../model/usePendingApprovals';
import { PendingList, LoadingState, ApproveRejectButtons } from './PendingListUI';

export function StudentTab() {
  const { list, isLoading, approve, reject } = usePendingStudents();

  if (isLoading) return <LoadingState />;

  return (
    <PendingList
      empty={list.length === 0}
      items={list}
      renderItem={(s) => (
        <div key={s.id} className="flex items-center justify-between px-7 py-4 min-h-17">
          <div>
            <p className="text-sm font-bold text-on-surface">{s.name}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {s.englishName} · G{s.grade}
            </p>
          </div>
          <ApproveRejectButtons onApprove={() => approve(s.id)} onReject={() => reject(s.id)} />
        </div>
      )}
    />
  );
}
