import type { Word, WordListItem } from '../model/types';

export const WORD_MOCK: Word[] = [
  {
    id: 1,
    difficultyLevel: 2,
    word: 'Ambiguity',
    synonyms: ['Vagueness', 'Obscurity', 'Equivocation'],
    partOfSpeech: 'N',
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    exampleSentence: 'The ambiguity of the poem allows multiple readings by different critics.',
  },
  {
    id: 2,
    difficultyLevel: 2,
    word: 'Corroborate',
    synonyms: ['Validate', 'Verify', 'Authenticate'],
    partOfSpeech: 'V',
    korMeaning: '확증하다, 입증하다',
    engMeaning: 'To confirm or give support to (a statement, theory, or finding).',
    exampleSentence:
      "The witness was able to corroborate the suspect's alibi with specific details.",
  },
  {
    id: 3,
    difficultyLevel: 2,
    word: 'Resilient',
    synonyms: ['Tough', 'Strong', 'Adaptable'],
    partOfSpeech: 'Adj',
    korMeaning: '회복력 있는, 탄력 있는',
    engMeaning: 'Able to withstand or recover quickly from difficult conditions.',
    exampleSentence: 'Despite the heavy rains, the local crops proved remarkably resilient.',
  },
];

// 단어 테스트 사이클 내 단어 목록 (VocabListPage)
export const MOCK_CYCLE_WORDS: WordListItem[] = [
  {
    id: 1,
    difficultyLevel: 3,
    category: 'Academic Core',
    word: 'Ambiguity',
    partOfSpeech: 'N',
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    exampleSentence: '',
    starred: false,
  },
  {
    id: 2,
    difficultyLevel: 4,
    category: 'Scholarly Prose',
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    korMeaning: '병치, 나란히 놓기',
    engMeaning: 'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
    starred: false,
  },
  {
    id: 3,
    difficultyLevel: 3,
    category: 'Literature Analysis',
    word: 'Inherent',
    partOfSpeech: 'Adj',
    korMeaning: '내재하는, 본질적인',
    engMeaning: 'Existing as a natural or permanent quality of something.',
    synonyms: ['intrinsic', 'innate', 'essential'],
    exampleSentence: '',
    starred: false,
  },
  {
    id: 4,
    difficultyLevel: 5,
    category: 'Advanced Dialectic',
    word: 'Pragmatic',
    partOfSpeech: 'Adj',
    korMeaning: '실용적인, 실제적인',
    engMeaning: 'Dealing with things sensibly and realistically based on practical considerations.',
    synonyms: ['practical', 'utilitarian', 'sensible'],
    exampleSentence: '',
    starred: false,
  },
];

// 레벨 테스트 단어 목록 (LevelWordListPage)
export const MOCK_LEVEL_WORDS: Word[] = [
  {
    id: 1,
    difficultyLevel: 4,
    word: 'Ambiguity',
    partOfSpeech: 'N',
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    exampleSentence: '',
  },
  {
    id: 2,
    difficultyLevel: 4,
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    korMeaning: '병치, 나란히 놓기',
    engMeaning: 'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
  },
];

// 오답 단어 목록 (WrongWordListPage)
export const MOCK_WRONG_WORDS: WordListItem[] = [
  {
    id: 1,
    difficultyLevel: 3,
    word: 'Ambiguity',
    partOfSpeech: 'N',
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    exampleSentence: '',
    wrongCount: 5,
  },
  {
    id: 2,
    difficultyLevel: 4,
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    korMeaning: '병치, 나란히 놓기',
    engMeaning: 'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
    wrongCount: 3,
  },
];
