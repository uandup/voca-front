import { SideNavBar } from "./SideNavBar";

const navItems = [
  { icon: "dashboard", label: "Dashboard", to: "/student/dashboard" },
] as const;

export function StudentSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
