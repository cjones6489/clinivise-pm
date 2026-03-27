# Clinivise Technical Specification Research

**Clinivise — an ABA therapy practice management and AI-native billing platform — has a viable, well-supported technology stack available as of March 2026.** Every major dependency is actively maintained, HIPAA compliance is achievable at roughly **$400–$490/month** during development (scaling to ~$1,000–$1,200/month in production with Stedi API access), and the Stedi API provides a modern JSON-first interface for all EDI transactions. This report details exact package versions, infrastructure pricing, authentication options, AI integration via AWS Bedrock, Stedi API documentation, multi-tenancy strategy, and complete ABA billing code references needed to build the specification.

---

## 1. Package Versions and Critical Breaking Changes

The JavaScript ecosystem has seen several major version bumps since late 2024. Three require special attention: **Zod 3→4**, **Tailwind CSS 3→4**, and **TypeScript 5.9→6.0** (in RC). The table below captures every dependency Clinivise needs.

| Package                           | Latest Stable | Notable Changes                                                                                                                                                                                                                                                                                    |
| --------------------------------- | :-----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                            |  **16.2.0**   | v16 current; new security defaults for Server Actions. v14 EOL Oct 2025. Critical CVE fixes in 16.2.x. **⚠️ VERIFY BEFORE STARTING**: Run `npm info next version` to confirm latest stable — App Router patterns are consistent across v15-v16 but server action security defaults changed in v16. |
| `typescript`                      |   **5.9.3**   | TS 6.0 RC available (Mar 6, 2026) but not yet `latest`. TS 7.0 will be a native Go port ("Project Corsa"). **Use 5.9.3 — ecosystem not ready for 6.0.**                                                                                                                                            |
| `drizzle-orm`                     |  **0.45.1**   | Still pre-1.0; v1.0.0-beta actively in development. Widely used in production                                                                                                                                                                                                                      |
| `drizzle-kit`                     |  **0.31.10**  | Beta 1.0.0-beta.18 available. Migration system redesign with DAG-based commutativity checking                                                                                                                                                                                                      |
| `@aws-sdk/client-bedrock-runtime` |    **3.x**    | AWS Bedrock SDK for HIPAA-compliant Claude access. Replaces direct `@anthropic-ai/sdk` for PHI workloads                                                                                                                                                                                           |
| `@tanstack/react-query`           |  **5.91.3**   | Mature v5, React 18+ compatible, frequent releases                                                                                                                                                                                                                                                 |
| `@tanstack/react-table`           |  **8.21.3**   | Stable v8 line; release cadence slowed                                                                                                                                                                                                                                                             |
| `react-hook-form`                 |  **7.71.2**   | Works with Zod v4 via `@hookform/resolvers` (supports `zod/v4` import)                                                                                                                                                                                                                             |
| `zod`                             | **4.3.6** ⚠️  | **Major breaking change from v3.** Template literals, `z.fromJSONSchema()`, exclusive unions, composable checks. Import path `zod/v4` for gradual migration                                                                                                                                        |
| `tailwindcss`                     | **4.2.1** ⚠️  | **Complete rewrite.** CSS-first config replaces `tailwind.config.js`. Lightning CSS engine (5x faster). OKLCH colors. `@import "tailwindcss"` syntax                                                                                                                                               |
| `@sentry/nextjs`                  |  **10.45.0**  | v10 major line; min supported Next.js 13.2.0                                                                                                                                                                                                                                                       |
| `vitest`                          |   **4.1.0**   | v4 major; standard JS testing framework. Async leak detection, Playwright browser provider                                                                                                                                                                                                         |
| `@playwright/test`                |  **1.58.2**   | Stable 1.x line                                                                                                                                                                                                                                                                                    |
| `@upstash/ratelimit`              |   **2.0.8**   | Dynamic rate limits (change limits at runtime without recreating limiter)                                                                                                                                                                                                                          |
| `@upstash/redis`                  |  **1.37.0**   | Connectionless HTTP-based Redis client                                                                                                                                                                                                                                                             |
| `next-safe-action`                |   **8.1.8**   | v8 major line; middleware pipeline pattern for type-safe server actions                                                                                                                                                                                                                            |
| `lucide-react`                    |  **0.577.0**  | Pre-1.0 but very widely used. Frequent icon additions                                                                                                                                                                                                                                              |
| `date-fns`                        |   **4.1.0**   | Release cadence slowed. TC39 Temporal proposal reached Stage 4 for ES2026                                                                                                                                                                                                                          |
| `@neondatabase/serverless`        |   **1.0.2**   | GA at 1.0. Requires Node.js ≥19. HTTP template function API changed at 1.0                                                                                                                                                                                                                         |

