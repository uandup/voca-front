import { PageTitle } from "@/shared/ui/PageTitle";
import { WeeklyScoreChart } from "./ui/WeeklyScoreChart";
import { StatCards } from "./ui/StatCards";
import { LevelProgress } from "./ui/LevelProgress";

export default function DashboardPage() {
  return (
    <main>
      <PageTitle title="Welcome back, LES" />

      {/* Level Progress */}
      <LevelProgress />

      {/* Top Grid: Chart + Stats */}
      <div className="grid grid-cols-12 gap-8 items-stretch">
        <WeeklyScoreChart />
        <StatCards />
      </div>
    </main>
  );
}
