import { createFileRoute } from "@tanstack/react-router";
import ClassesPage from "@/pages/teacher/classes/ClassesPage";

export const Route = createFileRoute("/teacher/classes")({
  component: ClassesPage,
});
