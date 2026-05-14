import type { WordCard } from '../model/types';

export const MOCK_WORDS: WordCard[] = [
  {
    id: 1,
    difficulty: 3,
    word: 'Ambiguity',
    partsOfSpeech: ['N'],
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
  },
  {
    id: 2,
    difficulty: 4,
    word: 'Juxtaposition',
    partsOfSpeech: ['N'],
    korMeaning: '병치, 나란히 놓기',
    engMeaning:
      'The fact of two things being seen or placed close together for contrasting effect.',
    synonyms: ['comparison', 'proximity', 'adjacency'],
  },
  {
    id: 3,
    difficulty: 3,
    word: 'Inherent',
    partsOfSpeech: ['Adj'],
    korMeaning: '내재하는, 본질적인',
    engMeaning: 'Existing as a natural or permanent quality of something.',
    synonyms: ['intrinsic', 'innate', 'essential'],
  },
  {
    id: 4,
    difficulty: 5,
    word: 'Pragmatic',
    partsOfSpeech: ['Adj'],
    korMeaning: '실용적인, 실제적인',
    engMeaning: 'Dealing with things sensibly and realistically based on practical considerations.',
    synonyms: ['practical', 'utilitarian', 'sensible'],
  },
];