**Key migration considerations**: Zod 4 provides a `zod/v4` import path for gradual migration from v3. Tailwind CSS offers `npx @tailwindcss/upgrade` which handles ~90% of v3→v4 changes automatically. The shadcn/ui CLI auto-detects your Tailwind version and serves compatible components.

---

## 2. Authentication: Clerk Pro ($20/month) — No HIPAA BAA Required

### Recommendation: Clerk Pro

Clerk offers the fastest path to production with **pre-built React components** (SignIn, SignUp, OrganizationSwitcher, UserButton), first-class `@clerk/nextjs` SDK for App Router, and the best AI-coding-tool compatibility in the category. Pricing starts at **$0 (Hobby)** and scales to **$20/month (Pro)**.

Organizations, RBAC, and MFA are all built-in. Session timeout is customizable on Pro+ (5 minutes to 10 years). The Enhanced B2B add-on ($85–100/month) unlocks custom roles, verified domains, and unlimited org members.

### A HIPAA BAA Is NOT Required for Clerk in This Architecture

Clinivise's auth layer stores **only staff data**: employee emails, names, hashed passwords, role assignments (Admin, BCBA, RBT, Billing Staff), organization membership, and session tokens. This data is not Protected Health Information under any reading of the statute.

**45 CFR § 160.103** defines PHI as individually identifiable health information relating to (a) health condition, (b) provision of health care, or (c) payment for health care. Staff credentials fail all three prongs — they describe employment, not patient care. HIPAA also has an explicit **employment records exclusion** that carves out workforce data held by a covered entity in its employer capacity.

A **BAA is only required when the vendor touches PHI** (45 CFR § 164.502(e)). HHS FAQ #256 confirms: providing software to a covered entity doesn't create a BA relationship if the vendor has no PHI access. No OCR enforcement action has ever targeted an auth-only vendor. The HIPAA Security Rule's access control requirements (§ 164.312) create obligations on the covered entity, not on every upstream component vendor.

**Critical architectural constraint**: Never store patient data in Clerk user metadata, custom session claims, or organization fields. If this boundary holds, the auth provider remains entirely outside HIPAA scope. Document this in a formal risk assessment.

**If Clinivise ever adds a patient/parent login portal**, the analysis changes — patient identity data could constitute PHI, and a BAA with the auth provider would become necessary. But the current staff-only architecture does not require one.

**Recommended path**: Use **Clerk Pro at $20/month**. No Enterprise tier or BAA needed. Spend HIPAA compliance budget where PHI actually lives (Neon, Vercel, file storage).

### Why Not the Alternatives?

| Provider       | Status                                                                              | Verdict                                                                                            |
| -------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **WorkOS**     | ✅ Active, 1M free MAUs, built-in RBAC                                              | Good alternative but fewer pre-built UI components. More enterprise-focused, less "startup magic." |
| **Auth.js v5** | ⚠️ Never left beta, lead maintainer quit Jan 2025, absorbed by Better Auth Sep 2025 | **Do not use.**                                                                                    |
| **Lucia**      | ❌ Fully deprecated March 2025                                                      | **Do not use.**                                                                                    |

### Comparison Matrix

| Feature                         | Clerk                        | WorkOS            | Auth.js v5              | Lucia         |
| ------------------------------- | ---------------------------- | ----------------- | ----------------------- | ------------- |
| Status                          | ✅ Active                    | ✅ Active         | ⚠️ Sunset → Better Auth | ❌ Deprecated |
| Free tier                       | 50K MAUs                     | **1M MAUs**       | OSS                     | N/A           |
| Organizations                   | ✅ Built-in                  | ✅ Built-in, free | ❌ Build yourself       | N/A           |
| RBAC                            | ✅ (add-on for custom roles) | ✅ Free, built-in | ❌ Build yourself       | N/A           |
| MFA                             | ✅ Pro+                      | ✅ Free           | ❌ Build yourself       | N/A           |
| Next.js integration             | ⭐ Best-in-class             | Very good         | Good (beta)             | N/A           |
| BAA needed for staff-only auth? | **No**                       | **No**            | N/A                     | N/A           |

