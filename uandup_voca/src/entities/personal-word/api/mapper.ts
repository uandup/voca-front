import type { PersonalWordCardData } from '../model/types';
import type { PersonalWordCreateRequest, PersonalWordUpdateRequest } from './personalWordApi';

function toPersonalWordRequestBody(
  data: Omit<PersonalWordCardData, 'id'>,
): PersonalWordCreateRequest {
  return {
    word: data.word,
    koreanMeaning: data.koreanMeaning,
  };
}

export function toPersonalWordCreateRequest(
  data: Omit<PersonalWordCardData, 'id'>,
): PersonalWordCreateRequest {
  return toPersonalWordRequestBody(data);
}

export function toPersonalWordUpdateRequest(
  data: Omit<PersonalWordCardData, 'id'>,
): PersonalWordUpdateRequest {
  return toPersonalWordRequestBody(data);
}
