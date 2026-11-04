import { useState } from 'react';
import axios from 'axios';
import { Modal } from '@/shared/ui/Modal';
import { NumberInput } from '@/shared/ui/NumberInput';
import { usePersonalWordSets } from '@/entities/personal-word-set';
import { usePersonalWordsBySet } from '@/entities/personal-word';
import type { WordTestType } from '@/entities/test';
import { usePersonalTestExamActions } from '../model/usePersonalTestExamActions';

interface PersonalTestCreateModalProps {
  studentId: number;
  // 처음 선택할 세트. 세트 상세 화면에서 열면 그 세트로 고정(lockSet)한다.
  initialSetId?: number;
  lockSet?: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const TEST_TYPE_OPTIONS: { value: WordTestType; label: string }[] = [
  { value: 'word-to-meaning', label: 'Word → Meaning' },
  { value: 'meaning-to-word', label: 'Meaning → Word' },
];

const DEFAULT_QUESTION_COUNT = 20;

// 사용자가 고른 범위 — 어느 세트에서 고른 것인지 함께 둔다. 세트를 바꾸면 이 값은 무시되고
// 새 세트의 전체 범위(1~N)가 기본값이 된다(effect로 리셋하지 않고 렌더 시점에 판정).
interface RangeSelection {
  setId: number;
  start: number;
  end: number;
}

// 개인 단어장 시험 생성 모달 — 세트 1개 → 등록순 연속 범위(From~To) → 문항 수 → 방향.
// 서버는 범위 안에서 문항 수만큼 랜덤 선택·랜덤 순서로 출제한다.
//
// 범위 번호는 세트 단어 목록 API의 순서(등록순) 그대로다 — 서버가 같은 순서로 잘라야 하므로
// 여기서 정렬·필터·셔플한 목록으로 번호를 매기면 안 된다.
// 클리닉 Personal Words 탭과 세트 상세(선생님) 두 페이지가 쓰므로 features에 둔다.
export function PersonalTestCreateModal({
  studentId,
  initialSetId,
  lockSet = false,
  onClose,
  onCreated,
}: PersonalTestCreateModalProps) {
  const { data: sets = [] } = usePersonalWordSets(studentId, studentId > 0);
  // 단어가 없는 세트에선 범위를 만들 수 없다
  const selectableSets = sets.filter((s) => s.wordCount > 0);

  const [pickedSetId, setPickedSetId] = useState<number | null>(initialSetId ?? null);
  const selectedSetId = pickedSetId ?? selectableSets[0]?.id ?? 0;

  const {
    data: words = [],
    isLoading: wordsLoading,
    refetch: refetchWords,
  } = usePersonalWordsBySet(selectedSetId, selectedSetId > 0);

  const [range, setRange] = useState<RangeSelection | null>(null);
  const [questionCount, setQuestionCount] = useState(String(DEFAULT_QUESTION_COUNT));
  const [testType, setTestType] = useState<WordTestType>('word-to-meaning');
  const [staleNotice, setStaleNotice] = useState(false);

  const { create } = usePersonalTestExamActions(studentId);

  const total = words.length;
  const rangeForSet = range && range.setId === selectedSetId ? range : null;
  // 단어 목록이 줄어든 경우(새로고침 후)에도 번호가 목록을 벗어나지 않게 자른다
  const start = Math.min(rangeForSet?.start ?? 1, Math.max(total, 1));
  const end = Math.min(rangeForSet?.end ?? total, total);
  const rangeSize = total > 0 ? end - start + 1 : 0;

  const qty = Number(questionCount);
  const errorMessage =
    total === 0
      ? 'This set has no words.'
      : start > end
        ? '"From" must not be after "To".'
        : qty < 1
          ? 'Question Quantity must be at least 1.'
          : qty > rangeSize
            ? `Question Quantity cannot exceed the range size (${rangeSize}).`
            : '';

  const createDisabled = wordsLoading || errorMessage !== '' || create.isPending;

  function updateRange(next: Partial<Pick<RangeSelection, 'start' | 'end'>>) {
    setStaleNotice(false);
    setRange({ setId: selectedSetId, start, end, ...next });
  }

  function handleSetChange(setId: number) {
    setStaleNotice(false);
    setPickedSetId(setId);
    setRange(null);
  }

  function handleCreate() {
    if (createDisabled) return;
    create.mutate(
      {
        personalWordSetId: selectedSetId,
        startIndex: start,
        endIndex: end,
        expectedStartWordId: words[start - 1].id,
        expectedEndWordId: words[end - 1].id,
        questionCount: qty,
        testType,
      },
      {
        onSuccess: () => {
          onCreated?.();
          onClose();
        },
        onError: (error) => {
          // 범위를 본 뒤 학생이 단어를 추가·삭제해 번호가 밀렸다(409) 또는 지워져 범위가 목록을 벗어났다(400) —
          // 최신 목록을 다시 받아 전체 범위로 되돌린다. 서버 메시지는 전역 알림이 띄우고,
          // 409는 "다시 고르라"는 안내를 모달 안에도 남긴다.
          const status = axios.isAxiosError(error) ? error.response?.status : undefined;
          if (status === 409 || status === 400) {
            setStaleNotice(status === 409);
            setRange(null);
            void refetchWords();
          }
        },
      },
    );
  }

  const selectedSet = sets.find((s) => s.id === selectedSetId);
  const fieldClass =
    'w-full text-sm bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface disabled:opacity-60';
  const labelClass =
    'text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1 block mb-2';

  return (
    <Modal onClose={onClose}>
      <div className="bg-white w-full max-w-160 rounded-3xl shadow-[0px_24px_64px_rgba(0,27,95,0.12)] overflow-hidden flex flex-col">
        <div className="px-10 pt-8 pb-6 flex justify-between items-start shrink-0">
          <div>
            <h2 className="font-headline text-[28px] font-extrabold text-primary leading-tight">
              Generate Personal Test
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Questions are picked at random from the selected range. Wrong answers go to the Review
              Deck.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="px-10 pb-10 space-y-5">
          {/* Word Set */}
          <div>
            <label className={labelClass}>Word Set</label>
            {lockSet ? (
              <p className="text-sm font-bold text-primary ml-1">
                {selectedSet?.name ?? '—'}{' '}
                <span className="font-normal text-on-surface-variant">({total} words)</span>
              </p>
            ) : selectableSets.length === 0 ? (
              <p className="text-sm text-on-surface-variant ml-1">
                No word sets with words yet. Add words to a set first.
              </p>
            ) : (
              <select
                value={selectedSetId}
                onChange={(e) => handleSetChange(Number(e.target.value))}
                className={fieldClass}
              >
                {selectableSets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.wordCount} words)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Range — 번호는 등록순(목록 API 순서) 그대로 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>From</label>
              <select
                value={start}
                onChange={(e) => updateRange({ start: Number(e.target.value) })}
                disabled={wordsLoading || total === 0}
                className={fieldClass}
              >
                {words.map((w, i) => (
                  <option key={w.id} value={i + 1}>
                    #{i + 1}. {w.word} — {w.koreanMeaning}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>To</label>
              <select
                value={end}
                onChange={(e) => updateRange({ end: Number(e.target.value) })}
                disabled={wordsLoading || total === 0}
                className={fieldClass}
              >
                {words.map((w, i) => (
                  <option key={w.id} value={i + 1}>
                    #{i + 1}. {w.word} — {w.koreanMeaning}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Question Quantity</label>
              <NumberInput value={questionCount} onChange={setQuestionCount} className={fieldClass} />
              <p className="text-[11px] text-on-surface-variant mt-1 ml-1">
                {rangeSize} {rangeSize === 1 ? 'word' : 'words'} in range
              </p>
            </div>
            <div>
              <label className={labelClass}>Test Type</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value as WordTestType)}
                className={fieldClass}
              >
                {TEST_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {staleNotice && (
            <p className="text-xs text-error ml-1">
              The word list has changed. Please reselect the range.
            </p>
          )}
          {!staleNotice && errorMessage && total > 0 && (
            <p className="text-xs text-error ml-1">{errorMessage}</p>
          )}

          <div className="flex items-center justify-end gap-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-[15px] font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createDisabled}
              className="px-10 py-4 bg-primary text-white text-[15px] font-bold rounded-xl shadow-[0px_8px_24px_rgba(0,27,95,0.2)] hover:bg-primary-container transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {create.isPending ? 'Generating...' : 'Generate Test'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
