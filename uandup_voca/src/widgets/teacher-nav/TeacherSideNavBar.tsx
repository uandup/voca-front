import { SideNavBar } from '@/shared/ui/SideNavBar';
import { isAdmin, useSignOut } from '@/entities/auth';

const BASE_NAV_ITEMS = [
  { icon: 'people', label: 'Students', to: '/teacher/students' },
  { icon: 'clinical_notes', label: 'Clinics', to: '/teacher/clinics' },
  { icon: 'book_2', label: 'Vocabulary Bank', to: '/teacher/vocabulary-bank' },
] as const;

const ADMIN_NAV_ITEM = {
  icon: 'admin_panel_settings',
  label: 'Admin',
  to: '/teacher/admin',
} as const;

interface TeacherSideNavBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function TeacherSideNavBar({ collapsed, onToggle }: TeacherSideNavBarProps) {
  const navItems = isAdmin() ? [...BASE_NAV_ITEMS, ADMIN_NAV_ITEM] : [...BASE_NAV_ITEMS];
  const onSignOut = useSignOut();

  return (
    <SideNavBar
      navItems={navItems}
      collapsed={collapsed}
      onToggle={onToggle}
      onSignOut={onSignOut}
    />
  );
}