---

## 3. HIPAA-Compliant File Storage for Authorization PDFs

Four options were evaluated for storing sensitive healthcare documents. **UploadThing is disqualified** — no HIPAA BAA, no compliance claims, not suitable for PHI. **Cloudflare R2's BAA is Enterprise-only** and R2 is likely not within its BAA scope.

**Vercel Blob** is the simplest choice if already paying for the Vercel HIPAA add-on. It's covered under Vercel's BAA, backed by AWS S3 with AES-256 encryption, and integrates natively via the `@vercel/blob` SDK. Pricing: **$0.023/GB-month** storage, $0.05/GB transfer.

**AWS S3** remains the gold standard for HIPAA-compliant storage. The BAA is **free** (sign via AWS Artifact), has the most mature compliance documentation, and offers maximum control over encryption (SSE-KMS), access logging, versioning, and Object Lock. Setup requires IAM configuration, bucket policies, and presigned URLs — more complex but battle-tested.

**Recommendation**: Use **Vercel Blob** for simplicity since we're already on the Vercel HIPAA plan. If advanced controls are needed later (Object Lock for immutable records, granular KMS encryption, cross-region replication), migrate to **AWS S3** with a free BAA.

---

## 4. Neon Postgres: HIPAA on Scale Plan at Dramatically Reduced Pricing

Neon (acquired by Databricks for $1B) now offers **HIPAA BAA on the Scale plan at no additional cost** beyond usage-based pricing. The BAA is self-serve: enable at the organization level, accept the agreement, then enable per-project. Once enabled on a project, it cannot be disabled. HIPAA support is available in **AWS regions only**.

### Scale Plan Pricing (Post-Databricks Acquisition)

| Resource       | Price                                |
| -------------- | ------------------------------------ |
| Compute        | **$0.222/CU-hour** (down from $0.26) |
| Storage        | **$0.35/GB-month** (down from $1.75) |
| History (PITR) | $0.20/GB-month                       |
| Minimum spend  | $5/month                             |
| Auto-scaling   | Up to 56 CU                          |

A 1 CU database running 24/7 costs approximately **$162/month** for compute alone. Scale plan includes **99.95% SLA**, SOC 2 Type 2, Private Link, SSO, and up to 30 days point-in-time recovery.

### Serverless Connection Setup for Vercel

Use `@neondatabase/serverless` v1.0.2 with two connection modes. **HTTP mode** (the `neon()` function) handles single queries via fetch with ~3 round trips — ideal for simple reads. **WebSocket mode** (the `Pool`/`Client` classes) supports interactive transactions and is API-compatible with `node-postgres`. Always create Pool/Client **inside** the request handler and close within the same handler — never outside handler scope.

Use Neon's **built-in PgBouncer connection pooling** (up to 10,000 concurrent connections) via the `-pooler` hostname suffix in your connection string. For Drizzle ORM integration, pass the `neon()` HTTP driver or `Pool` WebSocket driver to `drizzle()`.

### Multi-Tenancy Approach: Application-Level Filtering

Neon offers three multi-tenancy models: database-per-tenant (their recommendation at scale), schema-per-tenant (not recommended), and shared schema with row-level isolation. For Clinivise's target market (1–50 staff practices, likely dozens of tenants, not thousands), **shared schema with application-level `WHERE organization_id = ?` filtering is the right starting point.**

Neon does offer a first-class **RLS integration with Drizzle ORM** via `drizzle-orm/neon` — including `crudPolicy`, `authenticatedRole`, and `authUid` helpers that let you declare row-level security policies alongside your schema. However, the Neon team themselves note that RLS adds complexity and recommend it primarily as a defense-in-depth layer for "very important and core authorization logic," not as the sole isolation mechanism.

