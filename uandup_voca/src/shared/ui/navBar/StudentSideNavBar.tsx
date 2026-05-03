import { SideNavBar } from './SideNavBar';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'book_2', label: 'Word Test', to: '/student/word-test' },
  {
    icon: 'error',
    label: 'Review Deck',
    to: '/student/review-deck',
    activePrefixes: ['/student/review-deck/words'],
  },
  {
    icon: 'school',
    label: 'Level Test',
    to: '/student/level-test',
    activePrefixes: ['/student/level-word-list'],
  },
] as const;

export function StudentSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
