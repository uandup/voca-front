import { useTodos } from '@/entities/student';
import type { TodoItem } from '@/entities/student';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface Props {
  studentId: number;
}

// 시험 유형 → 표시 레이블
const TODO_TYPE_LABEL: Record<TodoItem['type'], string> = {
  WORD: 'Word Test',
  EXAMPLE: 'Sentence Test',
  REVIEW1: 'Review 1',
  REVIEW2: 'Review 2',
  REVIEW3: 'Review 3',
  WRONG_BANK: 'Wrong Bank Test',
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

export function TodoList({ studentId }: Props) {
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
              const dateFmt = todo.scheduledDate
                ? formatScheduledDate(todo.scheduledDate)
                : null;

              return (
                <li
                  key={todo.examId}
                  className={`rounded-xl px-3.5 py-3 flex items-center gap-3 border transition-colors
                    ${
                      todo.actionable
                        ? 'bg-primary/8 border-primary/20'
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

                  {/* 실행 가능 표시 */}
                  {todo.actionable && (
                    <span
                      className="material-symbols-outlined text-primary shrink-0"
                      style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                    >
                      play_circle
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
