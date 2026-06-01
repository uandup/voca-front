import type { MemberRole } from '@/entities/member/@x/auth';

export interface JwtPayload {
  sub: string;
  role: MemberRole; // 역할 STUDENT | TEACHER | PARENT
  isAdmin: boolean; // 관리자 여부 — TEACHER가 아니면 항상 false |
  iat: number;
  exp: number;
}
