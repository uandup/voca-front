import { createFileRoute } from '@tanstack/react-router';
import ExamGradeOnlinePage from '@/pages/teacher/exam-grade-online/ExamGradeOnlinePage';
import type { ExamType } from '@/entities/test';

const EXAM_TYPES: readonly ExamType[] = ['WORD', 'EXAMPLE', 'REVIEW1', 'REVIEW2', 'REVIEW3'];

function isExamType(v: unknown): v is ExamType {
  return typeof v === 'string' && (EXAM_TYPES as readonly string[]).includes(v);
}

// 채점 성공 시 정확한 invalidation(studentKeys.studySets + testKeys.history)을 위해
// 클리닉 컨텍스트(studentId/studySetId/examType)를 진입 시 전달받는다.
interface ExamGradeOnlineSearch {
  returnTo?: string;
  studentId?: number;
  studySetId?: number;
  examType?: ExamType;
}

export const Route = createFileRoute('/teacher_/exams/$examId/grade-online')({
  component: ExamGradeOnlinePage,
  validateSearch: (search: Record<string, unknown>): ExamGradeOnlineSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    studentId: typeof search.studentId === 'number' ? search.studentId : undefined,
    studySetId: typeof search.studySetId === 'number' ? search.studySetId : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
  }),
});
