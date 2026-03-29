import { createFileRoute } from "@tanstack/react-router";
import ClinicsPage from "@/pages/teacher/clinic/ClinicsPage";

export const Route = createFileRoute("/teacher/clinic")({
  component: ClinicsPage,
});
