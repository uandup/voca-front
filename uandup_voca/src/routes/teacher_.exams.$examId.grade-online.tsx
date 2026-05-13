import { createFileRoute } from '@tanstack/react-router';
import ExamGradeOnlinePage from '@/pages/teacher/exam-grade-online/ExamGradeOnlinePage';

interface ExamGradeOnlineSearch {
  returnTo?: string;
}

export const Route = createFileRoute('/teacher_/exams/$examId/grade-online')({
  component: ExamGradeOnlinePage,
  validateSearch: (search: Record<string, unknown>): ExamGradeOnlineSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
  }),
});
