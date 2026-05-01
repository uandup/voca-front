import type { WordListItem } from '../model/types';

export const MOCK_WORDS: WordListItem[] = [
  {
    id: 1,
    difficultyLevel: 3,
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
    engMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
  },
  {
    id: 3,
    difficultyLevel: 3,
    word: 'Inherent',
    partOfSpeech: 'Adj',
    korMeaning: '내재하는, 본질적인',
    engMeaning: 'Existing as a natural or permanent quality of something.',
    synonyms: ['intrinsic', 'innate', 'essential'],
    exampleSentence: '',
  },
  {
    id: 4,
    difficultyLevel: 5,
    word: 'Pragmatic',
    partOfSpeech: 'Adj',
    korMeaning: '실용적인, 실제적인',
    engMeaning: 'Dealing with things sensibly and realistically based on practical considerations.',
    synonyms: ['practical', 'utilitarian', 'sensible'],
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
    engMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    exampleSentence: '',
    wrongCount: 3,
  },
];
