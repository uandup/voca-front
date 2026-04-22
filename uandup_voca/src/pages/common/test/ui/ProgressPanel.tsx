import { MOCK_VOCAB_ITEMS, ITEMS_PER_PAGE } from '../mock/testMockData';

interface ProgressPanelProps {
  completedCount: number;
  remainingCount: number;
  totalItems: number;
  completedIds: Set<number>;
  onQuestionClick: (page: number) => void;
}

export function ProgressPanel({
  completedCount,
  remainingCount,
  totalItems,
  completedIds,
  onQuestionClick,
}: ProgressPanelProps) {
  return (
    <aside className="absolute left-[calc(50%+500px)] top-6 w-56">
      <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 flex flex-col gap-4 sticky top-18.25">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
            Progress Status
          </span>
          <span className="text-xs font-bold text-primary">
            {Math.round((completedCount / totalItems) * 100)}%
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {MOCK_VOCAB_ITEMS.map((item) => {
            const completed = completedIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onQuestionClick(Math.ceil(item.id / ITEMS_PER_PAGE))}
                className={`w-full aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold transition-colors ${
                  completed
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {item.id}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary shrink-0" />
              <span className="text-on-surface-variant">Completed</span>
            </div>
            <span className="font-bold text-on-surface">{completedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-surface-container-low border border-outline-variant/30 shrink-0" />
              <span className="text-on-surface-variant">Remaining</span>
            </div>
            <span className="font-bold text-on-surface">{remainingCount}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
