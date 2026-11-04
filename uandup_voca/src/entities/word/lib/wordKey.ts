import type { WordSource } from '../model/types';

/**
 * 출처까지 포함한 단어 식별 키 — `WORD-5`, `PERSONAL-5`.
 *
 * 공용 단어 5번과 개인 단어 5번은 다른 단어인데 id 숫자가 같다. 두 출처가 한 목록에 섞이는 화면
 * (오답 뱅크 단어 목록, 오답 시험 배정 단어)에서 id만으로 React key·북마크를 잡으면 서로 덮어쓴다.
 * 출처를 모르는(생략된) 단어는 공용 단어로 본다 — 출처 개념 도입 전 데이터가 전부 공용 단어다.
 */
export function toWordKey(word: { id: number; wordSource?: WordSource }): string {
  return `${word.wordSource ?? 'WORD'}-${word.id}`;
}
