function getLevelStyle(level: number): string {
  if (level === 1)  return "bg-primary/10";
  if (level === 2)  return "bg-primary/20";
  if (level === 3)  return "bg-primary/30";
  if (level === 4)  return "bg-primary/40";
  if (level === 5)  return "bg-primary/50";
  if (level === 6)  return "bg-primary/55";
  if (level === 7)  return "bg-primary/65";
  if (level === 8)  return "bg-primary/75";
  if (level === 9)  return "bg-primary/90";
  return "bg-primary";
}

export function AssignedLevelBlocks({ level }: { level: number }) {
  return (
    <span
      className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold text-white ${getLevelStyle(level)}`}
    >
      {level}
    </span>
  );
}
