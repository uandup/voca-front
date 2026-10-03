import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

export type PersonalWordResponse = components['schemas']['PersonalWordResponse'];
export type PersonalWordBulkCreateRequest =
  components['schemas']['PersonalWordBulkCreateRequest'];
export type PersonalWordUpdateRequest = components['schemas']['PersonalWordUpdateRequest'];

// 단어는 항상 세트에 속하므로 조회·등록이 세트 하위 경로다 — 학생 단위 플랫 조회 API는 서버에 없다.
export const getPersonalWords = (
  personalWordSetId: number,
): Promise<ApiResponse<PersonalWordResponse[]>> =>
  axiosInstance
    .get<
      ApiResponse<PersonalWordResponse[]>
    >(`/api/v1/personal-word-sets/${personalWordSetId}/personal-words`)
    .then((r) => r.data);

/**
 * 단어 일괄 등록. 단건 등록도 words 배열에 1개를 담아 이 함수를 쓴다 — 서버에 단건 전용
 * 엔드포인트가 없다.
 *
 * 한 항목이라도 유효하지 않으면 서버가 전부 거부하고(400) 아무것도 저장하지 않는다.
 * 에러 메시지의 필드 경로가 words[3].word 형태로 와서 몇 번째 항목이 문제인지 알 수 있다.
 */
export const createPersonalWords = (
  personalWordSetId: number,
  body: PersonalWordBulkCreateRequest,
): Promise<ApiResponse<PersonalWordResponse[]>> =>
  axiosInstance
    .post<
      ApiResponse<PersonalWordResponse[]>
    >(`/api/v1/personal-word-sets/${personalWordSetId}/personal-words`, body)
    .then((r) => r.data);

// 수정·삭제는 단어 하나만 알면 되므로 세트를 경로에 두지 않는다. 세트 이동은 지원하지 않는다.
export const updatePersonalWord = (
  personalWordId: number,
  body: PersonalWordUpdateRequest,
): Promise<ApiResponse<PersonalWordResponse>> =>
  axiosInstance
    .put<ApiResponse<PersonalWordResponse>>(`/api/v1/personal-words/${personalWordId}`, body)
    .then((r) => r.data);

export const deletePersonalWord = (personalWordId: number): Promise<ApiResponse<void>> =>
  axiosInstance
    .delete<ApiResponse<void>>(`/api/v1/personal-words/${personalWordId}`)
    .then((r) => r.data);
