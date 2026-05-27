import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { DIFFICULTY_LEVELS } from '@/entities/word';
import type { TeacherWord, PartOfSpeech, WordDifficultyLevel } from '@/entities/word';
import { useWordActions } from '../../model/useWordActions';

type WordFormData = Omit<TeacherWord, 'id'>;

interface WordFormModalProps {
  wordId?: number;
  initialData?: WordFormData;
  onClose: () => void;
}

const PARTS_OF_SPEECH: PartOfSpeech[] = ['N', 'V', 'Adj', 'Adv', 'Prep', 'Conj', 'Interj'];

const DEFAULT_FORM: WordFormData = {
  word: '',
  partsOfSpeech: [],
  korMeaning: '',
  difficulty: 1,
  engMeaning: '',
  synonyms: [],
  sentence: '',
};

export function WordFormModal({ wordId, initialData, onClose }: WordFormModalProps) {
  const { create, update: updateAction } = useWordActions();
  const mutation = wordId ? updateAction : create;

  const [form, setForm] = useState<WordFormData>(initialData ?? DEFAULT_FORM);
  const [synonymInput, setSynonymInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof WordFormData>(key: K, value: WordFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const errors = {
    word: form.word.trim() === '' ? 'Word is required.' : '',
    korMeaning: form.korMeaning.trim() === '' ? 'Korean meaning is required.' : '',
    partsOfSpeech: form.partsOfSpeech.length === 0 ? 'Select at least one part of speech.' : '',
  };

  function submit() {
    if (wordId) {
      updateAction.mutate({ id: wordId, data: form }, { onSuccess: onClose });
    } else {
      create.mutate(form, { onSuccess: onClose });
    }
  }

  function handleSynonymKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && synonymInput.trim()) {
      e.preventDefault();
      update('synonyms', [...form.synonyms, synonymInput.trim()]);
      setSynonymInput('');
    }
  }

  function removeSynonym(index: number) {
    update(
      'synonyms',
      form.synonyms.filter((_, i) => i !== index),
    );
  }

  function handleSave() {
    setSubmitted(true);
    if (errors.word || errors.korMeaning || errors.partsOfSpeech) return;
    submit();
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-white w-full max-w-160 rounded-3xl shadow-[0px_24px_64px_rgba(0,27,95,0.12)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-10 pt-8 pb-6 flex justify-between items-start shrink-0">
          <div>
            <h2 className="font-headline text-[32px] font-extrabold text-primary leading-tight">
              {wordId ? 'Edit Word' : 'Add New Word'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="px-10 pb-10 space-y-4 overflow-y-auto">
          {/* Row 1: Word + Difficulty Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
                Word
              </label>
              <input
                className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-headline font-bold text-primary placeholder:text-on-surface-variant/30"
                placeholder="e.g. Ephemeral"
                type="text"
                value={form.word}
                onChange={(e) => update('word', e.target.value)}
              />
              {submitted && errors.word && <p className="text-xs text-error ml-1">{errors.word}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
                Difficulty Level
              </label>
              <div className="relative">
                <select
                  className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-on-surface-variant pr-10"
                  value={form.difficulty}
                  onChange={(e) =>
                    update('difficulty', Number(e.target.value) as WordDifficultyLevel)
                  }
                >
                  {DIFFICULTY_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      Level {l}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Part of Speech — 풀 너비로 7개 버튼을 한 줄에 배치 */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              Part of Speech
            </label>
            <div className="flex gap-2 bg-surface-container-low rounded-xl p-3">
              {PARTS_OF_SPEECH.map((pos) => {
                const selected = form.partsOfSpeech.includes(pos);
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() =>
                      update(
                        'partsOfSpeech',
                        selected
                          ? form.partsOfSpeech.filter((p) => p !== pos)
                          : [...form.partsOfSpeech, pos],
                      )
                    }
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      selected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/50'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
            {submitted && errors.partsOfSpeech && (
              <p className="text-xs text-error ml-1">{errors.partsOfSpeech}</p>
            )}
          </div>

          {/* Row 3: Korean Meaning */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              Korean Meaning
            </label>
            <input
              className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant placeholder:text-on-surface-variant/30"
              placeholder="e.g. 일시적인, 덧없는"
              type="text"
              value={form.korMeaning}
              onChange={(e) => update('korMeaning', e.target.value)}
            />
            {submitted && errors.korMeaning && (
              <p className="text-xs text-error ml-1">{errors.korMeaning}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              English Meaning
            </label>
            <textarea
              className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-on-surface-variant placeholder:text-on-surface-variant/30"
              placeholder="Describe the nuanced definition..."
              rows={2}
              value={form.engMeaning}
              onChange={(e) => update('engMeaning', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              Synonyms
            </label>
            <div className="w-full bg-surface-container-low rounded-xl p-3 flex flex-wrap gap-2 items-center min-h-14">
              {form.synonyms.map((syn, i) => (
                <div
                  key={i}
                  className="pl-3 pr-2 py-1.5 bg-white text-primary rounded-lg text-[13px] font-semibold flex items-center gap-2 shadow-sm border border-black/5"
                >
                  {syn}
                  <button
                    type="button"
                    onClick={() => removeSynonym(i)}
                    className="flex items-center justify-center hover:bg-surface-container-low rounded-md p-0.5"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      close
                    </span>
                  </button>
                </div>
              ))}
              <input
                className="bg-transparent border-none focus:ring-0 outline-none p-1 text-[13px] grow min-w-37.5 text-on-surface-variant placeholder:text-on-surface-variant/40"
                placeholder="Add synonym and press Enter..."
                type="text"
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                onKeyDown={handleSynonymKeyDown}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block">
              Example Sentence
            </label>
            <textarea
              className="w-full text-sm bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-on-surface-variant placeholder:text-on-surface-variant/30"
              placeholder="Fashions are ephemeral; style is eternal."
              rows={3}
              value={form.sentence}
              onChange={(e) => update('sentence', e.target.value)}
            />
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
              {mutation.isPending ? 'Saving...' : 'Save Word'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
