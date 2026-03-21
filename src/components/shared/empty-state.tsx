"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-3 rounded-lg p-3">
        <HugeiconsIcon icon={icon} size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
