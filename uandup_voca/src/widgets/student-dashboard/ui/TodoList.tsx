import { useNavigate } from '@tanstack/react-router';
import { useTodos } from '@/entities/student';
import type { TodoItem } from '@/entities/student';
import type { ExamType } from '@/entities/test';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface Props {
  studentId: number;
  // true이면 클릭 비활성화 — 선생님이 학생 대시보드를 열람할 때 사용.
  readOnly?: boolean;
}

// 시험 유형 → 표시 레이블
const TODO_TYPE_LABEL: Record<TodoItem['type'], string> = {
  WORD: 'Word Test',
  EXAMPLE: 'Sentence Test',
  REVIEW1: 'Review 1',
  REVIEW2: 'Review 2',
  REVIEW3: 'Review 3',
  WRONG_BANK: 'Review Deck',
  LEVEL: 'Level Test',
};

// 시험 유형 → Material Symbols 아이콘
const TODO_TYPE_ICON: Record<TodoItem['type'], string> = {
  WORD: 'book',
  EXAMPLE: 'chat',
  REVIEW1: 'replay',
  REVIEW2: 'replay',
  REVIEW3: 'replay',
  WRONG_BANK: 'build',
  LEVEL: 'bar_chart',
};

// TodoItem type → ExamType search param 매핑
const TODO_EXAM_TYPE: Record<TodoItem['type'], ExamType> = {
  WORD: 'WORD',
  EXAMPLE: 'EXAMPLE',
  REVIEW1: 'REVIEW1',
  REVIEW2: 'REVIEW2',
  REVIEW3: 'REVIEW3',
  WRONG_BANK: 'REVIEW_DECK',
  LEVEL: 'LEVEL_TEST',
};

