import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OrganizationList } from "@clerk/nextjs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/auth";
import { getAlertCount } from "@/server/queries/authorizations";

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

  const alertCount = await getAlertCount(user.organizationId);

  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="bg-background text-foreground fixed top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-full rounded-b-md px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <AppSidebar userRole={user.role} alertCount={alertCount} />
      <SidebarInset>
        <Header />
        <main id="main-content" className="flex-1 bg-background p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
