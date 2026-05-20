import { SideNavBar } from '@/shared/ui/SideNavBar';

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

interface StudentSideNavBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function StudentSideNavBar({ collapsed, onToggle }: StudentSideNavBarProps) {
  return <SideNavBar navItems={[...navItems]} collapsed={collapsed} onToggle={onToggle} />;
}
