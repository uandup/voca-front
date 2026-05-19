import type { components } from '@/shared/api/schema.gen';
import type { Member } from './types';

type MemberResponse = components['schemas']['MemberResponse'];

export function toMember(res: MemberResponse): Member {
  return {
    role: res.role,
    status: res.status,
  };
}
