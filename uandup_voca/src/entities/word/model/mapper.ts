import type { components } from '@/shared/api/schema.gen';
import type { TeacherWord, PartOfSpeech } from './types';

type WordResponse = components['schemas']['WordResponse'];

// 백엔드는 소문자 약어('n', 'v', 'adj', 'adv', 'prep', 'conj', 'interj')로 내려준다.
const POS_MAP: Record<string, PartOfSpeech> = {
  n: 'N',
  v: 'V',
  adj: 'Adj',
  adv: 'Adv',
  prep: 'Prep',
  conj: 'Conj',
  interj: 'Interj',
};

function toPartOfSpeech(value: string): PartOfSpeech {
  return POS_MAP[value.toLowerCase()] ?? 'N';
}

export function toTeacherWord(res: WordResponse): TeacherWord {
  return {
    id: res.id ?? 0,
    word: res.word ?? '',
    partsOfSpeech: (res.partsOfSpeech ?? []).map(toPartOfSpeech),
    korMeaning: res.koreanMeaning ?? '',
    engMeaning: res.englishMeaning ?? '',
    difficulty: (res.difficulty ?? 1) as TeacherWord['difficulty'],
    synonyms: res.synonyms ?? [],
    sentence: res.example ?? '',
  };
}
