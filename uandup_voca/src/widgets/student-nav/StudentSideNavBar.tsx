import { SideNavBar } from '@/shared/ui/SideNavBar';
import { ChildSwitcher } from '@/features/child-switch';
import { useSignOut, useIsReadOnly } from '@/entities/auth';

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
  {
    icon: 'auto_stories',
    label: 'Personal Words',
    to: '/student/personal-words',
  },
] as const;

// 개인 단어장은 학생 본인과 선생님만 접근 가능하다 — 학부모 세션에선 메뉴에서 아예 뺀다.
// 라우트 가드만 두면 학부모가 메뉴를 눌렀을 때 대시보드로 튕기는 혼란스러운 동작이 된다.
const PARENT_HIDDEN_PATHS: readonly string[] = ['/student/personal-words'];

interface StudentSideNavBarProps {
  collapsed: boolean;
  onToggle: () => void;
  toggleDisabled?: boolean;
}

export function StudentSideNavBar({ collapsed, onToggle, toggleDisabled }: StudentSideNavBarProps) {
  const onSignOut = useSignOut();
  // useIsReadOnly는 PARENT 세션에서 true.
  const isReadOnly = useIsReadOnly();
  const items = isReadOnly
    ? navItems.filter((item) => !PARENT_HIDDEN_PATHS.includes(item.to))
    : [...navItems];

  return (
    <SideNavBar
      navItems={items}
      collapsed={collapsed}
      onToggle={onToggle}
      toggleDisabled={toggleDisabled}
      // 학부모 열람 세션이면 자녀 전환 드롭다운이 뜬다. 학생 본인 세션이면 ChildSwitcher가 null을 반환.
      topSlot={<ChildSwitcher collapsed={collapsed} />}
      onSignOut={onSignOut}
    />
  );
}
