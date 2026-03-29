import { SideNavBar } from "./SideNavBar";

const navItems = [
  { icon: "dashboard", label: "Dashboard", to: "/teacher/dashboard" },
  { icon: "calendar_today", label: "Class", to: "/teacher/class" },
  // {
  //   icon: "assignment",
  //   label: "Test Assignment",
  //   to: "/teacher/test-assignment",
  // },
  // { icon: "grading", label: "Test Grading", to: "/teacher/test-grading" },
  { icon: "clinical_notes", label: "Clinic", to: "/teacher/clinic" },
  { icon: "book_2", label: "Vocabulary Bank", to: "/teacher/vocabulary-bank" },
  { icon: "print", label: "Print Preview", to: "/teacher/print-preview" },
] as const;

export function TeacherSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
