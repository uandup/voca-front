import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageTitle } from '@/shared/ui/PageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCurrentStudentId } from '@/entities/auth';
import {
  useStudentOverview,
  useStudentDashboard,
  useStudentDashboardCharts,
} from '@/entities/student';
import {
  ScoreTrendChart,
  StatCards,
  LevelProgress,
  WordsLearnedCard,
  TodoList,
} from '@/widgets/student-dashboard';

// 학생 클라이언트 시험 유형('word-to-meaning' 등) → 표시 문구.
const TEST_TYPE_LABEL: Record<string, string> = {
  'word-to-meaning': 'Word to meaning',
  'meaning-to-word': 'Meaning to word',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  // 학생 본인이면 JWT의 studentId, 학부모 열람이면 선택된 자녀 id.
  const studentId = useCurrentStudentId() ?? 0;

  const { data: dashboard, isLoading: dashboardLoading } = useStudentDashboard(studentId);
  const { data: charts, isLoading: chartsLoading } = useStudentDashboardCharts(studentId);
  // Test Configuration은 대시보드 API에 없어 해당 학생의 overview에서 가져온다.
  // members/me 대신 student overview를 쓰는 이유 — 학부모가 자녀 대시보드를 열람할 때
  // members/me는 학부모 본인 정보라 examSubType 등이 비기 때문이다.
  const { data: overview } = useStudentOverview(studentId);

  const [todoOpen, setTodoOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!todoOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        drawerRef.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      )
        return;
      setTodoOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [todoOpen]);

  if (dashboardLoading || chartsLoading || !dashboard || !charts) {
    return (
      <main>
        <LoadingSpinner />
      </main>
    );
  }

  const testTypeLabel = overview ? (TEST_TYPE_LABEL[overview.testType] ?? '—') : '—';

  return (
    <main className="relative">
      {/* Title row with todo toggle */}
      <div className="flex items-center justify-between">
        <PageTitle title={overview?.nameKo ? `Welcome back, ${overview.nameKo}` : 'Welcome back'} />

        {/* Todo Button */}
        <button
          ref={buttonRef}
          onClick={() => setTodoOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
            ${
              todoOpen
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:text-primary'
            }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {todoOpen ? 'close' : 'checklist'}
          </span>
          To-Do
        </button>
      </div>

      <div className="flex gap-4 items-stretch mb-8">
        <div className="flex-1">
          <LevelProgress
            level={dashboard.currentLevel}
            progressPercent={dashboard.levelProgressPercent}
            testTypeLabel={testTypeLabel}
            includeSynonyms={overview?.includeSynonyms ?? false}
            examQuestionCount={overview?.testQuestionCount ?? 0}
            assignmentCount={overview?.assignmentCount ?? 0}
          />
        </div>
        <WordsLearnedCard count={dashboard.memorizedWordCount} />
      </div>
      <div className="grid grid-cols-12 gap-8 items-stretch">
        <ScoreTrendChart charts={charts} />
        <StatCards
          accuracy={dashboard.overallAccuracy}
          assignedWordCount={dashboard.activeAssignment?.wordCount ?? 0}
          pendingReviewWordCount={dashboard.pendingReviewWordCount}
          // 카드 클릭 시 진행 중 배정의 단어 목록 페이지로 이동 — activeAssignment가 없으면 버튼 비활성.
          onAssignedClick={
            dashboard.activeAssignment
              ? () =>
                  navigate({
                    to: '/student/dashboard/assigned-words/$studySetId',
                    params: { studySetId: String(dashboard.activeAssignment!.studySetId) },
                  })
              : undefined
          }
        />
      </div>

      {/* Slide-in drawer from right edge */}
      <div
        ref={drawerRef}
        className={`fixed top-24 right-0 bottom-20 w-76 z-50 transition-transform duration-300 ease-in-out
          ${todoOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full ">
          <TodoList assignedWordCount={dashboard.activeAssignment?.wordCount ?? 0} />
        </div>
      </div>
    </main>
  );
}