**Recommended approach for Clinivise:**

1. **Primary isolation**: Application-level filtering. Every query includes `organization_id` via a middleware-injected context. Server actions and services validate tenant scope before any database operation.
2. **Defense-in-depth (Phase 2+)**: Add Postgres RLS policies on the most sensitive tables (clients, sessions, claims) as a safety net against accidental cross-tenant data leaks. Drizzle's `.enableRLS()` and `crudPolicy` make this declarative.
3. **Never database-per-tenant**: At Clinivise's scale, the operational overhead of managing hundreds of Neon projects (migrations, backups, connection management) far outweighs the isolation benefit.

This mirrors how most successful multi-tenant SaaS platforms operate at this scale — Clerk's Organizations provide the tenant context, middleware resolves the `organization_id`, and every query is scoped.

---

## 5. Vercel HIPAA Compliance at $370/month

Vercel's HIPAA BAA became available to **Pro teams in September 2025** (previously Enterprise-only). The total minimum cost is **$370/month**: $20/seat/month for Pro + **$350/month HIPAA add-on**. Pro customers get a self-serve click-through BAA; Enterprise customers get a signed BAA through a CSM.

### Services Covered Under the BAA

The BAA covers the Vercel Edge Network, CDN, serverless Functions, Edge Config, KV storage, build/deployment pipeline, environment variable management, and Static IPs. **Secure Compute** (isolated networks, dedicated IPs, VPC peering), managed WAF with custom rules, and contractual 99.99% SLA are **Enterprise-only**.

### Required Security Headers (vercel.json or next.config.js)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

**Shared responsibility**: Vercel provides infrastructure security; you are responsible for application-level security (auth, authorization, input validation), RBAC configuration, ensuring BAAs with all PHI-touching services, risk assessments, and audit trail maintenance.

---

## 6. Stedi API: Modern JSON-First Healthcare EDI

Stedi provides REST APIs that accept JSON and translate to X12 EDI automatically. No FHIR support — it's JSON/X12 native. Authentication uses **API keys** passed via `Authorization: Key YOUR_API_KEY` header. Keys are managed in the Stedi portal and come in test and production types.

### Core API Endpoints

| Transaction               | Endpoint                                                                                            | Method |
| ------------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| **Eligibility (270/271)** | `https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/eligibility/v3`                   | POST   |
| **Batch Eligibility**     | `https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/batch-eligibility`                | POST   |
| **Claims (837P)**         | `https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/professionalclaims/v3/submission` | POST   |
| **Claim Attachments**     | `https://claims.us.stedi.com/2025-03-07/claim-attachments/submission`                               | POST   |
| **Transaction Polling**   | `https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/transactions`                     | GET    |
| **277CA Report**          | `.../reports/v2/{transactionId}/277`                                                                | GET    |
| **835 ERA Report**        | `.../reports/v2/{transactionId}/835`                                                                | GET    |

**Webhooks** are fully supported for 277CA claim acknowledgments and 835 ERA remittance. Configure in the portal at `portal.stedi.com/app/webhooks` with credential sets (API keys, Basic Auth, or none). Events include `transaction processed` (277CA or 835), `file delivered`, and `file failed`. Webhooks have a **5-second timeout** with up to 5 auto-retries. Filter by transaction type or partnership (test vs. production).

### Testing Environment

No separate sandbox URL — the same production endpoints accept test API keys. **Test API keys** return mock eligibility data from simulated payers (Aetna `60054`, Cigna `CIGNA`, UHC `87726`, CMS `CMS`). For claims testing, set `usageIndicator: "T"` — test claims are not sent to payers. The **Stedi Test Payer** enables end-to-end testing with both 277CA acknowledgments and 835 ERA responses; enroll your provider and the enrollment auto-activates within ~1 minute.

### CMS Medicare Attestation Deadline ⚠️

**By May 11, 2026**, all providers must complete HETS EDI enrollment attestation to continue running Medicare eligibility checks. CMS is migrating to a new trading partner management system, and without attestation, CMS will return AAA error 41 (Authorization/Access Restrictions) for any NPI that hasn't completed the process. Attestation must be completed per-NPI through the provider's Medicare Administrative Contractor (MAC).

