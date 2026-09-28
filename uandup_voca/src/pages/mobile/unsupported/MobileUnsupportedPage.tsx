import { useNavigate } from '@tanstack/react-router';
import { setViewPreference } from '@/shared/lib/viewport';

/**
 * 폰에서 시험 URL로 들어왔을 때 보여주는 안내 화면.
 *
 * 시험을 폰에서 막는 이유는 화면이 좁아서만이 아니다 — 태블릿·모바일 Safari는 전체화면 진입이
 * 불가능한데 감시 가림막을 띄우면 학생이 시험에 갇힌다
 * (pages/student/exam-take/model/useExamProctor.ts 주석 참고: 이 사고로 PR #31이 revert됐다).
 */
export function MobileUnsupportedPage() {
  const navigate = useNavigate();

  // 태블릿을 폰으로 오인했거나 굳이 이 기기에서 응시해야 하는 경우의 탈출구.
  function continueOnDesktopSite() {
    setViewPreference('desktop');
    navigate({ to: '/student/dashboard' });
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="material-symbols-outlined text-outline/40" style={{ fontSize: '56px' }}>
        devices
      </span>
      <h1 className="font-headline text-xl font-extrabold text-primary">
        Tests aren't available on mobile
      </h1>
      <p className="text-sm text-on-surface-variant leading-relaxed">
        Please use a computer or tablet to take a test. You can still review your words here.
      </p>

      <button
        onClick={() => navigate({ to: '/m/library' })}
        className="mt-2 w-full max-w-xs min-h-12 rounded-xl bg-primary text-white text-sm font-bold touch-manipulation"
      >
        Go to my words
      </button>
      <button
        onClick={continueOnDesktopSite}
        className="w-full max-w-xs min-h-12 rounded-xl border border-outline-variant/60 text-on-surface-variant text-sm font-bold touch-manipulation"
      >
        Continue on desktop site
      </button>
    </div>
  );
}
