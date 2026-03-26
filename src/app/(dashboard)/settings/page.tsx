import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { db } from "@/server/db";
import { organizations } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@clerk/nextjs";
import type { UserRole } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Settings | Clinivise",
};

const ALLOWED_ROLES: UserRole[] = ["owner", "admin"];

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
  const user = await requireAuth();

  if (!ALLOWED_ROLES.includes(user.role as UserRole)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-sm font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          You need admin or owner permissions to access settings.
        </p>
      </div>
    );
  }

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, user.organizationId))
    .limit(1);

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
            <KVRow label="Practice Name" value={org?.name ?? "—"} />
            <KVRow label="Timezone" value={org?.timezone ?? "—"} />
            {org?.phone && <KVRow label="Phone" value={org.phone} />}
            {org?.email && <KVRow label="Email" value={org.email} />}
            {org?.addressLine1 && (
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

          {/* Billing Identifiers */}
          {org?.npi || org?.taxId || org?.taxonomyCode ? (
            <SectionCard title="Billing Identifiers">
              {org.npi && <KVRow label="NPI" value={<span className="font-mono tabular-nums">{org.npi}</span>} />}
              {org.taxId && <KVRow label="Tax ID" value={<span className="font-mono tabular-nums">{org.taxId}</span>} />}
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
