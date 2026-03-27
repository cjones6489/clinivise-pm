# Client Management UX Research

> Frontier patterns and best-in-class UX for client management in ABA practice management software.
> Research date: 2026-03-21

---

## Table of Contents

1. [Detail Page UX Patterns](#1-detail-page-ux-patterns)
2. [AI-Native Client Management](#2-ai-native-client-management)
3. [Multi-Insurance UX Patterns](#3-multi-insurance-ux-patterns)
4. [Client List UX](#4-client-list-ux)
5. [Accessibility and Field-Use Patterns](#5-accessibility-and-field-use-patterns)
6. [Form UX for Healthcare](#6-form-ux-for-healthcare)
7. [CentralReach Pain Points (Competitive Opportunity)](#7-centralreach-pain-points)
8. [Recommended Architecture for Clinivise](#8-recommended-architecture-for-clinivise)

---

## 1. Detail Page UX Patterns

### 1a. Linear's Issue Detail Page (production-proven)

**What they do:**

- Compact tabs with rounded corners, smaller icon and text sizing
- When tabs overflow the viewport, hidden tabs collapse into a popover button showing the count of hidden tabs; if the active tab is hidden, its label replaces the count
- Tabs hidden using CSS `visibility: hidden` (not removed from DOM) to avoid layout flickering
- Sidebar, tabs, headers, and panels are tuned to reduce visual noise while maintaining density
- Right-side detail panel for metadata (assignee, priority, labels) while main content takes center stage

**What to steal:**

- Overflow tab handling with popover (essential when client detail has 4+ tabs on tablet viewports)
- Compact tab styling with `text-xs` sizing aligns with Mira design system
- Keep metadata in a fixed sidebar/header area, scrollable content below
- Minimize visual noise with intentional whitespace and hierarchy

**Source:** [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui), [Linear Design Refresh](https://linear.app/now/behind-the-latest-design-refresh)

### 1b. Stripe's Customer Detail Page (production-proven)

**What they do:**

- Progressive disclosure: show a glimpse of data (e.g., "6 of 25 failed payments") with link to full view
- Tooltips for additional context without cluttering the view
- Dashboard shows charts at a glance with deep-links to Payments, Payouts, Disputes, Customers, Balance
- Signature brand color (#635BFF) used sparingly for primary actions only
- "Calm technology" philosophy: powerful functionality that doesn't demand attention

**What to steal:**

- Progressive disclosure pattern for authorization utilization: show "12 of 40 units used" inline with link to full breakdown
- Glimpse-then-drill pattern: client card shows summary, click reveals full detail
- Sparing use of color for actions (align with Mira's primary color usage)
- Activity timeline on the right side of entity detail pages

**Source:** [Stripe Customer Detail Page Updates](https://support.stripe.com/questions/updates-to-the-customer-detail-page), [SaaSUI Stripe](https://www.saasui.design/application/stripe)

### 1c. Notion's Page Layout (production-proven)

**What they do:**

- Properties organized in three tiers: Pinned (up to 4, horizontal under title), Property groups (vertical stacks), and Collapsible sections (toggle-style)
- Right-side details panel that can be opened/closed, keeping main content clean
- Tabbed layout for organizing content by category
- Drag-and-drop property organization between main view and sidebar panel

**What to steal:**

- Pinned properties pattern: show 3-4 critical fields (DOB, diagnosis, assigned BCBA, status) under client name as horizontal badges
- Collapsible sections for grouping related properties (Demographics, Contact, Clinical)
- Side panel for less-critical info that billing staff needs but BCBAs don't (insurance details, billing notes)

**Source:** [Notion Layouts](https://www.notion.com/help/layouts), [Notion Tabbed Layouts](https://www.notion.vip/insights/notion-tabbed-page-layouts)

### 1d. Healthcare EHR Detail Pages (production-proven)

**What they do:**

- Role-specific customization: different dashboard views for physician, nurse, admin
- Quick data access with option to go deeper (overview-first)
- Every interaction designed to minimize clicks and save time
- Trust and transparency: users need to know what's happening, why, and what to do next

**What to steal:**

- Role-based tab visibility: RBTs see Sessions + Demographics; BCBAs see all tabs; Billing staff see Insurance + Authorizations prominently
- Overview-first pattern: client detail opens to a summary tab showing key data from ALL tabs
- Minimize clicks for the most common workflows (log session, check auth remaining)

**Source:** [Eleken Healthcare UI Design 2026](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications), [Phenomenon EHR Design](https://phenomenonstudio.com/ehr-system-design/)

### 1e. Master-Detail Pattern: Inline Editing vs. Modal (production-proven)

**Best practice synthesis:**

- **Inline editing** for simple, single-field edits (phone number, email, notes). Saves context switching
- **Modal/sheet** for complex multi-field edits (full address, insurance details). Keeps the read view clean
- **Full-page edit** only for initial intake or major changes (rare)
- Never use inline editing if it causes significant page morphing or requires scrolling

**Recommended for Clinivise:**

- Inline edit for: phone, email, notes, status toggle
- Sheet/drawer for: demographics section, insurance details, address
- Full form for: initial client creation only

**Source:** [PatternFly Inline Edit](https://www.patternfly.org/components/inline-edit/design-guidelines/), [WebAppHuddle Inline Edit Design](https://webapphuddle.com/inline-edit-design/)

---

## 2. AI-Native Client Management

### 2a. Insurance Card OCR + Auto-Fill (production-proven)

**Who does it:** athenahealth, AdvancedMD, NextGen, Mindee API, Veryfi API

**How it works:**

- Patient/staff uploads photo of insurance card (front + back in single request)
- AI OCR extracts: member ID, group number, payer name, plan type, copay, subscriber info
- Auto-populates corresponding fields in client insurance form
- Confidence scoring: high-confidence fields auto-fill; low-confidence fields flagged for manual review
- When extracted payer doesn't match a pre-configured payer, system prompts probable matching payers

**Key specs:**

- Mindee API: >90% overall accuracy, >95% precision on most fields, HIPAA compliant, supports JPEG/PNG up to 5MB
- athenahealth: ML models go beyond traditional OCR to analyze and tag content
- AdvancedMD: OCR runs automatically when card image is selected

**Implementation recommendation for Clinivise:**

- Phase 1: Upload insurance card image, store in Vercel Blob, display alongside manual fields
- Phase 1.5: Integrate Mindee API (or Veryfi) to extract fields, present with confidence indicators, let user confirm/correct
- Show extracted fields in green (high confidence) or yellow (needs review) before saving

**Source:** [athenahealth AI OCR](https://www.athenahealth.com/resources/blog/ai-ocr-and-insurance-verification-improve-accuracy), [Mindee Insurance Card API](https://www.mindee.com/product/us-health-insurance-cards-ocr-api)

### 2b. AI-Assisted Diagnosis Code Selection (emerging, gaining traction)

**Who does it:** Miraico (ASUS), ICDcodes.ai, AutoICD, MedCodER

**How it works:**

- NLP analyzes clinical text (referral letter, assessment notes) to suggest ICD-10 codes
- Presents top 5 suggestions ranked by confidence level
- Supporting evidence text can be toggled to show/hide
- Coding time reduced by 46-75%, accuracy >95%
- Audit-ready logs track every suggestion for compliance

**Implementation recommendation for Clinivise:**

- ABA practices primarily use F84.0 (Autism Spectrum Disorder) and a few related codes
- Build a smart autocomplete with the ~20 most common ABA diagnosis codes
- When AI parses a referral letter, extract and suggest diagnosis code from the referral text
- Show code + description + confidence together

**Source:** [Miraico ICD-10 AI](https://aics.asus.com/miraico-en/), [Roving Health Coding Automation](https://www.rovinghealth.com/articles/medical-coding-automation-ai-icd10-cpt-clinical-notes)

### 2c. Smart Intake / Document Parsing (emerging)

**Who does it:** Alpaca Health, Freed AI, Notable Health, Commure, Luma Health

**How it works:**

- Upload referral letter, assessment report, or faxed intake form
- AI extracts structured data: patient demographics, diagnosis, recommended services, insurance info
- Pre-fills intake form fields with extracted data
- Staff reviews and confirms rather than typing from scratch

**ABA-specific features (Alpaca Health):**

- AI generates session notes from conversation transcripts during parent interviews, caregiver trainings, RBT supervision
- AI assists reviewing client records and generating portions of treatment plans
- Built specifically for BCBAs, HIPAA compliant

**Implementation recommendation for Clinivise:**

- Phase 1: AI-parsed authorization letters (already in schema via `aiParsedData` field)
- Next: Extend to referral letter parsing for intake auto-fill
- Show "AI-extracted" badge next to auto-filled fields so staff knows what to verify

**Source:** [Alpaca Health AI Features](https://www.alpacahealth.io/blog/ai-automation-healthcare-bcba), [Notable Health](https://www.commure.com)

### 2d. Duplicate Detection (production-proven in enterprise, emerging in ABA)

**Industry context:**

- Average healthcare org carries 8-12% duplicate records; large systems up to 15%
- 53% of duplicates from SSN mismatches, 33% from swapped/mis-entered names

**How it works:**

- Jaro-Winkler algorithm for name matching (best for person names, handles transpositions)
- Levenshtein Distance for general string comparison
- Multi-field probabilistic matching: name + DOB + address + insurance ID
- EMPI (Enterprise Master Patient Index) systems compare demographic data from two records

**Implementation recommendation for Clinivise:**

- On client creation: check `firstName + lastName + dateOfBirth` against existing clients in same org
- Use Jaro-Winkler similarity threshold (>0.85) to flag potential duplicates
- Show inline warning: "Possible duplicate: [Name, DOB, Intake Date]" with link to existing record
- Keep it simple: ABA practices are small (1-50 staff), so exact match on DOB + fuzzy name is sufficient

**Source:** [Health IT Answers AI Patient Matching](https://www.healthitanswers.net/three-ways-artificial-intelligence-can-aid-patient-matching/), [WellSky Patient Matching](https://engineering.wellsky.com/post/wellskys-enterprise-patient-matching-a-deep-dive-into-an-algorithm-driven-solution)

### 2e. Natural Language Search (emerging)

**How it works:**

- Domain-specific vector embeddings for clinical text similarity
- Query expansion handles synonyms, abbreviations, and medical terminology variations
- NLP market in healthcare projected at $12.09B by 2026 (20.5% CAGR)

**Implementation recommendation for Clinivise:**

- Phase 1: Standard search with fuzzy matching on client name, DOB, member ID
- Phase 2: Add natural language queries: "clients with expiring auths this month", "all clients assigned to Dr. Smith with Aetna insurance"
- Use structured query parsing (not full vector search) since the data model is well-defined

**Source:** [ForeseeMed NLP in Healthcare](https://www.foreseemed.com/natural-language-processing-in-healthcare)

---

## 3. Multi-Insurance UX Patterns

### 3a. Primary/Secondary/Tertiary Insurance Display

**Best practice (synthesized from research):**

- Card-based layout with visual hierarchy: Primary card is prominent, secondary/tertiary are smaller or collapsed
- Badge indicator: `Primary`, `Secondary`, `Tertiary` labels with distinct colors
- Status dot: green (active/verified), yellow (pending verification), red (terminated/expired), gray (inactive)
- Date range visualization: simple horizontal bar showing effective-to-termination date, highlight if currently active
- Show "Verified" timestamp with source (manual, electronic, AI-scanned)

**Subscriber relationship display:**

- For ABA (children as patients): always show subscriber relationship prominently since the patient is almost always a dependent
- Fields: Subscriber Name, Relationship (Parent/Guardian/Self), Subscriber DOB
- "Same as patient" toggle for the rare case where the client is the subscriber
- Pre-fill subscriber last name from parent/guardian contact info

**Recommended layout for Clinivise:**

```
Insurance Tab
  [Primary Insurance Card]
    Payer: Blue Cross Blue Shield          Status: (green dot) Active
    Member ID: XYZ123456                   Group: 98765
    Subscriber: John Doe (Father)          Effective: 01/01/2025 - 12/31/2025
    [Edit] [Scan Card] [Verify Eligibility]

  [+ Add Secondary Insurance]  (collapsed by default)
```

### 3b. Insurance Card Scanning UX Flow

**Best practice:**

1. Camera/upload button on insurance form
2. Accept front + back in single flow (two-step capture)
3. Show extracted fields overlaid on card image for visual verification
4. Green highlight = high confidence, yellow = needs review
5. "Accept All" button to confirm and save, or edit individual fields
6. Store original card image linked to the insurance record for reference

**Source:** [CharmHealth Insurance Card Reader](https://www.charmhealth.com/resources/addons/insurance-card-reader.html), [Pixdynamics Insurance Card Reader](https://pixdynamics.com/us-health-insurance-card-reader)

### 3c. Insurance Verification Status Indicators

**Recommended status system:**

| Status       | Color   | Badge     | Meaning                                                |
| ------------ | ------- | --------- | ------------------------------------------------------ |
| Verified     | Emerald | Checkmark | Eligibility confirmed electronically or manually       |
| Pending      | Amber   | Clock     | Submitted for verification, awaiting response          |
| Unverified   | Gray    | Dash      | No verification attempted                              |
| Expired      | Red     | X         | Policy terminated or past termination date             |
| Needs Update | Blue    | Arrow     | Policy info may be stale (>90 days since verification) |

---

## 4. Client List UX

### 4a. Table Design Best Practices

**Information density:**

- Let users toggle between compact (py-1.5 text-xs) and comfortable (py-2.5 text-sm) density
- Default to compact for billing staff, comfortable for clinical staff
- `tabular-nums` on all numeric columns (auth units, session counts)

**Status indicators in compact rows:**

- Small colored dots (8px) for client status: green (active), gray (inactive), amber (pending intake), red (discharged)
- Inline utilization indicator: mini progress bar or fraction (12/40 units) next to auth status
- Expiring auth warning: amber/red dot next to client name if any auth expires within 30 days

**Column recommendations for client list:**

| Column             | Width | Notes                                         |
| ------------------ | ----- | --------------------------------------------- |
| Name (Last, First) | 180px | Sortable, link to detail. Bold last name      |
| DOB / Age          | 90px  | Show age in parentheses: "03/15/2019 (7y)"    |
| Status             | 80px  | Colored badge: Active, Inactive, Pending      |
| Assigned BCBA      | 140px | Avatar + name, filterable                     |
| Primary Insurance  | 140px | Payer name + verification dot                 |
| Auth Status        | 120px | Mini progress bar or "No Active Auth" warning |
| Next Session       | 100px | Date or "None scheduled"                      |
| Actions            | 60px  | Kebab menu                                    |

### 4b. Filters That Healthcare Workers Actually Use

**Priority filters (based on ABA workflow research):**

1. **Status** (Active / Inactive / Pending Intake / Discharged) -- most used
2. **Assigned Provider** (BCBA dropdown) -- BCBAs filter to "my clients"
3. **Insurance / Payer** -- billing staff filter by payer for batch billing
4. **Authorization Status** (Has Active Auth / Expiring Soon / No Auth / Over-Utilized)
5. **Intake Date Range** -- for new client reporting

**Implementation pattern:**

- Filter bar with pill-style active filters (Linear-style)
- Saved filter presets: "My Clients", "Expiring Auths", "Missing Insurance", "Pending Intake"
- Visual indicator when filters are active (badge count on filter icon)
- Clear all filters button

### 4c. Touch-Friendly Interactions

- Minimum touch targets: 44px (min-h-11 min-w-11)
- Row tap navigates to detail; no hover-only interactions
- Swipe actions on mobile/tablet: swipe right to call/email, swipe left for quick actions
- FAB (floating action button) for "Add Client" on tablet viewport
- Checkboxes visible (not hover-only) on touch devices

### 4d. Export and Print

- CSV export button in table toolbar (billing staff need this for reconciliation)
- Export should respect current filters (export what you see)
- Print-optimized view for client rosters (BCBAs print client lists for field work)
- Bulk actions on selected rows: export selected, change status, reassign BCBA

**Source:** [Pencil & Paper Data Tables](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables), [NN/g Data Tables](https://www.nngroup.com/articles/data-tables/), [Andrew Coyle Table UI](https://www.andrewcoyle.com/blog/table-ui-considerations-for-large-datasets)

---

## 5. Accessibility and Field-Use Patterns

### 5a. Tablet-First Healthcare Data Entry

**Key patterns:**

- Touch targets: minimum 48px for clinical apps (not just 44px) -- users wearing gloves or in motion
- Voice-to-text for session notes: CR Mobile (CentralReach) already has this; Clinivise must match it
- Smart templates with one-tap selections reduce typing significantly
- Stylus support for signature capture on intake forms
- High-contrast mode for outdoor/bright-light use

**Performance benchmark:** Healthcare pros using tablet EMRs save average 56 minutes/day through efficient documentation

### 5b. Offline-Capable Patterns

**Context:** RBTs provide ABA therapy in homes, schools, and community settings where connectivity is unreliable.

**Recommended approach:**

- Phase 1: Not needed (practice management is primarily office/desktop work)
- Phase 2 (session logging): Service worker for session data entry, sync when online
- Critical: show clear online/offline status indicator
- Queue mutations locally, sync in background, show sync status
- Never lose entered session data -- this is the #1 fear for field RBTs

### 5c. Color-Coding and Visual Hierarchy

**Clinical vs. administrative data separation:**

- Clinical data (diagnosis, treatment goals, session notes): presented with clinical typography, higher visual weight
- Administrative data (insurance, billing, scheduling): presented with standard typography, grouped separately
- Use semantic color tokens only (from Clinivise design system):
  - Emerald: success/verified/active
  - Amber: warning/expiring/pending
  - Red: error/critical/over-utilized
  - Blue: info/neutral/new

**Role-based emphasis:**

- BCBA view: clinical data prominent, admin data accessible but secondary
- Billing staff view: insurance + auth data prominent, clinical data summarized
- Admin view: all data equal weight

**Source:** [OpenForge Offline Mobile Design](https://openforge.io/offline-mobile-app-design/), [Thinkitive Mobile EMR](https://www.thinkitive.com/blog/emr-application-development-building-mobile-first-solutions-for-modern-healthcare/), [Capiproduct Healthcare Mobile UX](https://www.capiproduct.com/post/designing-healthcare-mobile-apps-best-ui-ux-practices-for-2025)

---

## 6. Form UX for Healthcare

### 6a. Multi-Step vs. Single Form

**Research consensus:**

- Multi-step forms improve completion rates when form has >7 fields
- Each step should group logically related fields (Demographics, Contact, Insurance, Clinical)
- Progress indicator required (step count or progress bar)
- Allow non-linear navigation between completed steps

**Recommended for Clinivise client intake:**

| Step          | Fields                                                                | Required?               |
| ------------- | --------------------------------------------------------------------- | ----------------------- |
| 1. Basic Info | First/Last Name, DOB, Gender                                          | All required            |
| 2. Contact    | Phone, Email, Address                                                 | Phone or Email required |
| 3. Clinical   | Diagnosis Code, Referral Source, Assigned BCBA, Intake Notes          | Diagnosis required      |
| 4. Insurance  | Upload card or manual entry: Payer, Member ID, Group, Subscriber info | Can skip, add later     |

- Total: 4 steps, ~15 fields
- Allow saving after Step 1 (minimum viable client record)
- Steps 2-4 can be completed in any order after initial save

### 6b. Auto-Save and Draft Patterns

**Best practices:**

- Auto-save every 30 seconds on forms with >5 fields
- Visual indicator: "Saved" / "Saving..." / "Unsaved changes" in form header
- "Save as Draft" for incomplete intake forms
- Resume capability: drafts appear in a "Pending Intake" filter on client list
- Never lose data on browser crash or accidental navigation

**Implementation:**

- Use `localStorage` for draft persistence (no server round-trip for autosave)
- Sync to server on explicit "Save" or on step completion
- Show "Draft" badge on client list for incomplete records

### 6c. Validation Timing

**Recommended pattern:**

- Required fields: validate on blur (immediate feedback)
- Format fields (phone, email, zip): validate on blur with auto-formatting
- Cross-field validation (date ranges, subscriber info): validate on step completion
- Show inline error below the field (never toast for validation errors)
- Use amber for warnings ("Insurance info missing -- billing may be delayed"), red for errors

### 6d. Pre-Filling from Context

**What to auto-populate:**

- `intakeDate`: today's date
- `diagnosisCode`: F84.0 (default for ABA, 90%+ of cases)
- `assignedBcbaId`: current user if they are a BCBA
- `state`: organization's state (most practices serve local clients)
- `subscriberLastName`: from parent/guardian last name if different contact provided
- Last-used payer: suggest the most common payer in the organization

**Source:** [Smashing Magazine Multi-Step Forms](https://www.smashingmagazine.com/2024/12/creating-effective-multistep-form-better-user-experience/), [Designlab Multi-Step Forms](https://designlab.com/blog/design-multi-step-forms-enhance-user-experience), [IxDF Form Design 2026](https://ixdf.org/literature/article/ui-form-design)

---

## 7. CentralReach Pain Points

These are documented user complaints that represent competitive opportunities for Clinivise.

| Pain Point                          | Impact                                                                 | Clinivise Opportunity                                          |
| ----------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Not mobile-friendly**             | RBTs can't enter data efficiently in the field                         | Responsive-first design, tablet-optimized session entry        |
| **Calendar is rigid**               | Can't easily create/change appointments or see shared client schedules | Drag-and-drop scheduling with auth-aware validation            |
| **System crashes lose data**        | Glitches kick staff out of notes without saving                        | Auto-save with local persistence, offline queue                |
| **Layout too small**                | Staff click wrong items when rushed                                    | 44px+ touch targets, clear visual hierarchy, density toggle    |
| **No expiring document alerts**     | Compliance tracking is manual                                          | Proactive alert system: expiring auths, insurance, credentials |
| **Weak reporting**                  | Hard to track client progress across learning platform                 | Dashboard with real-time utilization, exportable reports       |
| **Expensive add-ons**               | Per-employee pricing hurts small practices                             | Free PM tool, revenue-based billing model                      |
| **Poor integrations**               | Doesn't connect with other platforms                                   | API-first architecture, webhook support                        |
| **Desktop/mobile feature mismatch** | Different capabilities on different devices                            | Single codebase, responsive design, consistent feature set     |

**Source:** [CentralReach Reviews on Software Advice](https://www.softwareadvice.com/medical/centralreach-profile/reviews/), [CentralReach Reviews on GetApp](https://www.getapp.com/healthcare-pharmaceuticals-software/a/centralreach/), [Operant Billing CentralReach Review](https://operantbilling.com/central-reach-aba-software-review/)

---

## 8. Recommended Architecture for Clinivise

Based on all research, here is the recommended client management architecture.

### 8a. Client Detail Page Structure

```
+------------------------------------------------------------------+
| < Back to Clients     [Client Name]  [Status Badge]  [Actions v] |
|                                                                   |
| Pinned: DOB: 03/15/2019 (7y) | Dx: F84.0 | BCBA: Dr. Smith     |
|         Primary Ins: BCBS (Verified) | Auth: 12/40 units (30%)   |
|                                                                   |
| [Overview] [Demographics] [Insurance] [Authorizations] [Sessions]|
+------------------------------------------------------------------+
| Tab Content Area                          | Side Panel (optional) |
|                                           |                       |
| ...                                       | Activity Timeline     |
|                                           | Quick Actions         |
|                                           | Related Documents     |
+------------------------------------------------------------------+
```

### 8b. Tab Content

**Overview Tab (default):**

- Key metrics cards: total sessions this month, auth utilization gauge, next session date
- Active authorization summary with progress bars
- Recent session log (last 5)
- Alerts: expiring auth, missing insurance, incomplete intake
- Quick action buttons: Log Session, New Authorization, Edit Info

**Demographics Tab:**

- Inline-editable for simple fields (phone, email)
- Section groups: Personal Info, Contact, Address, Clinical, Notes
- Collapsible sections
- Edit button opens sheet for multi-field edits

**Insurance Tab:**

- Card-based insurance display (primary prominent, secondary collapsed)
- Insurance card image viewer alongside extracted data
- Verification status with timestamp
- Add/edit via sheet overlay
- "Scan Card" button for AI-assisted entry

**Authorizations Tab:**

- List of all authorizations (active first, then expired)
- Each auth shows: date range, status, per-service utilization bars
- Expandable rows showing service-level detail (CPT code, approved/used units)
- "Upload Auth Letter" with AI parsing
- Visual timeline of authorization coverage gaps

**Sessions Tab:**

- Filterable session log with date range picker
- Each row: date, provider, CPT code, units, auth linked, status
- Quick "Log Session" button
- Session timer integration for active sessions

### 8c. AI Features Roadmap for Client Management

| Feature                                     | Phase | Effort | Impact                              |
| ------------------------------------------- | ----- | ------ | ----------------------------------- |
| Insurance card OCR (Mindee/Veryfi API)      | 1.5   | Medium | High - eliminates manual data entry |
| Duplicate client detection (fuzzy matching) | 1     | Low    | Medium - prevents billing errors    |
| Auth letter AI parsing (already in schema)  | 1     | Medium | High - saves 10-15 min per auth     |
| Diagnosis code autocomplete                 | 1     | Low    | Low - most ABA uses F84.0           |
| Referral letter intake auto-fill            | 2     | Medium | High - saves 5-10 min per intake    |
| Natural language search                     | 2     | High   | Medium - power user feature         |
| Smart defaults from org history             | 1     | Low    | Medium - reduces repetitive entry   |
| Expiring auth proactive alerts              | 1     | Low    | High - prevents service gaps        |

### 8d. Key UX Principles

1. **Overview-first, drill-down second** -- client detail opens to summary, not raw data
2. **Role-aware density** -- BCBAs see clinical emphasis, billing sees financial emphasis
3. **Progressive disclosure everywhere** -- show summary counts with expand to detail
4. **Never lose data** -- auto-save drafts, offline queue for field use, optimistic updates
5. **AI assists, human confirms** -- every AI extraction shows confidence and requires confirmation
6. **Touch-ready, keyboard-powerful** -- 44px+ targets for tablet, command palette (Cmd+K) for desktop power users
7. **Alerts over dashboards** -- proactively surface expiring auths, missing insurance, incomplete records rather than making users hunt for them

### 8e. Existing Schema Alignment

The current schema (`src/server/db/schema/clients.ts`) already supports:

- Core demographics (name, DOB, gender, address, diagnosis)
- Multi-insurance via `clientInsurance` table with subscriber relationship
- Primary/secondary insurance flag (`isPrimary`)
- Insurance date ranges (`effectiveDate`, `terminationDate`)
- Soft delete (`deletedAt`)
- BCBA assignment (`assignedBcbaId`)
- Intake tracking (`intakeDate`, `dischargeDate`, `isActive`)

**Schema gaps to address:**

- No `parentGuardianName` / `parentGuardianPhone` fields (needed for ABA -- clients are children)
- No `referralSource` field (important for intake tracking)
- No `preferredLanguage` field (compliance requirement for some payers)
- No `insuranceCardImageUrl` field on `clientInsurance` (needed for card scanning feature)
- No `verificationStatus` / `lastVerifiedAt` fields on `clientInsurance`
- Consider adding `emergencyContactName` / `emergencyContactPhone` to clients table

---

## Sources

### Detail Page UX

- [Linear UI Redesign (Part II)](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design Refresh](https://linear.app/now/behind-the-latest-design-refresh)
- [Stripe Customer Detail Page Updates](https://support.stripe.com/questions/updates-to-the-customer-detail-page)
- [SaaSUI Stripe Interface](https://www.saasui.design/application/stripe)
- [Notion Layouts Help](https://www.notion.com/help/layouts)
- [Notion Tabbed Page Layouts](https://www.notion.vip/insights/notion-tabbed-page-layouts)
- [Eleken Healthcare UI Design 2026](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [Phenomenon EHR System Design](https://phenomenonstudio.com/ehr-system-design/)

### AI-Native Features

- [athenahealth AI OCR for Insurance](https://www.athenahealth.com/resources/blog/ai-ocr-and-insurance-verification-improve-accuracy)
- [Mindee Insurance Card OCR API](https://www.mindee.com/product/us-health-insurance-cards-ocr-api)
- [Miraico ICD-10 AI Coding Assistant](https://aics.asus.com/miraico-en/)
- [Roving Health Medical Coding Automation](https://www.rovinghealth.com/articles/medical-coding-automation-ai-icd10-cpt-clinical-notes)
- [Alpaca Health AI for BCBAs](https://www.alpacahealth.io/blog/ai-automation-healthcare-bcba)
- [Health IT Answers AI Patient Matching](https://www.healthitanswers.net/three-ways-artificial-intelligence-can-aid-patient-matching/)
- [WellSky Enterprise Patient Matching](https://engineering.wellsky.com/post/wellskys-enterprise-patient-matching-a-deep-dive-into-an-algorithm-driven-solution)
- [ForeseeMed NLP in Healthcare](https://www.foreseemed.com/natural-language-processing-in-healthcare)

### Insurance UX

- [CharmHealth Insurance Card Reader](https://www.charmhealth.com/resources/addons/insurance-card-reader.html)
- [Pixdynamics Insurance Card Reader](https://pixdynamics.com/us-health-insurance-card-reader)

### Data Tables

- [Pencil & Paper Enterprise Data Tables](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables)
- [NN/g Data Tables User Tasks](https://www.nngroup.com/articles/data-tables/)
- [Andrew Coyle Table UI for Large Datasets](https://www.andrewcoyle.com/blog/table-ui-considerations-for-large-datasets)
- [Eleken Table Design UX Guide](https://www.eleken.co/blog-posts/table-design-ux)

### Forms

- [Smashing Magazine Multi-Step Forms](https://www.smashingmagazine.com/2024/12/creating-effective-multistep-form-better-user-experience/)
- [Designlab Multi-Step Forms](https://designlab.com/blog/design-multi-step-forms-enhance-user-experience)
- [IxDF Form Design 2026](https://ixdf.org/literature/article/ui-form-design)

### Field/Tablet UX

- [OpenForge Offline Mobile App Design](https://openforge.io/offline-mobile-app-design/)
- [Thinkitive Mobile-First EMR](https://www.thinkitive.com/blog/emr-application-development-building-mobile-first-solutions-for-modern-healthcare/)
- [Capiproduct Healthcare Mobile UX 2025](https://www.capiproduct.com/post/designing-healthcare-mobile-apps-best-ui-ux-practices-for-2025)

### Inline Editing

- [PatternFly Inline Edit Guidelines](https://www.patternfly.org/components/inline-edit/design-guidelines/)
- [WebAppHuddle Inline Edit Design](https://webapphuddle.com/inline-edit-design/)

### Competitive Intelligence

- [CentralReach Reviews - Software Advice](https://www.softwareadvice.com/medical/centralreach-profile/reviews/)
- [CentralReach Reviews - GetApp](https://www.getapp.com/healthcare-pharmaceuticals-software/a/centralreach/)
- [Operant Billing CentralReach Review](https://operantbilling.com/central-reach-aba-software-review/)
- [Passage Health ABA Software](https://www.passagehealth.com/)

### ABA Intake Workflow

- [Passage Health ABA Intake Process](https://www.passagehealth.com/blog/aba-intake-process)
- [ABA Engine Intake Forms Guide](https://abaengine.com/blog/a-guide-to-using-aba-intake-forms/)
- [RightWay ABA Intake Guide](https://rightwayaba.com/understanding-the-intake-and-assessment-process-in-aba-therapy/)

### Progressive Disclosure

- [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [Algolia Information Density and Progressive Disclosure](https://www.algolia.com/blog/ux/information-density-and-progressive-disclosure-search-ux)

### SaaS Patterns

- [SaaSUI Design Patterns](https://www.saasui.design/)
- [SaaSFrame Tab Examples](https://www.saasframe.io/patterns/tabs)
- [SaaSFrame Side Panel Examples](https://www.saasframe.io/patterns/side-panel)
- [GitHub SaaS UI Workflow Patterns](https://gist.github.com/mpaiva-cc/d4ef3a652872cb5a91aa529db98d62dd)
