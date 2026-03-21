"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="bg-muted rounded-lg p-4">
        <h2 className="text-sm font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          An error occurred loading this page. Please try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
