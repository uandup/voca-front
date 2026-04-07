const TOTAL_LEVELS = 10;
const currentLevel = 4;
const currentLevelProgress = 60; // % of current level
const wordsLearned = 240;
const totalWords = 400;

const testConfig = {
  type: "Word to meaning (Korean)",
  synonyms: true,
  wordsPerTest: 40,
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LevelProgress() {
  const offset = CIRCUMFERENCE * (1 - currentLevelProgress / 100);

  return (
    <section>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex gap-8 items-stretch">
        {/* Left: Circular progress */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-44">
          <p className="text-xl font-extrabold font-headline text-primary">
            Level {currentLevel}
          </p>
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={10}
                className="text-surface-container-highest"
              />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={10}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-headline text-primary">
                {currentLevelProgress}%
              </span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">
            {wordsLearned} / {totalWords} words
          </p>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-outline-variant/20" />

        {/* Right */}
        <div className="flex-1 flex flex-col justify-around">
          {/* Test config chips */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Test Configuration
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container text-sm font-medium text-on-surface">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  translate
                </span>
                {testConfig.type}
              </span>
              <span
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                ${testConfig.synonyms ? "bg-green-50 text-green-700" : "bg-surface-container text-on-surface-variant"}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  {testConfig.synonyms ? "library_add_check" : "block"}
                </span>
                Synonyms: {testConfig.synonyms ? "Included" : "Excluded"}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container text-sm font-medium text-on-surface">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  edit_note
                </span>
                {testConfig.wordsPerTest} words / test
              </span>
            </div>
          </div>

          {/* Level bar */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Levels 1–{TOTAL_LEVELS} Completion Status
            </p>
            <div className="flex items-end gap-2">
              {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
                const level = i + 1;
                const isCompleted = level < currentLevel;
                const isCurrent = level === currentLevel;
                const isLocked = level > currentLevel;

                return (
                  <div
                    key={level}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="relative h-6 w-full rounded-sm overflow-hidden bg-surface-container-highest">
                      {isCompleted && (
                        <div className="absolute inset-0 bg-primary rounded-sm" />
                      )}
                      {isCurrent && (
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-sm"
                          style={{ width: `${currentLevelProgress}%` }}
                        />
                      )}
                      {isLocked && null}
                    </div>
                    <span
                      className={`text-[10px] font-medium ${isLocked ? "text-on-surface-variant/30" : "text-on-surface-variant"}`}
                    >
                      L{level}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
