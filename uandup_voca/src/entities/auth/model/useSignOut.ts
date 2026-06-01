import { useNavigate } from '@tanstack/react-router';
import { clearActiveChildId } from './activeChild';

// 명시적 로그아웃 — accessToken과 학부모 자녀 열람 상태를 함께 비운다.
// 401 만료(axios 인터셉터)는 토큰만 지워서 재로그인 시 마지막 자녀가 복원되지만,
// 명시적 로그아웃은 완전 초기화한다.
export function useSignOut(): () => void {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem('accessToken');
    clearActiveChildId();
    navigate({ to: '/' });
  };
}
