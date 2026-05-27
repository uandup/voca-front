import type { components } from '@/shared/api/schema.gen';
import type { PartOfSpeech, WordCardData } from '../model/types';

type WordCreateRequest = components['schemas']['WordCreateRequest'];
type WordUpdateRequest = components['schemas']['WordUpdateRequest'];

// 클라이언트 약어 → 백엔드 소문자 토큰 역변환
const POS_TO_TOKEN: Record<PartOfSpeech, string> = {
  N: 'n',
  V: 'v',
  Adj: 'adj',
  Adv: 'adv',
  Prep: 'prep',
  Conj: 'conj',
  Interj: 'interj',
};

function toWordRequestBody(data: Omit<WordCardData, 'id'>): WordCreateRequest {
  return {
    word: data.word,
    partsOfSpeech: data.partsOfSpeech.map((p) => POS_TO_TOKEN[p]),
    koreanMeaning: data.korMeaning,
    englishMeaning: data.engMeaning || undefined,
    difficulty: data.difficulty,
    synonyms: data.synonyms.length > 0 ? data.synonyms : undefined,
    example: data.sentence || undefined,
  };
}

export function toWordCreateRequest(data: Omit<WordCardData, 'id'>): WordCreateRequest {
  return toWordRequestBody(data);
}

export function toWordUpdateRequest(data: Omit<WordCardData, 'id'>): WordUpdateRequest {
  return toWordRequestBody(data);
}
