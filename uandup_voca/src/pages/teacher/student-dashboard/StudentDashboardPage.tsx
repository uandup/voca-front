import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { BreadcrumbPageTitle } from '@/shared/ui/BreadcrumbPageTitle';
import { getStudents, toStudentManageTableRow, studentKeys } from '@/entities/student';
import {
  ScoreTrendChart,
  StatCards,
  LevelProgress,
  WordsLearnedCard,
  TodoList,
} from '@/widgets/student-dashboard';

// 선생님이 학생 목록(row)에서 진입하는 학생 조회 화면.
// 학생 본인 대시보드(pages/student/dashboard)와 동일한 widgets/student-dashboard
// 블록을 재사용하되, 제목은 BreadcrumbPageTitle(Student > 이름)로 바꾼다.
export default function StudentDashboardPage() {
  const { studentId: studentIdParam } = useParams({
    from: '/teacher/students_/$studentId',
  });
  const studentId = Number(studentIdParam);
  const navigate = useNavigate();

  // 학생 목록 쿼리(studentKeys.lists())를 그대로 재사용 — StudentManagePage와 캐시를 공유한다.
  // 단일 학생 overview API가 별도로 있지만, 대시보드 위젯이 요구하는 필드는
  // StudentManageTableRow에 모두 포함되어 있어 목록 캐시에서 찾는 것으로 충분하다.
  const { data: students = [], isLoading } = useQuery({
    queryKey: studentKeys.lists(),
    queryFn: getStudents,
    select: (res) => res.data?.map(toStudentManageTableRow) ?? [],
  });
  const student = students.find((s) => s.id === studentId);

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

  if (isLoading) {
    return (
      <main>
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  if (!student) {
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
      {/* Title row with todo toggle */}
      <div className="flex items-center justify-between">
        <BreadcrumbPageTitle
          parents={[
            { label: 'Student Management', onClick: () => navigate({ to: '/teacher/students' }) },
          ]}
          title={student.nameKo}
        />

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
            student={{
              assignedLevel: student.assignedLevel,
              assignedWordCount: student.assignedWordCount,
              testConfig: student.testConfig,
            }}
          />
        </div>
        <WordsLearnedCard />
      </div>
      <div className="grid grid-cols-12 gap-8 items-stretch">
        <ScoreTrendChart />
        <StatCards
          student={{ accuracy: student.accuracy, assignedWordCount: student.assignedWordCount }}
        />
      </div>

      {/* Slide-in drawer from right edge */}
      <div
        ref={drawerRef}
        className={`fixed top-24 right-0 bottom-20 w-76 z-50 transition-transform duration-300 ease-in-out
          ${todoOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full ">
          <TodoList student={{ assignedWordCount: student.assignedWordCount }} />
        </div>
      </div>
    </main>
  );
}
