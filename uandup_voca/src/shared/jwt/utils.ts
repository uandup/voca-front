import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from './types';

export function decodeToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}

export function getTokenPayload(): JwtPayload | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    return decodeToken(token);
  } catch {
    return null;
  }
}
