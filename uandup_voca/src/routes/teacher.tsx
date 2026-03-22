import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SideNavBar } from "@/shared/ui/SideNavBar";

export const Route = createFileRoute("/teacher")({
  component: () => (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <SideNavBar />
      <Outlet />
    </div>
  ),
});
