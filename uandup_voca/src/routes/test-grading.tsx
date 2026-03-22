import { createFileRoute } from "@tanstack/react-router";
import { TestGradingPage } from "../pages/test-grading/ui/TestGradingPage";

export const Route = createFileRoute("/test-grading")({
  component: TestGradingPage,
});
