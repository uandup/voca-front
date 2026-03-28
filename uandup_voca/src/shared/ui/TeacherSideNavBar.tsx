import { SideNavBar } from "@/shared/ui/SideNavBar";

const navItems = [
  { icon: "dashboard", label: "Dashboard", to: "/teacher/dashboard" },
  { icon: "calendar_today", label: "Classes", to: "/teacher/classes" },
  {
    icon: "assignment",
    label: "Test Assignment",
    to: "/teacher/test-assignment",
  },
  { icon: "grading", label: "Test Grading", to: "/teacher/test-grading" },
  { icon: "book_2", label: "Vocabulary Bank", to: "/teacher/vocabulary-bank" },
  { icon: "print", label: "Print Preview", to: "/teacher/print-preview" },
] as const;

export function TeacherSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
