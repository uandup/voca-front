import { createFileRoute } from '@tanstack/react-router';
import ExamPreviewPage from '@/pages/teacher/exam-preview/ExamPreviewPage';
import { requireTeacher } from '@/entities/auth';
import type { ExamType } from '@/entities/test';

const EXAM_TYPES: readonly ExamType[] = [
  'WORD',
  'EXAMPLE',
  'REVIEW1',
  'REVIEW2',
  'REVIEW3',
  'REVIEW_DECK',
  'LEVEL_TEST',
];

function isExamType(v: unknown): v is ExamType {
  return typeof v === 'string' && (EXAM_TYPES as readonly string[]).includes(v);
}

// returnTo: Exit 시 history.replace로 돌아갈 클리닉 URL.
// examType: vocab/sentence preview row 분기를 위한 컨텍스트(EXAMPLE이면 sentence variant).
interface ExamPreviewSearch {
  returnTo?: string;
  examType?: ExamType;
}

export const Route = createFileRoute('/teacher_/exams/$examId/preview')({
  // /teacher 레이아웃을 우회하는 라우트라 가드를 명시적으로 적용한다.
  beforeLoad: requireTeacher,
  component: ExamPreviewPage,
  validateSearch: (search: Record<string, unknown>): ExamPreviewSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
  }),
});
