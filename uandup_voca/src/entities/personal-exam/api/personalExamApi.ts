import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

export type PersonalExamResponse = components['schemas']['PersonalExamResponse'];
export type PersonalExamSummaryResponse = components['schemas']['PersonalExamSummaryResponse'];
export type PersonalExamItemDetail = components['schemas']['PersonalExamItemDetail'];
export type PersonalExamDetailResponse = components['schemas']['PersonalExamDetailResponse'];

// 응시용 문항 — 유형별로 word/koreanMeaning 중 출제되는 프롬프트만 채워진다(entities/test의
// AttemptItem과 동일한 성격). 정답 필드는 내려오지 않는다.
export type PersonalExamAttemptItem = components['schemas']['AttemptItem'];

export type PersonalExamAttemptResponse = components['schemas']['PersonalExamAttemptResponse'];
export type CreatePersonalExamRequest = components['schemas']['PersonalExamCreateRequest'];
export type SubmitPersonalExamItemResult = components['schemas']['SubmitItemResult'];
export type SubmitPersonalExamRequest = components['schemas']['PersonalExamSubmitRequest'];

// ── API functions ──────────────────────────────────────────────────────────

export const createPersonalExam = (
  studentId: number,
  body: CreatePersonalExamRequest,
): Promise<ApiResponse<PersonalExamResponse>> =>
  axiosInstance
    .post<ApiResponse<PersonalExamResponse>>(`/api/v1/students/${studentId}/personal-exams`, body)
    .then((r) => r.data);

export const getPersonalExamList = (
  studentId: number,
): Promise<ApiResponse<PersonalExamSummaryResponse[]>> =>
  axiosInstance
    .get<
      ApiResponse<PersonalExamSummaryResponse[]>
    >(`/api/v1/students/${studentId}/personal-exams`)
    .then((r) => r.data);

export const getPersonalExamDetail = (
  personalExamId: number,
): Promise<ApiResponse<PersonalExamDetailResponse>> =>
  axiosInstance
    .get<ApiResponse<PersonalExamDetailResponse>>(`/api/v1/personal-exams/${personalExamId}`)
    .then((r) => r.data);

// 학생 응시용 — 정답이 제거된 문항을 받아온다. entities/test의 attemptExam과 동일하게
// 재응시가 차단되는(POST) 엔드포인트이므로 호출부에서 1회만 호출하도록 주의해야 한다.
export const attemptPersonalExam = (
  personalExamId: number,
): Promise<ApiResponse<PersonalExamAttemptResponse>> =>
  axiosInstance
    .post<
      ApiResponse<PersonalExamAttemptResponse>
    >(`/api/v1/personal-exams/${personalExamId}/attempt`)
    .then((r) => r.data);

// 학생이 자신의 답안을 제출 — READY/응시중 → SUBMITTED 상태 전이로 추정(entities/test와 동일 흐름).
export const submitPersonalExam = (
  personalExamId: number,
  body: SubmitPersonalExamRequest,
): Promise<ApiResponse<void>> =>
  axiosInstance
    .post<ApiResponse<void>>(`/api/v1/personal-exams/${personalExamId}/submit`, body)
    .then((r) => r.data);

export const cancelPersonalExam = (personalExamId: number): Promise<ApiResponse<void>> =>
  axiosInstance
    .post<ApiResponse<void>>(`/api/v1/personal-exams/${personalExamId}/cancel`)
    .then((r) => r.data);
