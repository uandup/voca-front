import type { ReviewDeckWord } from '../model/types';

// 학생 wrong-word-list 페이지가 임시로 사용 — API 연동 시 제거 예정.
export const MOCK_REVIEW_DECK_WORDS: ReviewDeckWord[] = [
  {
    id: 1,
    difficulty: 3,
    word: 'Ambiguity',
    partsOfSpeech: ['N'],
    korMeaning: '모호함, 다의성',
    engMeaning: 'The quality of being open to more than one interpretation; inexactness.',
    synonyms: ['vague', 'obscurity', 'uncertainty'],
    sentence: 'The ambiguity of the contract led to a long dispute.',
    wrongCount: 5,
    lastWrongAt: '2026-05-12T10:00:00',
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
    sentence: 'The juxtaposition of light and shadow gave the painting depth.',
    wrongCount: 3,
    lastWrongAt: '2026-05-10T14:30:00',
  },
];
