interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-8">
      {title}
    </h1>
  );
}
