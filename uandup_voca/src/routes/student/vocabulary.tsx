import { createFileRoute } from "@tanstack/react-router";
import { StudentVocabularyPage } from "@/pages/student-vocabulary/ui/StudentVocabularyPage";

export const Route = createFileRoute("/student/vocabulary")({
  component: StudentVocabularyPage,
});