// 'YYYY-MM-DD' → 오늘 기준 상대 표시. 반환값에 isOverdue 포함.
function formatScheduledDate(iso: string): { label: string; isOverdue: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return { label: 'Overdue', isOverdue: true };
  if (diffDays === 0) return { label: 'Due Today', isOverdue: false };
  return {
    label: `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    isOverdue: false,
  };
}

export function TodoList({ studentId, readOnly = false }: Props) {
  const navigate = useNavigate();
  const { data: todos, isLoading } = useTodos(studentId);

  // actionable 우선, 그 다음 scheduledDate 오름차순(없으면 마지막).
  const sorted = todos
    ? [...todos].sort((a, b) => {
        if (a.actionable !== b.actionable) return a.actionable ? -1 : 1;
        if (!a.scheduledDate && !b.scheduledDate) return 0;
        if (!a.scheduledDate) return 1;
        if (!b.scheduledDate) return -1;
        return a.scheduledDate.localeCompare(b.scheduledDate);
      })
    : [];

  // 시험 유형 → 시험 완료 후 돌아갈 탭 경로
  const TODO_RETURN_PATH: Record<TodoItem['type'], string> = {
    WORD: '/student/word-test',
    EXAMPLE: '/student/word-test',
    REVIEW1: '/student/word-test',
    REVIEW2: '/student/word-test',
    REVIEW3: '/student/word-test',
    WRONG_BANK: '/student/review-deck',
    LEVEL: '/student/level-test',
  };

  // actionable(ONLINE_STARTED) → 바로 시험 응시 페이지로 이동.
  // 학부모 세션이면 라우트 가드(/take beforeLoad)가 /review로 리다이렉트한다.
  // returnTo는 대시보드가 아닌 시험 유형에 맞는 탭으로 설정한다.
  function goTake(todo: TodoItem) {
    navigate({
      to: '/student/exams/$examId/take',
      params: { examId: String(todo.examId) },
      search: {
        returnTo: TODO_RETURN_PATH[todo.type],
        examType: TODO_EXAM_TYPE[todo.type],
      },
    });
  }

  // 비활성(READY) + studySetId 존재 → 단어장으로 이동해 미리 학습.
  function goWords(todo: TodoItem) {
    if (todo.studySetId === null) return;
    if (todo.type === 'WRONG_BANK') {
      navigate({
        to: '/student/review-deck/$studySetId/words',
        params: { studySetId: String(todo.studySetId) },
      });
    } else if (todo.type === 'LEVEL') {
      navigate({
        to: '/student/level-test/$studySetId/words',
        params: { studySetId: String(todo.studySetId) },
      });
    } else {
      navigate({
        to: '/student/word-test/$id/words',
        params: { id: String(todo.studySetId) },
      });
    }
  }

  return (
    <aside className="h-full">
      <div className="bg-surface-container-lowest rounded-tl-2xl rounded-bl-2xl border border-outline-variant/10 shadow-md p-5 flex flex-col gap-4 h-full">
        {/* 헤더 + 건수 배지 */}
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold font-headline text-on-surface">To-Do</h2>
          {!isLoading && sorted.length > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold leading-none rounded-full px-1.5 py-0.5">
              {sorted.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : sorted.length === 0 ? (
          /* 빈 상태 */
          <div className="flex flex-col items-center justify-center gap-2 mt-4 text-center">
            <span
              className="material-symbols-outlined text-on-surface-variant/30"
              style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <p className="text-xs text-on-surface-variant">All caught up!</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2 overflow-y-auto [scrollbar-width:thin]">
            {sorted.map((todo) => {
              const dateFmt = todo.scheduledDate ? formatScheduledDate(todo.scheduledDate) : null;
              // studySetId가 있으면 단어장 이동 가능.
              const canGoWords = !todo.actionable && todo.studySetId !== null;

              return (
                <li
                  key={todo.examId}
                  onClick={
                    readOnly
                      ? undefined
                      : () => {
                          if (todo.actionable) goTake(todo);
                          else if (canGoWords) goWords(todo);
                        }
                  }
                  className={`rounded-xl px-3.5 py-3 flex items-center gap-3 border transition-colors
                    ${
                      readOnly
                        ? todo.actionable
                          ? 'bg-primary/8 border-primary/20'
                          : 'bg-surface-container border-transparent'
                        : todo.actionable
                          ? 'bg-primary/8 border-primary/20 cursor-pointer hover:bg-primary/12'
                          : canGoWords
                            ? 'bg-surface-container border-transparent cursor-pointer hover:bg-surface-container-high'
                            : 'bg-surface-container border-transparent'
                    }`}
                >
                  {/* 유형 아이콘 */}
                  <span
                    className={`material-symbols-outlined shrink-0 ${
                      todo.actionable ? 'text-primary' : 'text-on-surface-variant/60'
                    }`}
                    style={{ fontSize: '18px' }}
                  >
                    {TODO_TYPE_ICON[todo.type]}
                  </span>

                  {/* 레이블 + 예정일 */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span
                      className={`text-xs font-semibold leading-tight truncate ${
                        todo.actionable ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {TODO_TYPE_LABEL[todo.type]}
                    </span>
                    {dateFmt && (
                      <span
                        className={`text-[11px] font-medium leading-tight ${
                          dateFmt.isOverdue ? 'text-error' : 'text-on-surface-variant'
                        }`}
                      >
                        {dateFmt.label}
                      </span>
                    )}
                  </div>

                  {/* 우측 액션 힌트 — readOnly(선생님 열람)이면 표시 안 함 */}
                  {!readOnly &&
                    (todo.actionable ? (
                      // actionable: Start 뱃지로 즉시 응시 가능함을 표시
                      <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-bold text-white bg-primary rounded-full px-2 py-0.5">
                        Start
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          arrow_forward
                        </span>
                      </span>
                    ) : canGoWords ? (
                      // 비활성이지만 단어장 이동 가능 — 텍스트 힌트 제공
                      <span className="shrink-0 text-[10px] font-bold text-on-surface-variant/50">
                        View Words
                      </span>
                    ) : null)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
