import type { UserRole } from "@/lib/constants";

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  roles: UserRole[];
  group: "core" | "management" | "admin";
}

export const navItems: NavItem[] = [
  // ── Core (daily use, all roles) ──
  {
    title: "Overview",
    href: "/overview",
    iconName: "DashboardSquare01Icon",
    roles: ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
    group: "core",
  },
  {
    title: "Clients",
    href: "/clients",
    iconName: "UserMultipleIcon",
    roles: ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
    group: "core",
  },
  {
    title: "Sessions",
    href: "/sessions",
    iconName: "Clock01Icon",
    roles: ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
    group: "core",
  },
  {
    title: "Authorizations",
    href: "/authorizations",
    iconName: "FileValidationIcon",
    roles: ["owner", "admin", "bcba", "bcaba", "billing_staff"],
    group: "core",
  },

  // ── Management (setup, admin/bcba/billing) ──
  {
    title: "Providers",
    href: "/providers",
    iconName: "StethoscopeIcon",
    roles: ["owner", "admin"],
    group: "management",
  },
  {
    title: "Payers",
    href: "/payers",
    iconName: "BankIcon",
    roles: ["owner", "admin", "billing_staff"],
    group: "management",
  },

  // ── Admin (owner/admin only) ──
  {
    title: "Team",
    href: "/team",
    iconName: "UserGroupIcon",
    roles: ["owner", "admin"],
    group: "admin",
  },
  {
    title: "Settings",
    href: "/settings",
    iconName: "Settings01Icon",
    roles: ["owner", "admin"],
    group: "admin",
  },
];
