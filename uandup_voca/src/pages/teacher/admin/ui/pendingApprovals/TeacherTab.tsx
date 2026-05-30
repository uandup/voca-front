import { usePendingTeachers } from '../../model/usePendingApprovals';
import { PendingList, LoadingState, ApproveRejectButtons } from './PendingListUI';
import { useApproveAlert } from './useApproveAlert';

export function TeacherTab() {
  const { list, isLoading, approve, reject } = usePendingTeachers();
  // 승인 완료 알림 — 리스트 바깥에 렌더링해야 아이템 언마운트 후에도 모달이 유지된다.
  const { trigger: showApproved, node: approvedDialog } = useApproveAlert();

  if (isLoading) return <LoadingState />;

  return (
    <>
      <PendingList
        empty={list.length === 0}
        items={list}
        renderItem={(t) => (
          <div key={t.id} className="flex items-center justify-between px-7 py-4 min-h-17">
            <div>
              <p className="text-sm font-bold text-on-surface">{t.name}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{t.englishName}</p>
            </div>
            <ApproveRejectButtons
              onApprove={() => {
                approve(t.id);
                showApproved();
              }}
              onReject={() => reject(t.id)}
            />
          </div>
        )}
      />
      {approvedDialog}
    </>
  );
}
