import { createFileRoute } from '@tanstack/react-router';
import OAuthCallbackPage from '@/pages/common/oauth/OAuthCallbackPage';

// 인증 흐름 페이지 — lazy하지 않고 초기 번들에 포함시킨다.
// 로그인 직후 무조건 거치는 경로라 청크 다운로드 대기를 두면 UX 답답함이 노출된다.
export const Route = createFileRoute('/oauth/callback')({
  component: OAuthCallbackPage,
});
