import { Link, useRouterState } from '@tanstack/react-router';

interface TabItem {
  icon: string;
  label: string;
  to: string;
  // 이 prefix로 시작하는 경로에서도 이 탭을 활성으로 본다 (하위 화면 대응).
  activePrefixes?: readonly string[];
}

const TAB_ITEMS: readonly TabItem[] = [
  {
    icon: 'menu_book',
    label: 'Library',
    to: '/m/library',
    activePrefixes: ['/m/words'],
  },
  { icon: 'account_circle', label: 'Account', to: '/m/account' },
] as const;

/**
 * 학생 모바일 화면의 하단 탭바.
 *
 * shared가 아니라 widgets에 두는 이유: 탭 항목이 /m/library·/m/account라 순수 도메인이고
 * 소비처가 하나뿐이다. SideNavBar(shared, 도메인 무지) ↔ StudentSideNavBar(widgets, 항목 주입)
 * 처럼 둘로 쪼개는 것은 선생님 모바일 화면이 생길 때 하면 된다.
 *
 * 로그아웃은 탭에 넣지 않고 /m/account 안에 둔다 — 탭이 2개로 단순해지고,
 * 오탭으로 로그아웃되는 사고를 막는다.
 */
export function MobileStudentTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex bg-surface-container-lowest border-t border-outline-variant/40"
      // 아이폰 홈 인디케이터에 탭이 깔리지 않도록 세이프에리어만큼 아래를 띄운다.
      // (index.html의 viewport-fit=cover가 있어야 이 값이 0이 아닌 값으로 해석된다.)
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      {TAB_ITEMS.map((tab) => {
        const active =
          pathname === tab.to ||
          (tab.activePrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false);

        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex-1 min-h-14 flex flex-col items-center justify-center gap-0.5 touch-manipulation transition-colors ${
              active ? 'text-primary' : 'text-on-surface-variant'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '24px',
                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
