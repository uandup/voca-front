import { axiosInstance } from '@/shared/api';
import type { ApiResponse } from '@/shared/api';
import type { components } from '@/shared/api/schema.gen';

type MemberResponse = components['schemas']['MemberResponse'];

export const getMyInfo = (): Promise<ApiResponse<MemberResponse>> =>
  axiosInstance
    .get<ApiResponse<MemberResponse>>('/api/v1/members/me')
    .then((res) => res.data);
