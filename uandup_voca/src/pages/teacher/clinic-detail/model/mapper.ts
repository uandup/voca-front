import type { StepCardVM, ExamItem, SentenceTestAnswer } from '@/entities/test';
import type { WordTestItem, VocabReviewItem, SentenceTestItem } from '@/entities/word';
import type { ESRow } from '@/widgets/test-offline';

export type PanelPhase = 'pending' | 'created' | 'fail' | 'passed';

export function inferPhase(step: StepCardVM): PanelPhase {
  if (step.status === 'passed') return 'passed';
  if (step.status === 'fail') return 'fail';
  if (step.status === 'active' || step.status === 'grading') return 'created';
  return 'pending';
}

export function isSentenceStep(step: StepCardVM): boolean {
  return step.name === 'Sentence';
}

// row 컴포넌트의 `id`는 화면 표시 번호 + React key + wrongIds 등 클라이언트 상태 추적용.
// itemOrder를 사용해 시험지 상의 의도된 번호(1~)와 일치시킨다. 채점 API 호출 시엔
// 페이지에서 examItemId를 따로 매핑하므로 백엔드 식별자가 손실되지 않는다.
export function toWordTestItems(items: ExamItem[]): WordTestItem[] {
  return items.map((item) => ({
    id: item.itemOrder,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
    synonyms: item.synonyms,
  }));
}

export function toVocabReviewItems(items: ExamItem[]): VocabReviewItem[] {
  return items.map((item) => ({
    id: item.itemOrder,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
    synonymAnswer: item.synonyms[0] ?? '',
  }));
}

export function toESRows(items: ExamItem[]): ESRow[] {
  return items.map((item) => ({
    no: String(item.itemOrder),
    sentence: item.example,
    answer: item.koreanMeaning,
  }));
}

export function toSentenceTestItems(items: ExamItem[]): SentenceTestItem[] {
  return items.map((item) => ({
    id: item.itemOrder,
    sentence: item.example,
  }));
}

export function toSentenceAnswers(items: ExamItem[]): Record<number, SentenceTestAnswer> {
  return Object.fromEntries(
    items.map((item) => [item.itemOrder, { answer: item.userAnswer ?? '' }]),
  );
}
