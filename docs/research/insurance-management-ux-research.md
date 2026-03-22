# Insurance Management UX & AI-Native Research

> Sprint 2C pre-build research. Covers UX patterns, AI-native approaches, and frontier techniques for client insurance & payer management in ABA therapy practice management software.
>
> Researched: 2026-03-21

---

## 1. Best UX Implementations for Insurance Management

### 1A. Jane App — "Awaiting Review" Intake Pipeline

Jane App has the best-documented insurance intake workflow for small practices:

- **Patient-facing**: Intake form lets patients photograph front/back of insurance card directly from any camera-equipped device (phone, tablet, laptop). Can upload existing images or take new photos.
- **Configuration flexibility**: Clinic can require front only, front+back, or make images optional. Supports up to 3 policies per patient.
- **Staff-facing**: Submitted insurance info lands in an "Awaiting Review" queue. Staff see the card images alongside the patient-entered data, verify details match, then approve before any claims are billed.
- **Why it's good**: Separates data capture (patient/intake coordinator) from data validation (billing staff). The "Awaiting Review" status prevents billing on unverified insurance. Simple enough for a 5-person practice.

**Applicable to Clinivise**: This is the right mental model. ABA intake coordinators hand a tablet to parents, parents photograph the card, data enters as "pending verification", billing staff reviews and approves. The key insight is that insurance data has a lifecycle: captured -> pending review -> verified -> active -> expired.

### 1B. athenahealth — AI-Powered Automated Insurance Selection

athenahealth represents the enterprise gold standard:

- **AI OCR pipeline**: Patient uploads card image (portal or front-desk scan) -> ML models extract text -> cross-reference against existing patient records -> auto-suggest correct insurance package.
- **Automated Insurance Selection**: AI suggests the matching insurance plan from payer database, pre-populating fields. Staff confirms or corrects.
- **Impact**: 35% reduction in insurance-related rule hold rates, 7.4% reduction in insurance-related denials.
- **Why it's good**: Closes the loop from image to verified, billable insurance with minimal manual entry. The AI doesn't just extract text — it matches to payer databases and validates.

**Applicable to Clinivise**: This is the aspirational target. Phase 1 should build the data structures and UI to support this flow. The OCR/AI layer can be added incrementally (Sprint 2C: manual entry with card image upload; later: OCR pre-fill; later still: automated payer matching).

### 1C. CERTIFY Health — Integrated Insurance Capture + Eligibility

- **Seamless flow**: Card capture -> OCR extraction -> real-time eligibility check in a single pipeline.
- **Patient portal integration**: Patients prompted to upload updated cards when they indicate coverage changes.
- **Card image storage**: Images stored in patient record for future reference and auditing.
- **Why it's good**: Eliminates the gap between "we have the card image" and "we know if coverage is active". The verification happens automatically.

**Applicable to Clinivise**: The card image storage pattern is a quick win — associate uploaded card images with the `client_insurance` record via the existing `documents` table. Real-time eligibility is Phase 2 (Stedi integration already planned).

### 1D. CentralReach — What to Avoid

CentralReach is the dominant ABA PM tool, and its insurance management UX is widely criticized:

- Layout elements are too small, causing click errors when staff are in a rush
- Payer-specific documentation templates are tedious to configure
- Authorization tracking exists but requires careful setup to prevent exceeding approved hours
- Mobile and desktop experiences are inconsistent
- Outages and reliability issues compound the UX problems

**Lesson for Clinivise**: The bar is low. Touch-friendly form elements (44px min targets), clear authorization tracking, and reliable desktop/tablet parity will differentiate us immediately.

### 1E. Card-Based Layout Pattern (Fintech Influence)

Modern fintech dashboards (Ramp, Mercury, Stripe) use card-based layouts where each card encapsulates a self-contained unit of information:

- Each insurance policy as a visual "card" — showing payer name, member ID, priority badge (Primary/Secondary), status indicator, effective dates
- Cards are scannable at a glance, unlike dense table rows
- Interactive elements within cards (edit, verify, check eligibility)
- Cards stack naturally on mobile/tablet

**Applicable to Clinivise**: Use card layout for the Insurance tab rather than a data table. ABA clients rarely have more than 2-3 policies. Cards > tables when N < 10 and each item has heterogeneous data.

---

## 2. AI-Native Approaches for Insurance Automation

