import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OrganizationList } from "@clerk/nextjs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId, orgId } = await auth();

  // Not signed in at all
  if (!userId) {
    redirect("/sign-in");
  }

  // Signed in but no organization selected — show org creation/selection
  if (!orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-lg font-semibold tracking-tight">Welcome to Clinivise</h1>
          <p className="text-muted-foreground text-xs">
            Create or select a practice to get started.
          </p>
          <OrganizationList
            afterCreateOrganizationUrl="/overview"
            afterSelectOrganizationUrl="/overview"
          />
        </div>
      </div>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={user.role} />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
