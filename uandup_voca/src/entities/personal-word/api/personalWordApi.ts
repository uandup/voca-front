import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

export type PersonalWordResponse = components['schemas']['PersonalWordResponse'];

export const getPersonalWords = (
  studentId: number,
): Promise<ApiResponse<PersonalWordResponse[]>> =>
  axiosInstance
    .get<ApiResponse<PersonalWordResponse[]>>(`/api/v1/students/${studentId}/personal-words`)
    .then((r) => r.data);
