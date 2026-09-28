import { useMemo, useState } from 'react';
import { shuffle } from '@/shared/lib/shuffle';

// 단어 목록의 "표시 순서"만 클라이언트에서 섞는 훅. 서버 데이터는 건드리지 않는다.
// - shuffle()을 누를 때마다 매번 새 무작위 순서를 만든다(복구/토글 없음).
// - 순열은 id 배열로만 저장하므로 words가 갱신돼도 안전하다(없는 id는 뒤로 밀린다).
// - 영속화하지 않는다: 섞은 순서는 휘발성 뷰 상태이고, 저장 시 목록 변경으로 stale해진다.
//
// id 외의 필드는 보지 않으므로 `{ id: number }`를 만족하는 어떤 목록에도 쓸 수 있다.
// (WordCardData 전용이었으나 모바일 뷰모델도 같은 순서 로직이 필요해 제네릭으로 넓혔다.
//  반환 타입이 입력 타입을 그대로 따라가므로 기존 호출부는 영향이 없다.)
export function useWordShuffle<T extends { id: number }>(words: T[]) {
  // null = 원본(서버) 순서. 배열 = 섞인 id 순서.
  const [shuffledIds, setShuffledIds] = useState<number[] | null>(null);
  // 섞을 때마다 증가. Flashcard를 리마운트해 첫 카드로 되돌리는 key로 쓴다.
  const [shuffleCount, setShuffleCount] = useState(0);

  const orderedWords = useMemo(() => {
    if (!shuffledIds) return words;
    const rank = new Map(shuffledIds.map((id, i) => [id, i]));
    // 순열에 없는 단어(데이터 갱신 등)는 Infinity로 뒤에 배치. 안정 정렬 유지.
    return [...words].sort(
      (a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity),
    );
  }, [words, shuffledIds]);

  function shuffleWords() {
    setShuffledIds(shuffle(words.map((w) => w.id)));
    setShuffleCount((c) => c + 1);
  }

  return { orderedWords, shuffle: shuffleWords, shuffleCount };
}
