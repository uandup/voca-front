import { useState } from 'react';

const STORAGE_KEY = 'word_mask';

interface MaskState {
  hideWord: boolean;
  hideMeaning: boolean;
}

function readFromStorage(): MaskState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { hideWord: false, hideMeaning: false };
  const parsed = JSON.parse(raw) as Partial<MaskState>;
  return { hideWord: parsed.hideWord === true, hideMeaning: parsed.hideMeaning === true };
}

/**
 * 단어장 리스트에서 단어/뜻을 가리는 토글 상태 hook.
 * 학생이 손으로 가리고 외우던 동작을 대신한다.
 *
 * 두 토글은 독립이다 — 둘 다 켜면 LEVEL·별점·기출 태그만 남는다(양방향 암기용).
 *
 * 스코프 없는 전역 키 하나에 저장한다. 북마크(useWordBookmarks)는 목록마다 대상이 달라
 * scopeKey를 받지만, 가리기는 목록과 무관한 "학습 취향"이라 WordFlashcard의
 * flashcard:frontFace와 같은 성격이다.
 * (셔플은 목록이 갱신되면 stale해지는 휘발성 뷰 상태라 영속화하지 않는다 — useWordShuffle 참고.)
 */
export function useWordMask() {
  const [mask, setMask] = useState<MaskState>(readFromStorage);

  function update(next: MaskState) {
    setMask(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return {
    hideWord: mask.hideWord,
    hideMeaning: mask.hideMeaning,
    toggleHideWord: () => update({ ...mask, hideWord: !mask.hideWord }),
    toggleHideMeaning: () => update({ ...mask, hideMeaning: !mask.hideMeaning }),
  };
}
