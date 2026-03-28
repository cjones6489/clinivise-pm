# Client Clinical Metadata Feature Spec

> The complete reference for structured clinical metadata on client profiles. Safety alerts, session-essential context, medical background, and the data model to support it all.

---

## What This Is

Every ABA practice collects detailed clinical metadata at intake: allergies, medications, safety concerns, communication methods, reinforcer preferences, sensory sensitivities, elopement risk, dietary restrictions, toileting status. This data is critical for safe session delivery.

**The problem:** In every competitor platform, this data goes into a free-text notes field or an uploaded PDF and is never referenced again. CentralReach is the only platform with a configurable metadata system, but it requires practices to set up every field from scratch — no pre-built ABA-specific fields.

**Our approach:** Ship pre-built, structured clinical metadata with sensible ABA defaults. Make intake data first-class data in the system, not buried PDFs.

---

## Competitive Context (Verified 2026-03-27)

> **Full research:** `docs/research/client-clinical-metadata-research.md`

| Feature | AlohaABA | Passage | Theralytics | TherapyPM | Motivity | CentralReach | Clinivise |
|---|---|---|---|---|---|---|---|
| Structured allergies | No | Unknown | No | No | No | Via custom metadata | **Planned** |
| Structured medications | No | Unknown | No | No | No | Via custom metadata | Phase 3 |
| Safety alert badges | No | No | No | No | No | No | **Planned** |
| Communication method | No | Unknown | No | No | No | Via custom metadata | **Planned** |
| Reinforcer preferences | No | No | No | No | No | Via custom metadata | **Planned** |
| Elopement risk flag | No | No | No | No | No | Via custom metadata | **Planned** |
| Sensory profile | No | No | No | No | No | Via custom metadata | **Planned** |
| Custom fields system | Limited | Unknown | Limited | No | No | Yes | Phase 3 |

**Key finding:** No platform in our tier offers structured clinical metadata out of the box. This is a genuine differentiation opportunity.

---

## Architecture

Clinical metadata appears in three places on the client detail page:

```
1. Client Header — Safety Alert Badges
   └── Red/amber badges for: allergies, elopement, seizures, PICA, SIB, aggression
   └── Visible on EVERY tab — never hidden

2. Overview Tab — Clinical Quick View Card
   └── Communication method, speech level, reinforcers
   └── Toileting status, dietary restrictions, sensory profile
   └── Compact, scannable format for RBTs before a session

3. Edit Tab — Clinical Metadata Section
   └── Full edit forms for safety alerts + session-essential fields
   └── Structured inputs (dropdowns, checklists, lists) not free text
```

---

## Data Model

### Approach: Columns on `clients` table + separate `client_allergies` table

Safety flags and clinical profile fields go directly on the `clients` table (simple, queryable, always loaded with the client). Allergies get their own table because they're a structured list with multiple attributes per entry. Reinforcers also get their own table for the same reason.

### New columns on `clients` table (14 columns)

**Safety flags:**
- `elopementRisk` — text: `'none' | 'low' | 'moderate' | 'high'`, default `'none'`
- `elopementProtocol` — text, nullable (protocol notes when risk > none)
- `seizureDisorder` — boolean, default false
- `seizureProtocol` — text, nullable (type, frequency, protocol)
- `pica` — boolean, default false
- `picaDetails` — text, nullable
- `sibRisk` — boolean, default false (self-injurious behavior)
- `aggressionRisk` — boolean, default false
- `medicalAlertNotes` — text, nullable (catch-all for other medical alerts)

**Session-essential:**
- `communicationMethod` — text: `'vocal_speech' | 'sign_language' | 'pecs' | 'aac_device' | 'gestures' | 'combination' | 'nonverbal'`, nullable
- `speechLevel` — text: `'full_sentences' | 'phrases' | 'single_words' | 'signs_only' | 'gestures_only' | 'no_functional_communication'`, nullable
- `toiletingStatus` — text: `'diapers' | 'diapers_and_bathroom' | 'daytime_trained' | 'fully_trained'`, nullable
- `dietaryRestrictions` — text, nullable
- `sensoryNotes` — text, nullable (free text for sensory profile summary)

### New `client_allergies` table (10 columns)

```
- id (text, PK, nanoid)
- organizationId (text, FK → organizations)
- clientId (text, FK → clients)
- allergyName (text, not null) — e.g., "Peanuts", "Amoxicillin"
- allergyType (text, not null) — 'food' | 'medication' | 'environmental' | 'other'
- severity (text, not null) — 'mild' | 'moderate' | 'severe'
- reaction (text, nullable) — description of reaction
- createdAt, updatedAt (timestamps)
```

Indexes: `[organizationId, clientId]`

### New `client_reinforcers` table (10 columns)

```
- id (text, PK, nanoid)
- organizationId (text, FK → organizations)
- clientId (text, FK → clients)
- category (text, not null) — 'edible' | 'tangible' | 'social' | 'sensory' | 'activity'
- item (text, not null) — e.g., "Goldfish crackers", "iPad time", "High fives"
- notes (text, nullable)
- sortOrder (integer, default 0)
- createdAt, updatedAt (timestamps)
```

