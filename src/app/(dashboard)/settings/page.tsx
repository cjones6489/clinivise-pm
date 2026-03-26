import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getOrganization } from "@/server/queries/organizations";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Settings | Clinivise",
};

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border/40 py-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-2.5">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
          {title}
        </span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default async function SettingsPage() {
  const user = await requireRole(["owner", "admin"]);
  const org = await getOrganization(user.organizationId);

  if (!org) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Practice configuration and profile" />
        <SectionCard title="Error">
          <p className="text-xs text-muted-foreground">
            Organization not found. Please contact support if this issue persists.
          </p>
        </SectionCard>
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

        <TabsContent value="practice" className="space-y-4 pt-4">
          {/* Practice Information */}
          <SectionCard title="Practice Information">
            <KVRow label="Practice Name" value={org.name} />
            <KVRow label="Timezone" value={org.timezone} />
            {org.phone && <KVRow label="Phone" value={org.phone} />}
            {org.email && <KVRow label="Email" value={org.email} />}
            {org.addressLine1 && (
              <KVRow
                label="Address"
                value={
                  org.city && org.state
                    ? `${org.addressLine1}, ${org.city}, ${org.state} ${org.zipCode ?? ""}`
                    : org.addressLine1
                }
              />
            )}
          </SectionCard>

          {/* Billing Identifiers — show if BOTH NPI and Tax ID exist */}
          {org.npi && org.taxId ? (
            <SectionCard title="Billing Identifiers">
              <KVRow label="NPI" value={<span className="font-mono tabular-nums">{org.npi}</span>} />
              <KVRow label="Tax ID" value={<span className="font-mono tabular-nums">{org.taxId}</span>} />
              {org.taxonomyCode && <KVRow label="Taxonomy Code" value={<span className="font-mono">{org.taxonomyCode}</span>} />}
            </SectionCard>
          ) : (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 dark:border-blue-800 dark:bg-blue-950/30">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-400">
                Complete your billing profile
              </div>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400/80">
                Add your NPI and Tax ID to prepare for claims submission. These identifiers are required on every insurance claim.
              </p>
            </div>
          )}
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
