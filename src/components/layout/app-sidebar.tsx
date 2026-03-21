"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserMultipleIcon,
  FileValidationIcon,
  Clock01Icon,
  StethoscopeIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "./sidebar-nav";

const iconMap: Record<string, typeof DashboardSquare01Icon> = {
  DashboardSquare01Icon,
  UserMultipleIcon,
  FileValidationIcon,
  Clock01Icon,
  StethoscopeIcon,
  Settings01Icon,
};

export function AppSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();

  // Filter nav items by role. Show all items if role not yet loaded (SSR/loading).
  const filteredItems = userRole
    ? navItems.filter((item) => item.roles.includes(userRole as (typeof item.roles)[number]))
    : navItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-border border-b px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
            C
          </div>
          <div>
            <div className="text-sm font-semibold">Clinivise</div>
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              Practice Management
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = iconMap[item.iconName];
              const isActive = pathname.startsWith(item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      {Icon && <HugeiconsIcon icon={Icon} size={16} strokeWidth={1.5} />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-border border-t p-3">
        <div className="flex items-center justify-between">
          <OrganizationSwitcher
            hidePersonal
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger: "w-full justify-start px-2 py-1.5 text-xs",
              },
            }}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
