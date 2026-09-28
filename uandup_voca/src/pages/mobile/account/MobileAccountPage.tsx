import { useNavigate } from '@tanstack/react-router';
import { setViewPreference } from '@/shared/lib/viewport';
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

function ActionRow({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full min-h-14 px-4 flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl touch-manipulation ${
        danger ? 'text-error' : 'text-on-surface'
      }`}
    >
      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '22px' }}>
        {icon}
      </span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
