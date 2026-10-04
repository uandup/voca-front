import { buildGoogleAuthUrl } from '@/entities/auth';
import { setViewPreference } from '@/shared/lib/viewport';

// LandingNav(데스크탑)에도 같은 아이콘이 있다 — 데스크탑 파일을 건드리지 않기 위한 의도적 복제다.
// 작은 정적 SVG라 공유 비용보다 복제 비용이 낮다.
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      fill="#EA4335"
    />
  </svg>
);

/**
 * 폰 전용 로그인 화면 — PWA의 첫 화면이다(start_url이 /m이고, 미로그인이면 여기로 온다).
 *
 * 데스크탑 랜딩(마케팅 7개 섹션 + 한영 전환)을 폰에 그대로 띄우지 않는 이유:
 * 설치형 앱을 연 사용자는 서비스를 이미 아는 사람이라 소개가 필요 없고, 스크롤해서
 * 로그인 버튼을 찾게 만들 이유가 없다. 데스크탑 랜딩은 그대로 두고 이 화면만 따로 둔다.
 */
export function MobileLoginPage() {
  function handleGoogleLogin() {
    window.location.href = buildGoogleAuthUrl();
  }

  function handleDesktopView() {
    // 이 화면이 생기면서 폰에서 마케팅 랜딩에 닿을 길이 사라진다 — 그 탈출구.
    // 선호도를 저장해야 /가 다시 모바일로 튕기지 않는다.
    setViewPreference('desktop');
    window.location.href = '/';
  }

  return (
    <div
      className="min-h-dvh bg-surface flex flex-col items-center justify-center px-8"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="w-full max-w-sm flex flex-col items-center">
        <span
          className="material-symbols-outlined text-primary mb-4"
          style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
        >
          auto_stories
        </span>

        <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
          Vocably
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">Learn words that stick</p>

        <button
          onClick={handleGoogleLogin}
          className="mt-10 w-full min-h-13 flex items-center justify-center gap-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm text-[15px] font-bold text-on-surface touch-manipulation active:scale-[0.98] transition-transform"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>

      <button
        onClick={handleDesktopView}
        className="absolute bottom-10 text-xs font-semibold text-on-surface-variant/60 underline underline-offset-4 touch-manipulation"
      >
        View desktop site
      </button>
    </div>
  );
}
