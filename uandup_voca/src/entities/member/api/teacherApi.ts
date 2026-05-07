import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type TeacherListResponse = components['schemas']['TeacherListResponse'];
type MemberResponse = components['schemas']['MemberResponse'];

export const getNonAdminTeachers = (): Promise<ApiResponse<TeacherListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<TeacherListResponse[]>>('/api/v1/members/teachers/non-admins')
    .then((r) => r.data);

export const getAdminTeachers = (): Promise<ApiResponse<TeacherListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<TeacherListResponse[]>>('/api/v1/members/teachers/admins')
    .then((r) => r.data);

export const promoteTeacherToAdmin = (id: number): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .patch<ApiResponse<MemberResponse>>(`/api/v1/members/teachers/${id}/promote-admin`)
    .then((r) => r.data);

export const demoteAdminToTeacher = (id: number): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .patch<ApiResponse<MemberResponse>>(`/api/v1/members/teachers/${id}/demote-admin`)
    .then((r) => r.data);
