import { createFileRoute } from '@tanstack/react-router';
import ExamPreviewPage from '@/pages/teacher/exam-preview/ExamPreviewPage';

// returnTo: Exit 시 history.replace로 돌아갈 클리닉 URL.
// CreatedPanel에서 진입할 때 현재 위치를 전달받아, replace로 복원하면 history의 preview 엔트리가
// 덮어쓰여 브라우저 앞으로가기로 preview 화면에 재진입할 수 없게 한다.
interface ExamPreviewSearch {
  returnTo?: string;
}

export const Route = createFileRoute('/teacher_/exams/$examId/preview')({
  component: ExamPreviewPage,
  validateSearch: (search: Record<string, unknown>): ExamPreviewSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
  }),
});
