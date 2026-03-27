# ABA Session Note Requirements: Comprehensive Research

> Research date: 2026-03-26
> Scope: Session note types, required fields, CPT-specific requirements, payer differences, audit expectations, billing relationship, templates, and format standards. Synthesized from CASP templates, TRICARE ACD documentation, Optum audit guides, payer provider manuals, ABA billing specialists, and practitioner resources.

---

## Table of Contents

1. [ABA Documentation Hierarchy](#1-aba-documentation-hierarchy)
2. [Session Note Formats](#2-session-note-formats)
3. [Required Fields for Billing Compliance](#3-required-fields-for-billing-compliance)
4. [CPT-Specific Documentation Requirements](#4-cpt-specific-documentation-requirements)
5. [What a Typical Session Note Looks Like](#5-what-a-typical-session-note-looks-like)
6. [Payer-Specific Requirements](#6-payer-specific-requirements)
7. [How Payers Audit Session Notes](#7-how-payers-audit-session-notes)
8. [Session Notes and the Billing Relationship](#8-session-notes-and-the-billing-relationship)
9. [Implications for Clinivise](#9-implications-for-clinivise)

---

## 1. ABA Documentation Hierarchy

ABA therapy involves multiple layers of clinical documentation. Understanding the hierarchy is essential to building the right data model.

### 1.1 Treatment Plan / Individualized Treatment Plan (ITP)

**What it is:** The overarching document written by the BCBA after the initial assessment (97151). Defines the client's diagnosis, baseline functioning, treatment goals, target behaviors, interventions, and recommended service hours. Updated every 6-12 months or at re-authorization.

**Contains:**

- Diagnosis (ICD-10 codes, typically F84.0 for autism)
- Functional Behavior Assessment (FBA) results
- Measurable goals with baselines and criteria for mastery
- Behavior Intervention Plan (BIP) for challenging behaviors
- Recommended hours per week by service type (e.g., 25 hours 97153, 4 hours 97155, 2 hours 97156)
- Caregiver involvement plan

**NOT a session note.** This is the foundation document that session notes reference.

### 1.2 Behavior Intervention Plan (BIP)

**What it is:** A specific component within the treatment plan focused on reducing challenging behaviors. Defines target behaviors operationally, their functions (identified via FBA), antecedent strategies, replacement behaviors, reinforcement plans, and crisis protocols.

**Relationship to session notes:** Session notes reference the BIP when documenting behavior incidents. The session note documents what happened; the BIP defines how to respond.

### 1.3 Session Note (aka Daily Note / Service Note)

**What it is:** Written after EVERY session by the rendering provider (RBT, BCaBA, or BCBA). Documents what happened during that specific session: goals targeted, interventions used, client responses, behavioral data, and session summary.

**Key characteristics:**

- Written per session, per provider, per day
- Primarily objective and data-driven
- Ties directly to a specific CPT code and billed units
- Must be completed within 24-72 hours of the session
- Requires provider signature and date
- This is what payers request during audits

### 1.4 Progress Report / Progress Note (Periodic BCBA Summary)

**What it is:** A higher-level summary written by the supervising BCBA, typically every 30-90 days (varies by payer). Synthesizes data across multiple sessions to evaluate progress toward treatment plan goals. Used for re-authorization requests.

**Contains:**

- Summary of data across the reporting period
- Progress toward each treatment plan goal (met, partially met, not met, regression)
- Graph analysis and trend interpretation
- Recommendations for treatment plan modifications
- Updated hours recommendation
- Clinical justification for continued services

**Key distinction from session notes:** Progress reports analyze trends across sessions; session notes document individual sessions. A BCBA writes progress reports by reviewing multiple session notes and their associated data.

### 1.5 Supervision Note

**What it is:** Documentation of BCBA supervision activities. Required by BACB (minimum 5% of RBT service hours per month). Documents direct observation of RBT, feedback provided, competency assessment, and any protocol modifications.

**Relationship to session notes:** Supervision notes may overlap with 97155 session notes when the BCBA modifies protocols during direct observation. But pure supervision (observing, giving feedback) without protocol modification is NOT separately billable as 97155.

### 1.6 Summary: Documentation Hierarchy

```
Treatment Plan (ITP)
  |-- Behavior Intervention Plan (BIP)
  |-- Goals & Objectives
  |       |
  |       v
  |   Session Notes (daily, per session)     <-- What we're building
  |       |-- 97153 notes (RBT direct therapy)
  |       |-- 97155 notes (BCBA protocol modification)
  |       |-- 97156 notes (caregiver training)
  |       |-- 97151 notes (assessment sessions)
  |       |
  |       v
  |   Progress Reports (periodic BCBA summary)  <-- Phase 2+
  |
  |-- Supervision Notes                          <-- Phase 2+
```

---

## 2. Session Note Formats

### 2.1 SOAP Notes

The most widely used format in ABA therapy and healthcare generally. Stands for:

- **S (Subjective):** Client/caregiver-reported information. What was shared verbally before or during the session. Direct quotes are recommended. Example: "Mom reported 2 elopements at school this week. Client said he 'didn't want to do work today.'"

- **O (Objective):** Measurable, observable data from the session. Trial data, frequency counts, duration measures, prompt levels, ABC data. This is the largest data-heavy section. Example: "Manding: 14 independent, 6 prompted. Toothbrushing TA: 9/12 steps independent (up from 7/12). Elopement attempts: 1 (blocked within 2 sec)."

- **A (Assessment):** Clinical interpretation of the data. Progress evaluation, trend analysis, identification of barriers. Example: "Task independence is improving (+16%). Elopement decreased in frequency. New staff aide may require extra priming for antecedent strategies."

- **P (Plan):** Next steps, planned interventions, adjustments. Example: "Maintain toothbrushing steps; fade prompts on steps 4 and 7. Practice recess role-play with proximity and fixed-time attention before transitions."

**Strengths:** Structured, reviewer-friendly, insurance-standard, easy to audit.
**Weaknesses:** Can feel rigid for fast-paced RBT sessions; "Subjective" section doesn't always apply to every ABA session.

### 2.2 Narrative / Session Notes Format

A more flexible format used in many ABA practice management systems. Structured into logical sections but without the rigid SOAP labels:

- Session identification (auto-populated)
- Client presentation at start of session
- Goals/programs targeted
- Interventions and techniques used
- Data summary (trial scores, percentages, behavior counts)
- Behavior incidents (if any)
- Session summary narrative
- Plan/next steps

**Strengths:** Flexible, natural flow for RBTs, aligns well with data collection workflows.
**Weaknesses:** Less standardized, can drift into vague territory without structure.

### 2.3 DAP Notes

Less common in ABA but used in some practices:

- **D (Data):** Objective data and observations
- **A (Assessment):** Clinical interpretation
- **P (Plan):** Next steps

Essentially SOAP without the Subjective section. Some ABA practitioners prefer this because pure ABA session notes are meant to be objective.

### 2.4 ABC Notes

Used specifically for documenting behavior incidents:

- **A (Antecedent):** What happened before the behavior
- **B (Behavior):** The observable behavior
- **C (Consequence):** What happened after the behavior

ABC data is typically embedded within a session note, not a standalone format. Multiple ABC entries may exist within a single session note.

### 2.5 Which Format is Standard for ABA?

**There is no single mandated format.** Per SimplePractice: "The therapist might use a narrative note format or a SOAP note format to record ABA notes -- so long as the note includes the aforementioned information, the format doesn't matter."

However, **SOAP is the most widely used** across ABA practice management platforms. CASP (Council of Autism Service Providers) developed their session note templates using a structured format that maps closely to SOAP. Most payers accept any format that contains the required elements.

**Recommendation for Clinivise:** Use a **structured hybrid format** -- SOAP-like sections with ABA-specific labels that feel natural to RBTs. Do NOT force strict SOAP labels if the workflow doesn't warrant it. The key is ensuring all required fields are captured, not enforcing a specific format label.

---

## 3. Required Fields for Billing Compliance

These fields are universally required across all payers for any ABA session note to survive an audit. Organized by section.

### 3.1 Session Identification (auto-populated in PM systems)

| Field                    | Required?   | Notes                                                         |
| ------------------------ | ----------- | ------------------------------------------------------------- |
| Client full name         | Yes         | Legal name matching insurance records                         |
| Client date of birth     | Yes         | Additional identifier for auditors                            |
| Date of service          | Yes         | Must match the claim date                                     |
| Session start time       | Yes         | Exact time, not approximate                                   |
| Session end time         | Yes         | Must support 15-minute unit calculation                       |
| Duration (minutes)       | Yes         | Calculated from start/end times                               |
| Billable units           | Yes         | Must align with duration per CMS/AMA rules                    |
| Place of service         | Yes         | Code + location (Home, Clinic, School, Community, Telehealth) |
| Service location address | Some payers | Required for home/community services                          |

### 3.2 Provider & Credentials

| Field                        | Required?   | Notes                                            |
| ---------------------------- | ----------- | ------------------------------------------------ |
| Rendering provider full name | Yes         | Must match NPI on claim                          |
| Provider credential type     | Yes         | RBT, BCaBA, BCBA, BCBA-D                         |
| Provider signature           | Yes         | Electronic acceptable with audit trail           |
| Signature date               | Yes         | Must be within 24-72 hours of session            |
| Supervising BCBA name        | Conditional | Required when rendering provider is RBT or BCaBA |
| Others present               | Yes         | Names and relationships (parent, sibling, aide)  |

### 3.3 Service & Billing

| Field                   | Required? | Notes                                               |
| ----------------------- | --------- | --------------------------------------------------- |
| CPT code                | Yes       | Must match service actually delivered               |
| Modifier code(s)        | Yes       | Credential-based (HM, HN, HO) + telehealth (95, GT) |
| Authorization number    | Yes       | Linked to active authorization for that CPT/date    |
| Diagnosis code (ICD-10) | Yes       | Usually F84.0 (autism)                              |

### 3.4 Clinical Content (The Heart of the Note)

| Field                          | Required?   | Notes                                                     |
| ------------------------------ | ----------- | --------------------------------------------------------- |
| Client presentation            | Yes         | Observable behavior at session start                      |
| Goals/programs targeted        | Yes         | Must link to current treatment plan objectives            |
| Interventions/techniques used  | Yes         | Specific ABA techniques: DTT, NET, prompting, etc.        |
| Data: trial scores/percentages | Yes         | Measurable, objective data                                |
| Data: prompt levels            | Yes         | FP, PP, M, V, G, I (Full Physical to Independent)         |
| Behavior incidents             | Conditional | Required if significant behaviors occurred                |
| ABC data                       | Conditional | For behavior incidents: Antecedent, Behavior, Consequence |
| Session narrative/summary      | Yes         | What happened, progress made, barriers encountered        |
| Response to treatment          | Yes         | How client responded to interventions, linked to goals    |

### 3.5 Assessment & Planning

| Field                      | Required?   | Notes                                        |
| -------------------------- | ----------- | -------------------------------------------- |
| Progress per goal          | Yes         | Met / Partially met / Not met / Regression   |
| Recommendations/next steps | Yes         | Plan for next session                        |
| Caregiver communication    | Conditional | If caregiver present or communicated with    |
| Treatment plan changes     | Conditional | For 97155 notes -- what was modified and why |

### 3.6 Compliance & Signatures

| Field                      | Required?   | Notes                                              |
| -------------------------- | ----------- | -------------------------------------------------- |
| Provider digital signature | Yes         | Must demonstrate intent; audit trail required      |
| Signature timestamp        | Yes         | Date signed, ideally auto-captured                 |
| Caregiver signature        | Some payers | Required by some commercial payers and some states |
| Note completion timestamp  | System      | Must show note was completed within 24-72 hours    |

### 3.7 Universal Minimum Standard

While individual payer requirements vary, the **universal minimum** that every session note must contain to survive any audit is:

1. **Who:** Client name + DOB, Provider name + credentials, Supervisor name (if RBT), Others present
2. **What:** CPT code, specific ABA techniques used, goals targeted from treatment plan
3. **When:** Date of service, exact start and end times, duration
4. **Where:** Place of service with code
5. **How:** Objective data (trial scores, percentages, prompt levels, behavior counts)
6. **Why:** Link to treatment plan goals, medical necessity justification through documented progress/need
7. **What next:** Plan for future sessions
8. **Signed:** Provider signature with date, within 24-72 hours

---

## 4. CPT-Specific Documentation Requirements

Different CPT codes require different note content because they represent different services. Each code needs a distinct template or at minimum distinct required sections.

### 4.1 CPT 97153 -- Adaptive Behavior Treatment by Protocol

**What it is:** Direct 1:1 therapy delivered by an RBT (or BCaBA) under BCBA supervision. The technician follows the existing treatment plan without making real-time protocol modifications. This is the highest-volume code -- an RBT might bill 97153 for 20-30 hours per week per client.

**Who writes the note:** RBT (primary), BCaBA, or BCBA if delivering direct therapy.

**Required note content (beyond universal fields):**

| Element                        | What to document                                                            |
| ------------------------------ | --------------------------------------------------------------------------- |
| Treatment plan goals addressed | List each goal/objective targeted during the session, referencing the ITP   |
| ABA techniques implemented     | Specific techniques: DTT, NET, incidental teaching, chaining, shaping, etc. |
| Prompt levels used per goal    | Document the prompt hierarchy: FP, PP, M, V, G, I                           |
| Trial/opportunity data         | Number of trials, percentage correct, frequency counts, duration measures   |
| Reinforcement                  | Type of reinforcement used, schedule, effectiveness                         |
| Behavior data                  | Frequency, duration, intensity of target behaviors                          |
| ABC data for incidents         | Antecedent, Behavior, Consequence for any significant behavior events       |
| Client presentation            | Observable behavior at session start (mood, engagement, readiness)          |
| Session narrative              | Summary of activities, transitions, notable events                          |
| Progress assessment            | Per-goal: met/partially met/not met                                         |

**What auditors look for in 97153 notes:**

- Data must be **objective and measurable** -- never "client did well" or "good session"
- Each note must be **individualized** -- cloned/copy-pasted notes are a top audit failure
- Interventions must **link to specific treatment plan goals** -- random activities not tied to goals trigger denials
- **Prompt level documentation** is critical -- shows systematic teaching, not just babysitting
- Time documented must **match units billed** -- a 97153 note showing 45 minutes cannot bill 4 units

**Example note section (97153):**

> **Goals Targeted:**
>
> 1. Manding (requesting) -- Target: 15 independent mands per session
> 2. Gross motor imitation -- Target: 80% correct across 20 trials
>
> **Interventions & Data:**
>
> - Manding: NET procedures during play. 14 independent mands, 6 prompted (gestural). Total: 20 opportunities, 70% independent. Edible reinforcement on VR3 schedule.
> - Gross motor imitation: DTT with picture cards. 16/20 correct (80%) with model prompts faded to gestural on 3 trials. Token board reinforcement.
>
> **Behavior:**
>
> - Elopement: 1 occurrence during transition to table (antecedent: timer ended preferred activity; consequence: physical redirection, 10-sec delay, re-presented demand). No aggression. Duration: ~8 seconds.
>
> **Assessment:**
> Manding trending upward (70% vs. 65% last session). Gross motor imitation met mastery criterion (80%) -- recommend probe next session and consider advancing to 2-step imitations. Elopement decreased from 3 last session to 1 today.
>
> **Plan:**
> Continue current manding targets. Probe gross motor imitation for mastery. Increase transition warnings to 2-minute and 1-minute countdowns to reduce elopement.

### 4.2 CPT 97155 -- Adaptive Behavior Treatment with Protocol Modification

**What it is:** A BCBA (or qualified healthcare professional) provides direct treatment while actively modifying the treatment protocol based on real-time client performance. The key distinction from 97153: the clinician is **changing the plan during the session**, not just following it.

**Who writes the note:** BCBA or BCBA-D only. BCaBAs in some states.

**Critical documentation requirement:** The note MUST document:

1. **What data prompted the modification** -- "Skill X plateaued at 60% across last 3 sessions"
2. **What was modified** -- "Changed prompt hierarchy from most-to-least to least-to-most"
3. **Why it was modified** -- Clinical rationale tied to data
4. **How the client responded** -- "After modification, client completed 4/5 trials successfully"
5. **Updated protocol** -- What the new protocol looks like going forward

**What auditors look for in 97155 notes:**

- **Modification must be real-time** -- Cannot bill 97155 for reviewing data after the session and updating the plan
- **Must be distinguishable from 97153** -- If the note reads like an RBT session note with no modifications, it will be denied
- **Data-driven rationale** -- "I changed the approach because..." must be backed by objective data
- **Cannot be used for pure supervision/observation** -- Watching an RBT and giving feedback without modifying protocol is NOT 97155

**Example note section (97155):**

> **Protocol Modification Rationale:**
> Reviewed data from past 5 sessions: tacting colors plateaued at 50% (below 80% mastery criterion) despite 15 sessions of DTT with errorless teaching. Error pattern: consistent confusion between blue/green.
>
> **Modification Made:**
> During session, switched from mass trial DTT to alternating trials with discrimination training (blue vs. green contrast pairs only). Introduced color-matching prerequisite task before tacting. Changed reinforcement from token board to immediate social praise + preferred activity access.
>
> **Client Response to Modification:**
> With discrimination training: 8/10 correct on blue/green contrast pairs (vs. 5/10 baseline). Client showed increased engagement (eye contact, approaching materials independently). No problem behaviors during modified protocol.
>
> **Updated Protocol:**
> Continue discrimination training for blue/green for 5 sessions before returning to mass trial tacting. Criterion: 90% on contrast pairs before re-introducing full color set. RBT to implement updated protocol starting next session.

### 4.3 CPT 97156 -- Family Adaptive Behavior Treatment Guidance

**What it is:** Structured caregiver training delivered by a BCBA. Teaches caregivers how to implement ABA strategies at home/school/community. Can be delivered with or without the client present.

**Who writes the note:** BCBA or BCBA-D. BCaBAs in some states.

**Unique documentation requirements:**

| Element                         | What to document                                                   |
| ------------------------------- | ------------------------------------------------------------------ |
| Caregiver name and relationship | Required -- who was trained (parent, teacher, aide)                |
| Client present?                 | Must explicitly state whether the client was present               |
| Training objectives             | 1-2 measurable caregiver objectives for the session                |
| Teaching method                 | How training was delivered: explain, model, role-play, feedback    |
| Caregiver demonstration         | Did the caregiver demonstrate the skill? Fidelity/competency check |
| Caregiver response/competency   | How well did the caregiver implement the technique?                |
| Generalization plan             | How will the caregiver apply this outside of training?             |
| Homework/follow-up task         | Specific practice assignment for the caregiver                     |
| Link to treatment plan          | How this training supports the client's treatment goals            |

**What auditors look for in 97156 notes:**

- **Must be training, not just talking** -- A conversation with a parent about the week is NOT 97156. Must document specific skills taught and caregiver practice.
- **Caregiver competency data** -- Did the parent actually demonstrate the technique? What was their fidelity score?
- **Client presence documented** -- Explicitly state "client present" or "client not present"
- **Distinct from 97155** -- 97155 is modifying protocol during treatment; 97156 is teaching caregivers to implement it

**Example note section (97156):**

> **Caregiver Training Session**
> Caregiver: Maria Thompson (mother). Client (Marcus) present.
>
> **Training Objectives:**
>
> 1. Teach mother to implement 3-step prompting sequence for manding during mealtimes
> 2. Review and practice differential reinforcement for appropriate requesting vs. tantrum
>
> **Teaching Method & Caregiver Response:**
>
> 1. Explained 3-step prompting (wait 5 sec -> gestural -> model). Modeled with Marcus during snack. Mother practiced 10 opportunities: implemented correct prompt sequence on 8/10 (80% fidelity). Errors: skipped wait time on 2 opportunities (moved directly to model prompt).
> 2. Reviewed DRA procedure. Mother correctly delivered reinforcement for appropriate mands on 9/10 opportunities. Correctly withheld reinforcement during 1 tantrum episode (extinction).
>
> **Generalization Plan:**
> Mother to practice prompting sequence during all meals this week. Provided written prompt hierarchy card for refrigerator. Will collect data on number of independent mands during dinner (tally sheet provided).
>
> **Plan:**
> Next session: Review dinner mand data. If fidelity > 80%, expand prompting training to play requests. If < 80%, re-model and practice during session.

### 4.4 CPT 97151 -- Behavior Identification Assessment

**What it is:** The initial comprehensive assessment conducted by a BCBA. Includes interviews, direct observations, standardized assessments, and development of the treatment plan. Billed in 15-minute units, typically 4-8 hours total across multiple sessions.

**Who writes the note:** BCBA or BCBA-D only.

**Unique documentation requirements:**

| Element                                | What to document                                                            |
| -------------------------------------- | --------------------------------------------------------------------------- |
| Assessment activities conducted        | Interviews, observations, standardized tools used                           |
| Assessment tools                       | VB-MAPP, ABLLS-R, AFLS, Vineland, etc. -- name each tool                    |
| Caregiver participation                | At least one session must include caregiver; document their input           |
| Face-to-face vs. non-face-to-face time | Must track separately; payers scrutinize time allocation                    |
| Findings/results                       | Summary of what was observed/measured                                       |
| Diagnostic impressions                 | Link to ICD-10 diagnosis                                                    |
| Treatment recommendations              | Recommended services, hours, goals                                          |
| Individual session length              | Each assessment session should be no longer than 2 hours                    |
| Total assessment time                  | Should not exceed 8 hours total (some payers allow more with justification) |

**What auditors look for in 97151 notes:**

- **Data collection alone is insufficient** -- Tally marks/raw scores without narrative explanation will be denied
- **Caregiver session documented** -- At least one session must include caregiver interview
- **Time tracking accuracy** -- Payers scrutinize assessment hours, especially beyond 8 hours
- **Medical necessity** -- Assessment must clearly link to functional impairments requiring ABA
- **Note signed within 24 hours** of each assessment session

### 4.5 Do Different Codes Need Different Templates?

**Yes, absolutely.** The documentation requirements are different enough that a single generic template will either:

- Miss required fields for specific codes (e.g., caregiver competency data for 97156)
- Include irrelevant fields that waste time (e.g., asking RBTs about protocol modifications for 97153)

**Recommended approach:** One base template with code-specific sections that appear/hide based on the selected CPT code.

| CPT Code | Template Variant                   | Unique Sections                                                                                                       |
| -------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 97153    | Direct therapy (RBT)               | Goals data table, prompt levels, behavior incidents, ABC data                                                         |
| 97155    | Protocol modification (BCBA)       | Modification rationale, data prompting change, what changed, client response, updated protocol                        |
| 97156    | Caregiver training (BCBA)          | Caregiver name/relationship, client present Y/N, training objectives, teaching method, caregiver competency, homework |
| 97151    | Assessment (BCBA)                  | Assessment tools used, F2F vs non-F2F time, caregiver participation, findings, recommendations                        |
| 97154    | Group therapy (RBT)                | Group composition, individual data per client, group dynamics                                                         |
| 97157    | Group caregiver training (BCBA)    | Attendee list, group training objectives, individual competency notes                                                 |
| 97158    | Group protocol modification (BCBA) | Per-client modifications within group context                                                                         |

---

## 5. What a Typical Session Note Looks Like

### 5.1 Note Length and Detail

| Session Length       | Expected Note Length | Detail Level                                            |
| -------------------- | -------------------- | ------------------------------------------------------- |
| 1 hour (4 units)     | 150-300 words        | 2-4 goals with data, brief narrative                    |
| 2 hours (8 units)    | 250-500 words        | 4-6 goals with data, behavior section, fuller narrative |
| 3+ hours (12+ units) | 400-800 words        | 6+ goals, multiple behavior entries, detailed narrative |

**Minimum acceptable:** A note must have enough detail to demonstrate that the billed service was actually delivered and was medically necessary. A 2-hour session note that is only 2 sentences will fail an audit. Conversely, a novel-length note for a 30-minute session is suspicious.

**Rule of thumb from practitioners:** "The length and level of detail in your session note should match the length of the session and the complexity of the interventions."

### 5.2 Typical RBT Session Note (97153, 2-hour session)

```
SESSION NOTE
============================================================
Client: Marcus Thompson (DOB: 03/15/2020)
Date of Service: 03/26/2026
Start Time: 9:00 AM | End Time: 11:00 AM | Duration: 120 min
Units: 8 | CPT: 97153
Place of Service: Home (12)
Provider: Jessica Smith, RBT | Supervisor: Dr. Sarah Chen, BCBA-D
Others Present: Maria Thompson (mother)
Authorization: AUTH-0891 | Diagnosis: F84.0

SUBJECTIVE
----------
Mother reported Marcus had a "rough morning" -- woke up early, skipped
breakfast. New babysitter started yesterday (potential setting event).

OBJECTIVE
---------
Goals Targeted:

1. Manding (requesting) -- Target: 15 independent mands/session
   - Procedure: NET during play and snack
   - Data: 14 independent, 6 prompted (gestural) = 20 total, 70% independent
   - Reinforcement: Edible (goldfish) on VR3 schedule
   - Prompt level: Gestural -> Independent on 14/20

2. Gross motor imitation -- Target: 80% across 20 trials
   - Procedure: DTT with picture cards and physical models
   - Data: 16/20 correct (80%). Model prompt faded to gestural on 3 trials.
   - Reinforcement: Token board (5 tokens = 2 min iPad)

3. Tooth brushing (task analysis) -- Target: Complete 10/12 steps
   - Procedure: Forward chaining
   - Data: 9/12 steps independent (up from 7/12 last session)
   - Prompts needed: Steps 8, 10, 12 (physical prompt)

Behavior Data:
- Elopement: 1 occurrence at 10:23 AM
  A: Timer ended preferred activity (trains)
  B: Ran toward front door
  C: Physical redirection within 8 sec, 10-sec delay, re-presented demand
- Aggression: 0 occurrences
- Tantrum: 0 occurrences

ASSESSMENT
----------
Manding trending upward (70% vs. 65% last session). Gross motor imitation
met mastery criterion (80%) -- ready for mastery probe. Tooth brushing
showing steady improvement (+2 steps independent). Elopement decreased
from 3 occurrences last session to 1 today despite reported rough morning.

PLAN
----
Continue manding targets at current level. Probe gross motor imitation
for mastery confirmation. If confirmed, advance to 2-step imitations.
Continue tooth brushing forward chain. Increase transition warnings
(2-min and 1-min countdown) for elopement prevention.

____________________________________________
Jessica Smith, RBT | Signed: 03/26/2026 11:15 AM
```

### 5.3 Time to Complete

| Method                                   | Time per Note (for 2-hour session) |
| ---------------------------------------- | ---------------------------------- |
| Manual free-text (blank screen)          | 15-30 minutes                      |
| Template-based PM system                 | 8-12 minutes                       |
| AI-assisted (draft from structured data) | 2-5 minutes                        |

AI-assisted note generation is the single biggest documentation time reduction. Platforms with AI (Raven Health, CentralReach NoteDraftAI, Passage Health + Frontera) report **60-80% reduction** in documentation time.

---

## 6. Payer-Specific Requirements

While the core documentation requirements are universal, payers add their own layers.

### 6.1 Medicaid (CMS Rules)

- Unit calculation: CMS 8-minute rule (aggregate across codes)
- Progress reports required: Every 90 days (quarterly re-authorization)
- Record retention: At least 7 years under federal Medicaid rules
- Supervision documentation: Must show BCBA supervision of RBT services
- Notes must demonstrate medical necessity at every session
- OIG audits have found tens of millions in improper ABA payments (Indiana: $56M, Wisconsin: $94.3M) due to documentation deficiencies

### 6.2 TRICARE (Autism Care Demonstration)

The most prescriptive payer for ABA documentation. Requires:

- **Clinical status:** Specific, objectively observed behavior at start of session
- **Narrative summaries** of session content supporting CPT codes billed
- **ABA techniques** attempted during the session
- **Response to treatment** and progress toward treatment goals
- **Location** of rendered services
- **Name of authorized ABA supervisor** and all session participants
- **Rendering provider** name, credentials, and dated signature
- Notes compared against claims during quality audits
- 97155 notes must clearly define the protocol modification that occurred
- 97151 requires progress notes separate from the treatment plan itself

### 6.3 Optum / UnitedHealthcare (UHC)

- Clinical audit preparation requires: intake forms, FBAs, treatment plans, the 5 most recent session notes with corresponding data, supervision logs, and HR files
- Auditors check consistency between assessment, treatment plan, and session notes -- any disconnect is an audit trigger
- Target 80%+ compliance score
- Commercial plans want summaries every 6 months
- Comorbidity notes may be required

### 6.4 Aetna

- Requires measurable baselines and intensity justification
- Comorbidity documentation expected
- Diagnosis + rationale for ABA in referral
- Medical necessity guide emphasizes specific measurable goals

### 6.5 Blue Cross Blue Shield (BCBS)

- Requires rationales showing ABA prevents regression or produces gains
- E-signature acceptance varies by state and plan
- State-specific plan variations are significant

### 6.6 Cigna / Evernorth

- Standard documentation requirements
- Medical necessity reviews at re-authorization
- Progress reports required for continued authorization

### 6.7 Key Takeaway

No payer requires a specific note FORMAT (SOAP vs narrative). All payers require the same core CONTENT. The differences are in:

- Frequency of progress reports (quarterly vs. semi-annual)
- Specific fields emphasized (TRICARE is most prescriptive)
- Audit frequency and methodology
- Unit calculation method (CMS vs AMA)
- Electronic signature acceptance

---

## 7. How Payers Audit Session Notes

### 7.1 Audit Triggers

| Trigger                    | Description                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| High therapy hours         | Clients receiving 30+ hours/week of direct therapy                                                         |
| Repeated claim denials     | Pattern of coding errors or missing documentation                                                          |
| Inconsistent documentation | Mismatches between billed codes and documented services                                                    |
| Expired authorizations     | Billing beyond authorization dates or units                                                                |
| Random sampling            | Routine compliance audits (especially Medicaid)                                                            |
| Whistleblower/complaint    | Staff or parent reports of billing irregularities                                                          |
| AI-based claims review     | Commercial payers now use AI to catch overutilization, supervision gaps, and documentation inconsistencies |

### 7.2 What Auditors Specifically Look For

1. **Note exists for every billed session** -- No note = automatic recoupment
2. **Times match units billed** -- 45 minutes documented but 4 units (60 min) billed = problem
3. **CPT code matches documented service** -- 97155 billed but note shows no protocol modification
4. **Provider credentials match CPT code** -- RBT billing 97155 = denial
5. **Supervisor identified** -- RBT sessions without named supervising BCBA
6. **Goals link to treatment plan** -- Activities not in the ITP raise questions
7. **Objective data present** -- Vague language without numbers triggers flags
8. **Notes are individualized** -- Identical/cloned notes across sessions = fraud indicator
9. **Signatures present and timely** -- Unsigned or late-signed notes
10. **Authorization active** -- Date of service falls within auth period, units available

### 7.3 Most Common Documentation Deficiencies

Ranked by frequency of audit findings:

1. **Cloned/copy-pasted notes** -- Identical language across sessions. OIG reports flag this as the #1 indicator of potential fraud. Each note must reflect what ACTUALLY happened that specific session.

2. **Vague/subjective language** -- "Client did well today" or "Good session." Must use objective, measurable terms: "Client completed 16/20 trials at 80% accuracy."

3. **Missing objective data** -- Notes that describe activities but don't include trial counts, percentages, frequency data, or prompt levels.

4. **Goals not linked to treatment plan** -- Session activities that don't reference specific ITP objectives.

5. **Missing or late signatures** -- Notes signed more than 72 hours after the session, or unsigned notes.

6. **Time/unit mismatches** -- Documented time doesn't support billed units.

7. **Missing behavior data** -- Behavior incidents occurred but no ABC data documented.

8. **No medical necessity justification** -- Notes don't demonstrate why continued services are needed.

9. **Missing supervision documentation** -- RBT sessions with no supervising BCBA identified.

10. **Credential/code mismatch** -- RBT billing 97155, or BCBA billing 97153 without justification.

### 7.4 Consequences of Deficient Documentation

- **Pre-payment denial:** Claim rejected before payment
- **Post-payment recoupment:** Money clawed back after audit (most common, most painful)
- **Suspension from payer network:** Repeated violations
- **OIG investigation:** Federal Medicaid fraud investigation
- **BACB ethics complaint:** Can affect certification

---

## 8. Session Notes and the Billing Relationship

### 8.1 Are Session Notes Submitted with Claims?

**No.** Session notes are NOT submitted with claims. The claim (CMS-1500 or 837P electronic) contains only billing data: CPT code, units, date, provider NPI, modifiers, diagnosis code, and charges. The session note stays on file.

**However:** Payers can and do request session notes at any time for:

- Pre-payment review (before paying the claim)
- Post-payment audit (after paying, reviewing for recoupment)
- Quality monitoring (routine compliance checks)
- Re-authorization review (supporting continued services)

When notes are requested, they're typically needed within 5-10 business days. Inability to produce notes = automatic recoupment.

### 8.2 Record Retention Requirements

| Standard             | Retention Period                          | Notes                    |
| -------------------- | ----------------------------------------- | ------------------------ |
| BACB Ethics Code 2.0 | 7 years from service termination          | Professional requirement |
| Federal Medicaid     | 7 years minimum                           | Can be longer per state  |
| HIPAA                | No specific requirement                   | Defers to state/payer    |
| State laws (typical) | 7-10 years for adults                     | Varies significantly     |
| Minors               | Until age of majority + state requirement | Often 18 + 7 = age 25    |
| Best practice        | 10 years                                  | Covers all scenarios     |

**For ABA specifically:** Since most clients are minors, the practical requirement is often **until the client turns 18 + 7 years = age 25 minimum.**

### 8.3 Electronic Signature Requirements

- **HIPAA permits electronic signatures** with proper safeguards
- **Requirements:** Verification of signer identity, audit trail (who signed, when, from where), tamper-evidence (can't be modified after signing), intent to sign
- **BACB allows e-signatures** that demonstrate intent
- **Medicare Program Integrity Manual:** Services must be authenticated by the author with a legible handwritten or electronic signature
- **No BACB co-signature requirement** for session notes (but some payers require BCBA co-signature on RBT notes)
- **Best practice:** Auto-capture timestamp, user identity, and IP at signature time

### 8.4 Note Completion Timeliness

| Standard           | Timeframe                            | Notes                            |
| ------------------ | ------------------------------------ | -------------------------------- |
| Best practice      | Same day / immediately after session | While details are fresh          |
| Industry standard  | Within 24 hours                      | Most PM systems enforce this     |
| Maximum acceptable | 72 hours                             | Beyond this, accuracy questioned |
| BCBA co-signature  | Within 48 hours                      | If required by payer             |
| Audit red flag     | >72 hours                            | Late notes trigger scrutiny      |

---

## 9. Implications for Clinivise

### 9.1 Current State (What We Have)

The current `sessions` table has a single `notes` text field. The session form has a notes textarea. The session detail view displays notes as plain text. This is adequate for Phase 1 session logging (tracking time, units, billing fields) but is **insufficient for clinical documentation** that would survive a payer audit.

### 9.2 What We Need for Session Note Feature (Phase 1B or Phase 2)

**Data model changes needed:**

The session note is a separate but tightly coupled entity to the session record. A session has one session note. The note contains structured sections that vary by CPT code.

**Proposed approach -- Structured + Narrative hybrid:**

Rather than a single text blob, store session notes as structured data:

```
session_notes table:
  id
  session_id (FK, unique -- one note per session)
  organization_id
  note_type: "97153_direct" | "97155_modification" | "97156_caregiver" | "97151_assessment"

  -- Universal sections (all CPT codes)
  client_presentation: text          -- Observable behavior at session start
  session_narrative: text            -- Free-text summary
  plan_next_session: text            -- Plan for next session

  -- 97153-specific (goals data stored separately)
  -- (goal data would be in a related table or JSON column)

  -- 97155-specific
  modification_rationale: text       -- Data prompting the modification
  modification_description: text     -- What was changed
  client_response_to_modification: text  -- How client responded
  updated_protocol: text             -- New protocol going forward

  -- 97156-specific
  caregiver_name: text
  caregiver_relationship: text
  client_present: boolean
  training_objectives: text
  teaching_method: text
  caregiver_competency: text
  generalization_plan: text
  homework_assigned: text

  -- 97151-specific
  assessment_tools_used: text[]
  face_to_face_minutes: integer
  non_face_to_face_minutes: integer
  caregiver_participated: boolean
  findings_summary: text
  recommendations: text

  -- Compliance
  signed_by: text (provider_id FK)
  signed_at: timestamp
  cosigned_by: text (supervisor provider_id FK)
  cosigned_at: timestamp
  status: "draft" | "signed" | "cosigned" | "locked"

  created_at, updated_at
```

**Goal/target data per session (for 97153 and 97155):**

```
session_note_goals table:
  id
  session_note_id (FK)
  organization_id
  goal_name: text                    -- From treatment plan
  procedure: text                    -- ABA technique used
  trials_completed: integer
  trials_correct: integer
  percentage_correct: numeric(5,2)
  prompt_level: text                 -- Most common prompt level used
  reinforcement: text                -- Type and schedule
  progress_status: "met" | "partially_met" | "not_met" | "regression" | "maintenance"
  notes: text                        -- Goal-specific notes
```

**Behavior incident data (for any session):**

```
session_note_behaviors table:
  id
  session_note_id (FK)
  organization_id
  behavior_name: text                -- From BIP (e.g., "elopement", "aggression")
  occurrence_time: text              -- When it happened
  antecedent: text                   -- What triggered it
  behavior_description: text         -- What the client did
  consequence: text                  -- How staff responded
  duration_seconds: integer
  intensity: text                    -- "mild" | "moderate" | "severe"
  notes: text
```

### 9.3 AI Session Note Generation Opportunity

This is the single biggest competitive differentiator for Clinivise. Based on research:

- AI note generation reduces documentation time from 15-30 minutes to 2-5 minutes (60-80% reduction)
- Competitors with AI notes: CentralReach (NoteDraftAI), Raven Health, Passage Health (Frontera AI)
- Competitors WITHOUT AI notes: AlohaABA, ABA Matrix, Artemis

**How it would work in Clinivise:**

1. RBT enters structured data during/after session (goals, trial counts, prompt levels, behaviors)
2. System generates a draft narrative from the structured data
3. RBT reviews, edits if needed, and signs
4. The structured data is the source of truth; the narrative is the human-readable audit document

**This inverts the typical documentation flow:** Instead of writing a narrative and hoping it contains the right data, the RBT enters data and the system writes the narrative. This ensures:

- All required fields are captured (structured input validates completeness)
- Objective language (AI doesn't write "client did well")
- Individualized notes (generated from actual session data, never cloned)
- Faster completion (structured inputs are faster than free-text)

### 9.4 Phasing Recommendation

| Phase             | What to Build                            | Why                                                                    |
| ----------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| Phase 1 (current) | Keep current `notes` text field          | Session logging core is the priority; free-text notes are fine for MVP |
| Phase 1B-4        | Structured session note form by CPT code | Add the required clinical documentation fields                         |
| Phase 2           | Digital signature + note locking         | Required for billing compliance before claims submission               |
| Phase 2           | AI note generation from structured data  | Competitive differentiator, massive time savings                       |
| Phase 2           | BCBA co-signature workflow               | Required by some payers for RBT notes                                  |
| Phase 2           | Note completion tracking + alerts        | Dashboard showing unsigned/overdue notes                               |
| Phase 3           | Progress report generation               | Aggregate session note data into periodic BCBA summaries               |

---

## Sources

### Session Note Structure & Templates

- [ABA Session Notes: Elements, Examples, Templates & Tips - Artemis ABA](https://www.artemisaba.com/blog/aba-session-notes)
- [CASP Session Note Templates - Council of Autism Service Providers](https://www.casproviders.org/casp-session-note-templates)
- [ABA Session Notes Examples & Templates - Theralytics](https://www.theralytics.net/blogs/aba-session-notes-examples)
- [ABA Notes Made Simple: Real Examples & Templates - Yung Sidekick](https://yung-sidekick.com/blog/aba-notes-made-simple-real-examples-ready-to-use-templates-2025-guide)
- [How to Write ABA Session Notes - Mentalyc](https://www.mentalyc.com/blog/aba-notes)
- [How to write ABA notes - SimplePractice](https://www.simplepractice.com/resource/aba-notes/)

### SOAP Notes & Formats

- [ABA SOAP Notes: Tips, Examples & Template - Artemis ABA](https://www.artemisaba.com/blog/aba-soap-notes)
- [Master ABA SOAP Notes: Guide for RBTs & BCBAs - Praxis Notes](https://www.praxisnotes.com/resources/aba-soap-notes-guide)
- [How to Write ABA SOAP Notes - Sprypt](https://www.sprypt.com/blog/how-to-write-effective-aba-soap-notes)

### CPT Code-Specific Documentation

- [CPT Code 97155 Explained: Billing, Documentation & Compliance - Brellium](https://brellium.com/resources/articles/understanding-and-applying-the-97155-cpt-code)
- [CPT 97156 Documentation Requirements - Praxis Notes](https://www.praxisnotes.com/resources/cpt-97156-documentation-requirements)
- [CPT Code 97151: ABA Initial Assessment & Documentation Guide - Brellium](https://brellium.com/resources/articles/how-to-cpt-code-97151-for-aba-therapy)
- [CPT Code 97153 ABA: Complete Guide - Praxis Notes](https://www.praxisnotes.com/resources/cpt-code-97153-aba-guide)
- [BCBA Protocol Modification Documentation: CPT 97155 Guide - Praxis Notes](https://www.praxisnotes.com/resources/cpt-97155-bcba-documentation)

### Audit & Compliance

- [Master ABA Insurance Audit Documentation - Praxis Notes](https://www.praxisnotes.com/resources/aba-insurance-audit-documentation)
- [ABA Documentation Audit Fails: 7 Pitfalls - Praxis Notes](https://www.praxisnotes.com/resources/aba-documentation-audit-pitfalls)
- [Common ABA Session Note Mistakes - Cube Therapy Billing](https://www.cubetherapybilling.com/common-aba-session-note-mistakes-and-how-to-fix-them)
- [Preparing for an ABA Audit: Proactive Compliance Guide 2025 - MBWR](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-audit-preparation-guide)
- [ABA Documentation Compliance Audit Checklist - Praxis Notes](https://www.praxisnotes.com/resources/aba-documentation-compliance-checklist)
- [HHS OIG Audits of the ABA Medicaid Benefit - CASP](https://www.casproviders.org/events/hhs-oig-audits)

### Payer-Specific Requirements

- [TRICARE Autism Care Demonstration Documentation QRG](https://tricare.triwest.com/globalassets/tricare/provider/autism-care-demonstration-documentation-and-quality-monitoring-qrg.pdf)
- [Progress Notes - Humana Military (TRICARE)](https://www.humanamilitary.com/content/humana-military-com/us/en/provider/managedcare/acoe/progressnotes.html)
- [Optum ABA Provider Clinical Audit Preparation](https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaProvidClinAuditPrep.pdf)
- [ABA Billing Guidelines 2026 - MedCloudMD](https://www.medcloudmd.com/post/aba-billing-guideline-2026)

### Billing & Compliance

- [ABA Billing Codes: 10 Main Codes + Guidelines - Passage Health](https://www.passagehealth.com/blog/aba-billing-codes)
- [ABA Billing Services: 2025-2026 Playbook - Cube Therapy Billing](https://www.cubetherapybilling.com/aba-billing-playbook)
- [ABA Electronic Signature Compliance Guide - Praxis Notes](https://www.praxisnotes.com/resources/aba-electronic-signature-compliance-guide)
- [BCBA Record Retention Guide - Praxis Notes](https://www.praxisnotes.com/resources/bcba-record-retention-guide)

### Record Retention & Signatures

- [BCBA Record Retention Guide - Praxis Notes](https://www.praxisnotes.com/resources/bcba-record-retention-guide)
- [ABA Electronic Signature Compliance Guide - Praxis Notes](https://www.praxisnotes.com/resources/aba-electronic-signature-compliance-guide)
- [How to Keep Your ABA Documents Protected - Cube Therapy Billing](https://www.cubetherapybilling.com/how-to-keep-your-aba-documents-protected-step-by-step-guide)
