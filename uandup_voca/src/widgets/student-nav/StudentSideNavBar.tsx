import { SideNavBar } from '@/shared/ui/SideNavBar';
import { ChildSwitcher } from '@/features/child-switch';
import { useSignOut } from '@/entities/auth';

const navItems = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    to: '/student/dashboard',
    activePrefixes: ['/student/dashboard/assigned-words', '/student/dashboard/pending-reviews'],
  },
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
  toggleDisabled?: boolean;
}

export function StudentSideNavBar({ collapsed, onToggle, toggleDisabled }: StudentSideNavBarProps) {
  const onSignOut = useSignOut();
  return (
    <SideNavBar
      navItems={[...navItems]}
      collapsed={collapsed}
      onToggle={onToggle}
      toggleDisabled={toggleDisabled}
      // 학부모 열람 세션이면 자녀 전환 드롭다운이 뜬다. 학생 본인 세션이면 ChildSwitcher가 null을 반환.
      topSlot={<ChildSwitcher collapsed={collapsed} />}
      onSignOut={onSignOut}
    />
  );
}