Stedi handles this through their enrollment workflow — when a CMS eligibility enrollment is submitted, Stedi moves it through statuses and surfaces an attestation task that the provider must complete. **Clinivise should surface this deadline in the dashboard UI** and prompt practices to verify their Medicare attestation status. This is an operational workflow item, not a technical integration issue.

### Pricing and Plan Gating ⚠️

**Critical finding: The Basic plan is portal-only for production transactions.** Production API access requires the **Developer plan ($500/month minimum, annual contract)**. The Basic plan allows test API keys for development, but production API keys, webhooks, SFTP, batch eligibility, and insurance discovery all require Developer.

This means Clinivise can **develop and test for free** on the Basic plan using test API keys, but must upgrade to Developer ($500/month) before going live with any automated billing. The 100 free monthly transactions on Basic are only accessible through the Stedi portal UI — not programmatically.

**Pricing breakdown:**

| Plan          | Monthly Cost | Production Portal |  Production API   | Webhooks | Batch |
| ------------- | :----------: | :---------------: | :---------------: | :------: | :---: |
| **Basic**     |    **$0**    |  ✅ 100 tx/month  | ❌ Test keys only |    ❌    |  ❌   |
| **Developer** |  **$500+**   |    ✅ Included    |  ✅ Full access   |    ✅    |  ✅   |

Per-transaction costs on the Developer plan are contract-specific and not publicly listed. All plans include unlimited test transactions and premium support via Slack with <10 minute average response times.

**Phase 2 budget implication**: The Stedi Developer plan cost should be factored into the revenue model. At 2-4% of collected revenue, Clinivise needs to be processing ~$12,500–$25,000/month in collections just to cover the Stedi cost alone.

### SDK and NPM Packages

Stedi publishes ~40 packages under `@stedi/` on npm, but these primarily serve the EDI platform services (Buckets, Stash). The **healthcare clearinghouse APIs are plain REST** — call them directly with fetch/axios. OpenAPI specs are available at `github.com/Stedi/openApi`. Stedi also provides an **MCP server** at `https://mcp.us.stedi.com/2025-07-11/mcp` for AI agent integration.

---

## 7. AI Integration: AWS Bedrock for HIPAA-Compliant Claude Access

Clinivise's AI features — auth letter parsing, pre-claim validation, eligibility interpretation, denial management — all involve processing PHI (patient names, DOBs, insurance IDs, diagnosis codes, authorized hours). **The direct Anthropic API (`@anthropic-ai/sdk`) does not offer a BAA** and cannot be used for PHI workloads. AWS Bedrock solves this.

### Why Bedrock

AWS Bedrock is a HIPAA-eligible service covered under the standard AWS BAA (free, self-serve via AWS Artifact). When using Claude through Bedrock, Anthropic has **no access to inputs, outputs, or customer data** — the model runs in an AWS-controlled escrow environment with no outbound permissions to Anthropic. Data is not used for model training. Bedrock pricing for Claude models is essentially identical to direct Anthropic API pricing.

### Setup and Access

Bedrock access approval is near-instant (seconds, not days). Use `@aws-sdk/client-bedrock-runtime` to invoke Claude models. The integration is straightforward — swap the Anthropic SDK's `messages.create()` call for Bedrock's `invokeModel()` with the same prompt format.

```typescript
// Conceptual pattern — actual implementation in spec
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });
const response = await client.send(
  new InvokeModelCommand({
    modelId: "anthropic.claude-sonnet-4-20250514-v1:0",
    contentType: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  }),
);
```

### Key Considerations

- **Model availability lag**: New Claude models appear on Bedrock within ~1 week of Anthropic's release (fastest of all cloud providers).
- **Same pricing**: Claude Sonnet on Bedrock costs the same as direct API. No markup for HIPAA compliance.
- **Anthropic's AUP still applies**: Anthropic's acceptable use policy applies to Claude on Bedrock. Healthcare use cases may require human-in-the-loop for high-risk decisions — Clinivise's AI features are assistive (parsing, flagging, suggesting), not autonomous clinical decision-making, so this is not a concern.
- **Audit logging**: Use CloudWatch to track Bedrock API usage for HIPAA audit trail requirements.
- **No additional BAA needed**: If you already have an AWS BAA (which you should for S3 if using it), Bedrock is automatically covered.

