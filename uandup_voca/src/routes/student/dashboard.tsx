import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardPage } from "@/pages/student-dashboard/ui/StudentDashboardPage";

export const Route = createFileRoute("/student/dashboard")({
  component: StudentDashboardPage,
});

