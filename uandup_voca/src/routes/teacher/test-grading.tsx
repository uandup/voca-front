import { createFileRoute } from "@tanstack/react-router";
import { TestGradingPage } from "../../pages/test-grading/ui/TestGradingPage";

export const Route = createFileRoute("/teacher/test-grading")({
  component: TestGradingPage,
});
