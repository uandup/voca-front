import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { icon: "assignment", label: "Assignments", to: "/student/dashboard" },
] as const;

export function StudentSideNavBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-16 bg-slate-50 flex flex-col gap-2 px-4 py-6">
      <div className="mb-8 px-2 pt-4">
        <h2 className="font-headline font-bold text-blue-900 text-lg">
          The Scholarly Curator
        </h2>
        <p className="text-xs text-on-surface-variant font-medium tracking-wide">
          Academic Excellence
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 bg-white text-blue-900 font-bold shadow-sm rounded-lg"
                  : "flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/50 transition-all rounded-lg"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pb-10">
        <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            add_circle
          </span>
          <span>Add New Word</span>
        </button>
      </div>
    </aside>
  );
}
