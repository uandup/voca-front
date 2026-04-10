import { SideNavBar } from './SideNavBar';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'book_2', label: 'Tests', to: '/student/test-list' },
] as const;

export function StudentSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