Indexes: `[organizationId, clientId]`

### Why this approach (not JSONB, not custom fields)

- **Columns on clients:** Safety flags are queried for alert badges on every page load. Simple boolean/text columns are fast and indexable. No JSONB parsing overhead.
- **Separate tables for lists:** Allergies and reinforcers are structured lists with attributes per entry. A table with rows is cleaner than a JSONB array for CRUD operations, validation, and individual item management.
- **Not custom fields (yet):** Custom fields (CentralReach approach) require admin configuration. We want these fields to work out of the box for every practice. Custom fields are a Phase 3 enhancement for the long tail of practice-specific needs.

---

## UI Specification

### 1. Client Header — Safety Alert Badges

Safety flags render as compact colored badges in the client header, right-aligned next to the status badge. Visible on every tab.

```
+------------------------------------------------------------------+
| <- Clients                                                        |
| Thompson, Marcus                                                  |
| DOB: 03/15/2020 · Age 6 · F84.0: Autism Spectrum Disorder       |
| Guardian: Maria Thompson · Aetna (Member: AET-29481)             |
|                                                                    |
| [Active] [🔴 Allergies (2)] [🟠 Elopement] [🔴 Seizures]         |
|                                          [Log Session] [Edit]      |
+------------------------------------------------------------------+
```

**Badge rules:**
| Flag | Condition | Badge Color | Label |
|---|---|---|---|
| Allergies | `client_allergies` count > 0 | Red | "Allergies (N)" |
| Elopement | `elopementRisk` is `moderate` or `high` | Amber/Red | "Elopement" |
| Seizures | `seizureDisorder` is true | Red | "Seizures" |
| PICA | `pica` is true | Red | "PICA" |
| SIB | `sibRisk` is true | Amber | "SIB" |
| Aggression | `aggressionRisk` is true | Amber | "Aggression" |
| Medical alert | `medicalAlertNotes` is not empty | Amber | "Medical Alert" |

**Design:**
- Use `Badge` component with `destructive` variant (red) for life-threatening (allergies, seizures, PICA) and a custom amber variant for behavioral (elopement, SIB, aggression, medical alert).
- Badges render in a flex-wrap row so they don't overflow on narrow viewports.
- Clicking a badge scrolls to or opens the relevant detail section (deferred — not MVP).

### 2. Overview Tab — Clinical Quick View Card

A new section card on the Overview tab, placed between the Clinical Info/Insurance row and the Contacts/Care Team row.

```
+------------------------------------------------------------------+
| CLINICAL INFO              | INSURANCE                            |
| (existing)                 | (existing)                           |
+----------------------------+-------------------------------------+
| CLINICAL QUICK VIEW                                               |
| Communication: Vocal speech (phrases)                             |
| Reinforcers: Goldfish, iPad, bubbles, tickles      [Edit →]      |
| Toileting: Daytime trained                                        |
| Dietary: No peanuts (allergy), no red dye                        |
| Sensory: Hypersensitive to loud sounds, fluorescent light        |
+------------------------------------------------------------------+
| SAFETY ALERTS                                                     |
| 🔴 Allergies: Peanuts (severe — anaphylaxis), Amoxicillin (mod) |
| 🟠 Elopement: High risk — door alarms required, 1:1 at all times|
| 🔴 Seizures: Absence seizures, ~2/month, protocol on file       |
+------------------------------------------------------------------+
| CONTACTS                   | CARE TEAM                            |
| (existing)                 | (existing)                           |
+------------------------------------------------------------------+
```

**Clinical Quick View card:**
- Compact KV display (label: value on each line)
- Communication combines method + speech level on one line
- Reinforcers show as a comma-separated list (first 5 items, "+N more" if >5)
- "Edit →" link navigates to the Edit tab's clinical section
- If all fields are empty: show "No clinical info yet. Add details on the Edit tab →"

**Safety Alerts card:**
- Only renders if at least one safety flag is set
- Red icon for life-threatening, amber for behavioral
- Each alert shows: flag name, key details, protocol summary (truncated)
- Clicking opens full detail (deferred — just show inline for now)

### 3. Edit Tab — Clinical Metadata Section

New section on the Edit tab between the existing clinical info and address sections.

