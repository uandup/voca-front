import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

export type PersonalWordSetResponse = components['schemas']['PersonalWordSetResponse'];
export type PersonalWordSetCreateRequest =
  components['schemas']['PersonalWordSetCreateRequest'];
export type PersonalWordSetUpdateRequest =
  components['schemas']['PersonalWordSetUpdateRequest'];

export const getPersonalWordSets = (
  studentId: number,
): Promise<ApiResponse<PersonalWordSetResponse[]>> =>
  axiosInstance
    .get<
      ApiResponse<PersonalWordSetResponse[]>
    >(`/api/v1/students/${studentId}/personal-word-sets`)
    .then((r) => r.data);

export const createPersonalWordSet = (
  studentId: number,
  body: PersonalWordSetCreateRequest,
): Promise<ApiResponse<PersonalWordSetResponse>> =>
  axiosInstance
    .post<
      ApiResponse<PersonalWordSetResponse>
    >(`/api/v1/students/${studentId}/personal-word-sets`, body)
    .then((r) => r.data);

export const updatePersonalWordSet = (
  personalWordSetId: number,
  body: PersonalWordSetUpdateRequest,
): Promise<ApiResponse<PersonalWordSetResponse>> =>
  axiosInstance
    .put<
      ApiResponse<PersonalWordSetResponse>
    >(`/api/v1/personal-word-sets/${personalWordSetId}`, body)
    .then((r) => r.data);

// 세트를 지우면 서버가 소속 단어까지 함께 소프트 삭제한다 — 호출부는 단어 캐시도 무효화해야 한다.
export const deletePersonalWordSet = (personalWordSetId: number): Promise<ApiResponse<void>> =>
  axiosInstance
    .delete<ApiResponse<void>>(`/api/v1/personal-word-sets/${personalWordSetId}`)
    .then((r) => r.data);
