import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getOrganization } from "@/server/queries/organizations";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeInfoForm } from "@/components/settings/practice-info-form";
import { UserProfile } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Settings | Clinivise",
};

export default async function SettingsPage() {
  const user = await requireRole(["owner", "admin"]);
  const org = await getOrganization(user.organizationId);

  if (!org) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Practice configuration and profile" />
        <div className="border-border bg-card overflow-hidden rounded-xl border px-4 py-8 text-center shadow-sm">
          <p className="text-muted-foreground text-xs">
            Organization not found. Please contact support if this issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Practice configuration and profile" />

      <Tabs defaultValue="practice">
        <TabsList>
          <TabsTrigger value="practice">Practice Info</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="pt-4">
          <div className="max-w-2xl">
            <PracticeInfoForm org={org} />
          </div>
        </TabsContent>

        <TabsContent value="profile" className="pt-4">
          <div className="max-w-2xl">
            <UserProfile
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  cardBox: "shadow-none border border-border rounded-xl",
                  navbar: "hidden",
                  pageScrollBox: "p-0",
                },
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
