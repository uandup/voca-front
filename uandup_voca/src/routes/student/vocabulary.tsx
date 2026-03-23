import { createFileRoute } from "@tanstack/react-router";
import { VocabularyPage } from "@/pages/student/vocabulary/ui/VocabularyPage";

export const Route = createFileRoute("/student/vocabulary")({
  component: VocabularyPage,
});
