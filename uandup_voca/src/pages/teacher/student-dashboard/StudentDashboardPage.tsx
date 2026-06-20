import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
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

// 선생님이 학생 목록(row)에서 진입하는 학생 조회 화면.
// 학생 본인 대시보드와 동일한 widgets/student-dashboard 블록을 재사용하되,
// 제목은 BreadcrumbPageTitle(Student Management > 이름)로 바꾼다.
// 대시보드 데이터는 본인/자녀와 동일하게 /dashboard·/dashboard/charts에서 받고,
// Test Configuration은 해당 학생의 overview에서 가져온다(선생님 members/me에는 없음).
export default function StudentDashboardPage() {
  const { studentId: studentIdParam } = useParams({
    from: '/teacher/students_/$studentId',
  });
  const studentId = Number(studentIdParam);
  const navigate = useNavigate();

  const { data: overview, isLoading: overviewLoading } = useStudentOverview(studentId);
  const { data: dashboard, isLoading: dashboardLoading } = useStudentDashboard(studentId);
  const { data: charts, isLoading: chartsLoading } = useStudentDashboardCharts(studentId);

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

  if (overviewLoading || dashboardLoading || chartsLoading) {
    return (
      <main>
        <LoadingSpinner />
      </main>
    );
  }

  if (!overview || !dashboard || !charts) {
    return (
      <main>
        <BreadcrumbPageTitle
          parents={[
            { label: 'Student Management', onClick: () => navigate({ to: '/teacher/students' }) },
          ]}
          title="Not found"
        />
        <p className="text-on-surface-variant">Student not found.</p>
      </main>
    );
  }

  return (
    <main className="relative">
      <div className="overflow-x-auto">
        <div className="min-w-300 space-y-8">
          {/* Title row with todo toggle */}
          <div className="flex items-center justify-between">
            <BreadcrumbPageTitle
              parents={[
                {
                  label: 'Student Management',
                  onClick: () => navigate({ to: '/teacher/students' }),
                },
              ]}
              title={overview.nameKo}
            />

            <div className="flex items-center gap-2">
              {/* Clinic Detail Button */}
              <button
                onClick={() =>
                  navigate({
                    to: '/teacher/clinics/students/$studentId',
                    params: { studentId: String(studentId) },
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:text-primary"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  school
                </span>
                Go Clinic
              </button>

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
          </div>

          <div className="flex gap-4 items-stretch">
            <div className="flex-1">
              <LevelProgress
                level={dashboard.currentLevel}
                progressPercent={dashboard.levelProgressPercent}
                testTypeLabel={TEST_TYPE_LABEL[overview.testType] ?? '—'}
                includeSynonyms={overview.includeSynonyms}
                examQuestionCount={overview.testQuestionCount}
                assignmentCount={overview.assignmentCount}
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
              onAssignedClick={
                dashboard.activeAssignment
                  ? () =>
                      navigate({
                        to: '/teacher/students/$studentId/assigned-words/$studySetId',
                        params: {
                          studentId: String(studentId),
                          studySetId: String(dashboard.activeAssignment!.studySetId),
                        },
                      })
                  : undefined
              }
              onReviewClick={
                dashboard.pendingReviewWordCount > 0
                  ? () =>
                      navigate({
                        to: '/teacher/students/$studentId/pending-reviews',
                        params: { studentId: String(studentId) },
                      })
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Slide-in drawer from right edge — fixed 포지셔닝이므로 overflow 래퍼 바깥에 둔다. */}
      <div
        ref={drawerRef}
        className={`fixed top-24 right-0 bottom-20 w-76 z-50 transition-transform duration-300 ease-in-out
          ${todoOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full ">
          <TodoList studentId={studentId} readOnly />
        </div>
      </div>
    </main>
  );
}
