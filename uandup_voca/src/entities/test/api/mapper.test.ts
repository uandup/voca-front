import { describe, it, expect } from 'vitest';
import { toExamSubType } from './mapper';

describe('toExamSubType', () => {
  it('word-to-meaning → WORD_TO_MEANING', () => {
    expect(toExamSubType('word-to-meaning')).toBe('WORD_TO_MEANING');
  });

  it('meaning-to-word → MEANING_TO_WORD', () => {
    expect(toExamSubType('meaning-to-word')).toBe('MEANING_TO_WORD');
  });
});
