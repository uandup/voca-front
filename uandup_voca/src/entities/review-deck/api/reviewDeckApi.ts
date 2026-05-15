import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type CreateWrongBankExamRequest = components['schemas']['CreateWrongBankExamRequest'];
type CreateExamResponse = components['schemas']['CreateExamResponse'];
type WrongBankExamListResponse = components['schemas']['WrongBankExamListResponse'];
type WrongBankWordResponse = components['schemas']['WrongBankWordResponse'];

// 서버 URL은 "wrong-bank"이지만 클라이언트 식별자는 review-deck으로 통일한다.

export const getReviewDeckExamList = (
  studentId: number,
): Promise<ApiResponse<WrongBankExamListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<WrongBankExamListResponse[]>>(`/api/v1/students/${studentId}/wrong-bank-exams`)
    .then((r) => r.data);

export const createReviewDeckExam = (
  studentId: number,
  body: CreateWrongBankExamRequest,
): Promise<ApiResponse<CreateExamResponse>> =>
  axiosInstance
    .post<ApiResponse<CreateExamResponse>>(`/api/v1/students/${studentId}/wrong-bank-exams`, body)
    .then((r) => r.data);

export const getReviewDeckWords = (
  studentId: number,
): Promise<ApiResponse<WrongBankWordResponse[]>> =>
  axiosInstance
    .get<ApiResponse<WrongBankWordResponse[]>>(`/api/v1/students/${studentId}/wrong-bank`)
    .then((r) => r.data);

export const getReviewDeckCount = (studentId: number): Promise<ApiResponse<number>> =>
  axiosInstance
    .get<ApiResponse<number>>(`/api/v1/students/${studentId}/wrong-bank/count`)
    .then((r) => r.data);
