import Link from "next/link";

export function GettingStartedCard() {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
      <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">
        Welcome to Clinivise! Set up your practice in 3 steps:
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-blue-600">1.</span>
          <Link href="/settings" className="text-blue-700 underline dark:text-blue-400">
            Add your practice info
          </Link>
          <span className="text-muted-foreground text-[11px]">Settings &rarr; Organization</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-blue-600">2.</span>
          <Link href="/providers/new" className="text-blue-700 underline dark:text-blue-400">
            Add your team members
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-blue-600">3.</span>
          <Link href="/clients/new" className="text-blue-700 underline dark:text-blue-400">
            Add your first client
          </Link>
        </div>
      </div>
    </div>
  );
}
