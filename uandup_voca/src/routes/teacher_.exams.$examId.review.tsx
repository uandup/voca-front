import { createFileRoute } from '@tanstack/react-router';
import ExamReviewPage from '@/pages/teacher/exam-review/ExamReviewPage';
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

// 채점/결과 통합 페이지. 진입 시점의 examDetail.status로 grading/result 모드 자동 분기.
// 채점 성공 시 정확한 invalidation(studentKeys.studySets + testKeys.history)을 위해
// 클리닉 컨텍스트(studentId/studySetId/examType)를 진입 시 전달받는다.
interface ExamReviewSearch {
  returnTo?: string;
  studentId?: number;
  studySetId?: number;
  examType?: ExamType;
}

export const Route = createFileRoute('/teacher_/exams/$examId/review')({
  // /teacher 레이아웃을 우회하는 라우트라 가드를 명시적으로 적용한다.
  beforeLoad: requireTeacher,
  component: ExamReviewPage,
  validateSearch: (search: Record<string, unknown>): ExamReviewSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    studentId: typeof search.studentId === 'number' ? search.studentId : undefined,
    studySetId: typeof search.studySetId === 'number' ? search.studySetId : undefined,
    examType: isExamType(search.examType) ? search.examType : undefined,
  }),
});
