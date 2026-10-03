import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import type { PersonalWordSetRow } from '@/entities/personal-word-set';
import { usePersonalWordSetActions } from '../model/usePersonalWordSetActions';

interface PersonalWordSetFormModalProps {
  studentId: number;
  // 넘기면 이름 변경, 없으면 새 세트 생성.
  target?: PersonalWordSetRow;
  onClose: () => void;
}

const MAX_NAME_LENGTH = 50;

// 세트 생성·이름변경 모달. 필드가 이름 하나뿐이라 생성과 수정이 같은 폼을 쓴다.
export function PersonalWordSetFormModal({
  studentId,
  target,
  onClose,
}: PersonalWordSetFormModalProps) {
  const { create, rename } = usePersonalWordSetActions(studentId);
  const mutation = target ? rename : create;

  const [name, setName] = useState(target?.name ?? '');
  const [submitted, setSubmitted] = useState(false);

  const trimmed = name.trim();
  const error =
    trimmed === ''
      ? 'Set name is required.'
      : trimmed.length > MAX_NAME_LENGTH
        ? `Set name must be ${MAX_NAME_LENGTH} characters or fewer.`
        : '';

  function handleSave() {
    setSubmitted(true);
    if (error) return;
    if (target) {
      rename.mutate({ id: target.id, data: { name } }, { onSuccess: onClose });
    } else {
      create.mutate({ name }, { onSuccess: onClose });
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-white w-full max-w-120 rounded-3xl shadow-[0px_24px_64px_rgba(0,27,95,0.12)] overflow-hidden flex flex-col">
        <div className="px-10 pt-8 pb-6 flex justify-between items-start shrink-0">
          <h2 className="font-headline text-[28px] font-extrabold text-primary leading-tight">
            {target ? 'Rename Word Set' : 'Add Word Set'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="px-10 pb-10 space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              Set Name
            </label>
            <input
              className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-headline font-bold text-primary placeholder:text-on-surface-variant/30 placeholder:font-normal"
              placeholder="e.g. Sep 13 TOEIC Words"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
            {submitted && error && <p className="text-xs text-error ml-1">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-6">
            <button
              type="button"
              onClick={onClose}
              className="text-[15px] font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={mutation.isPending}
              className="px-10 py-4 bg-primary text-white text-[15px] font-bold rounded-xl shadow-[0px_8px_24px_rgba(0,27,95,0.2)] hover:bg-primary-container transition-all active:scale-95 disabled:opacity-60"
            >
              {mutation.isPending ? 'Saving...' : target ? 'Save Name' : 'Create Set'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
