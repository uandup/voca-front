import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type StudentListResponse = components['schemas']['StudentListResponse'];
type UnassignedStudentResponse = components['schemas']['UnassignedStudentResponse'];
type StudentDetailResponse = components['schemas']['StudentDetailResponse'];
type StudentUpdateRequest = components['schemas']['StudentUpdateRequest'];
type StudentOverviewResponse = components['schemas']['StudentOverviewResponse'];
type StudySetExamListResponse = components['schemas']['StudySetExamListResponse'];
type AssignedWordResponse = components['schemas']['AssignedWordResponse'];
type AssignWordsResponse = components['schemas']['AssignWordsResponse'];
type AssignmentCountResponse = components['schemas']['AssignmentCountResponse'];
type ExamSettingsResponse = components['schemas']['ExamSettingsResponse'];
type UpdateAssignmentCountRequest = components['schemas']['UpdateAssignmentCountRequest'];
type UpdateExamSettingsRequest = components['schemas']['UpdateExamSettingsRequest'];

export const getStudents = (): Promise<ApiResponse<StudentListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<StudentListResponse[]>>('/api/v1/members/students')
    .then((r) => r.data);

export const getUnassignedStudents = (): Promise<ApiResponse<UnassignedStudentResponse[]>> =>
  axiosInstance
    .get<ApiResponse<UnassignedStudentResponse[]>>('/api/v1/members/students/unassigned')
    .then((r) => r.data);

export const getStudentDetail = (id: number): Promise<ApiResponse<StudentDetailResponse>> =>
  axiosInstance
    .get<ApiResponse<StudentDetailResponse>>(`/api/v1/members/students/${id}`)
    .then((r) => r.data);

export const updateStudent = (
  id: number,
  body: StudentUpdateRequest,
): Promise<ApiResponse<StudentDetailResponse>> =>
  axiosInstance
    .put<ApiResponse<StudentDetailResponse>>(`/api/v1/members/students/${id}`, body)
    .then((r) => r.data);

export const deleteStudent = (id: number): Promise<ApiResponse<void>> =>
  axiosInstance.delete<ApiResponse<void>>(`/api/v1/members/students/${id}`).then((r) => r.data);

// ── Clinic Detail ─────────────────────────────────────────────────────────

export const getStudentOverview = (id: number): Promise<ApiResponse<StudentOverviewResponse>> =>
  axiosInstance
    .get<ApiResponse<StudentOverviewResponse>>(`/api/v1/members/students/${id}/overview`)
    .then((r) => r.data);

export const getStudySetList = (
  studentId: number,
): Promise<ApiResponse<StudySetExamListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<StudySetExamListResponse[]>>(
      `/api/v1/normal-study-sets/students/${studentId}`,
    )
    .then((r) => r.data);

export const getAssignedWords = (
  studySetId: number,
): Promise<ApiResponse<AssignedWordResponse[]>> =>
  axiosInstance
    .get<ApiResponse<AssignedWordResponse[]>>(`/api/v1/study-sets/${studySetId}/words`)
    .then((r) => r.data);

export const updateAssignmentCount = (
  studentId: number,
  body: UpdateAssignmentCountRequest,
): Promise<ApiResponse<AssignmentCountResponse>> =>
  axiosInstance
    .patch<ApiResponse<AssignmentCountResponse>>(
      `/api/v1/members/students/${studentId}/assignment-settings`,
      body,
    )
    .then((r) => r.data);

export const assignWords = (studentId: number): Promise<ApiResponse<AssignWordsResponse>> =>
  axiosInstance
    .post<ApiResponse<AssignWordsResponse>>(`/api/v1/normal-study-sets/students/${studentId}`)
    .then((r) => r.data);

export const updateExamSettings = (
  studentId: number,
  body: UpdateExamSettingsRequest,
): Promise<ApiResponse<ExamSettingsResponse>> =>
  axiosInstance
    .patch<ApiResponse<ExamSettingsResponse>>(
      `/api/v1/members/students/${studentId}/exam-settings`,
      body,
    )
    .then((r) => r.data);
