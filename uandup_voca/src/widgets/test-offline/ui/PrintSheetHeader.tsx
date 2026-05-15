interface PrintSheetHeaderProps {
  name?: string;
  // 영문 이름 — name과 함께 표시되며, 인쇄 시 채점자가 한글/영문 모두 식별 가능하도록.
  englishName?: string;
  score?: string;
}

export function PrintSheetHeader({ name, englishName, score }: PrintSheetHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-center font-extrabold text-3xl tracking-[0.15em] text-[#3a5a8c] mb-8">
        [ VOCAB TEST ]
      </h1>
      <div className="grid grid-cols-2 text-sm font-bold gap-4">
        <div className="flex items-end gap-2">
          <span className="uppercase tracking-widest whitespace-nowrap">NAME:</span>
          <div className="grow border-b border-black h-5">
            {(name || englishName) && (
              <span className="text-md">
                {name}
                {name && englishName && ' '}
                {englishName && <span className="text-on-surface-variant">({englishName})</span>}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="uppercase tracking-widest whitespace-nowrap">SCORE:</span>
          <div className="grow border-b border-black h-5">
            {score && <span className="text-md">{score}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
