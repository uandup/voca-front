import type { PersonalWordSetFormData } from '../model/types';
import type { PersonalWordSetCreateRequest, PersonalWordSetUpdateRequest } from './personalWordSetApi';

// 생성·수정 바디가 지금은 같은 모양(이름 하나)이지만, 서버 DTO가 둘로 나뉘어 있으므로
// 변환도 둘로 둔다 — 한쪽에 필드가 추가될 때 다른 쪽이 조용히 따라가지 않게 한다.
export function toPersonalWordSetCreateRequest(
  data: PersonalWordSetFormData,
): PersonalWordSetCreateRequest {
  return { name: data.name.trim() };
}

export function toPersonalWordSetUpdateRequest(
  data: PersonalWordSetFormData,
): PersonalWordSetUpdateRequest {
  return { name: data.name.trim() };
}
