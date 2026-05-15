import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type CreateLevelExamRequest = components['schemas']['CreateLevelExamRequest'];
type CreateExamResponse = components['schemas']['CreateExamResponse'];
type LevelExamListResponse = components['schemas']['LevelExamListResponse'];

// 클라이언트는 'level-test'로 통일 — 서버 URL은 그대로 'level-exams'.

export const getLevelTestExamList = (
  studentId: number,
): Promise<ApiResponse<LevelExamListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<LevelExamListResponse[]>>(`/api/v1/students/${studentId}/level-exams`)
    .then((r) => r.data);

export const createLevelTestExam = (
  studentId: number,
  body: CreateLevelExamRequest,
): Promise<ApiResponse<CreateExamResponse>> =>
  axiosInstance
    .post<ApiResponse<CreateExamResponse>>(`/api/v1/students/${studentId}/level-exams`, body)
    .then((r) => r.data);
