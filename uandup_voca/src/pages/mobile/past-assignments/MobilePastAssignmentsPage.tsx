import { useNavigate } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useStudySetHistory, toStudySetRow } from '@/entities/student';
import type { StudySetRow } from '@/entities/student';
import { useCurrentStudentId } from '@/entities/auth';
import { MobileScreenHeader } from '@/widgets/mobile-nav';

function formatDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// MobileLibraryPage에도 같은 헬퍼가 있다 — 페이지끼리는 import할 수 없어(FSD) 복제한다.
// 위의 formatDate도 같은 이유로 양쪽에 있다.
function toLevelLabel(levels: { level: number }[]): string {
  if (levels.length === 0) return 'Level —';
  return `Level ${levels.map((l) => l.level).join(' · ')}`;
}

/**
 * 과거 배정 목록(폰).
 *
 * MobileLibraryPage와 **같은 useStudySetHistory**를 쓴다 — queryKey가 같아 홈에서 개수를 얻으려
 * 이미 받아둔 1페이지가 캐시에서 즉시 그려지고, "Load more"만 추가 요청한다.
 *
 * 진행 점을 그리지 않는 이유: 이미 끝난 세트라 "어디까지 했는지"가 의미 없다.
 */
export function MobilePastAssignmentsPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useStudySetHistory(studentId);

  const sets: StudySetRow[] = (data?.pages ?? []).flatMap((page) =>
    (page.data?.content ?? []).map(toStudySetRow),
  );
  const total = data?.pages[0]?.data?.totalElements ?? sets.length;

  return (
    <div className="px-4 pt-4">
      <MobileScreenHeader
        title="Past Assignments"
        subtitle={`${total} ${total === 1 ? 'set' : 'sets'}`}
        onBack={() => navigate({ to: '/m/library' })}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : sets.length === 0 ? (
        <EmptyState icon="history" title="No past assignments yet." />
      ) : (
        <div className="space-y-2">
          {sets.map((set) => (
            <button
              key={set.studySetId}
              onClick={() =>
                navigate({
                  to: '/m/words/assigned/$studySetId',
                  params: { studySetId: String(set.studySetId) },
                  search: { view: 'list' },
                })
              }
              className="w-full text-left bg-surface-container-lowest border border-outline-variant/50 rounded-2xl px-5 py-4 flex items-center gap-3 touch-manipulation active:bg-surface-container-low transition-colors"
            >
              {/* 진행 중 카드와 같은 타이포 — 11px 메타 줄(배정일) + 14px 본문 줄(단어 수·레벨).
                  다만 이미 끝난 세트라 진행 점은 그리지 않는다. */}
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2 text-[11px]">
                  <span className="font-bold uppercase tracking-widest text-on-surface-variant/60 shrink-0">
                    Assigned
                  </span>
                  <span className="font-bold tracking-widest text-on-surface-variant/60 tabular-nums">
                    {formatDate(set.assignedDate)}
                  </span>
                </p>
                <h3 className="text-[14px] mt-1.5">
                  <span className="font-bold text-on-surface">{set.wordCount} words</span>
                  <span className="font-semibold text-on-surface-variant">
                    {' · '}
                    {toLevelLabel(set.levels)}
                  </span>
                </h3>
              </div>
              <span
                className="material-symbols-outlined text-outline/70 shrink-0"
                style={{ fontSize: '20px' }}
              >
                chevron_right
              </span>
            </button>
          ))}

          {/* 무한 스크롤 대신 명시적 버튼 — 폰에서 스크롤 끝에 걸리는 자동 로딩은
              "끝난 건지 더 있는 건지"를 알기 어렵다. */}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full min-h-12 flex items-center justify-center rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-sm font-bold text-primary touch-manipulation disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
