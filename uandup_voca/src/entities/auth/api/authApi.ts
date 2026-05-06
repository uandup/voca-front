import { publicAxiosInstance, axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type LoginResponse = components['schemas']['LoginResponse'];
type CompleteProfileRequest = components['schemas']['CompleteProfileRequest'];
type CompleteProfileResponse = components['schemas']['CompleteProfileResponse'];

export const loginWithGoogle = (code: string): Promise<ApiResponse<LoginResponse>> =>
  publicAxiosInstance
    .post<ApiResponse<LoginResponse>>('/api/v1/auth/login', { code })
    .then((res) => res.data);

export const registerProfile = (
  body: CompleteProfileRequest,
): Promise<ApiResponse<CompleteProfileResponse>> =>
  axiosInstance
    .patch<ApiResponse<CompleteProfileResponse>>('/api/v1/auth/profile', body)
    .then((res) => res.data);
