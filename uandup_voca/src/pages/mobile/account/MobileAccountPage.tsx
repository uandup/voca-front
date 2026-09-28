import { useNavigate } from '@tanstack/react-router';
import { setViewPreference } from '@/shared/lib/viewport';
import { useInstallPrompt } from '@/shared/lib/useInstallPrompt';
import { useStudentOverview } from '@/entities/student';
import { useCurrentStudentId, useIsReadOnly, useSignOut } from '@/entities/auth';
import { MobileScreenHeader } from '@/widgets/mobile-nav';

export function MobileAccountPage() {
  const navigate = useNavigate();
  const onSignOut = useSignOut();
  const studentId = useCurrentStudentId() ?? 0;
  // 학부모 열람 세션이면 보고 있는 자녀의 정보다.
  const isReadOnly = useIsReadOnly();
  const { data: overview } = useStudentOverview(studentId);

  const { canInstall, needsManualInstall, install } = useInstallPrompt();

  // 데스크탑 화면으로 빠져나간다. 선호도를 남겨야 좁은 창에서 다시 /m으로 튕기지 않는다 —
  // /m은 반대 방향으로 자동 리다이렉트하지 않으므로(무한 루프 방지) 이 버튼이 유일한 탈출구다.
  function goDesktop() {
    setViewPreference('desktop');
    navigate({ to: '/student/dashboard' });
  }

  return (
    <div className="px-4 pt-4">
      <MobileScreenHeader title="Account" />

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 mb-4">
        <p className="text-lg font-bold text-on-surface">{overview?.nameKo ?? '—'}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {isReadOnly ? 'Viewing as parent' : 'Student'}
        </p>
      </div>

      <div className="space-y-2">
        {/* 크롬 계열: 탭하면 브라우저 설치창이 뜬다. 이미 설치된 상태면 canInstall이 false라 숨는다. */}
        {canInstall && (
          <ActionRow
            icon="install_mobile"
            label="Add to home screen"
            description="Open it like an app, without the address bar"
            onClick={() => void install()}
          />
        )}

        {/* iOS 사파리: 애플이 beforeinstallprompt를 지원하지 않아 코드로 설치창을 띄울 수 없다.
            사용자가 직접 "공유 → 홈 화면에 추가"를 눌러야 하므로 **버튼이 아니라 안내문**으로 둔다.
            접어두면 설치 버튼과 똑같이 생겨서 눌러도 반응 없는 버튼처럼 보이므로 항상 펼쳐둔다. */}
        {needsManualInstall && <IosInstallGuide />}

        <ActionRow icon="desktop_windows" label="Use desktop site" onClick={goDesktop} />
        <ActionRow icon="logout" label="Sign out" onClick={onSignOut} danger />
      </div>

      <p className="text-xs text-on-surface-variant/70 mt-6 leading-relaxed">
        Tests are only available on the desktop site. Use "Use desktop site" above when it's time to
        take a test.
      </p>
    </div>
  );
}

// 사파리 하단 공유 버튼과 같은 모양의 아이콘. 글로 설명하는 것보다 그림이 빠르다.
function ShareIcon() {
  return (
    <span
      className="material-symbols-outlined align-middle text-primary mx-0.5"
      style={{ fontSize: '16px' }}
      aria-label="Share"
    >
      ios_share
    </span>
  );
}

function IosInstallGuide() {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span
          className="material-symbols-outlined text-primary shrink-0"
          style={{ fontSize: '22px' }}
        >
          install_mobile
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-on-surface">Add to home screen</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Open it like an app, without the address bar
          </p>
        </div>
      </div>

      <ol className="mt-3 space-y-2.5">
        <GuideStep n={1}>
          Tap <ShareIcon /> at the bottom of Safari
        </GuideStep>
        <GuideStep n={2}>Scroll down and tap "Add to Home Screen"</GuideStep>
        <GuideStep n={3}>Tap "Add" in the top right</GuideStep>
      </ol>
    </section>
  );
}

function GuideStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      {/* 이 프로젝트의 rounded-full은 12px이라 원형이 필요하면 값을 명시해야 한다. */}
      <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-[999px] bg-primary text-white text-[11px] font-bold tabular-nums">
        {n}
      </span>
      <span className="text-xs text-on-surface-variant leading-5">{children}</span>
    </li>
  );
}

function ActionRow({
  icon,
  label,
  description,
  onClick,
  danger = false,
}: {
  icon: string;
  label: string;
  description?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full min-h-14 px-4 py-3 flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl touch-manipulation ${
        danger ? 'text-error' : 'text-on-surface'
      }`}
    >
      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '22px' }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-bold">{label}</span>
        {description && (
          <span className="block text-xs text-on-surface-variant mt-0.5">{description}</span>
        )}
      </span>
    </button>
  );
}
