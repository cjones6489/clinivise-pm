"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="border-border bg-background flex h-12 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
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
