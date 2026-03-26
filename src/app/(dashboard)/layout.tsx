import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OrganizationList } from "@clerk/nextjs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { PermissionProvider } from "@/components/shared/permission-provider";
import { getCurrentUser } from "@/lib/auth";
import { getAlertCount } from "@/server/queries/authorizations";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId, orgId } = await auth();

  // Not signed in at all
  if (!userId) {
    redirect("/sign-in");
  }

  // Signed in but no organization selected — contract-first model, no self-service org creation
  if (!orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-sm space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-500 text-lg font-bold text-white">
            C
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Welcome to Clinivise</h1>
          <p className="text-muted-foreground text-sm">
            Select your practice to continue. If you don&apos;t see your practice listed, contact your administrator or our support team.
          </p>
          <OrganizationList
            hidePersonal
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
    <PermissionProvider role={user.role}>
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
    </PermissionProvider>
  );
}
