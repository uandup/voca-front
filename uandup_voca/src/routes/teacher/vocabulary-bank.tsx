import { createFileRoute } from "@tanstack/react-router";
import { VocabularyBankPage } from "@/pages/vocabulary-bank/ui/VocabularyBankPage";

export const Route = createFileRoute("/teacher/vocabulary-bank")({
  component: VocabularyBankPage,
});
