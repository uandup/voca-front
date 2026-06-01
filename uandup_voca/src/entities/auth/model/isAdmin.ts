import { getTokenPayload } from './jwt';

// 현재 로그인 사용자가 관리자(isAdmin=true인 TEACHER)인지.
// TEACHER가 아니면 항상 false다.
export function isAdmin(): boolean {
  return getTokenPayload()?.isAdmin ?? false;
}