### 2A. Insurance Card OCR APIs — Market Overview

| Provider | Accuracy | HIPAA | Pricing | Fields Extracted | Notes |
|----------|----------|-------|---------|-----------------|-------|
| **Veryfi** | 97%+ | Yes (SOC 2 Type II, HIPAA, CCPA, GDPR) | Per document, tiered by volume | Member ID, group #, plan details, provider networks | Multi-modal LLM API (AnyDocs). Best for startups — good docs, reasonable pricing |
| **Mindee** | 90-95% | Yes | Free tier: 250/mo, then $0.10-$0.01/doc | Member ID, group #, barcodes, issue dates, plan codes | Both sides in single request. Good free tier for dev |
| **Microsoft Azure Doc Intelligence** | High (unspecified) | Yes (Azure BAA) | Pay-per-use via Azure | Full structured extraction | Enterprise-grade but complex setup. Already in Azure ecosystem |
| **Orbit Healthcare** | High | Yes | Custom pricing | Subscriber ID, Group ID, Payer Name, Payer ID | Trained on 4,000+ payers, 20,000+ plan types. Also validates with payers in <5 seconds |
| **Klippa** | High | Yes | Custom pricing | Full card data | Strong on multi-format support |

**Recommendation for Clinivise**: Start with **Mindee** for development (free tier, good accuracy, simple API). Evaluate **Veryfi** for production (better accuracy, HIPAA compliance is more mature, cleaner documentation). Both can be swapped easily — the extraction output is the same structured JSON.

### 2B. Payer Database & Directory APIs

| Service | Coverage | Features | Relevance |
|---------|----------|----------|-----------|
| **Stedi Payer Network** | 3,400+ US payers | Searchable payer directory, payer ID lookup, eligibility checks | Already in Clinivise tech stack. Use Stedi's payer list as the source of truth for payer search/autocomplete |
| **NPPES NPI Registry** | All US providers | Free API, lookup by NPI, name, location | Already needed for provider management |
| **pVerify** | Largest payer list in industry | EDI + non-EDI payers, real-time eligibility | Alternative to Stedi for eligibility |
| **Approved Admissions** | 1,300+ payers | Single endpoint, batch eligibility, MBI lookup, coverage discovery | Good for batch verification workflows |

**Recommendation for Clinivise**: Use **Stedi's payer list API** to power a payer search/autocomplete in the insurance form. This aligns with the existing tech stack decision and means payer data flows naturally into Phase 2 claims submission.

### 2C. AI-Powered Verification Pipeline (Future Architecture)

The most advanced systems combine multiple AI steps:

