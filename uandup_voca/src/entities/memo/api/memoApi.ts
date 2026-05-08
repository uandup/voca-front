import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type MemoResponse = components['schemas']['MemoResponse'];
type MemoRequest = components['schemas']['MemoRequest'];

export const getMemos = (studentId: number): Promise<ApiResponse<MemoResponse[]>> =>
  axiosInstance
    .get<ApiResponse<MemoResponse[]>>(`/api/v1/students/${studentId}/memos`)
    .then((r) => r.data);

export const createMemo = (
  studentId: number,
  body: MemoRequest,
): Promise<ApiResponse<MemoResponse>> =>
  axiosInstance
    .post<ApiResponse<MemoResponse>>(`/api/v1/students/${studentId}/memos`, body)
    .then((r) => r.data);

export const updateMemo = (
  memoId: number,
  body: MemoRequest,
): Promise<ApiResponse<MemoResponse>> =>
  axiosInstance
    .put<ApiResponse<MemoResponse>>(`/api/v1/memos/${memoId}`, body)
    .then((r) => r.data);

export const deleteMemo = (memoId: number): Promise<ApiResponse<void>> =>
  axiosInstance
    .delete<ApiResponse<void>>(`/api/v1/memos/${memoId}`)
    .then((r) => r.data);
