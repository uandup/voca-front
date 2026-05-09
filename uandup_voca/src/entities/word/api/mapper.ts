import type { components } from '@/shared/api/schema.gen';
import type { TeacherWord } from '../model/types';

type WordCreateRequest = components['schemas']['WordCreateRequest'];
type WordUpdateRequest = components['schemas']['WordUpdateRequest'];

function toWordRequestBody(data: Omit<TeacherWord, 'id'>): WordCreateRequest {
  return {
    word: data.word,
    partsOfSpeech: [data.partOfSpeech],
    koreanMeaning: data.korMeaning,
    englishMeaning: data.engMeaning || undefined,
    difficulty: data.difficulty,
    synonyms: data.synonyms.length > 0 ? data.synonyms : undefined,
    example: data.sentence || undefined,
  };
}

export function toWordCreateRequest(data: Omit<TeacherWord, 'id'>): WordCreateRequest {
  return toWordRequestBody(data);
}

export function toWordUpdateRequest(data: Omit<TeacherWord, 'id'>): WordUpdateRequest {
  return toWordRequestBody(data);
}
