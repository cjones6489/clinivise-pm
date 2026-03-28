import { Badge } from "@/components/ui/badge";
import { NOTE_STATUS_LABELS, NOTE_STATUS_VARIANT, type NoteStatus } from "@/lib/constants";

const DISPLAY_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  missing: {
    label: "Missing",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-transparent",
  },
};

export function NoteStatusBadge({ status }: { status: string }) {
  // "missing" is a derived status (no session_notes row), not a DB value
  const custom = DISPLAY_STATUS_CONFIG[status];
  if (custom) {
    return (
      <Badge variant="outline" className={custom.className}>
        {custom.label}
      </Badge>
    );
  }

  const s = status as NoteStatus;
  return (
    <Badge variant={NOTE_STATUS_VARIANT[s] ?? "outline"}>
      {NOTE_STATUS_LABELS[s] ?? status}
    </Badge>
  );
}
