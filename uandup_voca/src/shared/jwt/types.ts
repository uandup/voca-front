import type { MemberRole } from '@/entities/member';

export interface JwtPayload {
  sub: string;
  role: MemberRole;
  isAdmin: boolean;
  iat: number;
  exp: number;
}
