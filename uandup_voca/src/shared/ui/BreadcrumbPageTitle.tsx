interface BreadcrumbPageTitleProps {
  parents: string[];
  title: string;
}

export function BreadcrumbPageTitle({ parents, title }: BreadcrumbPageTitleProps) {
  return (
    <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-8 flex items-center gap-2">
      {parents.map((parent) => (
        <span key={parent} className="flex gap-2">
          <span>{parent}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '44px' }}>
            chevron_right
          </span>
        </span>
      ))}
      {title}
    </h1>
  );
}
