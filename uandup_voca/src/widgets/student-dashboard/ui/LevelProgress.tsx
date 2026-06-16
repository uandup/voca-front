interface Props {
  // 현재 레벨 — 미배정이면 null.
  level: number | null;
  // 현재 레벨 진척률 0~100.
  progressPercent: number;
  // 시험 유형 표시 문구 — 'Word to meaning' / 'Meaning to word' / '—'. 매핑은 호출부 책임.
  testTypeLabel: string;
  includeSynonyms: boolean;
  // 시험 1회 문항 수.
  examQuestionCount: number;
  // 1회 배정 단어 수.
  assignmentCount: number;
}

const TOTAL_LEVELS = 10;
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LevelProgress({
  level,
  progressPercent,
  testTypeLabel,
  includeSynonyms,
  examQuestionCount,
  assignmentCount,
}: Props) {
  // 미배정(level null)이면 진척 게이지는 0으로 표시한다.
  const displayLevel = level ?? 0;
  const offset = CIRCUMFERENCE * (1 - progressPercent / 100);

  return (
    <section>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 xl:p-6 flex gap-5 xl:gap-8 items-stretch">
        {/* Left: Circular progress */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-32 xl:w-44">
          <p className="text-base xl:text-xl font-extrabold font-headline text-primary">
            {level != null ? `Level ${level}` : 'Unassigned'}
          </p>
          <div className="relative w-24 h-24 xl:w-36 xl:h-36">
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
              <span className="text-xl xl:text-3xl font-black font-headline text-primary">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-outline-variant/20" />

        {/* Right */}
        <div className="flex-1 flex flex-col gap-3 xl:gap-4 justify-around">
          {/* Test config chips */}
          <div>
            <p className="text-[11px] xl:text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Test Configuration
            </p>
            <div className="flex items-center gap-1.5 xl:gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg bg-surface-container text-xs xl:text-sm font-medium text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  translate
                </span>
                {testTypeLabel}
              </span>
              <span className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg bg-surface-container text-xs xl:text-sm font-medium text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  edit_note
                </span>
                {examQuestionCount} words / test
              </span>
              <span className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg bg-surface-container text-xs xl:text-sm font-medium text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  assignment
                </span>
                {assignmentCount} words assigned
              </span>
              {/* 동의어 포함 시에만 칩을 띄운다 — 미포함은 기본 상태이므로 굳이 'Excluded'로 노출하지 않는다. */}
              {includeSynonyms && (
                <span className="flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium bg-green-50 text-green-700">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    library_add_check
                  </span>
                  Synonyms: Included
                </span>
              )}
            </div>
          </div>

          {/* Level bar */}
          <div>
            <p className="text-[11px] xl:text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Levels 1–{TOTAL_LEVELS} Completion Status
            </p>
            <div className="flex items-end gap-1 xl:gap-2">
              {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
                const lv = i + 1;
                const isCompleted = lv < displayLevel;
                const isCurrent = lv === displayLevel;
                const isLocked = lv > displayLevel;

                return (
                  <div key={lv} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative h-6 xl:h-8 w-full rounded-sm overflow-hidden bg-surface-container-highest">
                      {isCompleted && <div className="absolute inset-0 bg-primary rounded-sm" />}
                      {isCurrent && (
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-sm"
                          style={{ width: `${progressPercent}%` }}
                        />
                      )}
                      {isLocked && null}
                    </div>
                    <span
                      className={`text-[9px] xl:text-[10px] font-medium ${isLocked ? 'text-on-surface-variant/30' : 'text-on-surface-variant'}`}
                    >
                      L{lv}
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
