import type { WordTestType } from '../model/types';

export function toExamSubType(type: WordTestType): 'WORD_TO_MEANING' | 'MEANING_TO_WORD' {
  const map: Record<WordTestType, 'WORD_TO_MEANING' | 'MEANING_TO_WORD'> = {
    'word-to-meaning': 'WORD_TO_MEANING',
    'meaning-to-word': 'MEANING_TO_WORD',
  };
  return map[type];
}
