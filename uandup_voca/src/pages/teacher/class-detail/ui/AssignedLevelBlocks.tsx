const LEVEL_STYLES: Record<1 | 2 | 3 | 4, string> = {
  1: "bg-surface-container-highest text-on-surface-variant/60",
  2: "bg-primary/30 text-primary/70",
  3: "bg-primary/60 text-white",
  4: "bg-primary text-white",
};

export function AssignedLevelBlocks({ levels }: { levels: (1 | 2 | 3 | 4)[] }) {
  return (
    <div className="flex items-center gap-1">
      {levels.map((n) => (
        <span
          key={n}
          className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold ${LEVEL_STYLES[n]}`}
        >
          {n}
        </span>
      ))}
    </div>
  );
}
