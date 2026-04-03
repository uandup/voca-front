type Level = 1 | 2 | 3 | 4;

const mockProgress: Record<Level, number> = {
  1: 100,
  2: 100,
  3: 60,
  4: 0,
};

const levels: Level[] = [1, 2, 3, 4];
const currentLevel: Level = 3;
const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LevelProgress() {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-5 gap-8">
        {levels.map((level) => {
          const pct = mockProgress[level];
          const offset = CIRCUMFERENCE * (1 - pct / 100);
          const isCurrent = level === currentLevel;

          return (
            <div
              key={level}
              className={`p-6 rounded-xl flex flex-col items-center text-center relative overflow-hidden
                ${
                  isCurrent
                    ? "bg-surface-container-lowest ring-2 ring-primary-container"
                    : "bg-surface-container-lowest shadow-sm"
                }`}
            >
              {/* Active badge */}
              {isCurrent && (
                <div className="absolute top-0 left-2">
                  <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    Active
                  </span>
                </div>
              )}

              <h3 className="font-headline font-bold mb-3 text-primary">
                Level {level}
              </h3>

              {/* Circular progress */}
              <div className="relative w-32 h-32 mb-5">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r={RADIUS}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={isCurrent ? 12 : 8}
                    className="text-surface-container-highest"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={RADIUS}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={isCurrent ? 12 : 8}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={
                      isCurrent ? "text-primary" : "text-primary-container"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-headline font-extrabold text-primary">
                    {pct}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-tighter">
                    {pct === 100 ? "Completed" : pct === 0 ? "" : "In Progress"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Words Mastered */}
        <div className="bg-surface-container-lowest shadow-sm p-6 rounded-xl flex flex-col items-center text-center h-full">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Words Learned
          </span>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-5xl font-black text-primary font-headline">
              1450
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
