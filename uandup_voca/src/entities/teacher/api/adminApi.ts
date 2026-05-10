import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type PendingStudentResponse = components['schemas']['PendingStudentResponse'];
type PendingParentResponse = components['schemas']['PendingParentResponse'];
type PendingTeacherResponse = components['schemas']['PendingTeacherResponse'];
type MemberResponse = components['schemas']['MemberResponse'];
type BulkGradeResponse = components['schemas']['BulkGradeResponse'];
type ApproveRequest = components['schemas']['ApproveRequest'];

export const getPendingCount = (): Promise<ApiResponse<number>> =>
  axiosInstance.get<ApiResponse<number>>('/api/v1/members/pending/count').then((r) => r.data);

export const getPendingStudents = (): Promise<ApiResponse<PendingStudentResponse[]>> =>
  axiosInstance
    .get<ApiResponse<PendingStudentResponse[]>>('/api/v1/members/pending/students')
    .then((r) => r.data);

export const getPendingParents = (): Promise<ApiResponse<PendingParentResponse[]>> =>
  axiosInstance
    .get<ApiResponse<PendingParentResponse[]>>('/api/v1/members/pending/parents')
    .then((r) => r.data);

export const getPendingTeachers = (): Promise<ApiResponse<PendingTeacherResponse[]>> =>
  axiosInstance
    .get<ApiResponse<PendingTeacherResponse[]>>('/api/v1/members/pending/teachers')
    .then((r) => r.data);

export const approveMember = (
  id: number,
  body: ApproveRequest = {},
): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .patch<ApiResponse<MemberResponse>>(`/api/v1/members/${id}/approve`, body)
    .then((r) => r.data);

export const rejectMember = (id: number): Promise<ApiResponse<void>> =>
  axiosInstance.patch<ApiResponse<void>>(`/api/v1/members/${id}/reject`).then((r) => r.data);

export const promoteAllStudentsGrade = (): Promise<ApiResponse<BulkGradeResponse>> =>
  axiosInstance
    .patch<ApiResponse<BulkGradeResponse>>('/api/v1/members/students/grade/promote')
    .then((r) => r.data);

export const demoteAllStudentsGrade = (): Promise<ApiResponse<BulkGradeResponse>> =>
  axiosInstance
    .patch<ApiResponse<BulkGradeResponse>>('/api/v1/members/students/grade/demote')
    .then((r) => r.data);
