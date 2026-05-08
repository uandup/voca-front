import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type StudentListResponse = components['schemas']['StudentListResponse'];
type StudentUpdateRequest = components['schemas']['StudentUpdateRequest'];
type MemberResponse = components['schemas']['MemberResponse'];

export const getStudents = (): Promise<ApiResponse<StudentListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<StudentListResponse[]>>('/api/v1/members/students')
    .then((r) => r.data);

export const updateStudent = (
  id: number,
  body: StudentUpdateRequest,
): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .put<ApiResponse<MemberResponse>>(`/api/v1/members/students/${id}`, body)
    .then((r) => r.data);

export const deleteStudent = (id: number): Promise<ApiResponse<void>> =>
  axiosInstance
    .delete<ApiResponse<void>>(`/api/v1/members/students/${id}`)
    .then((r) => r.data);
