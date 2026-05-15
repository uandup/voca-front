import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type StudySetExamTypeResponse = components['schemas']['StudySetExamTypeResponse'];
type ExamDetailResponse = components['schemas']['ExamDetailResponse'];
type CreateExamResponse = components['schemas']['CreateExamResponse'];
type CreateExamRequest = components['schemas']['CreateExamRequest'];
type RecordOnlineResultsRequest = components['schemas']['RecordOnlineResultsRequest'];
type RecordOfflineResultsRequest = components['schemas']['RecordOfflineResultsRequest'];
type RecordResultsResponse = components['schemas']['RecordResultsResponse'];
type SubmitExamRequest = components['schemas']['SubmitExamRequest'];

export const getExamsByType = (
  studySetId: number,
  examType: CreateExamRequest['examType'],
): Promise<ApiResponse<StudySetExamTypeResponse>> =>
  axiosInstance
    .get<
      ApiResponse<StudySetExamTypeResponse>
    >(`/api/v1/normal-study-sets/${studySetId}/exams/${examType}`)
    .then((r) => r.data);

export const getExamDetail = (examId: number): Promise<ApiResponse<ExamDetailResponse>> =>
  axiosInstance.get<ApiResponse<ExamDetailResponse>>(`/api/v1/exams/${examId}`).then((r) => r.data);

export const createExam = (
  studySetId: number,
  body: CreateExamRequest,
): Promise<ApiResponse<CreateExamResponse>> =>
  axiosInstance
    .post<ApiResponse<CreateExamResponse>>(`/api/v1/normal-study-sets/${studySetId}/exams`, body)
    .then((r) => r.data);

export const startOnlineExam = (examId: number): Promise<ApiResponse<void>> =>
  axiosInstance.post<ApiResponse<void>>(`/api/v1/exams/${examId}/start-online`).then((r) => r.data);

export const cancelExam = (examId: number): Promise<ApiResponse<void>> =>
  axiosInstance.post<ApiResponse<void>>(`/api/v1/exams/${examId}/cancel`).then((r) => r.data);

export const recordOnlineResults = (
  examId: number,
  body: RecordOnlineResultsRequest,
): Promise<ApiResponse<RecordResultsResponse>> =>
  axiosInstance
    .post<ApiResponse<RecordResultsResponse>>(`/api/v1/exams/${examId}/results/online`, body)
    .then((r) => r.data);

export const recordOfflineResults = (
  examId: number,
  body: RecordOfflineResultsRequest,
): Promise<ApiResponse<RecordResultsResponse>> =>
  axiosInstance
    .post<ApiResponse<RecordResultsResponse>>(`/api/v1/exams/${examId}/results/offline`, body)
    .then((r) => r.data);

// 학생이 자신의 답안을 제출 — ONLINE_STARTED → SUBMITTED 상태 전이.
// 이후 채점은 선생님이 recordOnlineResults로 수행.
export const submitExam = (
  examId: number,
  body: SubmitExamRequest,
): Promise<ApiResponse<void>> =>
  axiosInstance
    .post<ApiResponse<void>>(`/api/v1/exams/${examId}/submit`, body)
    .then((r) => r.data);
