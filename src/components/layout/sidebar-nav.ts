import type { UserRole } from "@/lib/constants";

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/overview",
    iconName: "DashboardSquare01Icon",
    roles: ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  },
  {
    title: "Clients",
    href: "/clients",
    iconName: "UserMultipleIcon",
    roles: ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  },
  {
    title: "Authorizations",
    href: "/authorizations",
    iconName: "FileValidationIcon",
    roles: ["owner", "admin", "bcba", "bcaba", "billing_staff"],
  },
  {
    title: "Sessions",
    href: "/sessions",
    iconName: "Clock01Icon",
    roles: ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  },
  {
    title: "Providers",
    href: "/providers",
    iconName: "StethoscopeIcon",
    roles: ["owner", "admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    iconName: "Settings01Icon",
    roles: ["owner", "admin"],
  },
];
