import { ITEMS_PER_PAGE } from '../mock/testMockData';

interface ProgressPanelProps {
  questionIds: number[];
  completedCount: number;
  remainingCount: number;
  completedIds: Set<number>;
  wrongIds?: Set<number>;
  mode?: 'test' | 'review';
  onQuestionClick: (page: number) => void;
}

export function ProgressPanel({
  questionIds,
  completedCount,
  remainingCount,
  completedIds,
  wrongIds,
  mode = 'test',
  onQuestionClick,
}: ProgressPanelProps) {
  const totalItems = questionIds.length;
  const isReview = mode === 'review';

  return (
    <aside className="absolute left-[calc(50%+500px)] top-6 w-56">
      <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 flex flex-col gap-4 sticky top-18.25">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
            Progress Status
          </span>
          {!isReview && (
            <span className="text-xs font-bold text-primary">
              {Math.round((completedCount / totalItems) * 100)}%
            </span>
          )}
          {isReview && wrongIds && (
            <span className="text-xs font-bold text-error">{wrongIds.size} wrong</span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {questionIds.map((id) => {
            const isWrong = wrongIds?.has(id) ?? false;
            const completed = completedIds.has(id);
            return (
              <button
                key={id}
                onClick={() => onQuestionClick(Math.ceil(id / ITEMS_PER_PAGE))}
                className={`w-full aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold transition-colors ${
                  isWrong
                    ? 'bg-error text-white'
                    : isReview || !completed
                      ? 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
                      : 'bg-primary text-white'
                }`}
              >
                {id}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          {!isReview && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary shrink-0" />
                <span className="text-on-surface-variant">Completed</span>
              </div>
              <span className="font-bold text-on-surface">{completedCount}</span>
            </div>
          )}
          {wrongIds && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-error shrink-0" />
                <span className="text-on-surface-variant">Wrong</span>
              </div>
              <span className="font-bold text-on-surface">{wrongIds.size}</span>
            </div>
          )}
          {!isReview && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-surface-container-low border border-outline-variant/30 shrink-0" />
                <span className="text-on-surface-variant">Remaining</span>
              </div>
              <span className="font-bold text-on-surface">{remainingCount}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
