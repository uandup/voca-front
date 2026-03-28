interface TableContainerProps {
  children: React.ReactNode;
}

export function TableContainer({ children }: TableContainerProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-1">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}
