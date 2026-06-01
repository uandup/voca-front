interface Props {
  // 누적 암기 완료 단어 수(모든 레벨 합).
  count: number;
}

export function WordsLearnedCard({ count }: Props) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col shrink-0 w-64">
      <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
        Words Learned
      </span>
      <div className="flex-1 flex items-center justify-center">
        <span className="text-5xl font-black text-primary font-headline">
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
