import type { Word } from '../model/types';

export const WORD_MOCK: Word[] = [
  {
    id: 1,
    difficultyLevel: 2,
    word: 'Ambiguity',
    synonyms: ['Vagueness', 'Obscurity', 'Equivocation'],
    partOfSpeech: 'N',
    koreanMeaning: '모호함, 다의성',
    englishMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    exampleSentence: 'The ambiguity of the poem allows multiple readings by different critics.',
  },
  {
    id: 2,
    difficultyLevel: 2,
    word: 'Corroborate',
    synonyms: ['Validate', 'Verify', 'Authenticate'],
    partOfSpeech: 'V',
    koreanMeaning: '확증하다, 입증하다',
    englishMeaning: 'To confirm or give support to (a statement, theory, or finding).',
    exampleSentence:
      "The witness was able to corroborate the suspect's alibi with specific details.",
  },
  {
    id: 3,
    difficultyLevel: 2,
    word: 'Resilient',
    synonyms: ['Tough', 'Strong', 'Adaptable'],
    partOfSpeech: 'Adj',
    koreanMeaning: '회복력 있는, 탄력 있는',
    englishMeaning: 'Able to withstand or recover quickly from difficult conditions.',
    exampleSentence: 'Despite the heavy rains, the local crops proved remarkably resilient.',
  },
];
