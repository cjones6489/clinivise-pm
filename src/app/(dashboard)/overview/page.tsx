import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Overview | Clinivise",
};

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Good morning — here's what needs attention today."
      />
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-12">
        <p className="text-xs text-muted-foreground">
          Dashboard widgets coming in Sprint 3.
        </p>
      </div>
    </div>
  );
}
