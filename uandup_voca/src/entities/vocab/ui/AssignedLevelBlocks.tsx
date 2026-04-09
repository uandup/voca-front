function getLevelStyle(level: number): string {
  if (level === 1)  return "bg-primary/10 text-primary/40";
  if (level === 2)  return "bg-primary/20 text-primary/50";
  if (level === 3)  return "bg-primary/30 text-primary/60";
  if (level === 4)  return "bg-primary/40 text-primary/70";
  if (level === 5)  return "bg-primary/50 text-primary/80";
  if (level === 6)  return "bg-primary/55 text-white";
  if (level === 7)  return "bg-primary/65 text-white";
  if (level === 8)  return "bg-primary/75 text-white";
  if (level === 9)  return "bg-primary/90 text-white";
  return "bg-primary text-white";
}

export function AssignedLevelBlocks({ level }: { level: number }) {
  return (
    <span
      className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold ${getLevelStyle(level)}`}
    >
      {level}
    </span>
  );
}
