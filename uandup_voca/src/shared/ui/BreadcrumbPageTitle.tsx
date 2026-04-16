interface BreadcrumbPageTitleProps {
  parents: { label: string; onClick?: () => void }[];
  title: string;
}

export function BreadcrumbPageTitle({ parents, title }: BreadcrumbPageTitleProps) {
  return (
    <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-6 flex items-center gap-2">
      {parents.map((parent) => (
        <span key={parent.label} className="flex gap-2">
          {parent.onClick ? (
            <button onClick={parent.onClick} className="cursor-pointer transition-opacity">
              {parent.label}
            </button>
          ) : (
            <span>{parent.label}</span>
          )}
          <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>
            chevron_right
          </span>
        </span>
      ))}
      {title}
    </h1>
  );
}
