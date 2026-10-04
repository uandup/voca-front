import { useNavigate } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import type { PersonalWordSetRow } from '@/entities/personal-word-set';
import { useCurrentStudentId } from '@/entities/auth';
import { MobileScreenHeader } from '@/widgets/mobile-nav';

/**
 * 모바일 개인 단어 세트 목록 — 폰에서는 **조회·암기 전용**이다.
 * 세트 생성·단어 등록은 데스크탑에서 한다(엑셀 붙여넣기가 주 입력 수단이라 폰에서 의미가 적다).
 * 그래서 Rename/Delete 같은 액션 없이 카드 목록만 둔다.
 */
export function MobilePersonalWordSetListPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;

  const { data: sets = [], isLoading } = usePersonalWordSets(studentId, studentId > 0);

  function openSet(set: PersonalWordSetRow) {
    navigate({
      to: '/m/words/personal/$personalWordSetId',
      params: { personalWordSetId: String(set.id) },
      // 항상 목록으로 들어간다 — 플래시카드는 그 안에서 전환한다.
      search: { view: 'list' },
    });
  }

  return (
    <div className="px-4 pt-4">
      {/* 탭 최상위 화면이라 뒤로가기를 두지 않는다 — MobileScreenHeader는 onBack이 없으면 화살표를 그리지 않는다. */}
      <MobileScreenHeader
        title="Personal Words"
        subtitle={`${sets.length} ${sets.length === 1 ? 'set' : 'sets'}`}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : sets.length === 0 ? (
        <EmptyState
          icon="auto_stories"
          title="No word sets yet."
          description="Create a set on the desktop site to start adding words."
        />
      ) : (
        <div className="space-y-2">
          {sets.map((set) => (
            <button
              key={set.id}
              onClick={() => openSet(set)}
              className="w-full text-left bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 flex items-center gap-3 touch-manipulation"
            >
              <span
                className="material-symbols-outlined text-primary shrink-0"
                style={{ fontSize: '24px' }}
              >
                auto_stories
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-on-surface truncate">{set.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {set.wordCount} {set.wordCount === 1 ? 'word' : 'words'}
                </p>
              </div>
              <span
                className="material-symbols-outlined text-outline shrink-0"
                style={{ fontSize: '22px' }}
              >
                chevron_right
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
