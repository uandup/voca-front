import { useState, useRef, useEffect } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { useCurrentStudentId } from '@/shared/jwt';
import { useStudentDashboard, useStudentDashboardCharts, useMyInfo } from '@/features/student';
import {
  ScoreTrendChart,
  StatCards,
  LevelProgress,
  WordsLearnedCard,
  TodoList,
} from '@/widgets/student-dashboard';

const TEST_TYPE_LABEL: Record<'WORD_TO_MEANING' | 'MEANING_TO_WORD', string> = {
  WORD_TO_MEANING: 'Word to meaning',
  MEANING_TO_WORD: 'Meaning to word',
};

export default function DashboardPage() {
  // 학생 본인이면 JWT의 studentId, 학부모 열람이면 선택된 자녀 id.
  const studentId = useCurrentStudentId() ?? 0;

  const { data: dashboard, isLoading: dashboardLoading } = useStudentDashboard(studentId);
  const { data: charts, isLoading: chartsLoading } = useStudentDashboardCharts(studentId);
  // Test Configuration은 대시보드 API에 없어 members/me의 examSettings에서 가져온다.
  const { data: me } = useMyInfo();

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
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  const examSettings = me?.examSettings;
  const testTypeLabel = examSettings?.examSubType
    ? TEST_TYPE_LABEL[examSettings.examSubType]
    : '—';

  return (
    <main className="relative">
      {/* Title row with todo toggle */}
      <div className="flex items-center justify-between">
        <PageTitle title={me?.name ? `Welcome back, ${me.name}` : 'Welcome back'} />

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
            includeSynonyms={examSettings?.includeSynonyms ?? false}
            examQuestionCount={examSettings?.examQuestionCount ?? 0}
            assignmentCount={examSettings?.assignmentCount ?? 0}
          />
        </div>
        <WordsLearnedCard count={dashboard.memorizedWordCount} />
      </div>
      <div className="grid grid-cols-12 gap-8 items-stretch">
        <ScoreTrendChart charts={charts} />
        <StatCards
          accuracy={dashboard.overallAccuracy}
          assignedWordCount={dashboard.activeAssignedWordCount}
          pendingReviewWordCount={dashboard.pendingReviewWordCount}
        />
      </div>

      {/* Slide-in drawer from right edge */}
      <div
        ref={drawerRef}
        className={`fixed top-24 right-0 bottom-20 w-76 z-50 transition-transform duration-300 ease-in-out
          ${todoOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full ">
          <TodoList assignedWordCount={dashboard.activeAssignedWordCount} />
        </div>
      </div>
    </main>
  );
}
