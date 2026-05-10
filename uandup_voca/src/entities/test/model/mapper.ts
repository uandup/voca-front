import type { WordTestType } from './types';

export function toWordTestType(
  subType: 'WORD_TO_MEANING' | 'MEANING_TO_WORD' | string | undefined,
): WordTestType {
  return subType === 'WORD_TO_MEANING' ? 'word-to-meaning' : 'meaning-to-word';
}
