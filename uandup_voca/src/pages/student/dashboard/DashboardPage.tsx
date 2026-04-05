import { useState, useRef, useEffect } from "react";
import { PageTitle } from "@/shared/ui/PageTitle";
import { WeeklyScoreChart } from "./ui/WeeklyScoreChart";
import { StatCards } from "./ui/StatCards";
import { LevelProgress } from "./ui/LevelProgress";
import { TodoList } from "./ui/TodoList";

export default function DashboardPage() {
  const [todoOpen, setTodoOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!todoOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        drawerRef.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      )
        return;
      setTodoOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [todoOpen]);

  return (
    <main className="relative">
      {/* Title row with todo toggle */}
      <div className="flex items-center justify-between mb-8">
        <PageTitle title="Welcome back, LES" />

        {/* Todo Button */}
        <button
          ref={buttonRef}
          onClick={() => setTodoOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
            ${
              todoOpen
                ? "bg-primary text-white shadow-md"
                : "bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:text-primary"
            }`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "16px" }}
          >
            {todoOpen ? "close" : "checklist"}
          </span>
          To-Do
        </button>
      </div>

      <LevelProgress />
      <div className="grid grid-cols-12 gap-8 items-stretch">
        <WeeklyScoreChart />
        <StatCards />
      </div>

      {/* Slide-in drawer from right edge */}
      <div
        ref={drawerRef}
        className={`fixed top-24 right-0 bottom-20 w-76 z-50 transition-transform duration-300 ease-in-out
          ${todoOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full ">
          <TodoList />
        </div>
      </div>
    </main>
  );
}
