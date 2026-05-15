import { createFileRoute } from '@tanstack/react-router';
import { ClinicDetailPage } from '@/pages/teacher/clinic-detail/ClinicDetailPage';

// 페이지 내 펼침 상태(어느 main tab을 보고 있는지, 어느 study-set의 어느 step이 열려있는지)를
// URL에 영속화하여 Preview/Grade 페이지로 이동 후 returnTo(history.replace)로 돌아왔을 때
// 같은 탭과 step이 다시 열리도록 한다.
type MainTab = 'wordTest' | 'reviewDeck' | 'levelTest';
const MAIN_TABS: readonly MainTab[] = ['wordTest', 'reviewDeck', 'levelTest'];

function isMainTab(v: unknown): v is MainTab {
  return typeof v === 'string' && (MAIN_TABS as readonly string[]).includes(v);
}

export interface ClinicDetailSearch {
  tab?: MainTab;
  openSet?: number;
  openStep?: string;
}

export const Route = createFileRoute('/teacher/clinics_/students/$studentId')({
  component: ClinicDetailPage,
  validateSearch: (search: Record<string, unknown>): ClinicDetailSearch => ({
    tab: isMainTab(search.tab) ? search.tab : undefined,
    openSet: typeof search.openSet === 'number' ? search.openSet : undefined,
    openStep: typeof search.openStep === 'string' ? search.openStep : undefined,
  }),
});
