interface LevelStatCardProps {
  level: number;
  count: number;
}

export function LevelStatCard({ level, count }: LevelStatCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:border-primary/30 transition-colors group">
      <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">
        Level {level}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-[#002D8F]">{count}</span>
        <span className="text-xs text-on-surface-variant font-medium">words</span>
      </div>
    </div>
  );
}
