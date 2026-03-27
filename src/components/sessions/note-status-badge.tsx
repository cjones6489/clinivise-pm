import { Badge } from "@/components/ui/badge";
import { NOTE_STATUS_LABELS, NOTE_STATUS_VARIANT, type NoteStatus } from "@/lib/constants";

export function NoteStatusBadge({ status }: { status: string }) {
  const s = status as NoteStatus;
  return (
    <Badge variant={NOTE_STATUS_VARIANT[s] ?? "outline"}>
      {NOTE_STATUS_LABELS[s] ?? status}
    </Badge>
  );
}
