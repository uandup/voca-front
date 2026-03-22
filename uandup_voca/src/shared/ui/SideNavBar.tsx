import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  {
    icon: "assignment",
    label: "Test Assignment",
    to: "/teacher/test-assignment",
  },
  { icon: "grading", label: "Test Grading", to: "/teacher/test-grading" },
  { icon: "book_2", label: "Vocabulary Bank", to: "/teacher/vocabulary-bank" },
] as const;

export function SideNavBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col gap-2 p-4 bg-slate-50 border-r border-slate-200/20 z-40">
      <div className="py-2">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 bg-white text-blue-900 font-bold shadow-sm rounded-lg transition-transform duration-200"
                  : "flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-200/50 rounded-lg transition-transform duration-200"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-slate-200">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-200/50 rounded-lg text-sm"
        >
          <span className="material-symbols-outlined">help</span>
          <span>Help Center</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-200/50 rounded-lg text-sm"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
  );
}
