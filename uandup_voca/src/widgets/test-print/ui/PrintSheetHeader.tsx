interface PrintSheetHeaderProps {
  no?: string;
}

export function PrintSheetHeader({ no }: PrintSheetHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-center font-extrabold text-3xl tracking-[0.15em] text-[#3a5a8c] mb-8">
        [ VOCAB TEST ]
      </h1>
      <div className="grid grid-cols-3 text-sm font-bold gap-4">
        <div className="flex items-end gap-2">
          <span className="uppercase tracking-widest whitespace-nowrap">NO:</span>
          <div className="grow border-b border-black h-5">
            {no && <span className="text-xs">{no}</span>}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="uppercase tracking-widest whitespace-nowrap">NAME:</span>
          <div className="grow border-b border-black h-5" />
        </div>
        <div className="flex items-end gap-2">
          <span className="uppercase tracking-widest whitespace-nowrap">SCORE:</span>
          <div className="grow border-b border-black h-5" />
        </div>
      </div>
    </header>
  );
}
