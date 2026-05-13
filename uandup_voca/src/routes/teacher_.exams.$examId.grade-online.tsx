import { createFileRoute } from '@tanstack/react-router';
import ExamGradeOnlinePage from '@/pages/teacher/exam-grade-online/ExamGradeOnlinePage';

export const Route = createFileRoute('/teacher_/exams/$examId/grade-online')({
  component: ExamGradeOnlinePage,
});
