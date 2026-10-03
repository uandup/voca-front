import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import type { PersonalWordCardData } from '@/entities/personal-word';
import { usePersonalWordActions } from '../model/usePersonalWordActions';

// WordFormModal(vocabulary-bank)의 레벨/품사/동의어/예문 필드는 PersonalWord에 개념 자체가
// 없어 재사용하지 않는다 — word/koreanMeaning 2필드짜리 경량 폼을 따로 둔다.
type PersonalWordFormData = Omit<PersonalWordCardData, 'id'>;

interface PersonalWordEditModalProps {
  studentId: number;
  personalWordSetId: number;
  word: PersonalWordCardData;
  onClose: () => void;
}

// 단어 1건 수정 전용 모달. 추가는 PersonalWordBulkAddModal(표 붙여넣기)이 담당한다 —
// 한 단어 고치려고 표를 띄울 이유가 없고, 반대로 추가를 2필드 폼으로 하면 붙여넣기를 못 쓴다.
// 세트 이동은 지원하지 않으므로 세트 선택 필드가 없다.
export function PersonalWordEditModal({
  studentId,
  personalWordSetId,
  word,
  onClose,
}: PersonalWordEditModalProps) {
  const { update } = usePersonalWordActions({ studentId, personalWordSetId });

  const [form, setForm] = useState<PersonalWordFormData>({
    word: word.word,
    koreanMeaning: word.koreanMeaning,
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof PersonalWordFormData>(
    key: K,
    value: PersonalWordFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const errors = {
    word: form.word.trim() === '' ? 'Word is required.' : '',
    koreanMeaning: form.koreanMeaning.trim() === '' ? 'Korean meaning is required.' : '',
  };

  function handleSave() {
    setSubmitted(true);
    if (errors.word || errors.koreanMeaning) return;
    update.mutate({ id: word.id, data: form }, { onSuccess: onClose });
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-white w-full max-w-120 rounded-3xl shadow-[0px_24px_64px_rgba(0,27,95,0.12)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-10 pt-8 pb-6 flex justify-between items-start shrink-0">
          <h2 className="font-headline text-[28px] font-extrabold text-primary leading-tight">
            Edit Word
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="px-10 pb-10 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              Word
            </label>
            <input
              className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-headline font-bold text-primary placeholder:text-on-surface-variant/30"
              placeholder="e.g. Ephemeral"
              type="text"
              value={form.word}
              onChange={(e) => updateField('word', e.target.value)}
            />
            {submitted && errors.word && <p className="text-xs text-error ml-1">{errors.word}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              Korean Meaning
            </label>
            <input
              className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant placeholder:text-on-surface-variant/30"
              placeholder="e.g. 일시적인, 덧없는"
              type="text"
              value={form.koreanMeaning}
              onChange={(e) => updateField('koreanMeaning', e.target.value)}
            />
            {submitted && errors.koreanMeaning && (
              <p className="text-xs text-error ml-1">{errors.koreanMeaning}</p>
            )}
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
              disabled={update.isPending}
              className="px-10 py-4 bg-primary text-white text-[15px] font-bold rounded-xl shadow-[0px_8px_24px_rgba(0,27,95,0.2)] hover:bg-primary-container transition-all active:scale-95 disabled:opacity-60"
            >
              {update.isPending ? 'Saving...' : 'Save Word'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
