import { shuffle } from '@/shared/lib/shuffle';
import type { VocabReviewItem, WordCardData, WordTestItem } from '@/entities/word';

// 문항 수를 1 ~ 단어 수 범위로 맞춘다. 단어가 없으면 0.
// 선생님 설정 문항 수가 이 study-set의 단어 수보다 많을 수 있어 기본값 계산에 쓴다.
export function clampQuestionCount(count: number, wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.min(Math.max(count, 1), wordCount);
}

// 문항 수 입력값 검증. 문제가 없으면 null, 있으면 화면에 띄울 안내 문구.
// 설정 화면(에러 표시)과 훅(Start 가드)이 같은 규칙을 쓰도록 한 곳에 둔다.
export function getQuestionCountError(count: number, wordCount: number): string | null {
  if (wordCount <= 0) return 'There are no words to test.';
  if (count < 1) return 'Enter at least 1 question.';
  if (count > wordCount) return `You can test up to ${wordCount} words.`;
  return null;
}

// 단어 목록에서 무작위로 count개를 뽑아 시험 문항으로 만든다.
// id는 원본 word id가 아니라 출제 순서(1..N) — 답안 Record의 key이자 ProgressPanel 번호가 된다.
export function pickSelfTestQuestions(words: WordCardData[], count: number): WordTestItem[] {
  return shuffle(words)
    .slice(0, count)
    .map((word, index) => ({
      id: index + 1,
      word: word.word,
      korMeaning: word.korMeaning,
      engMeaning: word.engMeaning,
      synonyms: word.synonyms,
    }));
}

// 응시 문항 → 정답 공개(VocabReviewTable)용 문항.
// 정답 synonym은 복수 — entities/test의 toVocabReviewItems와 같은 규칙으로 ", "로 이어 표시한다.
export function toSelfTestReviewItems(items: WordTestItem[]): VocabReviewItem[] {
  return items.map((item) => ({
    id: item.id,
    word: item.word,
    korMeaning: item.korMeaning,
    engMeaning: item.engMeaning,
    synonymAnswer: item.synonyms.join(', '),
  }));
}
