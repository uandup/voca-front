import { useTodos } from '@/entities/student';
import type { TodoItem } from '@/entities/student';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface Props {
  studentId: number;
}

// 시험 유형 → 표시 레이블
const TODO_TYPE_LABEL: Record<TodoItem['type'], string> = {
  WORD: 'Word Test',
  EXAMPLE: 'Example Sentence Test',
  REVIEW1: 'Review Test 1',
  REVIEW2: 'Review Test 2',
  REVIEW3: 'Review Test 3',
  WRONG_BANK: 'Wrong Bank Test',
  LEVEL: 'Level Test',
};

export function TodoList({ studentId }: Props) {
  const { data: todos, isLoading } = useTodos(studentId);

  return (
    <aside className="h-full">
      <div className="bg-surface-container-lowest rounded-tl-2xl rounded-bl-2xl border border-outline-variant/10 shadow-md p-5 flex flex-col gap-4 h-full">
        <h2 className="text-sm font-bold font-headline text-on-surface">To-Do</h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : !todos || todos.length === 0 ? (
          <p className="text-xs text-on-surface-variant text-center mt-4">No tasks yet.</p>
        ) : (
          <ul className="flex flex-col gap-3 overflow-y-auto [scrollbar-width:thin]">
            {todos.map((todo) => (
              <li
                key={todo.examId}
                className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between gap-2
                  ${todo.actionable
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container-high text-on-surface'
                  }`}
              >
                <span>{TODO_TYPE_LABEL[todo.type] ?? todo.type}</span>
                {todo.actionable && (
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>
                    play_circle
                  </span>
                )}
                {todo.scheduledDate && (
                  <span className="text-xs text-on-surface-variant ml-auto">
                    {todo.scheduledDate}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
