interface PrintSheetHeaderProps {
  name?: string;
  score?: string;
}

export function PrintSheetHeader({ name, score }: PrintSheetHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-center font-extrabold text-3xl tracking-[0.15em] text-[#3a5a8c] mb-8">
        [ VOCAB TEST ]
      </h1>
      <div className="grid grid-cols-2 text-sm font-bold gap-4">
        <div className="flex items-end gap-2">
          <span className="uppercase tracking-widest whitespace-nowrap">NAME:</span>
          <div className="grow border-b border-black h-5">
            {name && <span className="text-xs">{name}</span>}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="uppercase tracking-widest whitespace-nowrap">SCORE:</span>
          <div className="grow border-b border-black h-5">
            {score && <span className="text-xs">{score}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
