import type { components } from '@/shared/api/schema.gen';
import type { TeacherWord, PartOfSpeech } from './types';

type WordResponse = components['schemas']['WordResponse'];

const VALID_POS = new Set(['N', 'V', 'Adj', 'Adv', 'Conj']);

function toPartOfSpeech(value: string): PartOfSpeech {
  if (VALID_POS.has(value)) return value as PartOfSpeech;
  return 'N';
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
