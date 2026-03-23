interface TestHistoryItem {
  id: number;
  type: string;
  level: number;
  date: string;
  correct: number;
  total: number;
  accuracy: number;
  iconBg: string;
  iconColor: string;
  icon: string;
}

const testHistory: TestHistoryItem[] = [
  {
    id: 1,
    type: "Word Test",
    level: 2,
    date: "Oct 18, 2023",
    correct: 38,
    total: 40,
    accuracy: 95,
    iconBg: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
    icon: "quiz",
  },
  {
    id: 2,
    type: "Review Test",
    level: 2,
    date: "Oct 12, 2023",
    correct: 40,
    total: 40,
    accuracy: 100,
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-on-tertiary-fixed-variant",
    icon: "history_edu",
  },
  {
    id: 3,
    type: "Word Test",
    level: 2,
    date: "Oct 05, 2023",
    correct: 34,
    total: 40,
    accuracy: 85,
    iconBg: "bg-primary-container/10",
    iconColor: "text-primary",
    icon: "quiz",
  },
  {
    id: 4,
    type: "Word Test",
    level: 1,
    date: "Sep 28, 2023",
    correct: 39,
    total: 40,
    accuracy: 98,
    iconBg: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
    icon: "quiz",
  },
];

import { useNavigate } from "@tanstack/react-router";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <main>
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">
          Assignments
        </h1>
        <p className="text-on-surface-variant font-medium">
          Manage your active curriculum and review your academic performance history.
        </p>
      </header>

      {/* Current Active Assignment */}
      <section className="mb-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full" />
          Current Active Path
        </h2>
        <div
          onClick={() => navigate({ to: "/student/vocabulary" })}
          className="group block relative overflow-hidden bg-surface-container-lowest rounded-xl p-8 shadow-[0px_8px_24px_rgba(0,21,80,0.08)] border-l-4 border-primary transition-all hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-container/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Active Assignment
                </span>
                <span className="text-on-surface-variant text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  Assigned on Oct 24
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-primary mb-2 group-hover:text-primary-container transition-colors">
                Level 3 - Academic Core
              </h3>
              <p className="text-on-surface-variant text-lg font-medium max-w-2xl">
                Master 40 essential vocabulary words focused on higher education and research discourse.
              </p>
            </div>
            <div className="flex items-center gap-8 md:border-l border-outline-variant/30 md:pl-8">
              <div className="text-center">
                <p className="text-3xl font-black text-primary">40</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Words</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Test History */}
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-2xl font-bold text-primary whitespace-nowrap">
          Previous Test History
        </h2>
        <div className="h-[1px] w-full bg-outline-variant/30" />
      </div>

      <div className="space-y-4">
        {testHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate({ to: "/student/vocabulary" })}
            className="group flex flex-col md:flex-row items-center justify-between bg-surface-container-low hover:bg-surface-container-lowest p-6 rounded-xl transition-all hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
              <div className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-primary">{item.type}</h4>
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary text-[10px] font-bold rounded-full">
                    Level {item.level}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  Completed on {item.date}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:gap-16">
              <div className="text-right">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter mb-1">
                  Accuracy
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary">{item.correct}</span>
                  <span className="text-sm font-medium text-on-surface-variant">/ {item.total}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-secondary-container/50 text-on-secondary-container text-xs font-bold rounded-full">
                  {item.accuracy}%
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-24" />
    </main>
  );
}
