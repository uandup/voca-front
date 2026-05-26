import type { ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';

interface NavItem {
  icon: string;
  label: string;
  to: string;
  activePrefixes?: readonly string[];
}

interface SideNavBarProps {
  navItems: NavItem[];
  collapsed: boolean;
  onToggle: () => void;
  // 로고와 메뉴 사이에 들어가는 선택적 영역(예: 학부모의 자녀 전환 드롭다운).
  // 표시 위치만 제공하고 내용은 사용처가 결정한다 — collapsed 상태 대응도 슬롯 쪽 책임.
  topSlot?: ReactNode;
  // 로그아웃 동작 — auth entity의 useSignOut을 래퍼(StudentSideNavBar/TeacherSideNavBar)에서 주입한다.
  // 도메인(토큰, 자녀 열람 상태)을 모르는 shared 레이어에 두기 위해 prop으로 분리.
  onSignOut: () => void;
}

export function SideNavBar({
  navItems,
  collapsed,
  onToggle,
  topSlot,
  onSignOut,
}: SideNavBarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={`h-screen fixed left-0 top-0 flex flex-col gap-2 py-4 px-3 bg-slate-50 border-r border-slate-200 z-40 overflow-hidden transition-all duration-200 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* 로고 + 접기/펼치기 토글 — 토글은 레일에 항상 보이므로 접힌 뒤에도 다시 펼칠 수 있다.
          높이를 고정해 로고 유무에 따라 아래 메뉴가 위아래로 밀리지 않게 한다. */}
      <div className={`flex items-center h-16 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <img src="/logo.png" alt="Logo" className="h-12 w-auto" />}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex items-center justify-center py-1 rounded-lg text-slate-600 hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined leading-none">
            {collapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>

      {/* topSlot은 항상 truthy인 엘리먼트일 수 있어(예: 학생 세션에서 null을 반환하는 ChildSwitcher),
          래퍼로 감싸면 빈 여백이 남는다. 간격은 슬롯 콘텐츠가 직접 책임진다. */}
      {topSlot}

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname.includes(item.to) ||
            (item.activePrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false);
          return (
            <Link
              key={item.label}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 py-3 px-3 rounded-lg transition-transform duration-200 ${
                isActive
                  ? 'bg-white text-blue-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              <span className="material-symbols-outlined shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onSignOut}
          title={collapsed ? 'Sign Out' : undefined}
          className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-slate-600 hover:bg-slate-200/50"
        >
          <span className="material-symbols-outlined shrink-0">logout</span>
          {!collapsed && <span className="whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
