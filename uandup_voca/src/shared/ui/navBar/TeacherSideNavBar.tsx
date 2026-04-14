import { SideNavBar } from './SideNavBar';

const navItems = [
  // { icon: 'dashboard', label: 'Dashboard', to: '/teacher/dashboard' },
  { icon: 'people', label: 'Students', to: '/teacher/student-manage' },
  // { icon: 'calendar_today', label: 'Classes', to: '/teacher/classes' },
  // {
  //   icon: "assignment",
  //   label: "Test Assignment",
  //   to: "/teacher/test-assignment",
  // },
  // { icon: "grading", label: "Test Grading", to: "/teacher/test-grading" },
  { icon: 'clinical_notes', label: 'Clinics', to: '/teacher/clinics' },
  { icon: 'book_2', label: 'Vocabulary Bank', to: '/teacher/vocabulary-bank' },
  // { icon: 'print', label: 'Print Preview', to: '/teacher/print-preview' },
  { icon: 'admin_panel_settings', label: 'Admin', to: '/teacher/admin' },
] as const;

export function TeacherSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
