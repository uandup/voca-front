import { createFileRoute } from '@tanstack/react-router';
import PendingPage from '@/pages/common/pending/PendingPage';
import { requireAuth } from '@/entities/auth';

// 인증 흐름 페이지 — lazy하지 않고 초기 번들에 포함시킨다.
// 로그인 후 ACTIVE 학부모/대기 회원이 거쳐 가는 경유점이라 청크 대기가 페이지 깜빡임으로 노출된다.
export const Route = createFileRoute('/pending')({
  beforeLoad: requireAuth,
  component: PendingPage,
});
