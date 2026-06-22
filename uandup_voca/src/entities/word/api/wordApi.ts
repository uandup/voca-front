import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type WordCreateRequest = components['schemas']['WordCreateRequest'];
type WordUpdateRequest = components['schemas']['WordUpdateRequest'];
type WordResponse = components['schemas']['WordResponse'];
type PageResponseWordResponse = components['schemas']['PageResponseWordResponse'];
type WordLevelCountResponse = components['schemas']['WordLevelCountResponse'];

interface GetWordsParams {
  keyword?: string;
  difficulty?: number;
  page?: number;
  size?: number;
}

export const getWords = (params: GetWordsParams): Promise<ApiResponse<PageResponseWordResponse>> =>
  axiosInstance
    .get<ApiResponse<PageResponseWordResponse>>('/api/v1/words', { params })
    .then((r) => r.data);

export const createWord = (body: WordCreateRequest): Promise<ApiResponse<WordResponse>> =>
  axiosInstance.post<ApiResponse<WordResponse>>('/api/v1/words', body).then((r) => r.data);

export const updateWord = (
  id: number,
  body: WordUpdateRequest,
): Promise<ApiResponse<WordResponse>> =>
  axiosInstance.put<ApiResponse<WordResponse>>(`/api/v1/words/${id}`, body).then((r) => r.data);

export const deleteWord = (id: number): Promise<ApiResponse<void>> =>
  axiosInstance.delete<ApiResponse<void>>(`/api/v1/words/${id}`).then((r) => r.data);

export const getWordCountByLevel = (
  level: number,
): Promise<ApiResponse<WordLevelCountResponse>> =>
  axiosInstance
    .get<ApiResponse<WordLevelCountResponse>>(`/api/v1/words/levels/${level}/count`)
    .then((r) => r.data);
