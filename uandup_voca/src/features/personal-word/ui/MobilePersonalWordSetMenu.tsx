import { Modal } from '@/shared/ui/Modal';
import type { PersonalWordSetRow } from '@/entities/personal-word-set';

interface Props {
  target: PersonalWordSetRow;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * 세트 하나에 대한 액션 시트 (이름 변경 / 삭제).
 *
 * 드롭다운을 쓰지 않는 이유: 이 레포에 터치 크기 드롭다운이 없다
 * (shared/ui/ColumnToggleDropdown은 데스크탑 치수이고, 외부 클릭 감지를 또 구현해야 한다).
 * Modal이 백드롭과 바깥 탭 닫힘을 이미 주므로, 그 위에 44px 행 두 개를 올리는 게
 * 코드도 적고 폰에서 더 정확히 눌린다.
 */
export function MobilePersonalWordSetMenu({ target, onRename, onDelete, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 pt-4 pb-3">
          <p className="text-sm font-bold text-on-surface truncate">{target.name}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {target.wordCount} {target.wordCount === 1 ? 'word' : 'words'}
          </p>

          {/* 서버는 학생이 선생님이 만든 세트를 지우는 것도 허용한다(소유자 또는 선생님).
              그래서 실수로 지우는 걸 막는 건 UI 몫이다 — 지우기 전에 출처를 알려준다. */}
          {target.createdByRole === 'TEACHER' && (
            <p className="text-xs text-primary font-semibold mt-2">Added by your teacher</p>
          )}
        </div>

        <div className="border-t border-outline-variant/40">
          <MenuRow icon="edit" label="Rename set" onClick={onRename} />
          <MenuRow icon="delete" label="Delete set" danger onClick={onDelete} />
        </div>

        <div className="border-t border-outline-variant/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-12 text-sm font-bold text-on-surface-variant touch-manipulation"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

function MenuRow({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: string;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-14 px-5 flex items-center gap-3 text-left text-sm font-bold touch-manipulation active:bg-surface-container-low transition-colors ${
        danger ? 'text-error' : 'text-on-surface'
      }`}
    >
      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>
        {icon}
      </span>
      {label}
    </button>
  );
}