---

## 8. shadcn/ui: CLI v4 with 56+ Components and Tailwind v4

The CLI has evolved from `shadcn-ui` to `shadcn` and is now at **CLI v4** (March 2026). Initialize with `npx shadcn@latest init -t next`. Components are copied into your project at `components/ui/` — they're your code, not an npm dependency.

### Key CLI v4 Features

The v4 release introduced **skills** (context files for AI coding agents like Claude and Codex), **presets** (design system config packed into short codes), and inspection flags (`--dry-run`, `--diff`, `--view`). The `npx shadcn create` command scaffolds new projects interactively. Five component styles are available: Vega (classic), Nova (compact), Maia (soft/rounded), Lyra (boxy/sharp), and Mira (ultra-compact for dense interfaces — **ideal for a billing dashboard**).

### Components Most Relevant to Clinivise

The library now includes **56+ components**. For an ABA billing platform, the most critical are: **Data Table** (TanStack Table integration), **Field** and **Input Group** (new form wrappers, Oct 2025), **Calendar** and **Date Picker** (revamped Jun 2025), **Chart** (Recharts-based), **Sidebar** (dashboard navigation), **Dialog**/**Sheet**/**Drawer** (overlays), **Command** (search/command palette), **Combobox** (autocomplete for payer/CPT lookups), **Sonner** (toast notifications), and the full form suite (Input, Select, Checkbox, Radio Group, Switch, Textarea). The new **Spinner** component (Oct 2025) handles loading states.

### Tailwind CSS v4 Integration

shadcn/ui is fully updated for Tailwind v4. No `tailwind.config.js` needed — all configuration lives in `globals.css` using `@theme inline` directives with OKLCH color values. The `default` style is deprecated; **new-york** is the standard. Components use the unified `radix-ui` package (since Feb 2026) instead of individual `@radix-ui/react-*` packages. An alternative **Base UI** (from MUI) is also available as primitives.

### Registry and Blocks System

Pre-built page blocks are available (`npx shadcn add dashboard-01` pulls a complete dashboard with sidebar, charts, and data table). The **namespaced registry system** (v3.0+) supports private registries with authentication, cross-registry dependencies, and a directory of community registries. Community resources include Shadcnblocks.com (1,400+ blocks) and Kibo UI (3.6K+ GitHub stars for data-heavy dashboards).

---

## 9. ABA Billing Codes: Complete Reference for Clinivise

### Category I CPT Codes (97151–97158)

All Category I ABA codes are **timed in 15-minute units** following the CMS 8-minute rule. These are the core codes Clinivise must support.

| Code      | Description                                                        | Provider      | MUE (units/day) |
| --------- | ------------------------------------------------------------------ | ------------- | :-------------: |
| **97151** | Behavior identification assessment (F2F + non-F2F)                 | BCBA/QHP      |   32 (8 hrs)    |
| **97152** | Behavior identification supporting assessment                      | RBT under QHP |   16 (4 hrs)    |
| **97153** | Adaptive behavior treatment by protocol (1:1 direct therapy)       | RBT under QHP |   32 (8 hrs)    |
| **97154** | Group adaptive behavior treatment by protocol (2–8 patients)       | RBT under QHP |  18 (4.5 hrs)   |
| **97155** | Adaptive behavior treatment with protocol modification             | BCBA/QHP      |   24 (6 hrs)    |
| **97156** | Family adaptive behavior treatment guidance (caregiver training)   | BCBA/QHP      |   16 (4 hrs)    |
| **97157** | Multiple-family group treatment guidance (patient not present)     | BCBA/QHP      |   16 (4 hrs)    |
| **97158** | Group treatment with protocol modification (QHP-led, 2–8 patients) | BCBA/QHP      |   16 (4 hrs)    |

**97153 is the most commonly billed ABA code** — it represents direct 1:1 therapy sessions delivered by RBTs implementing the behavior intervention plan. **97155 is the primary BCBA direct-service code**, used when the analyst provides treatment while modifying protocols in real time.

### Category III Codes (0362T and 0373T)

