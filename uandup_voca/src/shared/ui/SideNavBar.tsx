import { Link, useNavigate, useRouterState } from '@tanstack/react-router';

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
}

export function SideNavBar({ navItems, collapsed, onToggle }: SideNavBarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    navigate({ to: '/' });
  };

  return (
    <aside
      className={`h-screen fixed -r  left-0 top-0 flex flex-col gap-2 py-4 px-3 bg-slate-50 border-r border-slate-200 z-40 overflow-hidden transition-all duration-200 ${
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
          className="flex items-center justify-center  rounded-lg text-slate-600 hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined leading-none">
            {collapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>

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
          onClick={handleSignOut}
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
