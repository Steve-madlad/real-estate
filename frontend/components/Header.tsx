export default function Header({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-border/60 mb-8 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">{subtitle}</p>
      </div>
      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
}
