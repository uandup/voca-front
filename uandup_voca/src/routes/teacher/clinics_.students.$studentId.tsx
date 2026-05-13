import { createFileRoute } from '@tanstack/react-router';
import { ClinicDetailPage } from '@/pages/teacher/clinic-detail/ClinicDetailPage';

// 페이지 내 펼침 상태(어느 study-set의 어느 step이 열려있는지)를 URL에 영속화하여
// Preview/Grade Online 페이지로 이동 후 history.back()으로 돌아왔을 때 같은 step이 다시 열리도록 한다.
interface ClinicDetailSearch {
  openSet?: number;
  openStep?: string;
}

export const Route = createFileRoute('/teacher/clinics_/students/$studentId')({
  component: ClinicDetailPage,
  validateSearch: (search: Record<string, unknown>): ClinicDetailSearch => ({
    openSet: typeof search.openSet === 'number' ? search.openSet : undefined,
    openStep: typeof search.openStep === 'string' ? search.openStep : undefined,
  }),
});
