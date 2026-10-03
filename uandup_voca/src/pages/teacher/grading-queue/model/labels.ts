import type { ExamType } from '@/entities/test';

// 큐 항목의 유형 뱃지에 표시할 사람이 읽는 라벨.
// EXAMPLE은 도메인상 "문장(예문) 시험"이므로 Sentence로 노출한다 — 채점 화면 분기와 동일 의미.
const EXAM_TYPE_LABEL: Record<ExamType, string> = {
  WORD: 'Word',
  EXAMPLE: 'Sentence',
  REVIEW1: 'Review 1',
  REVIEW2: 'Review 2',
  REVIEW3: 'Review 3',
  REVIEW_DECK: 'Review Deck',
  LEVEL_TEST: 'Level Test',
};

export function examTypeLabel(examType: ExamType): string {
  return EXAM_TYPE_LABEL[examType];
}
