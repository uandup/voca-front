import { getTokenPayload } from '@/shared/jwt';

export function isAdmin(): boolean {
  return getTokenPayload()?.isAdmin ?? false;
}
