import type { PersonalWordResponse } from '../api/personalWordApi';
import type { PersonalWordCardData } from './types';

// PersonalWordResponse → PersonalWordCard가 요구하는 PersonalWordCardData.
export function toPersonalWordCardData(r: PersonalWordResponse): PersonalWordCardData {
  return {
    id: r.personalWordId ?? 0,
    word: r.word ?? '',
    koreanMeaning: r.koreanMeaning ?? '',
  };
}
