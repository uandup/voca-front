import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EmptyState } from '@/shared/ui/EmptyState';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import type { PersonalWordSetRow } from '@/entities/personal-word-set';
import { useCurrentStudentId } from '@/entities/auth';
import { MobilePersonalWordSetFormModal } from '@/features/personal-word';

/**
 * 모바일 개인 단어 세트 목록.
 *
 * 이 화면에서는 **세트 생성까지만** 한다. 이름 변경·삭제는 세트를 열고 들어가서 한다 —
 * 그래야 각 행이 "누르면 들어간다" 하나만 하는 버튼으로 남는다. 행 안에 메뉴 버튼을 또 넣으면
 * 버튼 안에 버튼이 들어가(HTML 위반) 행 전체를 flex 컨테이너로 쪼개야 하고,
 * 360px에서 세트 이름이 메뉴 버튼만큼 더 잘린다.
 *
 * 단어 등록·수정·삭제는 세트 상세(pages/mobile/word-list)가 담당한다.
 */
export function MobilePersonalWordSetListPage() {
  const navigate = useNavigate();
  const studentId = useCurrentStudentId() ?? 0;

  const { data: sets = [], isLoading } = usePersonalWordSets(studentId, studentId > 0);
  const [createOpen, setCreateOpen] = useState(false);

  // 조회는 enabled로 막혀 있지만 mutation에는 그게 없다. studentId가 0인 채로 생성하면
  // POST /students/0/personal-word-sets로 날아가므로 버튼 자체를 그리지 않는다.
  const canCreate = studentId > 0;

  function openSet(set: PersonalWordSetRow) {
    navigate({
      to: '/m/words/personal/$personalWordSetId',
      params: { personalWordSetId: String(set.id) },
      // 항상 목록으로 들어간다 — 플래시카드는 그 안에서 전환한다.
      search: { view: 'list' },
    });
  }

  return (
    <div className="px-4 pt-6">
      {isLoading ? (
        <LoadingSpinner />
      ) : sets.length === 0 ? (
        <EmptyState
          icon="auto_stories"
          title="No word sets yet."
          description="Make a set and start adding the words you want to remember."
          action={
            canCreate ? (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="min-h-12 px-5 rounded-xl bg-primary text-white text-sm font-bold touch-manipulation"
              >
                New word set
              </button>
            ) : undefined
          }
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

          {/* 목록 맨 아래에 둔다 — 세트가 쌓일수록 자주 누르는 건 기존 세트이고,
              새로 만들기는 "목록을 다 보고 없을 때" 하는 행동이다.
              점선 테두리 + primary 글자로 위 카드들과 갈라 놓는다:
              위는 "누르면 이동", 이건 "누르면 생성"이라 같은 모양이면 안 된다. */}
          {canCreate && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="w-full min-h-14 rounded-xl border border-dashed border-outline-variant text-sm font-bold text-primary flex items-center justify-center gap-1.5 touch-manipulation active:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                add
              </span>
              New word set
            </button>
          )}
        </div>
      )}

      {createOpen && (
        <MobilePersonalWordSetFormModal
          studentId={studentId}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </div>
  );
}
