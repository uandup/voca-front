import { createFileRoute } from '@tanstack/react-router';
import ExamPreviewPage from '@/pages/teacher/exam-preview/ExamPreviewPage';

export const Route = createFileRoute('/teacher_/exams/$examId/preview')({
  component: ExamPreviewPage,
});
