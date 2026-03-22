import { createFileRoute } from "@tanstack/react-router";
import { TestAssignmentDetailPage } from "../pages/test-assignment/ui/TestAssignmentDetailPage";

export const Route = createFileRoute("/test-assignment_/$studentId")({
  component: TestAssignmentDetailPage,
});
