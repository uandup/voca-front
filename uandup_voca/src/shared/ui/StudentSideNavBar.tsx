import { SideNavBar } from "@/shared/ui/SideNavBar";

const navItems = [
  { icon: "assignment", label: "Dashboard", to: "/student/dashboard" },
] as const;

export function StudentSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
