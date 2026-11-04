import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type CreatePersonalExamRequest = components['schemas']['CreatePersonalExamRequest'];
type CreateExamResponse = components['schemas']['CreateExamResponse'];
type PersonalExamListResponse = components['schemas']['PersonalExamListResponse'];

// 클라이언트는 'personal-test'로 통일 — 서버 URL은 'personal-exams'.
// 생성·목록만 자체 endpoint이고, 시작·응시·제출·채점·취소는 entities/test의 공용 /exams API를 쓴다.

export const getPersonalTestExamList = (
  studentId: number,
): Promise<ApiResponse<PersonalExamListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<PersonalExamListResponse[]>>(`/api/v1/students/${studentId}/personal-exams`)
    .then((r) => r.data);

export const createPersonalTestExam = (
  studentId: number,
  body: CreatePersonalExamRequest,
): Promise<ApiResponse<CreateExamResponse>> =>
  axiosInstance
    .post<ApiResponse<CreateExamResponse>>(`/api/v1/students/${studentId}/personal-exams`, body)
    .then((r) => r.data);
