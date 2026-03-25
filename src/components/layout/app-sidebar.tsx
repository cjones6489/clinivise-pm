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
  SidebarMenuBadge,
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

export function AppSidebar({ userRole, alertCount }: { userRole?: string; alertCount?: number }) {
  const pathname = usePathname();

  const filteredItems = userRole
    ? navItems.filter((item) => item.roles.includes(userRole as (typeof item.roles)[number]))
    : navItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-500 text-sm font-bold text-white shadow-sm shadow-blue-400/20">
            C
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Clinivise</div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
              Practice Management
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 mb-1 px-3 text-[10px] font-semibold tracking-widest uppercase">
            Core
          </SidebarGroupLabel>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = iconMap[item.iconName];
              const isActive = pathname.startsWith(item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={
                      isActive
                        ? "h-9 bg-accent font-medium text-primary shadow-sm"
                        : "h-9 text-sidebar-foreground/75 hover:bg-accent/50 hover:text-sidebar-foreground"
                    }
                  >
                    <Link href={item.href} className="gap-3">
                      {Icon && (
                        <HugeiconsIcon
                          icon={Icon}
                          size={18}
                          strokeWidth={isActive ? 2 : 1.5}
                          className={isActive ? "text-primary" : ""}
                        />
                      )}
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.href === "/overview" && alertCount ? (
                    <SidebarMenuBadge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                      {alertCount}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t p-3">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger:
                "w-full justify-start px-2 py-1.5 text-xs rounded-lg hover:bg-accent transition-colors",
            },
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
