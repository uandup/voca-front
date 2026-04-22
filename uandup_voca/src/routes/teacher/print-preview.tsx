import { createFileRoute } from '@tanstack/react-router';
import { PrintPreviewPage } from '@/pages/teacher/print-preview/ui/PrintPreviewPage';

export const Route = createFileRoute('/teacher/print-preview')({
  component: PrintPreviewPage,
});
