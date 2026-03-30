import { createFileRoute } from "@tanstack/react-router";
import ClinicsPage from "@/pages/teacher/clinics/ClinicsPage";

export const Route = createFileRoute("/teacher/clinics")({
  component: ClinicsPage,
});
