import type { StepCardVM, ExamItem, ESRow } from '@/entities/test';

export type PanelPhase = 'pending' | 'created' | 'fail' | 'passed';

export function inferPhase(step: StepCardVM): PanelPhase {
  if (step.status === 'passed') return 'passed';
  if (step.status === 'fail') return 'fail';
  if (step.status === 'active' || step.status === 'grading' || step.status === 'submitted')
    return 'created';
  return 'pending';
}

export function isSentenceStep(step: StepCardVM): boolean {
  return step.name === 'Sentence';
}

export function toESRows(items: ExamItem[]): ESRow[] {
  return items.map((item) => ({
    no: String(item.itemOrder),
    sentence: item.example,
    // sentence 시험의 빈칸은 영어 word를 채우는 것 — koreanMeaning이 아님.
    answer: item.word,
  }));
}
