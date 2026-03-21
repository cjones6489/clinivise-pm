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
      <div className="border-border flex items-center justify-center rounded-lg border border-dashed p-12">
        <p className="text-muted-foreground text-xs">Dashboard widgets coming in Sprint 3.</p>
      </div>
    </div>
  );
}
