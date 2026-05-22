import type { StudentPickerRow } from '@/entities/student';
import { usePendingParents } from '../../model/hooks/usePendingApprovals';
import type { PendingParent } from '../../model/types';
import { EmptyState, ApproveRejectButtons } from './PendingListUI';

interface ParentTabProps {
  onMatchStudent: (parent: PendingParent) => void;
  // 학부모 id → 매칭된 자녀 목록. 승인 시 이 자녀 id들을 함께 보낸다.
  matchedChildren: Map<number, StudentPickerRow[]>;
  onRemoveChild: (parentId: number, studentId: number) => void;
  // 승인 시 호출 — 열려 있던 학생 매칭 패널을 닫는다.
  onApprove: () => void;
}

export function ParentTab({
  onMatchStudent,
  matchedChildren,
  onRemoveChild,
  onApprove,
}: ParentTabProps) {
  const { list, isLoading, approve, reject } = usePendingParents();

  if (isLoading) return null;

  return (
    <div className="h-full overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]">
      {list.length === 0 ? (
        <EmptyState />
      ) : (
        list.map((p) => {
          const matched = matchedChildren.get(p.id) ?? [];
          return (
            <div key={p.id} className="px-7 py-4 min-h-19">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-on-surface">
                    {p.name}
                    <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                      ( {p.phoneNumber} )
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {/* 학부모가 가입 시 입력한 자녀 이름 — 매칭과 무관하게 항상 표시한다. */}
                    <span className="text-xs text-on-surface-variant">
                      Child: {p.requestedChildName} (G{p.requestedChildGrade})
                    </span>
                    <button
                      type="button"
                      onClick={() => onMatchStudent(p)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                        person_search
                      </span>
                      Match Student
                    </button>
                  </div>
                </div>
                <ApproveRejectButtons
                  onApprove={() => {
                    approve({
                      id: p.id,
                      studentIds: matched.length > 0 ? matched.map((s) => s.id) : undefined,
                    });
                    onApprove();
                  }}
                  onReject={() => reject(p.id)}
                />
              </div>

              {/* 관리자가 실제 학생 DB에서 매칭한 자녀들 — 태그 목록. 승인 시 이 학생 id들이 전송된다. */}
              {matched.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {matched.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 pl-2.5 pr-1.5 py-1 rounded-full"
                    >
                      {s.nameKo} (G{s.grade})
                      <button
                        type="button"
                        onClick={() => onRemoveChild(p.id, s.id)}
                        className="inline-flex items-center rounded-full hover:bg-primary/20 transition-colors"
                        aria-label={`Remove ${s.nameKo}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