Only **two** Category III codes remain active for ABA — both address severe destructive behaviors requiring multi-technician teams with the QHP on-site:

- **0362T** — Multi-technician behavior identification supporting assessment for destructive behavior (16 units/day max)
- **0373T** — Multi-technician adaptive behavior treatment with protocol modification for destructive behavior (32 units/day max)

All other codes in the 0359T–0374T range, **including 0374T**, were **retired January 1, 2019** when Category I codes replaced them. **Critical upcoming change**: The ABA Coding Coalition announced that 0362T and 0373T will be **deleted effective January 1, 2027**, replaced by 6 new CPT codes. Clinivise should build for this transition.

### Modifier Codes

**Provider credential modifiers** (required by most Medicaid and many commercial payers):

| Modifier | Level                | ABA Role                  |
| -------- | -------------------- | ------------------------- |
| **HM**   | Less than bachelor's | RBT / Behavior Technician |
| **HN**   | Bachelor's degree    | BCaBA                     |
| **HO**   | Master's degree      | BCBA                      |
| **HP**   | Doctoral level       | BCBA-D                    |

**Telehealth modifiers**: **95** (preferred, synchronous telehealth) used with POS 02 or 10. **GT** (legacy, still accepted by some payers). Audio-only (FQ) is not accepted for ABA.

**Distinct procedural service modifiers**: **59** and the X-modifier family (**XE** separate encounter, **XP** separate practitioner, **XS** separate structure, **XU** unusual non-overlapping service). Required when billing 97155 + 97156 on the same date or when multiple technicians serve the same patient at different times.

### Place of Service Codes

|  POS   | Description                      | ABA Usage                                           |
| :----: | -------------------------------- | --------------------------------------------------- |
| **02** | Telehealth (not in patient home) | Video sessions, patient at clinic or other location |
| **03** | School                           | School-based ABA services                           |
| **10** | Telehealth (patient home)        | Video sessions, patient at home                     |
| **11** | Office/Clinic                    | Clinic-based ABA programs                           |
| **12** | Home                             | Home-based ABA programs (very common)               |
| **99** | Other/Community                  | Community skills training (parks, stores, etc.)     |

### Critical Billing Rules for Clinivise to Enforce

**Prior authorization is nearly universal** for ABA treatment. Assessment authorizations typically cover 8–12 hours; treatment reauthorization runs every 4–6 months. The primary diagnosis code is **F84.0** (Autism Spectrum Disorder). All codes bill in 15-minute increments under the 8-minute rule. **97153 and 97155 may be billed concurrently** when different providers (tech + QHP) are both face-to-face with the patient, but a single provider cannot report both codes simultaneously. There is **no standalone CPT code for indirect ABA services** (report writing, data analysis) — these are bundled into direct service codes.

---

## 10. Minimum HIPAA Infrastructure Cost Summary

### Development Phase (Phase 1)

| Service                            | Plan         |     Monthly Cost     |                  BAA Required?                  |
| ---------------------------------- | ------------ | :------------------: | :---------------------------------------------: |
| Vercel Pro (1 seat) + HIPAA add-on | Pro + Add-on |       **$370**       | ✅ Yes — PHI flows through serverless functions |
| Neon Scale (light usage)           | Scale        |      **$5–$50**      |     ✅ Yes — stores patient records, claims     |
| Clerk                              | Pro          |       **$20**        |     ❌ No — staff credentials only, no PHI      |
| File storage (Vercel Blob)         | Usage-based  |      **$1–$20**      |      ✅ Yes — auth letter PDFs contain PHI      |
| AWS Bedrock (Claude)               | Usage-based  |      **$5–$30**      | ✅ Yes — processes auth letters containing PHI  |
| Stedi (development)                | Basic        |        **$0**        |        ✅ Yes — but no PHI in test mode         |
| **Total development phase**        |              | **~$401–$490/month** |                                                 |

### Production Phase (Phase 2+)

