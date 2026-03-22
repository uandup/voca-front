import { createFileRoute } from "@tanstack/react-router";
import { TestAssignmentPage } from "../pages/test-assignment/ui/TestAssignmentPage";

export const Route = createFileRoute("/test-assignment")({
  component: TestAssignmentPage,
});