```
+------------------------------------------------------------------+
| SAFETY & MEDICAL ALERTS                                           |
|------------------------------------------------------------------|
| Allergies                                          [+ Add Allergy]|
| ┌──────────────────────────────────────────────────┐              |
| │ Peanuts · Food · Severe · Anaphylaxis    [Remove]│              |
| │ Amoxicillin · Medication · Moderate      [Remove]│              |
| └──────────────────────────────────────────────────┘              |
|                                                                    |
| Elopement Risk     [None v]  [Low v]  [Moderate v]  [High ●]     |
| Protocol: Door alarms required. 1:1 supervision at all times.    |
|           Never leave doors unlocked. Check windows.              |
|                                                                    |
| [x] Seizure disorder                                              |
| Protocol: Absence seizures, ~2/month. Turn on side, time it,    |
|           call 911 if >5 min. Parent: Maria (512) 555-0101       |
|                                                                    |
| [x] PICA  Details: Crayons, small plastic items                  |
| [ ] Self-injurious behavior                                       |
| [ ] Aggression risk                                               |
| Other medical alerts: ______________________________________      |
+------------------------------------------------------------------+
| SESSION CONTEXT                                                    |
|------------------------------------------------------------------|
| Communication method   [Vocal speech v]                           |
| Speech/language level  [Phrases v]                                |
| Toileting status       [Daytime trained v]                        |
| Dietary restrictions   [No peanuts, no red dye___]                |
| Sensory notes          [Hypersensitive to loud sounds_____]       |
|                                                                    |
| Reinforcers                                       [+ Add Item]    |
| ┌──────────────────────────────────────────────────┐              |
| │ 🍎 Edible: Goldfish, gummy bears                 [Edit][Remove]│
| │ 🎮 Tangible: iPad, bubbles, train set            [Edit][Remove]│
| │ 🤗 Social: High fives, "great job!"              [Edit][Remove]│
| │ 💫 Sensory: Tickles, spinning                    [Edit][Remove]│
| │ 🎯 Activity: Playground, coloring                [Edit][Remove]│
| └──────────────────────────────────────────────────┘              |
+------------------------------------------------------------------+
```

**Allergy add form (inline or dialog):**
- Fields: Name (text), Type (dropdown: food/medication/environmental/other), Severity (dropdown: mild/moderate/severe), Reaction (text, optional)
- Add button adds to the list immediately

**Reinforcer add form (inline or dialog):**
- Fields: Category (dropdown: edible/tangible/social/sensory/activity), Item (text), Notes (text, optional)
- Grouped by category in the display

---

## Constants

Add to `src/lib/constants.ts`:

```typescript
export const ELOPEMENT_RISK_LEVELS = ["none", "low", "moderate", "high"] as const;
export type ElopementRiskLevel = (typeof ELOPEMENT_RISK_LEVELS)[number];

export const COMMUNICATION_METHODS = [
  "vocal_speech", "sign_language", "pecs", "aac_device",
  "gestures", "combination", "nonverbal",
] as const;
export type CommunicationMethod = (typeof COMMUNICATION_METHODS)[number];

export const SPEECH_LEVELS = [
  "full_sentences", "phrases", "single_words",
  "signs_only", "gestures_only", "no_functional_communication",
] as const;
export type SpeechLevel = (typeof SPEECH_LEVELS)[number];

export const TOILETING_STATUSES = [
  "diapers", "diapers_and_bathroom", "daytime_trained", "fully_trained",
] as const;
export type ToiletingStatus = (typeof TOILETING_STATUSES)[number];

export const ALLERGY_TYPES = ["food", "medication", "environmental", "other"] as const;
export type AllergyType = (typeof ALLERGY_TYPES)[number];

export const ALLERGY_SEVERITIES = ["mild", "moderate", "severe"] as const;
export type AllergySeverity = (typeof ALLERGY_SEVERITIES)[number];

export const REINFORCER_CATEGORIES = [
  "edible", "tangible", "social", "sensory", "activity",
] as const;
export type ReinforcerCategory = (typeof REINFORCER_CATEGORIES)[number];
```

---

## Phased Roadmap

### NOW — Phase 2A: Safety Alerts + Session Context
- [ ] Add 14 new columns to `clients` table (safety flags + session-essential)
- [ ] Create `client_allergies` table
- [ ] Create `client_reinforcers` table
- [ ] Add constants for dropdowns
- [ ] Safety alert badges on client header
- [ ] Clinical Quick View card on Overview tab
- [ ] Safety Alerts card on Overview tab
- [ ] Edit tab: Safety & Medical Alerts section (allergies CRUD, safety toggles)
- [ ] Edit tab: Session Context section (communication, reinforcers CRUD, toileting, dietary, sensory)
- [ ] Validators for new fields

### NEXT — Phase 2B: Polish
- [ ] Safety alert badges clickable (scroll to detail)
- [ ] Allergy cross-reference with reinforcer preferences (warn if edible reinforcer matches food allergy)
- [ ] Import from intake form (pre-fill from structured intake data)

### LATER — Phase 3+
- [ ] Medications table (name, dosage, frequency, prescribing provider, start/stop date)
- [ ] Medical conditions table (condition, status, onset date)
- [ ] Custom fields system (org-admin configurable, text/dropdown/boolean/date types)
- [ ] Other therapies tracking (OT, Speech, PT coordination)
- [ ] Educational context (school, grade, IEP)
- [ ] Time-based tracking (medication history with effective dates — Noteable pattern)

---

## Sources

- `docs/research/client-clinical-metadata-research.md` — Full competitive research with 50+ sources
- ABA intake form templates: UW Autism Center, Compass Center, Kind BH, ABA Engine
- BACB Ethics Code Section 2.12 (record-keeping requirements)
- AAAAI/AHRQ guidelines on structured allergy documentation in EHRs
- CentralReach metadata system documentation
- Noteable time-based tracking model
