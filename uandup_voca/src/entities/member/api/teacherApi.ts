import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type TeacherListResponse = components['schemas']['TeacherListResponse'];
type TeacherUpdateRequest = components['schemas']['TeacherUpdateRequest'];
type MemberResponse = components['schemas']['MemberResponse'];

export const getTeachers = (): Promise<ApiResponse<TeacherListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<TeacherListResponse[]>>('/api/v1/members/teachers')
    .then((r) => r.data);

export const getNonAdminTeachers = (): Promise<ApiResponse<TeacherListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<TeacherListResponse[]>>('/api/v1/members/teachers/non-admins')
    .then((r) => r.data);

export const getAdminTeachers = (): Promise<ApiResponse<TeacherListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<TeacherListResponse[]>>('/api/v1/members/teachers/admins')
    .then((r) => r.data);

export const updateTeacher = (
  id: number,
  body: TeacherUpdateRequest,
): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .put<ApiResponse<MemberResponse>>(`/api/v1/members/teachers/${id}`, body)
    .then((r) => r.data);

export const deleteTeacher = (id: number): Promise<ApiResponse<void>> =>
  axiosInstance
    .delete<ApiResponse<void>>(`/api/v1/members/teachers/${id}`)
    .then((r) => r.data);

export const promoteTeacherToAdmin = (id: number): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .patch<ApiResponse<MemberResponse>>(`/api/v1/members/teachers/${id}/promote-admin`)
    .then((r) => r.data);

export const demoteAdminToTeacher = (id: number): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .patch<ApiResponse<MemberResponse>>(`/api/v1/members/teachers/${id}/demote-admin`)
    .then((r) => r.data);