| Service                      | Plan          |      Monthly Cost      | Notes                                 |
| ---------------------------- | ------------- | :--------------------: | ------------------------------------- |
| Vercel Pro + HIPAA           | Pro + Add-on  |        **$370**        | Same as dev                           |
| Neon Scale (production load) | Scale         |      **$50–$200**      | Scales with compute hours             |
| Clerk                        | Pro           |        **$20**         | Same as dev                           |
| File storage                 | Usage-based   |       **$5–$30**       | Grows with document volume            |
| AWS Bedrock                  | Usage-based   |      **$20–$100**      | Scales with AI feature usage          |
| Stedi                        | **Developer** |        **$500**        | ⚠️ Required for production API access |
| **Total production phase**   |               | **~$965–$1,220/month** |                                       |

**Revenue breakeven for Stedi**: At 2-4% of collections, Clinivise needs **$12,500–$25,000/month** in processed claims just to cover the Stedi Developer plan cost.

---

## 11. Key Decisions Summary

| Decision          | Choice                                         | Rationale                                                                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth provider     | **Clerk Pro ($20/mo)**                         | Best DX, pre-built components, org/RBAC/MFA included. No BAA needed for staff-only auth.                                                                                                                                                                                |
| Auth BAA          | **Not required**                               | Staff credential data is not PHI (45 CFR § 160.103). Employment records exclusion applies. No enforcement precedent.                                                                                                                                                    |
| AI provider       | **AWS Bedrock (Claude)**                       | HIPAA-eligible, covered under AWS BAA, same pricing as direct API. Anthropic has no access to inputs/outputs.                                                                                                                                                           |
| File storage      | **Vercel Blob**                                | Covered under Vercel BAA, simplest integration, adequate for auth letter PDFs                                                                                                                                                                                           |
| Multi-tenancy     | **App-level filtering + RLS defense-in-depth** | `WHERE organization_id = ?` on all queries. Add Postgres RLS on sensitive tables in Phase 2.                                                                                                                                                                            |
| ID generation     | **nanoid (21 chars default)**                  | Shorter and more URL-friendly than UUIDs. Default 21 chars provides 149 bits of entropy (collision-safe at billions of IDs). If sortable IDs are needed later (e.g., for pagination cursors), consider migrating to **cuid2** or **ulid** — but nanoid is fine for MVP. |
| TypeScript        | **5.9.3** (pin with tilde)                     | 6.0 RC not ecosystem-ready. Next.js/Drizzle untested against it.                                                                                                                                                                                                        |
| Tailwind          | **v4**                                         | Breaking change from v3 but shadcn/ui fully supports it. CSS-first config, no tailwind.config.js needed.                                                                                                                                                                |
| Zod               | **v4**                                         | Breaking change but `zod/v4` import path enables gradual migration. react-hook-form resolvers support it.                                                                                                                                                               |
| shadcn/ui style   | **Mira**                                       | Ultra-compact, ideal for data-dense billing dashboards                                                                                                                                                                                                                  |
| Rate limiting     | **Upstash**                                    | Serverless-native, HTTP-based Redis, works on Vercel edge                                                                                                                                                                                                               |
| Stedi plan timing | **Basic → Developer at Phase 2 launch**        | Free development/testing on Basic. $500/month Developer plan required for production API access.                                                                                                                                                                        |

## Conclusion

The Clinivise stack is technically sound and commercially viable. **Next.js 16, Drizzle ORM, and Tailwind v4 form a mature foundation**, though teams must navigate the Zod v3→v4 and Tailwind v3→v4 migrations carefully. **Clerk Pro is the clear authentication winner** for a small team — its pre-built components and Organization primitives dramatically reduce implementation time, and no HIPAA BAA is needed since the auth layer only handles staff credentials. **AWS Bedrock provides HIPAA-compliant Claude access** at identical pricing to the direct API, solving the PHI-in-AI-pipeline problem cleanly. The **Stedi API's JSON-first design** eliminates the need to work with raw X12 EDI, though the $500/month Developer plan requirement for production API access means billing features have a meaningful cost floor that should inform go-to-market timing.

Three time-sensitive items require attention: the **ABA Coding Coalition's 6 new CPT codes replacing 0362T/0373T effective January 1, 2027**, the **CMS HETS attestation deadline of May 11, 2026** for Medicare eligibility checks, and the need to factor the **Stedi Developer plan cost into the revenue model** before launching Phase 2 billing features.
