import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StudentSideNavBar } from "../shared/ui/StudentSideNavBar";

export const Route = createFileRoute("/student")({
  component: () => (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <StudentSideNavBar />
      <Outlet />
    </div>
  ),
});
