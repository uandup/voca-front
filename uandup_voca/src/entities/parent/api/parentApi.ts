import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type ParentListResponse = components['schemas']['ParentListResponse'];
type ParentUpdateRequest = components['schemas']['ParentUpdateRequest'];
type MemberResponse = components['schemas']['MemberResponse'];

export const getParents = (): Promise<ApiResponse<ParentListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<ParentListResponse[]>>('/api/v1/members/parents')
    .then((r) => r.data);

export const updateParent = (
  id: number,
  body: ParentUpdateRequest,
): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .put<ApiResponse<MemberResponse>>(`/api/v1/members/parents/${id}`, body)
    .then((r) => r.data);

export const deleteParent = (id: number): Promise<ApiResponse<void>> =>
  axiosInstance.delete<ApiResponse<void>>(`/api/v1/members/parents/${id}`).then((r) => r.data);
