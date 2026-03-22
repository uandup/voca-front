import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test-grading")({
  component: () => <div className="ml-64 p-10">Test Grading</div>,
});
