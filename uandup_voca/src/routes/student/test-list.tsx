import { createFileRoute } from "@tanstack/react-router";
import { TestListPage } from "@/pages/student/test-list/ui/TestListPage";

export const Route = createFileRoute("/student/test-list")({
  component: TestListPage,
});
