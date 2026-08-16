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
    // 이 폼은 실제 Word 생성/수정 전용이라 difficulty가 항상 있지만, WordCardData 타입
    // 자체는 PersonalWord처럼 개념이 없는 출처를 위해 optional이라 폴백을 둔다.
    difficulty: data.difficulty ?? 1,
    synonyms: data.synonyms && data.synonyms.length > 0 ? data.synonyms : undefined,
    example: data.sentence || undefined,
    satPriority: data.satPriority,
    // 배열 → 콤마 구분 문자열 역변환. 빈 배열이면 필드 생략.
    examTag: data.examTags.length > 0 ? data.examTags.join(', ') : undefined,
  };
}

export function toWordCreateRequest(data: Omit<WordCardData, 'id'>): WordCreateRequest {
  return toWordRequestBody(data);
}

export function toWordUpdateRequest(data: Omit<WordCardData, 'id'>): WordUpdateRequest {
  return toWordRequestBody(data);
}
