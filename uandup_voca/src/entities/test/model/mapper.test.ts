import { describe, it, expect } from 'vitest';
import { toWordTestType, toExamDetail, toStepExamHistory } from './mapper';

describe('toWordTestType', () => {
  it('WORD_TO_MEANING → word-to-meaning', () => {
    expect(toWordTestType('WORD_TO_MEANING')).toBe('word-to-meaning');
  });

  it('MEANING_TO_WORD → meaning-to-word', () => {
    expect(toWordTestType('MEANING_TO_WORD')).toBe('meaning-to-word');
  });

  it('undefined → meaning-to-word (기본값)', () => {
    expect(toWordTestType(undefined)).toBe('meaning-to-word');
  });

  it('알 수 없는 값 → meaning-to-word (방어적 기본값)', () => {
    expect(toWordTestType('UNKNOWN_VALUE')).toBe('meaning-to-word');
  });
});

describe('toExamDetail', () => {
  it('items가 itemOrder 오름차순으로 정렬된다', () => {
    const result = toExamDetail({
      examId: 1,
      studySetId: 1,
      status: 'COMPLETED',
      items: [
        { examItemId: 10, itemOrder: 3, word: 'c' },
        { examItemId: 11, itemOrder: 1, word: 'a' },
        { examItemId: 12, itemOrder: 2, word: 'b' },
      ],
    });
    expect(result.items.map((i) => i.itemOrder)).toEqual([1, 2, 3]);
    expect(result.items.map((i) => i.word)).toEqual(['a', 'b', 'c']);
  });

  it('subType이 없으면 null (있으면 변환)', () => {
    expect(toExamDetail({ examId: 1, studySetId: 1 }).subType).toBeNull();
    expect(toExamDetail({ examId: 1, studySetId: 1, subType: 'WORD_TO_MEANING' }).subType).toBe(
      'word-to-meaning',
    );
  });

  it('items가 비어있어도 정상 처리', () => {
    expect(toExamDetail({ examId: 1, studySetId: 1 }).items).toEqual([]);
  });

  it('null 필드들은 null로 보존된다 (isPassed, userAnswer, isCorrect)', () => {
    const result = toExamDetail({
      examId: 1,
      studySetId: 1,
      // schema는 nullable 필드를 optional로만 노출하지만 서버는 null 보낼 수 있음. as never로 우회.
      items: [
        { examItemId: 1, itemOrder: 1, isCorrect: null as never, userAnswer: null as never },
      ],
    });
    expect(result.isPassed).toBeNull();
    expect(result.items[0].isCorrect).toBeNull();
    expect(result.items[0].userAnswer).toBeNull();
  });
});

describe('toStepExamHistory', () => {
  it('failedAttempts가 비어있어도 정상 처리', () => {
    const result = toStepExamHistory({ studySetId: 1, examType: 'WORD' });
    expect(result.failedAttempts).toEqual([]);
    expect(result.currentExamId).toBeNull();
  });

  it('current.subType이 있으면 client 타입으로 변환된다', () => {
    const result = toStepExamHistory({
      studySetId: 1,
      examType: 'WORD',
      current: { examId: 5, subType: 'MEANING_TO_WORD' },
    });
    expect(result.currentSubType).toBe('meaning-to-word');
    expect(result.currentExamId).toBe(5);
  });

  it('current.subType이 없으면 null로 보존된다 (SENTENCE/REVIEW 시험 등)', () => {
    const result = toStepExamHistory({
      studySetId: 1,
      examType: 'EXAMPLE',
      current: { examId: 5 },
    });
    expect(result.currentSubType).toBeNull();
  });
});
