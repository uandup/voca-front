import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type ClassroomSummary = components['schemas']['ClassroomSummary'];
type ClassroomResponse = components['schemas']['ClassroomResponse'];
type ClassroomCreateRequest = components['schemas']['ClassroomCreateRequest'];
type ClassroomUpdateRequest = components['schemas']['ClassroomUpdateRequest'];

export const getClassrooms = (): Promise<ApiResponse<ClassroomSummary[]>> =>
  axiosInstance.get<ApiResponse<ClassroomSummary[]>>('/api/v1/classrooms').then((r) => r.data);

export const createClassroom = (
  body: ClassroomCreateRequest,
): Promise<ApiResponse<ClassroomResponse>> =>
  axiosInstance
    .post<ApiResponse<ClassroomResponse>>('/api/v1/classrooms', body)
    .then((r) => r.data);

export const updateClassroom = (
  id: number,
  body: ClassroomUpdateRequest,
): Promise<ApiResponse<void>> =>
  axiosInstance.put<ApiResponse<void>>(`/api/v1/classrooms/${id}`, body).then((r) => r.data);

export const deleteClassroom = (id: number): Promise<ApiResponse<void>> =>
  axiosInstance.delete<ApiResponse<void>>(`/api/v1/classrooms/${id}`).then((r) => r.data);
