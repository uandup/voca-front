import { describe, it, expect } from 'vitest';
import { toReviewDeckExamRow, toReviewDeckWord } from './mapper';

describe('toReviewDeckExamRow', () => {
  it('status 기본값은 READY (서버가 안 내려준 경우)', () => {
    expect(toReviewDeckExamRow({ examId: 1 }).status).toBe('READY');
  });

  it('totalCount는 questionCount에서 가져온다', () => {
    const row = toReviewDeckExamRow({ examId: 1, wordCount: 50, questionCount: 25 });
    expect(row.wordCount).toBe(50);
    expect(row.totalCount).toBe(25);
  });

  it('correctCount는 null 보존 (시험 미완료 상태)', () => {
    expect(toReviewDeckExamRow({ examId: 1 }).correctCount).toBeNull();
  });
});

describe('toReviewDeckWord', () => {
  it('백엔드 소문자 약어 7종을 클라이언트 대소문자 약어로 변환한다', () => {
    const result = toReviewDeckWord({
      wordId: 1,
      partsOfSpeech: ['n', 'v', 'adj', 'adv', 'prep', 'conj', 'interj'],
    });
    expect(result.partsOfSpeech).toEqual(['N', 'V', 'Adj', 'Adv', 'Prep', 'Conj', 'Interj']);
  });

  it('알 수 없는 POS는 N으로 폴백된다', () => {
    // 서버가 새 품사를 추가하거나 잘못된 값을 내려도 클라이언트가 깨지지 않게 폴백.
    const result = toReviewDeckWord({ wordId: 1, partsOfSpeech: ['pron', 'GARBAGE'] });
    expect(result.partsOfSpeech).toEqual(['N', 'N']);
  });

  it('partsOfSpeech가 없으면 빈 배열', () => {
    expect(toReviewDeckWord({ wordId: 1 }).partsOfSpeech).toEqual([]);
  });

  it('sentence는 서버의 example 필드에서 매핑된다', () => {
    expect(toReviewDeckWord({ wordId: 1, example: 'I like it.' }).sentence).toBe('I like it.');
  });
});
