/**
 * 구글 OAuth 동의 화면 URL.
 *
 * ⚠️ `pages/common/landing/LandingPage.tsx`에도 **같은 생성 로직**이 모듈 상수로 있다.
 * 데스크탑 파일을 건드리지 않기 위한 의도적 중복이다(모바일 전용 작업 제약).
 *
 * client_id / redirect_uri / scope / access_type이 양쪽에서 갈라지면
 * "데스크탑은 로그인되는데 폰만 실패" 같은 증상이 나온다 — **한쪽을 고치면 다른 쪽도 함께 본다.**
 * 데스크탑을 수정해도 될 때 LandingPage의 상수를 이 함수 호출로 바꾸면 중복이 사라진다.
 */
export function buildGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
