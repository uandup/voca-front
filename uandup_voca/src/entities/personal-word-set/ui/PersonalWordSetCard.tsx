import type { ReactNode } from 'react';
import type { PersonalWordSetRow } from '../model/types';

interface PersonalWordSetCardProps {
  set: PersonalWordSetRow;
  // 카드 전체 클릭 — 세트 상세로 이동. 읽기 전용 화면에선 생략한다.
  onClick?: () => void;
  // 카드 외부에서 주입하는 액션(Rename / Delete 등). 조회 전용 화면에선 넘기지 않는다.
  extraInfo?: ReactNode;
}

function creatorLabel(role: PersonalWordSetRow['createdByRole']): string {
  return role === 'STUDENT' ? 'Added by you' : 'Added by teacher';
}

// 개인 단어 세트 1건을 표시하는 카드.
// StudySet과 달리 사람이 붙인 이름이 있어 그것만으로 식별된다 — 레벨 칩·배정일 같은 보조 라벨이 필요없다.
export function PersonalWordSetCard({ set, onClick, extraInfo }: PersonalWordSetCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden border shadow-sm border-outline-variant/60 relative">
      <div className="p-6 flex items-center gap-6">
        {/* 이름·메타 영역만 클릭 대상 — extraInfo의 버튼까지 삼키지 않도록 분리한다. */}
        <button
          type="button"
          onClick={onClick}
          disabled={!onClick}
          className="flex-1 min-w-0 text-left disabled:cursor-default"
        >
          <h2 className="font-headline font-bold text-xl text-primary truncate">{set.name}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-on-surface-variant">
              {set.wordCount} {set.wordCount === 1 ? 'word' : 'words'}
            </span>
            <span className="text-outline-variant">·</span>
            <span className="text-xs text-on-surface-variant/80">
              {creatorLabel(set.createdByRole)}
            </span>
          </div>
        </button>

        {extraInfo && <div className="shrink-0">{extraInfo}</div>}

        {onClick && (
          <span
            className="material-symbols-outlined text-outline shrink-0"
            style={{ fontSize: '22px' }}
          >
            chevron_right
          </span>
        )}
      </div>
    </article>
  );
}
