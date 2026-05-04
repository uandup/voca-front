import type { WrongWord, Word } from '../model/types';

export const MOCK_WORDS: Word[] = [
  {
    id: 1,
    difficulty: 3,
    word: 'Ambiguity',
    partOfSpeech: 'N',
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    sentence: '',
  },
  {
    id: 2,
    difficulty: 4,
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    korMeaning: '병치, 나란히 놓기',
    engMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    sentence: '',
  },
  {
    id: 3,
    difficulty: 3,
    word: 'Inherent',
    partOfSpeech: 'Adj',
    korMeaning: '내재하는, 본질적인',
    engMeaning: 'Existing as a natural or permanent quality of something.',
    synonyms: ['intrinsic', 'innate', 'essential'],
    sentence: '',
  },
  {
    id: 4,
    difficulty: 5,
    word: 'Pragmatic',
    partOfSpeech: 'Adj',
    korMeaning: '실용적인, 실제적인',
    engMeaning: 'Dealing with things sensibly and realistically based on practical considerations.',
    synonyms: ['practical', 'utilitarian', 'sensible'],
    sentence: '',
  },
];

// 오답 단어 목록 (WrongWordListPage)
export const MOCK_WRONG_WORDS: WrongWord[] = [
  {
    id: 1,
    difficulty: 3,
    word: 'Ambiguity',
    partOfSpeech: 'N',
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    sentence: '',
    wrongCount: 5,
  },
  {
    id: 2,
    difficulty: 4,
    word: 'Juxtaposition',
    partOfSpeech: 'N',
    korMeaning: '병치, 나란히 놓기',
    engMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
    sentence: '',
    wrongCount: 3,
  },
];
