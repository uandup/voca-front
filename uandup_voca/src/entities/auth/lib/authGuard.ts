import { redirect } from '@tanstack/react-router';

// 보호된 라우트의 beforeLoad에서 호출. accessToken이 없으면 랜딩 페이지로 리다이렉트.
export function requireAuth() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw redirect({ to: '/' });
  }
}
