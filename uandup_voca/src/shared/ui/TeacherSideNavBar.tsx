import { SideNavBar } from "@/shared/ui/SideNavBar";

const navItems = [
  {
    icon: "assignment",
    label: "Test Assignment",
    to: "/teacher/test-assignment",
  },
  { icon: "grading", label: "Test Grading", to: "/teacher/test-grading" },
  { icon: "book_2", label: "Vocabulary Bank", to: "/teacher/vocabulary-bank" },
] as const;

export function TeacherSideNavBar() {
  return <SideNavBar navItems={[...navItems]} />;
}
