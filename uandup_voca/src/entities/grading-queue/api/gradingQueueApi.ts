import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type SubmittedExamResponse = components['schemas']['SubmittedExamResponse'];

// 학원 전체에서 채점 대기 중(SUBMITTED)인 온라인 시험 목록.
// 서버가 submittedAt 오름차순(오래 기다린 순 위)으로 정렬해 내려준다. 파라미터 없음.
export const getSubmittedExams = (): Promise<ApiResponse<SubmittedExamResponse[]>> =>
  axiosInstance
    .get<ApiResponse<SubmittedExamResponse[]>>('/api/v1/exams/submitted')
    .then((r) => r.data);
