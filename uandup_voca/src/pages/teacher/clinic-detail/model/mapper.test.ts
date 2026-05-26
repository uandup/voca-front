import { describe, it, expect } from 'vitest';
import {
  inferPhase,
  isSentenceStep,
  toWordTestItems,
  toVocabReviewItems,
  toESRows,
  toSentenceTestItems,
  toSentenceAnswers,
  toSentencePreviewItems,
} from './mapper';
import type { StepCardVM, ExamItem } from '@/entities/test';

// ── inferPhase: 6 step status → 4 panel phase 매핑 ───────────────────────────

function step(status: StepCardVM['status']): StepCardVM {
  return {
    name: 'Word',
    status,
    createdAt: null,
    lastScore: null,
    maxScore: null,
    retakeCount: 0,
    examId: null,
  };
}

describe('inferPhase — step status → panel phase 매핑', () => {
  it('passed → passed', () => {
    expect(inferPhase(step('passed'))).toBe('passed');
  });

  it('fail → fail', () => {
    expect(inferPhase(step('fail'))).toBe('fail');
  });

  it('active → created (시험 생성됨, 응시 가능 상태)', () => {
    expect(inferPhase(step('active'))).toBe('created');
  });

  it('grading → created (시험 생성됨, 채점 대기)', () => {
    expect(inferPhase(step('grading'))).toBe('created');
  });

  it('pending → pending', () => {
    expect(inferPhase(step('pending'))).toBe('pending');
  });

  it('locked → pending (locked는 panel 안 띄움이라 같은 처리)', () => {
    expect(inferPhase(step('locked'))).toBe('pending');
  });
});

describe('isSentenceStep', () => {
  it("name === 'Sentence'일 때만 true", () => {
    expect(isSentenceStep(step('active'))).toBe(false); // name='Word'
    expect(isSentenceStep({ ...step('active'), name: 'Sentence' })).toBe(true);
    expect(isSentenceStep({ ...step('active'), name: 'Review 1' })).toBe(false);
  });
});

// ── ExamItem[] → 다양한 row 형태 변환 ────────────────────────────────────────

const sampleItems: ExamItem[] = [
  {
    examItemId: 100,
    itemOrder: 1,
    word: 'go',
    koreanMeaning: '가다',
    englishMeaning: 'to move',
    synonyms: ['move', 'travel'],
    example: 'Let go.',
    isCorrect: null,
    userAnswer: 'depart',
    synonymUserAnswers: [],
  },
  {
    examItemId: 101,
    itemOrder: 2,
    word: 'stop',
    koreanMeaning: '멈추다',
    englishMeaning: 'to halt',
    synonyms: [],
    example: 'Stop now.',
    isCorrect: true,
    userAnswer: 'halt',
    synonymUserAnswers: [],
  },
];

describe('toWordTestItems', () => {
  // ⚠️ id에 itemOrder를 쓴다 — examItemId가 아님 (UI 표시 번호와 일치시키기 위함).
  // 채점 API 호출 시엔 examItemId를 페이지에서 따로 매핑한다.
  it('id는 itemOrder (시험지 표시 번호)', () => {
    const result = toWordTestItems(sampleItems);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it('필요한 필드만 추출 (example/userAnswer/isCorrect 제외)', () => {
    const result = toWordTestItems(sampleItems);
    expect(result[0]).toEqual({
      id: 1,
      word: 'go',
      korMeaning: '가다',
      engMeaning: 'to move',
      synonyms: ['move', 'travel'],
    });
  });
});

describe('toVocabReviewItems', () => {
  it('synonymAnswer는 첫 번째 synonym (없으면 빈 문자열)', () => {
    const result = toVocabReviewItems(sampleItems);
    expect(result[0].synonymAnswer).toBe('move');
    expect(result[1].synonymAnswer).toBe(''); // sampleItems[1].synonyms is empty
  });
});

describe('toESRows', () => {
  // ⚠️ sentence 시험에서 빈칸에 채울 답은 영어 word — koreanMeaning이 아님.
  // 이게 바뀌면 학생이 한국어 뜻을 답으로 채워야 하는 잘못된 채점이 일어남.
  it('answer는 영어 word (한국어 meaning이 아님)', () => {
    const result = toESRows(sampleItems);
    expect(result[0].answer).toBe('go');
    expect(result[1].answer).toBe('stop');
  });

  it('no는 itemOrder를 string으로 변환', () => {
    expect(toESRows(sampleItems).map((r) => r.no)).toEqual(['1', '2']);
  });

  it('sentence는 example에서 가져온다', () => {
    expect(toESRows(sampleItems)[0].sentence).toBe('Let go.');
  });
});

describe('toSentenceTestItems', () => {
  it('id는 itemOrder, sentence는 example', () => {
    const result = toSentenceTestItems(sampleItems);
    expect(result).toEqual([
      { id: 1, sentence: 'Let go.' },
      { id: 2, sentence: 'Stop now.' },
    ]);
  });
});

describe('toSentenceAnswers', () => {
  it('itemOrder 기준 키로 묶인다 (examItemId가 아님 — 페이지 state 추적용)', () => {
    const result = toSentenceAnswers(sampleItems);
    expect(result).toEqual({
      1: { answer: 'depart' },
      2: { answer: 'halt' },
    });
  });

  it('userAnswer가 null이면 빈 문자열로 폴백', () => {
    const result = toSentenceAnswers([{ ...sampleItems[0], userAnswer: null }]);
    expect(result[1].answer).toBe('');
  });
});

describe('toSentencePreviewItems', () => {
  it('answer는 영어 word (toESRows와 동일 규칙)', () => {
    const result = toSentencePreviewItems(sampleItems);
    expect(result[0]).toEqual({ id: 1, sentence: 'Let go.', answer: 'go' });
  });
});
