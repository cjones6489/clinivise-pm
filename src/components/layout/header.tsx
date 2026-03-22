"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export function Header() {
  return (
    <header className="border-border bg-card flex h-12 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="relative max-w-sm flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          size={14}
          className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
        />
        <Input
          placeholder="Search clients, providers..."
          className="bg-muted/50 focus:border-border focus:bg-card h-8 w-full border-transparent pl-8 text-xs"
          readOnly
        />
        <kbd className="border-border bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </div>
      <div className="flex-1" />
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-7 w-7",
          },
        }}
      />
    </header>
  );
}
