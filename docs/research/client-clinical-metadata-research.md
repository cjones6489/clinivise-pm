# Client Clinical Metadata Research: Structured Fields on ABA Learner Profiles

> Research into how ABA practice management platforms handle structured clinical metadata beyond demographics and diagnosis on client/learner profiles.
> Research date: 2026-03-27

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Platform-by-Platform Analysis](#2-platform-by-platform-analysis)
3. [ABA Intake Form Standards](#3-aba-intake-form-standards)
4. [BACB & Compliance Requirements](#4-bacb--compliance-requirements)
5. [Cross-Platform Comparison Table](#5-cross-platform-comparison-table)
6. [Industry Patterns & Key Insights](#6-industry-patterns--key-insights)
7. [Recommended Field Set for Clinivise](#7-recommended-field-set-for-clinivise)
8. [Implementation Strategy](#8-implementation-strategy)
9. [Sources](#9-sources)

---

## 1. Executive Summary

**The gap between what ABA intake forms collect and what PM software stores as structured data is enormous.** Every ABA practice collects detailed clinical metadata at intake (allergies, medications, safety concerns, communication methods, reinforcer preferences, sensory sensitivities, elopement risk, dietary restrictions, toileting status, sleep issues). But most PM platforms store this data in one of three ways:

1. **Free-text notes fields** (AlohaABA, TherapyPM) — information is captured but unsearchable, non-alertable, and invisible to providers at point of care
2. **Custom metadata fields** (CentralReach, Noteable) — practice-configurable key-value pairs attached to profiles, more structured but requiring setup by each practice
3. **Separate clinical tools** (Motivity, Catalyst/Rethink) — clinical platforms store profile data in their own systems, requiring integration with the PM tool

**No platform in our competitive tier offers a thoughtfully designed, ABA-specific structured clinical metadata section on the client profile.** This is a genuine differentiation opportunity.

**Key finding:** The most critical clinical metadata for ABA practices falls into 4 categories:
- **Safety-critical** (allergies, elopement risk, self-injurious behavior, medical conditions requiring monitoring) — must be prominently displayed and alertable
- **Session-essential** (communication method, reinforcer preferences, sensory sensitivities) — needed by every RBT before/during every session
- **Medical background** (medications, medical conditions, hospitalizations, seizure history) — needed by BCBAs for treatment planning and by billing for medical necessity
- **Daily living context** (toileting status, dietary restrictions, sleep patterns, food selectivity) — needed by RBTs for in-session care and parent communication

---

## 2. Platform-by-Platform Analysis

### 2a. AlohaABA (PM-focused, mid-market)

**Client profile structure:**
- Demographics tab with standard fields (name, DOB, gender, address, contact)
- Insurance tab with payer/subscriber information
- Authorization management with real-time utilization
- Contacts/guardians section
- General notes field (free text)

**Clinical metadata approach:** AlohaABA stores "client intake data including demographics, medical history, treatment plans" but the clinical metadata beyond demographics lives primarily in free-text fields and customizable data forms. The platform is "fully customizable — you can configure fields, authorizations, employee permissions, and teams." There is evidence of a custom fields capability (a "CTDS Arizona" custom field was mentioned in release notes), suggesting practice-configurable fields exist but are not heavily documented.

**What's NOT structured:**
- No dedicated allergies/medications fields visible in public documentation
- No safety alert banners on client profiles
- No structured reinforcer or communication fields
- Clinical detail appears to rely on the integration with Motivity for clinical data collection

**Key insight:** AlohaABA is PM-first. Clinical profile data is offloaded to data collection partners (Motivity). The "custom notes or inputs section" for allergies/medications that the user mentioned likely refers to either free-text notes or practice-configured custom fields — not built-in structured clinical metadata.

### 2b. Passage Health (Modern PM + AI)

**Client profile structure:**
- Centralized client data storage: demographics, insurance, medical history, treatment plans
- HIPAA-compliant intake forms

**Clinical metadata approach:** Passage Health's intake process recommends capturing: medical and developmental history (health milestones, medications, allergies), behavioral history (behaviors, triggers, strategies tried), diagnosis verification, and special accommodations (language preference, accessibility needs). Their platform "stores all client intake data including demographics, insurance, medical history, and treatment plans in one HIPAA-compliant location."

**What's notable:**
- Explicit mention of "special accommodations" as an intake category (language preference, accessibility needs)
- Frontera AI integration for clinical intelligence suggests clinical data is structured enough for AI processing
- Mobile app with real-time data collection and auto-syncing

**Key insight:** Passage Health captures more clinical context than pure PM tools but specifics on structured vs. free-text storage are not publicly documented.

### 2c. Theralytics (ABA PM, startup-friendly)

**Client profile structure:**
- Profile/Demographics tab
- Data Collection with multiple methods
- Session Notes with AI-powered narratives
- Progress Tracking with interactive graphs
- Scheduling and Billing tabs

**Clinical metadata approach:** Theralytics allows building "detailed client profiles that outline treatment plans, target goals, and specific behaviors." The platform offers customizable curriculum libraries, flexible data collection (NET, DTT, interval, duration), and customizable workflows. However, no public documentation details structured clinical metadata fields (allergies, medications, etc.) on the client profile itself.

**Key insight:** Theralytics is more clinically capable than AlohaABA but still appears to treat clinical metadata as part of the data collection/treatment plan workflow rather than as structured profile fields.

### 2d. TherapyPM (Simplified PM)

**Client profile structure:**
- Client notes with customizable templates
- Quick entry for documentation
- Family portal with multi-child support

**Clinical metadata approach:** TherapyPM offers "customizable templates and quick entry" for client notes. Pre-built ABA SOAP note templates can be customized per workflow. The platform focuses on documentation compliance rather than structured profile metadata.

**Key insight:** TherapyPM is the simplest platform in this tier. No evidence of structured clinical metadata fields — everything appears to flow through templates and notes.

### 2e. Motivity (Clinical-focused data collection)

**Learner profile structure (from help documentation):**
- **Identity fields:** Preferred name, prefix, first, middle, last, suffix, Learner ID, Learner ID Secondary, learner type
- **Clinical & diagnostic:** Diagnosis Code (dropdown), Additional Diagnosis Information (text), Initial Diagnosis Provider, Date of Initial Assessment, Treatment Start Date
- **Demographics:** Gender, Date of Birth, SSN, Client Code
- **Insurance:** Policy Number, Group Number, Member Number, Payors
- **Clinical management:** Authorized Case Supervisor, Background section, Notes section (supports links to behavior plans and external resources)
- **Contacts:** Parent/Guardian details (name, DOB, gender, relationship, phone, email, mailing address)

**Clinical metadata approach:** Motivity uses an "imported fields" system where learner profile data can be pulled into session notes and reports. The profile includes a "Clinical Notes and Information" section that "can include information specific to the learner that others should have access to, including links to behavior plans or other relevant external files." This is essentially a rich-text notes field with link support — not structured clinical metadata.

**What's NOT structured:**
- No dedicated allergy/medication fields in the documented profile
- No safety alert mechanism
- No structured reinforcer preferences or communication method fields
- Clinical context appears to live in the notes/background free-text fields

**Key insight:** Even Motivity — the most clinical-focused platform in this comparison — does not have structured clinical metadata fields for allergies, medications, safety concerns, or ABA-specific clinical context. Everything beyond diagnosis codes and demographics goes into free-text fields.

### 2f. CentralReach (Market leader, enterprise)

**Client profile structure:**
- Contact sidebar with summary information
- Profile tab: account info, office locations, credentials, billing
- Notes & Forms: clinical documents
- Authorizations: utilization tracking
- Files/Documents: uploaded records
- Team: connected contacts
- Billing: invoices, timesheets
- Schedule: appointments
- Insurance: overview, subscriber, patient tabs

**Clinical metadata approach — Custom Metadata System:**
CentralReach has the most sophisticated approach: a configurable **metadata system** where organizations can:
1. Create custom metadata fields with defined answer types
2. Attach metadata fields to client (learner) and provider profiles
3. Pull metadata into session note templates via the "Meta Data" tab in Configure Fields
4. Use dynamic fields to auto-fill information in forms

The metadata creation process:
- Select a Contact Type (Client, Provider, etc.)
- Name the field
- Choose a "Type of Answer" from a dropdown (types include text, dropdown, date, checkbox, and number based on standard EHR patterns — exact list not publicly documented)
- Answer types cannot be changed after creation

Metadata appears in:
- The client profile card
- The Learner Information section of session note templates
- Can be configured per template using the "Configure Fields" button

**What's notable:**
- This is the ONLY platform with a documented custom fields system for client profiles
- But it requires each practice to configure their own fields — no pre-built clinical metadata
- Common use: practices create metadata for allergies, school information, diagnosis details
- The system is generic (not ABA-specific) — a practice must know what to set up

**Key insight:** CentralReach solves the problem with maximum flexibility (custom metadata) but minimum guidance. A practice using CentralReach CAN track allergies, medications, safety concerns — but only if an admin knows to create those fields. Many practices don't, and the data ends up in free-text notes instead.

### 2g. Raven Health (AI-powered, BCBA-founded)

**Client profile structure:**
- Client intake with automated information collection
- Customizable session templates
- Custom treatment plans
- Mobile-first data collection

**Clinical metadata approach:** Raven's intake process "automates the collection of essential information and details about new client learners" so clinicians "gain an understanding of their client learners before even meeting them, allowing clinicians to grasp the needs, preferences, and specific requirements of each individual." This language suggests structured intake data, but specific fields are not publicly documented.

**Key insight:** Raven Health's marketing emphasizes pre-session client understanding, which implies structured clinical context. As a BCBA-founded platform, they likely have more clinical awareness in their profile design — but details are not accessible without a demo.

### 2h. Hi Rasmus (Clinical platform for behavioral health)

**Client profile structure:**
- Learner profiles with clinical data
- Program data fields (enhanced in 2025)
- Assessment protocols (ABLLS-R, AFLS)
- Custom staff information fields

**Clinical metadata approach:** Hi Rasmus added "custom staff information fields" and improved "program data fields" in 2025. The platform supports standardized assessment protocols (ABLLS-R, AFLS) directly. Manual assessment entry gives clinicians flexibility to enter historical data and customize assessment details by client.

**Key insight:** Hi Rasmus focuses customization on the program/assessment level rather than the demographic profile level. Clinical metadata appears to live in the treatment program context rather than on a centralized client profile.

### 2i. Noteable (ABA + Community Mental Health)

**Client profile structure:**
- Client documentation with customizable report templates
- Secure portal with customizable intake forms
- Time-based tracking of client medications, insurance, funding, home situation, diagnosis, and treatment goals

**Clinical metadata approach:** Noteable stands out with an explicit mention of **"time-based tracking of client medications, insurance, funding, home situation, diagnosis and treatment goals."** This suggests structured, versioned clinical metadata — not just free-text notes. The platform also offers "8 collector types" for data collection and "advanced analysis tools."

**Key insight:** Noteable's "time-based tracking" of medications and diagnoses is the most sophisticated approach found in this research. This implies structured records with effective dates (medication started/stopped, diagnosis added/changed), which is closer to a proper EHR model than any other platform in this tier.

### 2j. Hipp Health (AI-powered, "practice on autopilot")

**Client profile structure:**
- Patient data accessible via chat interface
- Analytics dashboard with customizable charts
- Treatment plans with embedded patient analytics
- Live session monitoring

**Clinical metadata approach:** Hipp Health provides "all of your patient data at your fingertips via chat" — suggesting an AI layer over clinical data. They track "patient skill acquisition goals and overtime development with advanced analytics and AI insights." Specific profile fields for medical/clinical metadata are not publicly documented.

**Key insight:** Hipp's AI-first approach may abstract away the need for discrete structured fields — the system may use natural language processing to surface relevant clinical context. This is a fundamentally different paradigm from traditional field-based profiles.

---

## 3. ABA Intake Form Standards

Real ABA intake forms (analyzed from University of Washington Autism Center, Compass Center Inc., ABA Therapy for Kids, Kind Behavioral Health, and multiple practice templates) consistently capture structured clinical data across these categories:

### 3a. Medical History (Universal — collected by every practice)

| Field | Format | Notes |
|-------|--------|-------|
| Current medications | List (name, dosage, frequency) | Required for safety; affects behavior |
| Medication allergies | List | Critical safety — can cause adverse reactions |
| Food allergies | List | Critical for edible reinforcers, meal/snack time |
| Other allergies (environmental, etc.) | List | Affects session environment |
| Medical conditions/diagnoses | List with dates | Beyond ASD — comorbidities (seizures, GI, anxiety) |
| Hospitalizations | List with dates | Medical context |
| Surgeries | List with dates | Medical context |
| Seizure history | Yes/No + details | Critical safety — affects session protocols |
| Vision/hearing concerns | Yes/No + details | Affects data collection and instruction |
| Current therapies (OT, Speech, PT) | List | Coordination of care |
| Primary care provider | Name + phone | Required for referral/coordination |
| Family medical/behavioral history | Free text | Treatment planning context |

### 3b. Safety & Behavioral Concerns (Universal — critical for session delivery)

| Field | Format | Notes |
|-------|--------|-------|
| Elopement/bolting/wandering risk | Yes/No + severity + details | **Safety-critical** — requires protocols |
| Self-injurious behavior (SIB) | Checklist (self-biting, head-banging, scratching, self-hitting) + severity | **Safety-critical** — requires monitoring |
| Physical aggression | Checklist (hitting, biting, pinching, kicking) + severity | **Safety-critical** — affects staffing |
| Property destruction | Yes/No + details | Session environment concern |
| PICA (eating inedible items) | Yes/No + details | **Safety-critical** — constant monitoring |
| Danger to self or others | Yes/No/Sometimes | Overall safety assessment |
| Overpowering strength | Yes/No/Unsure | Affects staffing decisions |
| Reaction to new people | Free text | First-session preparation |

### 3c. Communication Profile (ABA-specific — essential for every session)

| Field | Format | Notes |
|-------|--------|-------|
| Primary communication method | Dropdown (vocal/verbal, sign language, PECS, AAC device, gestures, combination, none) | Determines instruction modality |
| Speech ability level | Dropdown (full sentences, phrases, single words, manual signs, gestures, none) | Baseline for goals |
| Follows simple directions | Checklist (come here, hands down, stand up, get object) | Baseline receptive language |
| Eye contact | Dropdown (none, spontaneous, on request) | Baseline engagement |
| Primary language | Text | May need interpreter |
| Interpreter needed | Yes/No | Scheduling consideration |

### 3d. Reinforcer Preferences (ABA-specific — drives session effectiveness)

| Field | Format | Notes |
|-------|--------|-------|
| Preferred activities | List | Used during session breaks and as reinforcement |
| Preferred food/edibles | List | Edible reinforcers (must cross-reference food allergies) |
| Preferred toys/items | List | Tangible reinforcers |
| Sensory preferences | Checklist/text (visual, auditory, tactile, vestibular) | Sensory reinforcers |
| Social reinforcers | Text (praise types, physical affection comfort level) | Social reinforcement strategy |
| Known aversions | Text | What to avoid |

### 3e. Daily Living Skills (Context for treatment planning and in-session care)

| Field | Format | Notes |
|-------|--------|-------|
| Toileting status | Dropdown (diapers full-time, diapers + bathroom access, urine trained, bowel trained, night trained, fully independent) | Session logistics |
| Dressing ability | Dropdown (needs full help, attempts to help, partial independence, independent) | Self-care goal context |
| Feeding/eating | Utensil use level, food preferences, food selectivity, food aversions | Meal/snack management |
| Sleep patterns | Typical bedtime, wake time, sleep difficulties | Affects session behavior |
| Bathing/hygiene | Independence level | Self-care goal context |
| Hand dominance | Right/Left/Ambidextrous | Fine motor context |

### 3f. Sensory Profile (ABA-specific — affects environment and instruction)

| Field | Format | Notes |
|-------|--------|-------|
| Hypersensitivities | Checklist (sounds, light, touch, textures, smells) | Environmental modifications |
| Hyposensitivities | Checklist (sounds, light, touch, textures, smells) | Sensory seeking behaviors |
| Self-stimulatory behaviors | Checklist (finger play, rocking, spinning, vocalizations, sniffing/smelling) | Baseline stereotypy |

### 3g. Educational Context

| Field | Format | Notes |
|-------|--------|-------|
| Current school/program | Name + contact | Coordination |
| Grade level | Text | Context |
| IEP status | Yes/No + dates | Service coordination |
| 504 plan | Yes/No | Accommodations |
| School schedule | Days + times | Session scheduling |
| School services | Checklist (Speech, OT, 1:1 support, Adaptive PE) | Coordination |

---

## 4. BACB & Compliance Requirements

### 4a. BACB Ethics Code (Section 2.12) — Record-Keeping

BACB requires behavior analysts to maintain records that include:
- Evidence of assessment and diagnosis
- Ongoing plan of care
- Progress notes from sessions
- Medical and behavioral health background

The BACB does not prescribe specific structured profile fields beyond what's needed for the assessment and treatment plan. However, **best practice guidance** (from BACB-aligned training programs and ABA clinical standards) recommends capturing medical history, medications, allergies, and safety concerns as part of the client record.

### 4b. Medicaid Documentation Requirements

State Medicaid programs require:
- **Demographics:** Full name, birth date, member ID, insurance details
- **Clinical:** ICD-10 diagnosis codes, DSM-5-TR documentation
- **Medical necessity:** Treatment plan with goals, expected outcomes
- **Session documentation:** Date, time, location, provider credentials, interventions, client response, progress

Medicaid does NOT typically require structured allergy/medication fields in the PM system — but does require that the provider has access to relevant medical history for safe treatment delivery.

### 4c. EHR Best Practices for Safety Data

Research from AAAAI and AHRQ on allergy documentation in EHRs found:
- Allergy information is commonly entered as free text, which **does not trigger safety alerts**
- Structured/coded allergy entries are critical for clinical decision support
- Best practice recommends: allergen identification, clinical description of reaction, approximate date, and status (confirmed/suspected)
- Free-text allergy entries are "often inaccurate and/or incomplete and are infrequently reviewed and/or updated"

**Implication for Clinivise:** If we store allergies as free text, they're effectively invisible to the system. Structured allergy data enables:
- Alert banners when selecting edible reinforcers
- Safety warnings at session start
- Automated inclusion in treatment plan documents

---

## 5. Cross-Platform Comparison Table

| Feature | AlohaABA | Passage | Theralytics | TherapyPM | Motivity | CentralReach | Raven | Hi Rasmus | Noteable | Hipp |
|---------|----------|---------|-------------|-----------|----------|-------------|-------|-----------|----------|------|
| **Structured allergies** | No | Unknown | No | No | No | Via metadata | Unknown | No | Unknown | Unknown |
| **Structured medications** | No | Unknown | No | No | No | Via metadata | Unknown | No | Time-based | Unknown |
| **Safety alerts/banners** | No | No | No | No | No | No | Unknown | No | No | No |
| **Communication method** | No | Unknown | No | No | No | Via metadata | Unknown | No | Unknown | Unknown |
| **Reinforcer preferences** | No | No | No | No | No | Via metadata | Unknown | No | Unknown | Unknown |
| **Custom fields system** | Limited | Unknown | Limited | No | No | **Yes (metadata)** | Unknown | Staff only | **Yes (intake forms)** | No |
| **Elopement risk flag** | No | No | No | No | No | Via metadata | Unknown | No | Unknown | No |
| **Sensory profile** | No | No | No | No | No | Via metadata | Unknown | No | Unknown | No |
| **Toileting status** | No | No | No | No | No | Via metadata | Unknown | No | Unknown | No |
| **Dietary restrictions** | No | No | No | No | No | Via metadata | Unknown | No | Unknown | No |

**Legend:** "Via metadata" = possible if the practice configures it manually. "Unknown" = not publicly documented; would require demo access. "No" = confirmed absent from public documentation and feature lists.

---

## 6. Industry Patterns & Key Insights

### Pattern 1: The PM/Clinical Split

The ABA software market is split into PM tools (AlohaABA, TherapyPM, Passage) and clinical tools (Motivity, Catalyst, Hi Rasmus). PM tools handle demographics, insurance, authorizations, and billing. Clinical tools handle data collection, treatment plans, and progress tracking. **Neither side owns the clinical metadata layer** — the structured profile context that sits between demographics and treatment data.

This means that in most practices:
- Allergies are written on a sticky note on the client's physical folder
- Medications are in a PDF intake form uploaded to the file system
- Safety concerns are communicated verbally during staff meetings
- Reinforcer preferences are in the RBT's personal notes

### Pattern 2: CentralReach's Metadata Approach Has the Right Architecture but Wrong UX

CentralReach's configurable metadata system is technically capable of solving this problem — practices CAN create fields for allergies, medications, safety flags, etc. But it requires:
1. An admin who knows to set up these fields
2. Staff who know to fill them in
3. No pre-built templates or guidance for ABA-specific clinical metadata
4. No safety alert mechanism that surfaces critical data

**Clinivise opportunity:** Ship pre-built, ABA-specific clinical metadata sections with sensible defaults. Don't make practices reinvent the wheel.

### Pattern 3: No Platform Has Safety Alert Banners

None of the researched platforms display safety-critical information (allergies, elopement risk, SIB, seizures) as prominent alert banners on the client profile or at session start. This is standard in hospital EHRs (Epic, Cerner) but absent from ABA practice management.

**Clinivise opportunity:** Display safety flags as colored alert badges on the client header — visible on every tab, every page where the client's name appears.

### Pattern 4: Intake Forms Collect It, Software Doesn't Store It

Every ABA practice's intake form collects allergies, medications, safety concerns, communication method, reinforcers, and sensory profile. But this data goes into a PDF that gets uploaded and never referenced again. The PM software doesn't have structured fields for it, so it becomes a document, not data.

**Clinivise opportunity:** Make intake data first-class structured data in the system, not uploaded PDFs.

### Pattern 5: Noteable's Time-Based Tracking Is the Most Sophisticated Model

Noteable's explicit support for "time-based tracking of client medications, insurance, funding, home situation, diagnosis, and treatment goals" is the most EHR-like approach found. This means medications have start/stop dates, diagnoses have effective dates, and changes create a history — not an overwrite.

**Clinivise consideration:** For MVP, simple current-state fields are sufficient. Time-based tracking (medication history, diagnosis history) is a Phase 3+ enhancement.

---

## 7. Recommended Field Set for Clinivise

Organized by category with priority levels for implementation.

### Category A: Safety-Critical (Display as alert badges on client header)

These fields should be prominently displayed wherever the client appears — on the client detail page header, in the session logging form, and in any context where a provider interacts with client data.

| Field | Type | Display | Rationale |
|-------|------|---------|-----------|
| **Allergies** | Structured list (allergy name, type: food/medication/environmental, severity: mild/moderate/severe, reaction description) | Red alert badge if any exist; count shown | Safety: affects reinforcer selection, medication interactions, environment |
| **Elopement risk** | Boolean + severity (none/low/moderate/high) + protocol notes | Orange/red alert badge if moderate/high | Safety: affects session location, staffing, door security |
| **Self-injurious behavior** | Boolean + types (checklist) + severity + protocol notes | Orange/red alert badge if present | Safety: affects protective equipment, monitoring level |
| **Seizure disorder** | Boolean + type + frequency + protocol notes | Red alert badge if present | Safety: requires seizure protocol, affects session planning |
| **Aggressive behavior** | Boolean + types (checklist) + severity + protocol notes | Orange alert badge if moderate/high | Safety: affects staffing ratios, session environment |
| **PICA** | Boolean + details | Red alert badge if present | Safety: requires constant monitoring of environment |
| **Other medical alerts** | Free text for anything not covered above | Yellow alert badge if populated | Catch-all for unusual conditions |

### Category B: Session-Essential (Shown in a "Clinical Quick View" section)

This information should be easily accessible before and during every session — ideally visible in a collapsed card on the client Overview tab and expandable on demand.

| Field | Type | Rationale |
|-------|------|-----------|
| **Primary communication method** | Dropdown (vocal speech, sign language, PECS, AAC device, gestures, combination, nonverbal/pre-verbal) | Every RBT needs to know how this client communicates |
| **Speech/language level** | Dropdown (full sentences, phrases, single words, signs only, gestures only, no functional communication) | Baseline context for every session |
| **Reinforcer preferences** | Structured list with categories (edible, tangible, social, sensory, activity) and items per category | Core to ABA session delivery |
| **Known aversions** | Free text list | What to avoid in sessions |
| **Sensory sensitivities** | Checkboxes (hypersensitive to: sounds, light, touch, textures, smells) + (hyposensitive to: sounds, light, touch, textures, smells) + notes | Environmental modifications for sessions |
| **Toileting status** | Dropdown (diapers, diapers + bathroom access, daytime trained, fully trained) | Session logistics for RBTs |
| **Dietary restrictions** | Free text list | Relevant when edible reinforcers are used or during meal/snack times |

### Category C: Medical Background (Shown in a "Medical Information" section)

This information is needed by BCBAs for treatment planning and by billing staff for medical necessity documentation. Not needed during every session but must be accessible.

| Field | Type | Rationale |
|-------|------|-----------|
| **Current medications** | Structured list (name, dosage, frequency, prescribing provider, start date) | Affects behavior; required for treatment planning |
| **Medical conditions** | Structured list (condition, status: active/resolved/managed, onset date) | Beyond diagnoses — comorbidities that affect treatment |
| **Hospitalizations** | List (reason, date, duration) | Medical history context |
| **Vision/hearing concerns** | Boolean + details per sense | Affects instruction and data collection methods |
| **Current other therapies** | List (type: OT/Speech/PT/counseling/other, provider, frequency) | Coordination of care |
| **Primary care provider** | Name + phone + fax | Required for referrals and coordination |
| **Family medical history** | Free text | Treatment planning context |

### Category D: Custom Fields (Practice-defined)

Allow practices to create their own structured fields for client profiles. This covers the long tail of practice-specific needs without us having to anticipate every possible field.

| Feature | Type | Rationale |
|---------|------|-----------|
| **Custom text fields** | Key-value (label + text value) | Catch-all for practice-specific needs (school district, insurance group, etc.) |
| **Custom dropdown fields** | Key-value (label + defined options) | Standardized practice-specific categories |
| **Custom boolean fields** | Key-value (label + yes/no) | Flags and indicators |
| **Custom date fields** | Key-value (label + date) | Date-tracked information |

Custom fields should be organization-scoped (defined by org admin, available on all client profiles in that org).

### Category E: Educational Context (Optional section, available but not required)

| Field | Type | Rationale |
|-------|------|-----------|
| **Current school/program** | Text | Session scheduling and coordination |
| **Grade level** | Text | Context |
| **IEP status** | Boolean + dates | Service coordination |
| **School contact** | Name + phone + email | Communication |
| **School schedule** | Text or structured | Session scheduling around school |

---

## 8. Implementation Strategy

### Phase 2 (Current — Clinical Foundation): Categories A + B

**Why A + B first:** Safety alerts and session-essential clinical context are the highest-value addition to the client profile. Every RBT and BCBA needs this data at point of care. This is where Clinivise can differentiate immediately.

**Data model approach:**

Option 1 — **Dedicated tables** (recommended for Categories A & B):
- `client_medical_alerts` table: allergy records, seizure info, PICA flag, other medical alerts
- `client_safety_profile` table: elopement risk, SIB details, aggression details, safety protocols
- `client_clinical_profile` table: communication method, speech level, toileting status, sensory profile, dietary restrictions
- `client_reinforcers` table: structured list with category, item, notes

Option 2 — **JSONB columns** on the clients table:
- Simpler schema but harder to query, validate, and alert on
- Appropriate for rarely-queried context (family history, educational details)

Option 3 — **Generic custom fields** (CentralReach approach):
- Maximum flexibility but requires practice configuration
- No pre-built ABA-specific fields
- Appropriate for Category D only

**Recommended hybrid:** Use dedicated columns/tables for Categories A-C (pre-built, ABA-specific, with validation) and a generic custom fields system for Category D (practice-configurable). This gives practices structured clinical data out of the box while supporting the long tail of practice-specific needs.

### Phase 3+: Categories C, D, E

**Category C** (medical background) can be added incrementally. Start with medications and medical conditions; add the rest as the treatment planning features mature.

**Category D** (custom fields) is a generic infrastructure feature that benefits the whole platform. Build it once, use it on clients, providers, and organization settings.

**Category E** (educational context) is low priority. Most practices track school information in notes or separate systems.

### UI Placement

Based on the research and Clinivise's existing tab structure:

1. **Client header/banner:** Safety alert badges (Category A) — always visible on every tab
2. **Overview tab — "Clinical Quick View" card:** Category B fields in a compact, scannable format
3. **New "Clinical" or "Medical" tab:** Full Category A details + Category C medical background
4. **Custom Fields section:** Either on the Overview tab or a dedicated section within the Clinical tab
5. **Educational context:** Optional section within the Overview tab or Clinical tab

---

## 9. Sources

### Platform Documentation
- [AlohaABA Features](https://alohaaba.com/features/practice-management)
- [AlohaABA Help Center](https://support.alohaaba.com/portal/en/kb/articles/client-portal)
- [CentralReach Client Profile](https://help.centralreach.com/manage-my-client-profile/)
- [CentralReach Creating Metadata](https://help.centralreach.com/creating-meta-data/)
- [CentralReach Add/Edit Metadata](https://help.centralreach.com/add-edit-meta-data/)
- [CentralReach Session Note Templates](https://help.centralreach.com/session-note-templates/)
- [Motivity Edit Learner Profile](https://help.motivity.net/edit-a-learner-profile)
- [Motivity AlohaABA Integration](https://help.motivity.net/manual-provisioning-of-learners-from-aloha-aba)
- [Raven Health Client Intake](https://ravenhealth.com/key-features-client-intake/)
- [Hi Rasmus 2025 Features](https://hirasmus.com/2025/12/24/hi-rasmus-year-end-wrapped-top-10-new-features-powering-modern-aba-practice-management/)
- [Hipp Health Patient Care Management](https://www.hipp.health/product/aba-streamline-patient-care-management)
- [Noteable ABA](https://mynoteable.com/aba)
- [Theralytics](https://www.theralytics.net/)
- [TherapyPM ABA](https://therapypms.com/aba-practice-management-software/)

### ABA Intake Form Templates & Standards
- [Carepatron ABA Intake Form Template](https://www.carepatron.com/templates/aba-intake-form)
- [Compass Center ABA Intake Form (Jotform)](https://form.jotform.com/232960446148864) — most detailed field inventory found
- [ABA Engine Intake Form Guide](https://abaengine.com/blog/a-guide-to-using-aba-intake-forms/)
- [Passage Health ABA Intake Process](https://www.passagehealth.com/blog/aba-intake-process)
- [Your Missing Piece ABA Intake Paperwork](https://yourmissingpiece.com/blog/what-should-be-included-in-the-aba-intake-paperwork/)
- [UW Autism Center ABA Intake Packet](https://depts.washington.edu/uwautism/wp-content/uploads/2018/04/1b.-IntakeForm_ABA1.pdf)
- [Kind Behavioral Health Intake Forms](https://kindbh.com/intake-forms/)

### Clinical Standards & Compliance
- [CentralReach ABA Medical Records](https://centralreach.com/blog/aba-medical-health-records/)
- [Praxis Notes BCBA Audit Checklist](https://www.praxisnotes.com/resources/bcba-audit-documentation-checklist)
- [Praxis Notes Essential EHR Features for ABA](https://www.praxisnotes.com/resources/essential-ehr-features-aba-compliance)
- [BACB Client Records Ownership](https://www.praxisnotes.com/resources/aba-client-records-ownership-guide)

### Reinforcer Assessment & Communication Methods
- [Relias Preference Assessments in ABA](https://www.relias.com/blog/preference-assessment-aba)
- [Intellistars Reinforcer Assessments](https://www.intellistarsaba.com/blog/how-to-use-reinforcer-assessments-to-enhance-aba-outcomes)
- [ASHA AAC Practice Portal](https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/)
- [Regis College PECS in ABA](https://online.regiscollege.edu/blog/online-regiscollege-edu-blog-what-is-picture-exchange-communication-system)

### EHR Safety Documentation Research
- [PMC: Patient Safety Risks in Allergy CDS](https://pmc.ncbi.nlm.nih.gov/articles/PMC9117784/)
- [AAAAI Position on EHR Allergy Alerts](https://pubmed.ncbi.nlm.nih.gov/39488769/)
- [AHRQ: Improving Allergy Documentation](https://digital.ahrq.gov/file/37751/download)

### Medicaid & Payer Requirements
- [NY Medicaid ABA Policy Manual](https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf)
- [Montana Medicaid ABA Services Manual](https://medicaidprovider.mt.gov/manuals/appliedbehavioranalysisservicesmanual)
- [Praxis Notes Medicaid ABA Documentation Guide](https://www.praxisnotes.com/resources/medicaid-aba-documentation-cuts-guide)

### Competitive Reviews
- [Passage Health AlohaABA Review](https://www.passagehealth.com/blog/aloha-aba-reviews)
- [Passage Health Top ABA PM Software](https://www.passagehealth.com/blog/aba-practice-management-software)
- [Software Advice AlohaABA](https://www.softwareadvice.com/medical/alohaaba-profile/)
