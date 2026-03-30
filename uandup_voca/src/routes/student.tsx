import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StudentSideNavBar } from "@/shared/ui/navBar";

export const Route = createFileRoute("/student")({
  component: () => (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <StudentSideNavBar />
      <div className="ml-64 p-10">
        <Outlet />
      </div>
    </div>
  ),
});
