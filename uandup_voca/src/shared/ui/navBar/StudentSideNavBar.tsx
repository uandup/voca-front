import { SideNavBar } from './SideNavBar';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'book_2', label: 'Word Tests', to: '/student/word-test' },
  { icon: 'error', label: 'Wrong Word Bank', to: '/student/wrong-word-bank' },
  { icon: 'school', label: 'Level Tests', to: '/student/level-test' },
] as const;

export function StudentSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
