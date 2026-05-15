import { SideNavBar } from '@/shared/ui/SideNavBar';
import { isAdmin } from '@/entities/teacher';

const BASE_NAV_ITEMS = [
  // { icon: 'dashboard', label: 'Dashboard', to: '/teacher/dashboard' },
  { icon: 'people', label: 'Students', to: '/teacher/student-manage' },
  { icon: 'clinical_notes', label: 'Clinics', to: '/teacher/clinics' },
  { icon: 'book_2', label: 'Vocabulary Bank', to: '/teacher/vocabulary-bank' },
] as const;

const ADMIN_NAV_ITEM = {
  icon: 'admin_panel_settings',
  label: 'Admin',
  to: '/teacher/admin',
} as const;

export function TeacherSideNavBar() {
  const navItems = isAdmin() ? [...BASE_NAV_ITEMS, ADMIN_NAV_ITEM] : [...BASE_NAV_ITEMS];

  return <SideNavBar navItems={navItems} />;
}
