import { createFileRoute } from '@tanstack/react-router';
import StudentManagePage from '@/pages/teacher/student-manage/StudentManagePage';

export const Route = createFileRoute('/teacher/students')({
  component: StudentManagePage,
});