1. **Capture**: Patient/staff photographs card (browser camera API or file upload)
2. **Extract**: OCR API extracts structured fields (member ID, group #, payer name, plan type)
3. **Match**: AI cross-references extracted payer name against payer directory to find Stedi payer ID
4. **Pre-fill**: Form fields auto-populated with extracted data, confidence scores shown per field
5. **Verify**: Real-time eligibility check via Stedi 270/271 API confirms active coverage
6. **Store**: Card images stored as documents, extraction results stored alongside insurance record

**Maturity Assessment**:
- Steps 1-2: Production-ready today (Veryfi/Mindee APIs are mature)
- Step 3: Semi-automated (fuzzy matching against Stedi payer list — ~85% accuracy, staff confirms)
- Step 4: Production-ready (standard form pre-fill from API response)
- Step 5: Production-ready (Stedi eligibility API works well)
- Step 6: Production-ready (Vercel Blob + DB)

**Build order for Clinivise**:
- Sprint 2C: Steps 1 (image upload), 4 (manual form), 6 (storage) — manual entry with card image attachment
- Later sprint: Steps 2-3 (OCR extraction + payer matching) — AI pre-fill behind a feature flag
- Phase 2: Step 5 (eligibility verification via Stedi)

---

## 3. Frontier Patterns — Production-Proven vs Experimental

### Production-Proven (Build Now)

**Insurance card image capture via browser camera API**
The HTML5 `<input type="file" accept="image/*" capture="environment">` attribute opens the device camera directly on mobile/tablet. Jane App, CERTIFY Health, and athenahealth all use this pattern. Zero additional dependencies.

**"Pending Verification" status workflow**
Insurance records have a verification status: `unverified` (just entered/OCR'd), `verified` (staff confirmed), `failed` (eligibility check failed). Jane App's "Awaiting Review" queue is the reference implementation. Prevents billing on unverified insurance.

**Payer search with autocomplete**
Instead of a static dropdown of payers, use a searchable combobox backed by the Stedi payer list or the practice's own payer table. Users type "Blue Cross" and see matching payers with their Stedi payer IDs. Athenahealth and most modern PM tools do this.

**Visual priority indicators**
Primary/Secondary/Tertiary insurance shown with clear visual hierarchy: numbered badges, color-coded borders, or positional ordering. Most PM tools use a simple numbered label. The fintech pattern of "default card" indicator transfers well.

**Subscriber relationship handling (critical for ABA)**
ABA patients are almost always minors. The subscriber (policy holder) is typically a parent/guardian. The form must handle:
- `relationshipToSubscriber`: self, spouse, child, other
- When "child" is selected: show subscriber name, DOB, gender fields
- Pre-fill subscriber info from client contacts (if a parent/guardian contact exists)
- This is already modeled in the `client_insurance` schema — the UX just needs to make it smooth

### Experimental (Design For, Build Later)

**OCR-to-form pre-fill with confidence indicators**
Upload card image -> OCR extracts fields -> form pre-fills with green/amber/red confidence badges per field. Athenahealth does this at enterprise scale. For Clinivise, this requires an OCR API subscription and the confidence-based UI pattern from the AI architecture (already planned for auth letter parsing in Sprint 4B).

**Drag-and-drop priority reordering**
Let staff drag insurance cards to reorder primary/secondary/tertiary priority. Fintech apps (Ramp) use drag-to-reorder for card management. For Clinivise, this is a nice-to-have — most ABA clients have 1-2 policies, and a simple "Set as Primary" button suffices.

**Coverage timeline visualization**
Show insurance effective dates on a timeline/gantt view to visualize overlapping coverage periods. Useful when a client transitions between payers (common during Medicaid redetermination). This is a Phase 2 analytics feature — not needed for CRUD.

**Predictive coverage alerts**
AI flags patients at risk of losing coverage before appointments. Requires historical data and payer behavior patterns. Not viable until Clinivise has significant user data.

**Automated insurance discovery**
Services like Approved Admissions offer "Insurance Coverage Discovery" — given a patient name and DOB, find all active insurance policies. Powerful for intake but requires third-party API integration and careful PHI handling.

---

## 4. Recommended UX Approach for Clinivise

### Persona-Specific Design

**Intake Coordinator (tablet, standing, at front desk)**
- Large touch targets (44px minimum), chunky form elements
- Camera capture button prominently placed — "Scan Insurance Card" is the primary action
- Quick-add flow: photo -> minimal required fields (payer, member ID) -> save as unverified
- Pre-fill subscriber from client's contacts (auto-detect parent/guardian)

**Billing Staff (desktop, sitting, processing 20+ clients/day)**
- Keyboard-navigable form (Tab through fields, Enter to save)
- Batch verification workflow — see all unverified insurance across clients
- Side-by-side view: card image on left, form fields on right
- Quick-verify button that validates and marks as verified in one action

**BCBA (desktop or tablet, reviewing client info)**
- Read-only insurance summary on client detail page
- See active coverage at a glance — payer name, member ID, status badge
- Link to authorizations tied to each insurance policy
- No need to edit insurance directly (permission-gated)

### Layout Recommendation

The Insurance tab within the client detail page should use a **card-based layout** (not a table):

```
+--------------------------------------------------+
| Insurance                          [Add Policy]  |
+--------------------------------------------------+
|                                                  |
| +----------------------------------------------+|
| | [1] PRIMARY          [Verified]  [Active]    ||
| | Blue Cross Blue Shield of MA                  ||
| | Member: XYZ123456    Group: GRP789            ||
| | Subscriber: Jane Doe (Mother)                 ||
| | Effective: 01/01/2026 - 12/31/2026            ||
| |                                                ||
| | [Card Images: Front | Back]                   ||
| |                              [Edit] [Verify]  ||
| +----------------------------------------------+|
|                                                  |
| +----------------------------------------------+|
| | [2] SECONDARY        [Unverified] [Active]   ||
| | MassHealth (Medicaid)                          ||
| | Member: MH98765      Group: —                  ||
| | Subscriber: Self                               ||
| | Effective: 03/01/2026 - ongoing                ||
| |                                                ||
| | [Card Images: Not uploaded]                    ||
| |                              [Edit] [Upload]  ||
| +----------------------------------------------+|
|                                                  |
+--------------------------------------------------+
```

### Status Badge System

| Status | Color | Badge Variant | Meaning |
|--------|-------|---------------|---------|
| Active + Verified | Emerald | `default` with emerald | Coverage confirmed, ready to bill |
| Active + Unverified | Amber | `outline` with amber | Entered but not yet verified by staff |
| Expired | Red | `outline` with red | Past termination date |
| Pending Verification | Blue | `secondary` | Eligibility check in progress (Phase 2) |

### Form Design

The add/edit insurance form should be a **dialog/sheet** (consistent with the contact form pattern already in the codebase):

**Required fields**: Payer (searchable select), Member ID
**Conditional fields**: Subscriber info (shown when relationship != "self")
**Optional fields**: Group number, effective date, termination date, card images
**Smart defaults**:
- Priority auto-increments (first policy = 1, second = 2)
- Relationship defaults to "child" (since ABA patients are almost always minors)
- Pre-fill subscriber name from client contacts if a legal guardian exists

---

## 5. Quick Wins vs Future Features

### Build Now (Sprint 2C)

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| Card-based insurance display (read) | S | High | Replace placeholder with policy cards |
| Add/edit insurance dialog form | M | High | Payer select + member ID + subscriber fields |
| Insurance CRUD server actions | M | High | Create, update, delete, reorder priority |
| Payer searchable select (from payers table) | S | High | Combobox backed by existing payers table |
| Subscriber auto-fill from contacts | S | Medium | If legal guardian contact exists, pre-fill subscriber fields |
| Insurance status badges | S | Medium | Active/expired based on dates, verified/unverified status |
| Card image upload (file input) | S | Medium | Simple file upload attached to insurance record via documents table |
| Priority management (set as primary) | S | Medium | Button to swap priority, not drag-and-drop |
| Verification status field | S | Medium | Add `verification_status` column to `client_insurance` |

### Build Soon (Sprint 2C+ or Sprint 4)

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| Payer management page (settings) | M | High | CRUD for practice's payer list |
| Card image viewer (side-by-side with form) | S | Medium | Show uploaded card images in a lightbox |
| Browser camera capture | S | Medium | `<input capture="environment">` for tablet intake |
| Batch verification queue | M | Medium | Dashboard widget showing all unverified insurance |

### Build Later (Phase 2)

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| OCR card extraction (Mindee/Veryfi) | M | High | API integration + confidence-based pre-fill UI |
| Real-time eligibility check (Stedi 270/271) | L | Very High | Core billing prerequisite |
| Stedi payer directory integration | M | High | Replace local payer table with Stedi payer search |
| Coverage timeline visualization | M | Low | Visual date ranges for overlapping coverage |
| Automated insurance discovery | L | Medium | Third-party API, PHI handling complexity |
| Predictive coverage alerts | L | Low | Requires historical data |

---

## 6. Visual Design Patterns Worth Stealing

### Insurance Card as UI Element
Represent each insurance policy as a visual "card" that loosely resembles a physical insurance card. This creates immediate recognition and reduces cognitive load. The card should show:
- Payer logo/name prominently at top (like the insurer branding on a physical card)
- Priority badge in top-right corner (numbered circle: 1, 2, 3)
- Key identifiers in a consistent grid: Member ID, Group #
- Subscriber info in a secondary row
- Date range at bottom
- Status badges (active/expired, verified/unverified) using the Clinivise status color system (emerald/amber/red/blue)

### Status Color System (from design-system.md)
- **Emerald**: Active + Verified (ready to bill)
- **Amber**: Unverified or expiring soon (needs attention)
- **Red**: Expired or failed verification (cannot bill)
- **Blue**: Pending (eligibility check in progress)

### Empty State
When no insurance is on file:
- Shield/insurance icon in muted background
- "No insurance on file" message
- "Add Insurance" CTA button
- Secondary text: "Upload an insurance card or enter policy details manually"

### Card Image Thumbnail
Show a small thumbnail of the uploaded insurance card image on the policy card. Clicking opens a lightbox/modal with the full-size image. This lets billing staff quickly reference the physical card while verifying data.

### Priority Indicator
Use a small numbered circle badge (1, 2, 3) in the top-left or top-right of each insurance card. Primary = filled circle with "1", secondary = outlined circle with "2". This is more immediately scannable than text labels like "Primary" / "Secondary".

### Coordination of Benefits Visual
When multiple policies exist, show a subtle connecting line or shared border between cards to indicate they work together. A small "COB" indicator on the secondary policy helps billing staff understand the billing sequence.

---

## Key Takeaways

1. **The schema is already well-designed** — `client_insurance` has the right fields (priority, subscriber info, dates). The main addition needed is a `verification_status` column.

2. **Card-based layout > table** for insurance policies. ABA clients have 1-3 policies. Cards are scannable, touch-friendly, and visually richer.

3. **"Subscriber is the parent" is the default path** in ABA. The form should optimize for `relationship = child` and make subscriber entry frictionless by pre-filling from contacts.

4. **Image upload now, OCR later** is the right sequencing. The browser camera API works today with zero dependencies. OCR extraction can be layered on as an enhancement.

5. **Verification status is a force multiplier** — it prevents billing on unverified data, creates a natural workflow for billing staff, and sets up the pipeline for automated eligibility checks in Phase 2.

6. **Stedi is the right payer data source** — already in the tech stack, 3,400+ payers, and the payer IDs flow directly into eligibility checks and claims submission. Building payer search against Stedi's directory (or syncing to the local payers table) avoids maintaining a separate payer database.

---

## Sources

- [Jane App — Collect Insurance on Intake Forms](https://jane.app/guide/collect-insurance-information-on-intake-forms-from-your-clients)
- [athenahealth — AI OCR for Insurance Verification](https://www.athenahealth.com/resources/blog/ai-ocr-and-insurance-verification-improve-accuracy)
- [CERTIFY Health — Insurance Capture Software](https://www.certifyhealth.com/patient-experience-platform/intake/insurance-capture/)
- [Veryfi — Health Insurance Cards OCR API](https://www.veryfi.com/health-insurance-cards-ocr-api/)
- [Mindee — US Health Insurance Cards OCR API](https://www.mindee.com/product/us-health-insurance-cards-ocr-api)
- [Microsoft Azure — Health Insurance Card Processing](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/health-insurance-card?view=doc-intel-4.0.0)
- [Orbit Healthcare — Insurance Card AI](https://orbithc.com/insurance-card-ai.html)
- [Stedi — Eligibility Checks API](https://www.stedi.com/eligibility-checks)
- [Stedi — Developer Docs](https://www.stedi.com/docs/healthcare)
- [CentralReach — Software Reviews](https://www.softwareadvice.com/medical/centralreach-profile/)
- [DoctorConnect — Best AI Insurance Verification 2026](https://doctorconnect.net/best-ai-insurance-verification-2026/)
- [DoctorConnect — Benefits & Eligibility Automation 2026](https://doctorconnect.net/benefits-eligibility-automation-top-healthcare-tools-2026/)
- [Harper — AI Insurance Brokerage (YC W25)](https://techcrunch.com/2026/02/25/ai-insurance-brokerage-harper-raises-45m-series-a-and-seed/)
- [Carbon Design System — Status Indicator Pattern](https://carbondesignsystem.com/patterns/status-indicator-pattern/)
- [Toptal — Medical Billing UX Case Study](https://www.toptal.com/designers/healthcare/medical-billing-ux)
- [G & Co. — Insurance UX Design Trends 2025](https://www.g-co.agency/insights/insurance-ux-design-trends-industry-analysis)
- [PatternFly — Inline Edit Design Guidelines](https://www.patternfly.org/components/inline-edit/design-guidelines/)
- [Eleken — Healthcare UI Design 2026](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [Eleken — Card UI Design Examples](https://www.eleken.co/blog-posts/card-ui-examples-and-best-practices-for-product-owners)
- [pVerify — Realtime Insurance Eligibility Verification](https://pverify.com/)
- [Approved Admissions — Eligibility API](https://approvedadmissions.com/eligibility-api/)
- [SPRY — Insurance Verification Software](https://www.sprypt.com/blog/top-9-insurance-verification-software)
- [AllHealthTech — YC F25 Healthtech Startups](https://allhealthtech.com/y-combinators-fall-2025-yc-f25/)
