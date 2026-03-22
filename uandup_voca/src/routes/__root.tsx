import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SideNavBar } from "../shared/ui/SideNavBar";

export const Route = createRootRoute({
  component: () => (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <SideNavBar />
      <Outlet />
    </div>
  ),
});
