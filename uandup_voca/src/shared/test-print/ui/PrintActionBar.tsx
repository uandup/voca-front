interface PrintActionBarProps {
  onClose: () => void;
  onPrint: () => void;
  title?: string;
}

export function PrintActionBar({ onClose, onPrint, title = "Document Preview" }: PrintActionBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 bg-white border-b border-black/10" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="bg-black/5 hover:bg-black/10 text-black p-2 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="font-headline font-bold text-lg">{title}</h2>
      </div>
      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-gray-100 transition-all font-bold text-sm"
      >
        <span className="material-symbols-outlined text-lg">print</span>
        Print
      </button>
    </div>
  );
}
