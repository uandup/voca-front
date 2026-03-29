import { createFileRoute } from "@tanstack/react-router";
import ClassesPage from "@/pages/teacher/class/ClassPage";

export const Route = createFileRoute("/teacher/class/")({
  component: ClassesPage,
});
