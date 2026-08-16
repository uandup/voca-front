import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

export type PersonalWordResponse = components['schemas']['PersonalWordResponse'];
export type PersonalWordCreateRequest = components['schemas']['PersonalWordCreateRequest'];
export type PersonalWordUpdateRequest = components['schemas']['PersonalWordUpdateRequest'];

export const getPersonalWords = (
  studentId: number,
): Promise<ApiResponse<PersonalWordResponse[]>> =>
  axiosInstance
    .get<ApiResponse<PersonalWordResponse[]>>(`/api/v1/students/${studentId}/personal-words`)
    .then((r) => r.data);

export const createPersonalWord = (
  studentId: number,
  body: PersonalWordCreateRequest,
): Promise<ApiResponse<PersonalWordResponse>> =>
  axiosInstance
    .post<
      ApiResponse<PersonalWordResponse>
    >(`/api/v1/students/${studentId}/personal-words`, body)
    .then((r) => r.data);

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
