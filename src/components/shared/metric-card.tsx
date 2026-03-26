import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  sub,
  color,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
  /** Optional accent color class for the value (e.g., "text-red-600") — takes precedence over `color` */
  accent?: string;
}) {
  return (
    <div className="card-hover border-border bg-card rounded-xl border px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          {label}
        </div>
        {icon}
      </div>
      <div
        className={cn("mt-2 text-2xl font-semibold tracking-tight tabular-nums", accent)}
        style={!accent && color ? { color } : undefined}
      >
        {value}
      </div>
      {sub && <div className="text-muted-foreground mt-1 text-[11px]">{sub}</div>}
    </div>
  );
}
