export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {description && <div className="text-muted-foreground text-sm">{description}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
