import type { StepCardVM, ExamItem } from '@/entities/test';
import type { WordTestItem, VocabReviewItem } from '@/entities/word';
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

export function toWordTestItems(items: ExamItem[]): WordTestItem[] {
  return items.map((item) => ({
    id: item.examItemId,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
  }));
}

export function toVocabReviewItems(items: ExamItem[]): VocabReviewItem[] {
  return items.map((item) => ({
    id: item.examItemId,
    word: item.word,
    korMeaning: item.koreanMeaning,
    engMeaning: item.englishMeaning,
    synonymAnswer: item.synonyms[0] ?? '',
  }));
}

export function toESRows(items: ExamItem[]): ESRow[] {
  return items.map((item, i) => ({
    no: String(i + 1),
    sentence: item.example,
    answer: item.koreanMeaning,
  }));
}
