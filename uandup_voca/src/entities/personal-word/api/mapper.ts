import type { PersonalWordCardData } from '../model/types';
import type { PersonalWordBulkCreateRequest, PersonalWordUpdateRequest } from './personalWordApi';

type PersonalWordFormData = Omit<PersonalWordCardData, 'id'>;

/**
 * 폼 값 여러 건 → 일괄 등록 바디.
 * 서버가 빈 문자열을 거부하므로 여기서 trim만 하고 걸러내지는 않는다 — 어떤 행이 비었는지는
 * 입력 화면이 먼저 보여줘야 하는 정보라, 조용히 버리면 "넣은 게 사라졌다"가 된다.
 */
export function toPersonalWordBulkCreateRequest(
  items: PersonalWordFormData[],
): PersonalWordBulkCreateRequest {
  return {
    words: items.map((item) => ({
      word: item.word.trim(),
      koreanMeaning: item.koreanMeaning.trim(),
    })),
  };
}

export function toPersonalWordUpdateRequest(
  data: PersonalWordFormData,
): PersonalWordUpdateRequest {
  return { word: data.word.trim(), koreanMeaning: data.koreanMeaning.trim() };
}
