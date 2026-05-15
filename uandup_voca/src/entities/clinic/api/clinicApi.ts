import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type ClinicStudentListResponse = components['schemas']['ClinicStudentListResponse'];
type ClinicStudentEditResponse = components['schemas']['ClinicStudentEditResponse'];
type UpdateClinicStudentsRequest = components['schemas']['UpdateClinicStudentsRequest'];

export const getClinicStudents = (
  dayOfWeek: string,
  hour: number,
): Promise<ApiResponse<ClinicStudentListResponse[]>> =>
  axiosInstance
    .get<ApiResponse<ClinicStudentListResponse[]>>(`/api/v1/clinics/${dayOfWeek}/${hour}/students`)
    .then((r) => r.data);

export const getClinicEditData = (
  dayOfWeek: string,
  hour: number,
): Promise<ApiResponse<ClinicStudentEditResponse>> =>
  axiosInstance
    .get<
      ApiResponse<ClinicStudentEditResponse>
    >(`/api/v1/clinics/${dayOfWeek}/${hour}/students/edit`)
    .then((r) => r.data);

export const updateClinicStudents = (
  dayOfWeek: string,
  hour: number,
  body: UpdateClinicStudentsRequest,
): Promise<ApiResponse<void>> =>
  axiosInstance
    .put<ApiResponse<void>>(`/api/v1/clinics/${dayOfWeek}/${hour}/students`, body)
    .then((r) => r.data);
