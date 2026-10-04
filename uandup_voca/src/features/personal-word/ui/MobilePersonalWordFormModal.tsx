import { useRef, useState } from 'react';
import type { PersonalWordCardData } from '@/entities/personal-word';
import { usePersonalWordActions } from '../model/usePersonalWordActions';
import { MobileModalShell, MobileTextField } from './MobileModalShell';

interface Props {
  studentId: number;
  personalWordSetId: number;
  // 넘기면 수정, 없으면 등록.
  target?: PersonalWordCardData;
  onClose: () => void;
}

/**
 * 폰용 단어 등록·수정 모달 (단어 + 한글 뜻 2필드).
 *
 * 데스크탑은 등록을 PersonalWordBulkAddModal(표에 엑셀 붙여넣기)로 하지만 폰에는 엑셀이 없다.
 * 그래서 폰은 **한 개씩 연속 입력**으로 대체한다 — `Save & add another`가 저장 후 두 칸을 비우고
 * 단어 칸에 포커스를 되돌려주므로, 모달을 여닫지 않고 손가락을 멈추지 않고 계속 넣을 수 있다.
 *
 * 등록과 수정을 한 컴포넌트로 두는 이유: 필드가 완전히 같고, 다른 건 어떤 mutation을 부르는지와
 * 버튼이 하나냐 둘이냐뿐이다. 파일을 쪼개면 같은 폼을 두 벌 유지하게 된다.
 */
export function MobilePersonalWordFormModal({
  studentId,
  personalWordSetId,
  target,
  onClose,
}: Props) {
  const { createMany, update } = usePersonalWordActions({ studentId, personalWordSetId });

  const [word, setWord] = useState(target?.word ?? '');
  const [koreanMeaning, setKoreanMeaning] = useState(target?.koreanMeaning ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  // 연속 등록 중 "지금까지 몇 개 넣었는지" — 모달이 닫히지 않으니 피드백이 없으면
  // 저장이 된 건지 알 수 없다.
  const [addedCount, setAddedCount] = useState(0);

  const wordRef = useRef<HTMLInputElement | null>(null);

  const errors = {
    word: word.trim() === '' ? 'Word is required.' : '',
    koreanMeaning: koreanMeaning.trim() === '' ? 'Meaning is required.' : '',
  };
  const hasError = errors.word !== '' || errors.koreanMeaning !== '';
  const isPending = createMany.isPending || update.isPending;

  // keepOpen=true면 저장 후 입력칸만 비우고 모달을 유지한다.
  function handleSave(keepOpen: boolean) {
    setSubmitted(true);
    if (hasError) return;
    setFailed(false);

    const data = { word, koreanMeaning };

    if (target) {
      update.mutate({ id: target.id, data }, { onSuccess: onClose, onError: () => setFailed(true) });
      return;
    }

    // 서버에 단건 등록 엔드포인트가 없어 1개도 배열로 보낸다(usePersonalWordActions 주석 참고).
    createMany.mutate([data], {
      onSuccess: () => {
        if (!keepOpen) {
          onClose();
          return;
        }
        setWord('');
        setKoreanMeaning('');
        setSubmitted(false);
        setAddedCount((n) => n + 1);
        // 포커스를 단어 칸으로 되돌린다 — 이게 없으면 키보드가 내려가 매번 다시 탭해야 한다.
        wordRef.current?.focus();
      },
      onError: () => setFailed(true),
    });
  }

  return (
    <MobileModalShell title={target ? 'Edit word' : 'Add word'} onClose={onClose}>
      <div className="space-y-4">
        <MobileTextField
          label="Word"
          value={word}
          onChange={setWord}
          placeholder="e.g. abandon"
          error={submitted ? errors.word : ''}
          inputRef={wordRef}
          autoFocus
          autoCapitalize="none"
        />

        <MobileTextField
          label="Meaning"
          value={koreanMeaning}
          onChange={setKoreanMeaning}
          placeholder="예: 버리다, 포기하다"
          error={submitted ? errors.koreanMeaning : ''}
          // 수정 모드는 버튼이 하나뿐이라 Enter로 바로 저장해도 모호하지 않다.
          // 등록 모드는 Enter가 "계속 추가"인지 "닫기"인지 정할 수 없어 묶지 않는다.
          onEnter={target ? () => handleSave(false) : undefined}
        />

        {failed && (
          <p className="text-xs text-error">Could not save. Check your connection and try again.</p>
        )}

        {target ? (
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isPending}
            className="w-full min-h-12 rounded-xl bg-primary text-white text-sm font-bold touch-manipulation disabled:opacity-60"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        ) : (
          <div className="space-y-2">
            {/* 연속 추가를 주 버튼으로 둔다 — 단어를 하나만 넣고 끝내는 경우는 드물다. */}
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isPending}
              className="w-full min-h-12 rounded-xl bg-primary text-white text-sm font-bold touch-manipulation disabled:opacity-60"
            >
              {isPending ? 'Saving...' : 'Save & add another'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isPending}
              className="w-full min-h-12 rounded-xl border border-outline-variant/60 text-sm font-bold text-on-surface-variant touch-manipulation disabled:opacity-60"
            >
              Save and close
            </button>
            {addedCount > 0 && (
              <p className="text-xs text-on-surface-variant text-center pt-1">
                {addedCount} {addedCount === 1 ? 'word' : 'words'} added
              </p>
            )}
          </div>
        )}
      </div>
    </MobileModalShell>
  );
}
