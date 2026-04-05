import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/pages/common/LoginPage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
