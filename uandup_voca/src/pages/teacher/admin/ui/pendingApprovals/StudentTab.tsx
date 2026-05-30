import { usePendingStudents } from '../../model/usePendingApprovals';
import { PendingList, LoadingState, ApproveRejectButtons } from './PendingListUI';
import { useApproveAlert } from './useApproveAlert';

export function StudentTab() {
  const { list, isLoading, approve, reject } = usePendingStudents();
  // 승인 완료 알림 — 리스트 바깥에 렌더링해야 아이템 언마운트 후에도 모달이 유지된다.
  const { trigger: showApproved, node: approvedDialog } = useApproveAlert();

  if (isLoading) return <LoadingState />;

  return (
    <>
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
            <ApproveRejectButtons
              onApprove={() => {
                approve(s.id);
                showApproved();
              }}
              onReject={() => reject(s.id)}
            />
          </div>
        )}
      />
      {approvedDialog}
    </>
  );
}
