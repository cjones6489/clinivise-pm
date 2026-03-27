# ABA Practice RBAC: Deep Technical Research

## Executive Summary

Role-based access control in ABA practice management must balance three competing demands: HIPAA's minimum necessary standard (staff see only what their job requires), BACB ethical codes (RBTs work under supervision and cannot interpret data independently), and small-practice reality (a BCBA in a 5-person clinic often wears clinical, admin, and billing hats simultaneously). Competitor analysis reveals that CentralReach offers the most granular permissions system (50+ individual toggles per module), but user reviews consistently cite its complexity as a pain point. SimplePractice takes the opposite approach with 6 preset roles (4 clinician + 2 admin) that cover 90% of use cases without configuration. For Clinivise, the recommended approach is **preset roles with per-feature override toggles** — ship the 6 roles we already have, add a `billing_read` permission for BCBAs who also do billing, and build toward per-feature toggles only when customers request them. This avoids the CentralReach complexity trap while respecting HIPAA minimum necessary. The permission matrix below is the primary deliverable: it maps every Clinivise feature to every role with read/write/none granularity, derived from BACB scope-of-practice rules, HIPAA requirements, and competitor patterns.

---

## 1. ABA Role Definitions & Scope of Practice

### 1.1 Registered Behavior Technician (RBT)

**BACB Definition:** Paraprofessional certification (undergraduate-level) in behavior analysis. RBTs are direct-care providers who implement behavior-analytic services under the close supervision of a BCBA or BCaBA. The RBT credential is granted by the BACB after completing a 40-hour training, passing a competency assessment, and passing a written exam.

**Scope of Practice:**

- Implement behavior reduction and skill acquisition programs as designed by the supervising BCBA
- Collect data on target behaviors during sessions
- Complete session documentation (session notes, data sheets, billing records)
- Follow treatment protocols; may NOT modify them independently
- May NOT conduct assessments (functional behavior assessments, ABLLS-R, VB-MAPP, etc.)
- May NOT interpret data or make clinical decisions based on data patterns
- May NOT develop or modify treatment plans
- May NOT bill insurance directly — their services are billed under the supervising BCBA's NPI

**Day-to-Day in Practice:**

- Arrives at client location (home, clinic, school, community)
- Reviews session plan/targets set by BCBA
- Runs discrete trial training, natural environment teaching, or other protocols
- Collects frequency, duration, interval, or ABC data
- Writes session notes documenting what was targeted, client response, and any incidents
- Logs session time (start/end) for billing purposes
- Communicates session outcomes to supervisor

**Data Access Needs:**

- Their own assigned clients' treatment plans (read-only)
- Session data collection interface for their sessions
- Their own session history and notes
- Their own schedule
- Client demographics sufficient for identification (name, DOB, photo)
- Behavior intervention plans for their assigned clients

**Must Be Blocked From:**

- Other providers' session notes and data (unless explicitly shared for coverage)
- Client insurance/financial information (policy numbers, billing rates, claims)
- Authorization details (approved units, utilization percentages, payer correspondence)
- Billing rates (what the practice charges vs. what they're paid)
- Other staff's schedules, compensation, or HR data
- Practice-level financial reports or dashboards
- Client records for non-assigned clients
- Ability to modify treatment plans or assessment results
- Administrative settings (payer configuration, practice info)
- Audit logs

**BACB Ethics Code References:**

- RBT Ethics Code 2.0, Section 1.01: "RBTs practice within the boundaries defined by their credential, their education, and their competencies."
- RBT Ethics Code 2.0, Section 1.07: "RBTs follow the direction of their supervisors, accurately implement behavior-technician services, and accurately complete all required documentation (e.g., client data, billing records)."
- RBT Ethics Code 2.0, Section 2: "RBTs protect the confidentiality of clients... share information only with supervisors as required."

### 1.2 Board Certified Assistant Behavior Analyst (BCaBA)

**BACB Definition:** Undergraduate-level certification in behavior analysis. BCaBAs provide behavior-analytic services under the supervision of a BCBA. Unlike RBTs, BCaBAs may supervise RBTs and have broader clinical responsibilities, but they cannot practice independently.

**Scope of Practice:**

- All RBT duties plus:
- May supervise RBTs (but must be supervised themselves by a BCBA)
- May assist with assessments under BCBA direction
- May help develop treatment plans under BCBA guidance
- May collect and organize data for BCBA analysis
- Cannot independently interpret evaluation data
- Cannot independently develop or modify treatment plans
- Cannot practice without BCBA supervision
- First 1,000 hours post-certification: must receive supervision for at least 5% of total service hours

**Day-to-Day in Practice:**

- Provides direct therapy services (like an RBT but with more autonomy)
- Conducts portions of assessments as directed by supervising BCBA
- Supervises and trains RBTs on protocol implementation
- Reviews RBT session notes for accuracy and completeness
- Assists BCBA with treatment plan development
- May run caregiver training sessions under BCBA oversight
- Tracks RBT supervision hours and compliance

**Data Access Needs:**

- All data an RBT needs, plus:
- Assigned clients' full clinical records (assessment data, treatment plans, progress notes)
- RBT session notes for supervisees they oversee
- Supervision tracking data (hours, compliance)
- Authorization utilization for caseload planning (view-only)
- Scheduling data for their supervisees and assigned clients

**Must Be Blocked From:**

- Insurance/financial details (billing rates, claims, payments)
- Practice-level financial data
- Clients not in their caseload or their supervisees' caseloads
- Administrative settings and practice configuration
- Staff compensation data
- Payer configuration
- Audit logs (unless specifically granted for supervision documentation)

### 1.3 Board Certified Behavior Analyst (BCBA)

**BACB Definition:** Graduate-level (master's degree minimum) certification in behavior analysis. BCBAs are independent practitioners who may practice without supervision. They are qualified healthcare professionals (QHPs) under insurance billing rules.

**Scope of Practice:**

- Full clinical authority within ABA practice
- Conduct functional behavior assessments (FBAs) and all ABA assessments
- Develop, implement, and modify treatment/behavior intervention plans
- Supervise BCaBAs, RBTs, and trainees
- Provide caregiver/parent training
- Bill insurance directly under their own NPI
- Sign off on all clinical documentation
- Interpret data and make treatment decisions
- May bill CPT codes 97151, 97155, 97156, 97157, 97158 (QHP-only codes)

**Day-to-Day in Practice:**

- Reviews client data and progress across caseload
- Conducts assessments for new clients
- Develops and updates treatment plans
- Provides direct supervision to RBTs and BCaBAs (in-person and remote)
- Signs off on session notes and clinical documentation
- Communicates with families about treatment progress
- Coordinates with other providers (SLPs, OTs, schools)
- Manages authorization requests and renewals
- Reviews utilization data to ensure services stay within approved limits
- May handle some billing review or claim submission in small practices

**Data Access Needs:**

- All clinical data for their caseload (and supervisees' caseloads)
- Authorization data (approved units, utilization, expiry dates) for caseload planning
- Session data across their caseload for supervision and clinical review
- Client demographics, insurance info (for authorization requests)
- Assessment tools and results
- Treatment plans (full read/write)
- Scheduling for their caseload and supervisees
- Some billing visibility (what's been billed, claim status) — varies by practice

**Must Be Blocked From (in practices with dedicated admin/billing staff):**

- Practice-wide financial reports (revenue, collections, profit margins)
- Other BCBAs' caseload data (unless cross-coverage is configured)
- Staff compensation and HR data
- Practice settings (unless also an admin)
- Payer contract rates (unless also involved in billing)
- Billing write access (creating/submitting claims) — unless dual-role

### 1.4 Board Certified Behavior Analyst - Doctoral (BCBA-D)

**BACB Definition:** Doctoral-level designation for BCBAs who have completed a doctoral degree in behavior analysis or related field. The BCBA-D does NOT expand clinical scope of practice beyond the BCBA.

**Key Distinction:** The BCBA-D is not a higher-level credential with expanded clinical authority. It recognizes doctoral education and typically leads to academic, research, and advanced supervisory roles. BCBAs and BCBA-Ds have identical clinical and ethical responsibilities.

**Implication for Clinivise:** In a practice management system, BCBA-D should have the same permissions as BCBA. The distinction is informational (displayed on provider profile, used on claims with the HP modifier) rather than functional for access control.

**Recommendation:** Do not create a separate `bcba_d` role. Store BCBA-D as a credential type on the provider record (which we already do in `CREDENTIAL_TYPES`). The system role remains `bcba`. Display "BCBA-D" on the UI where the credential matters (provider profile, claim rendering).

### 1.5 Billing Staff

**Regulatory Context:** Billing staff are not BACB-credentialed roles. They are administrative staff who handle insurance verification, claim submission, payment posting, denial management, and financial reporting. In ABA practices, billing is notoriously complex due to authorization-based services, unit calculations, and payer-specific rules.

**Day-to-Day in Practice:**

- Verify insurance eligibility and benefits for new/existing clients
- Submit authorization requests (administrative side — BCBA provides clinical justification)
- Track authorization utilization to prevent over/under-billing
- Create and submit claims (CMS-1500 / EDI 837P)
- Post payments from insurance ERAs (835)
- Manage denials and appeals
- Run aging reports and follow up on unpaid claims
- Reconcile payments against contracted rates
- Generate financial reports for practice leadership

**Data Access Needs:**

- Client demographics and insurance information (full read/write)
- Authorization data (approved units, dates, utilization — full read, limited write)
- Session data (dates, CPT codes, units, provider — for claim creation; NOT clinical content)
- Billing rates, fee schedules, contracted rates
- Claims (full CRUD)
- Payments and ERAs (full CRUD)
- Payer information (full read/write)
- Financial reports and aging dashboards
- Provider NPI and credential information (for claim rendering)

**Must Be Blocked From:**

- Clinical content of session notes (behavioral data, skill acquisition data, incident details)
- Treatment plans and behavior intervention plans
- Assessment results and clinical progress notes
- Detailed client behavioral/medical history
- Clinical aspects of authorization letters (treatment justification)
- Ability to modify session clinical data
- Practice management settings (unless dual-role)
- Staff scheduling management

**HIPAA Minimum Necessary:**
Per HHS guidance, "a billing specialist does not need access to psychotherapy notes" and "billing staff should only access the least amount of PHI needed to process claims, such as diagnosis and procedure codes and insurance information — not the patient's entire clinical history." For ABA specifically, billing staff need to see: client name, DOB, insurance ID, diagnosis codes, CPT codes, units, dates of service, rendering/supervising provider, and place of service. They do NOT need session note content, behavioral data, or treatment plan details.

### 1.6 Admin (Office Manager / Practice Manager)

**Role Description:** Administrative staff who manage day-to-day operations of the practice. May or may not be clinically credentialed. In small ABA practices, this role often overlaps with billing, scheduling, and HR.

**Day-to-Day in Practice:**

- Manage staff onboarding, credential tracking, and offboarding
- Configure practice settings (locations, services, payer contracts)
- Handle scheduling for clinical staff and clients
- Manage client intake workflow
- Oversee authorization tracking and renewal
- Run operational reports
- Handle staff issues, timesheets, and payroll inputs
- Manage payer relationships and contract terms
- Configure system settings

**Data Access Needs:**

- All client data (demographics, insurance, status) — full CRUD
- Provider/staff data — full CRUD
- Authorization data — full CRUD
- Session data (scheduling, status, billing fields) — clinical content access varies
- Billing data — full read, typically write access too
- Practice settings — full CRUD
- Payer data — full CRUD
- Reports — all operational and financial reports
- Audit logs — full read access
- Team management — invite, deactivate, change roles

**Must Be Blocked From:**

- Certain clinical content may be restricted if admin is not clinically credentialed
- In practice, most small-practice admins have broad access
- Cannot delete audit logs or modify historical billing records

### 1.7 Owner (Practice Owner / Clinical Director)

**Role Description:** The practice owner. Usually a BCBA who founded or leads the practice. Has full system access. In Clerk's model, this maps to the organization creator.

**Data Access:**

- Everything. Full CRUD on all features.
- Only role that can manage organization settings, billing configuration, and subscription
- Only role that can transfer ownership
- Only role that can delete the organization or access destruction-level operations
- Full audit log access including export

**Distinction from Admin:**

- Owner can manage other admins (promote, demote, remove)
- Owner can access subscription/plan information
- Owner can configure SSO and security settings
- Owner is the final escalation point for access disputes

---

## 2. Competitor RBAC Analysis

### 2.1 CentralReach

**Overview:** The dominant ABA practice management platform, used by large multi-site practices. Known for its comprehensive feature set and equally comprehensive complexity.

**Permissions Model:**

- Fully granular, module-by-module permission system
- Permissions are organized by module: Contacts, Clinical, Billing, Claims, Scheduling, Timesheets, Reports, Learn (training), and Organization Account
- Each module has multiple individual permission toggles (estimated 50+ total)
- CentralReach recommends creating "custom permission groups" based on job descriptions
- No preset roles — every practice must configure permissions from scratch

**Key Billing Module Permissions:**

- Basic Billing Access (create timesheets)
- Access billing tab and create invoices
- Create and manage payments
- Manage timesheets on behalf of others
- View billed rates
- Access Service Codes and Fee Schedules

**Key Clinical Module Permissions:**

- Basic Clinical Access
- Create/view/edit/score assessments (ABLLS-R, AFLS)
- View and collect scores for assessments
- View finalized reports

**Key Scheduling Permissions:**

- Separate from clinical and billing
- Granular view/edit/manage toggles

**Organization Account Restrictions:**

- Only the main organization account can access: SSO settings, insurance verification settings, visit verification settings, organization claim settings, merchant settings, employee/client checklists, and agreed-rate toggling

**Pain Points (from user reviews on Capterra/Software Advice):**

- Steep learning curve; permissions setup is one of the most common onboarding complaints
- "Too many settings to configure" is a recurring theme
- Permission misconfiguration is a frequent support ticket category
- New employees often get either too much or too little access
- No recommended permission templates for common ABA roles
- System crashes and UI complexity compound the permissions problem

**Lesson for Clinivise:** CentralReach proves that fully granular permissions without good defaults is a UX antipattern for the ABA market. Practices want to get started quickly; they don't want to configure 50 toggles per role.

### 2.2 AlohaABA

**Overview:** Cloud-based ABA practice management popular with small to mid-size practices. Positioned as simpler than CentralReach.

**Permissions Model:**

- Role-based with custom user roles
- Accessed via Settings > Security > User Roles
- Permissions assigned individually and/or by job title
- Two access levels per feature: "View Only" or "Full Access"
- Permissions cover: files, rates, session notes, reports, and other resources
- By default, reports are only visible to those with admin permissions
- Staff can only view clients and complete sessions they're assigned to

**Key Design Decisions:**

- Simpler than CentralReach but still requires manual configuration
- Binary access model (view/full) rather than granular CRUD
- Client-level access scoping (staff see only assigned clients)
- Reports locked behind admin by default

**Pain Points:**

- When a staff member is deleted and recreated with the same email, the system treats it as a new record (user role must be reassigned)
- Limited documentation on exactly what each permission controls
- No preset role templates

**Lesson for Clinivise:** AlohaABA's binary (view/full) approach is simpler than CentralReach's granular toggles. Their client-level scoping (assigned clients only) is a good pattern for RBTs.

### 2.3 SimplePractice

**Overview:** General practice management platform (not ABA-specific) used by group therapy practices. Known for excellent UX and clear role definitions.

**Permissions Model — Clinician Roles (mutually exclusive):**

| Role                        | Own Clients      | All Clients | Billing          | Operations     |
| --------------------------- | ---------------- | ----------- | ---------------- | -------------- |
| **Entire Practice Access**  | Full manage      | Full manage | Yes              | Selected tools |
| **Full Client List Access** | Full manage      | View only   | No               | No             |
| **Billing Access**          | Full manage      | No access   | Own clients only | No             |
| **Basic Access**            | Care + docs only | No access   | No               | No             |

**Additional Clinician Role:**

- **Supervisor** — can be combined with any other clinician role. Allows reviewing supervisees' documentation and enabling supervisee billing.

**Administrative Roles (stackable with clinician roles):**

| Role                   | Scope                      | Key Capabilities                                      |
| ---------------------- | -------------------------- | ----------------------------------------------------- |
| **Practice Manager**   | All clients, all settings  | Full operational access except plan/subscription info |
| **Practice Biller**    | All clients (limited view) | Billing documents, payments, reports, payroll         |
| **Practice Scheduler** | All clients (limited view) | Scheduling tasks only                                 |

**Key Design Decisions:**

- Clinician roles are mutually exclusive (pick one); admin roles stack on top
- Supervisor is the only combinable clinician role
- Client-level access granting/revoking is possible regardless of role
- Account Owner and Practice Manager can adjust other clinicians' access levels
- Only Plus plan supports group practice features

**Pain Points:**

- Not ABA-specific (no authorization tracking, no CPT code awareness)
- Can't create custom roles beyond the 6 presets
- The "Billing Access" clinician role conflates clinical and billing in a way that doesn't map to ABA's clinical/billing separation

**Lesson for Clinivise:** SimplePractice's 4+3 role model (4 clinician levels + 3 admin functions) is the gold standard for UX clarity. The clinician/admin split and the ability to stack admin roles on top of clinician roles is a pattern worth adopting. Their approach is the closest to what Clinivise should target.

### 2.4 Theralytics

**Overview:** ABA-specific practice management software, positioned as budget-friendly for smaller practices.

**Permissions Model:**

- Role-based access controls (RBAC) described but not fully documented publicly
- Roles include: Clinician, Clinical Director, Administrative Team
- Configurable permissions per role — "letting practices tailor rules, permissions, locations, and service types"
- Scheduling can be centralized or shared with staff
- Automated authorization expiration tracking with role-based access
- Automatic session timeouts for shared devices

**Key Design Decisions:**

- Emphasis on role-based defaults that match ABA practice hierarchies
- Clinical Director has overview across staff utilization and compliance
- Administrative team has operational tools without full clinical access
- HIPAA-focused: encryption at rest/in transit, audit logging, session timeouts

**Lesson for Clinivise:** Theralytics confirms that ABA-specific platforms are converging on role-based defaults that mirror actual practice hierarchies (RBT < BCaBA < BCBA < Admin < Owner) rather than fully custom permission builders.

### 2.5 Comparative Summary

| Feature                  | CentralReach                | AlohaABA              | SimplePractice                | Theralytics    |
| ------------------------ | --------------------------- | --------------------- | ----------------------------- | -------------- |
| **Role count**           | Custom only                 | Custom + presets      | 7 preset                      | ~4 preset      |
| **Granularity**          | 50+ toggles                 | View/Full per feature | Preset bundles                | Configurable   |
| **Client scoping**       | Network-based               | Assignment-based      | Role + manual                 | Role-based     |
| **Preset templates**     | None                        | None                  | Yes (the roles ARE templates) | Yes            |
| **Admin/clinical split** | By permission               | By permission         | Explicit roles                | Explicit roles |
| **Stackable roles**      | N/A (all custom)            | N/A                   | Yes (admin on clinician)      | Unknown        |
| **Setup complexity**     | Very high                   | Medium                | Very low                      | Low            |
| **ABA-specific**         | Yes                         | Yes                   | No                            | Yes            |
| **User satisfaction**    | Mixed (power vs complexity) | Good                  | Very good                     | Good           |

---

## 3. HIPAA & Regulatory Constraints

### 3.1 The Minimum Necessary Standard

The HIPAA Privacy Rule (45 CFR 164.502(b)) requires covered entities to "make reasonable efforts to limit use, disclosure of, and requests for protected health information to the minimum necessary to accomplish the intended purpose."

**Practical Implementation for ABA:**

- A billing specialist should see diagnosis codes, CPT codes, units, dates of service, and insurance information — NOT full session notes, behavioral data, or treatment plan content
- An RBT should see their assigned clients' treatment targets and session plans — NOT insurance information, billing rates, or other clients' records
- A BCBA should see full clinical data for their caseload — but not necessarily practice-wide financial data or other BCBAs' clinical notes
- An admin/owner may need broad access but should still be restricted from clinical content if they are not clinically credentialed

**HHS Guidance Specifics:**

- "For internal uses, a covered entity must develop and implement policies and procedures that restrict access and uses of protected health information based on the specific roles of the members of their workforce"
- "A billing office sending information to an insurer should not include the patient's full clinical record if a treatment summary and relevant diagnosis codes suffice"
- Organizations must identify "classes of persons or job titles" that need access to PHI and define the categories of PHI each class needs

### 3.2 HIPAA Security Rule — Access Controls

The HIPAA Security Rule (45 CFR 164.312(a)) requires:

1. **Unique User Identification** (Required): Assign a unique name/number for identifying and tracking user identity
2. **Emergency Access Procedure** (Required): Establish procedures for obtaining necessary ePHI during an emergency
3. **Automatic Logoff** (Addressable): Implement electronic procedures to terminate sessions after inactivity
4. **Encryption and Decryption** (Addressable): Implement mechanism to encrypt/decrypt ePHI

**Audit Controls** (45 CFR 164.312(b)):

- Implement mechanisms that record and examine activity in information systems containing ePHI
- Must track: who accessed records, when, what actions they performed, what data they viewed
- Audit logs must be retained for minimum 6 years
- Audit logs themselves must be protected from unauthorized modification

### 3.3 BACB Ethics Code Requirements

**Ethics Code for Behavior Analysts (2022):**

**Section 2.01 — Protecting Confidentiality:**
Behavior analysts protect the confidentiality of clients, stakeholders, supervisees, trainees, and research participants. They share confidential information only when: (1) informed consent is obtained, (2) protecting client/others from harm, (3) resolving contractual issues, (4) preventing reasonably likely crime, or (5) compelled by law.

**Section 2.04 — Third-Party Sharing:**
"When authorized to discuss confidential information with a third party, they only share information critical to the purpose of the communication."

**Section 2.05 — Documentation Protection and Retention:**
Behavior analysts must be knowledgeable about and comply with all applicable requirements for storing, transporting, retaining, and destroying documentation.

**Section 2.06 — Accuracy in Service Billing and Reporting:**
"Behavior analysts identify their services accurately and include all required information on reports, bills, invoices, requests for reimbursement, and receipts." They do not implement or bill for services that are not necessary. They do not bill for services provided by someone other than the identified provider.

**Section 4 — Supervision:**
Supervisors ensure supervisees' performance is within the boundaries of their competence and their assigned responsibilities. Supervisors maintain documentation of supervision. Supervisors must be competent to provide supervision and maintain appropriate oversight volume.

**Implications for RBAC:**

- RBTs should not have access to information beyond what their supervisor has authorized them to see
- BCaBAs must have enough access to fulfill supervisory duties over RBTs, but under BCBA oversight
- Session documentation must be attributable to the specific provider who rendered the service
- Billing accuracy requires that the person submitting claims can verify service details (dates, units, codes, rendering provider) but not necessarily clinical content

### 3.4 Payer Audit Requirements

Insurance payers and government auditors check:

1. **Access control documentation**: Who has access to what, and is it role-appropriate?
2. **Audit trail integrity**: Can you produce a log showing who accessed/modified any given record?
3. **Session documentation matching**: Do session notes match billed units? (Clinical-billing correlation)
4. **Credential verification**: Was the rendering provider appropriately credentialed for the billed CPT code?
5. **Authorization compliance**: Were services provided within authorized date ranges and unit limits?
6. **Supervision documentation**: For RBT-rendered services, is there documented BCBA supervision?

**What payers specifically look for in audits:**

- That billing staff cannot modify clinical documentation
- That clinical documentation was signed by the rendering provider (not someone else)
- That session times and dates are accurate and not retroactively altered without audit trail
- That authorization utilization is tracked and services don't exceed approved units
- That staff credentials are current and match the billed modifiers (HM for RBT, HN for BCaBA, HO for BCBA, HP for BCBA-D)

### 3.5 State-Specific Considerations

Many states have additional requirements:

- Some states require BCBA access to all clinical records for supervisees at all times
- Some Medicaid programs require specific supervision ratios that must be documented
- Some states require electronic visit verification (EVV) with provider-specific authentication
- Virginia Medicaid specifically requires BCBA access documentation per their 2024 FAQs

**Recommendation:** Build the permission system to accommodate the strictest state requirements, then allow practices to relax where their state permits.

---

## 4. Permission Matrix

This is the primary deliverable. Each cell indicates the access level:

- **---** = No access (feature hidden from this role)
- **R** = Read only
- **RW** = Read + Write (create, edit)
- **RWD** = Read + Write + Delete/Archive
- **ADMIN** = Full administrative control
- **OWN** = Access limited to own records / assigned clients only
- **CASE** = Access limited to own caseload (assigned clients + supervisees' clients)

### 4.1 Core Navigation & Pages

| Feature / Page                      | Owner         | Admin               | BCBA         | BCaBA        | RBT                       | Billing Staff          |
| ----------------------------------- | ------------- | ------------------- | ------------ | ------------ | ------------------------- | ---------------------- |
| **Dashboard / Overview**            | Full practice | Full practice       | Own caseload | Own caseload | Own schedule              | Billing metrics        |
| **Clients list**                    | RWD all       | RWD all             | RW caseload  | R caseload   | R assigned                | R all (limited fields) |
| **Client detail — Demographics**    | RW            | RW                  | RW caseload  | R caseload   | R assigned                | R all                  |
| **Client detail — Insurance**       | RW            | RW                  | R caseload   | ---          | ---                       | RW all                 |
| **Client detail — Clinical notes**  | RW            | R (if credentialed) | RW caseload  | RW caseload  | R assigned (own notes RW) | ---                    |
| **Client detail — Contacts/Family** | RW            | RW                  | RW caseload  | R caseload   | R assigned                | R all                  |
| **Client detail — Documents**       | RW            | RW                  | RW caseload  | R caseload   | R assigned                | R (billing docs only)  |

### 4.2 Authorizations

| Feature                           | Owner         | Admin         | BCBA               | BCaBA        | RBT | Billing Staff              |
| --------------------------------- | ------------- | ------------- | ------------------ | ------------ | --- | -------------------------- |
| **Authorizations list**           | RW all        | RW all        | RW caseload        | R caseload   | --- | RW all                     |
| **Authorization detail**          | RW            | RW            | RW caseload        | R caseload   | --- | RW (admin fields)          |
| **Create authorization**          | Yes           | Yes           | Yes (own caseload) | No           | No  | Yes                        |
| **Edit authorization**            | Yes           | Yes           | Yes (own caseload) | No           | No  | Yes (dates, units, status) |
| **Upload auth letter (AI parse)** | Yes           | Yes           | Yes                | No           | No  | Yes                        |
| **Auth utilization view**         | Full practice | Full practice | Own caseload       | Own caseload | --- | Full practice              |
| **Auth alerts/warnings**          | All           | All           | Own caseload       | Own caseload | --- | All                        |

### 4.3 Sessions

| Feature                                            | Owner        | Admin               | BCBA              | BCaBA             | RBT                            | Billing Staff          |
| -------------------------------------------------- | ------------ | ------------------- | ----------------- | ----------------- | ------------------------------ | ---------------------- |
| **Sessions list**                                  | RW all       | RW all              | RW caseload       | RW caseload       | OWN RW                         | R all (billing fields) |
| **Log new session**                                | Yes          | Yes                 | Yes               | Yes               | Yes (own only)                 | No                     |
| **Edit session**                                   | All sessions | All sessions        | Caseload sessions | Caseload sessions | Own sessions (before sign-off) | No                     |
| **Cancel session**                                 | All          | All                 | Caseload          | Caseload          | Own (before sign-off)          | No                     |
| **Session clinical data** (targets, data, notes)   | RW all       | R (if credentialed) | RW caseload       | RW caseload       | OWN RW                         | ---                    |
| **Session billing fields** (CPT, units, modifiers) | RW           | RW                  | R caseload        | R caseload        | ---                            | R all                  |
| **Session sign-off / lock**                        | Yes          | Yes                 | Yes (caseload)    | No                | No                             | No                     |
| **View session timer**                             | Yes          | Yes                 | Yes               | Yes               | Yes (own)                      | No                     |
| **Bulk session operations**                        | Yes          | Yes                 | No                | No                | No                             | No                     |

### 4.4 Providers / Staff

| Feature                           | Owner  | Admin  | BCBA  | BCaBA                | RBT              | Billing Staff       |
| --------------------------------- | ------ | ------ | ----- | -------------------- | ---------------- | ------------------- |
| **Providers list**                | RW all | RW all | R all | R limited            | R (own profile)  | R (NPI/credentials) |
| **Provider detail — Profile**     | RW     | RW     | R     | R (own + supervisor) | R (own profile)  | R (billing fields)  |
| **Provider detail — Credentials** | RW     | RW     | R     | R (own)              | R (own)          | R                   |
| **Provider detail — Caseload**    | R all  | R all  | R own | R own                | ---              | ---                 |
| **Create provider**               | Yes    | Yes    | No    | No                   | No               | No                  |
| **Edit provider**                 | Yes    | Yes    | No    | No                   | Own profile only | No                  |
| **Deactivate provider**           | Yes    | Yes    | No    | No                   | No               | No                  |

### 4.5 Payers

| Feature                   | Owner | Admin | BCBA | BCaBA | RBT | Billing Staff |
| ------------------------- | ----- | ----- | ---- | ----- | --- | ------------- |
| **Payers list**           | RW    | RW    | R    | ---   | --- | RW            |
| **Payer detail**          | RW    | RW    | R    | ---   | --- | RW            |
| **Create / edit payer**   | Yes   | Yes   | No   | No    | No  | Yes           |
| **Fee schedules / rates** | RW    | RW    | ---  | ---   | --- | RW            |
| **Contracted rates**      | RW    | RW    | ---  | ---   | --- | RW            |

### 4.6 Billing (Phase 2)

| Feature                   | Owner | Admin | BCBA       | BCaBA | RBT | Billing Staff |
| ------------------------- | ----- | ----- | ---------- | ----- | --- | ------------- |
| **Claims list**           | RW    | RW    | R caseload | ---   | --- | RW all        |
| **Create / submit claim** | Yes   | Yes   | No         | No    | No  | Yes           |
| **Edit claim**            | Yes   | Yes   | No         | No    | No  | Yes           |
| **Void claim**            | Yes   | Yes   | No         | No    | No  | Yes           |
| **Payments / ERAs**       | RW    | RW    | ---        | ---   | --- | RW            |
| **Post payment**          | Yes   | Yes   | No         | No    | No  | Yes           |
| **Denial management**     | RW    | R     | ---        | ---   | --- | RW            |
| **Billing reports**       | Full  | Full  | ---        | ---   | --- | Full          |
| **Revenue dashboard**     | Full  | Full  | ---        | ---   | --- | Full          |
| **Aging reports**         | Full  | Full  | ---        | ---   | --- | Full          |

### 4.7 Settings & Administration

| Feature                   | Owner | Admin           | BCBA | BCaBA | RBT | Billing Staff |
| ------------------------- | ----- | --------------- | ---- | ----- | --- | ------------- |
| **Practice settings**     | RW    | RW              | ---  | ---   | --- | ---           |
| **Team management**       | ADMIN | ADMIN           | ---  | ---   | --- | ---           |
| **Invite members**        | Yes   | Yes             | No   | No    | No  | No            |
| **Change member roles**   | Yes   | Yes (not owner) | No   | No    | No  | No            |
| **Remove members**        | Yes   | Yes (not owner) | No   | No    | No  | No            |
| **Audit logs**            | R     | R               | ---  | ---   | --- | ---           |
| **Organization settings** | ADMIN | R               | ---  | ---   | --- | ---           |
| **Subscription / plan**   | ADMIN | ---             | ---  | ---   | --- | ---           |
| **Security settings**     | ADMIN | ADMIN           | ---  | ---   | --- | ---           |

### 4.8 Reports & Analytics

| Feature                             | Owner         | Admin         | BCBA            | BCaBA        | RBT          | Billing Staff     |
| ----------------------------------- | ------------- | ------------- | --------------- | ------------ | ------------ | ----------------- |
| **Utilization reports**             | Full practice | Full practice | Own caseload    | Own caseload | ---          | Full practice     |
| **Session summary reports**         | Full          | Full          | Own caseload    | Own caseload | Own sessions | ---               |
| **Financial reports**               | Full          | Full          | ---             | ---          | ---          | Full              |
| **Staff productivity**              | Full          | Full          | Own supervisees | ---          | ---          | ---               |
| **Authorization expiry report**     | Full          | Full          | Own caseload    | Own caseload | ---          | Full              |
| **Compliance / supervision report** | Full          | Full          | Own supervisees | ---          | ---          | ---               |
| **Export data**                     | Yes           | Yes           | Own caseload    | No           | No           | Billing data only |

### 4.9 AI Features

| Feature                           | Owner | Admin | BCBA           | BCaBA | RBT       | Billing Staff |
| --------------------------------- | ----- | ----- | -------------- | ----- | --------- | ------------- |
| **Auth letter AI parsing**        | Yes   | Yes   | Yes (caseload) | No    | No        | Yes           |
| **Session note AI assist**        | Yes   | Yes   | Yes            | Yes   | Yes (own) | No            |
| **Claim scrubbing AI** (Phase 2)  | Yes   | Yes   | No             | No    | No        | Yes           |
| **Treatment plan AI suggestions** | Yes   | R     | Yes            | R     | No        | No            |

---

## 5. Architecture Options

### 5.1 Option A: Preset Roles Only (Current State)

**Description:** Fixed set of 6 roles with hardcoded permission mappings. No customization.

**What we have today:**

```typescript
export const PERMISSIONS = {
  "clients.write": ["owner", "admin", "bcba"],
  "clients.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  "sessions.write": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "authorizations.write": ["owner", "admin", "bcba"],
  "providers.write": ["owner", "admin"],
  "payers.write": ["owner", "admin"],
  "settings.write": ["owner", "admin"],
} as const;
```

**Pros:**

- Simplest to implement and maintain
- No permission configuration UI needed
- Impossible to misconfigure
- Fast to audit ("what can an RBT do?" has one definitive answer)
- Aligns with HIPAA minimum necessary (we define exactly what each role needs)
- Matches SimplePractice's successful approach

**Cons:**

- No flexibility for practices with non-standard role needs
- A BCBA who also does billing can't have billing access without being made admin
- A billing staff member who also schedules can't see schedules without role change
- No way to handle the "small practice where everyone does everything" case

**Verdict:** Good for Phase 1 but insufficient for Phase 2+ as billing features are added.

### 5.2 Option B: Preset Roles + Per-Feature Overrides (Recommended)

**Description:** Ship the 6 preset roles with comprehensive default permissions (from the matrix above). Allow admins/owners to grant additional per-feature permissions to individual users.

**Implementation Model:**

```
User's effective permissions = Role defaults + Individual overrides
```

Overrides can only ADD permissions, never remove them. This prevents accidentally locking someone out of features they need for their role.

**Example:**

- "Dr. Smith is a BCBA who also handles billing. Her role is `bcba`, but she has override permissions: `billing.read`, `billing.write`, `claims.write`."
- "Maria is a billing staff member who also manages scheduling. Her role is `billing_staff`, but she has override permissions: `scheduling.write`."

**UI Pattern (Team page):**

1. Select a member
2. See their current role and its default permissions
3. Toggle on additional permissions from a categorized list
4. Changes take effect immediately with audit log entry

**Pros:**

- Covers 95%+ of use cases with preset roles alone
- Overrides handle edge cases without full custom role builder complexity
- Additive-only model prevents accidental lockouts
- Easy to audit (base role + list of explicit overrides)
- Low implementation cost (extend existing PERMISSIONS map with DB-stored overrides)
- Matches the SimplePractice model (preset roles + stackable admin capabilities)

**Cons:**

- Overrides could accumulate, becoming hard to track (mitigated by per-user override display)
- Doesn't support "remove a default permission" (by design, but some practices may want this)
- Still requires a small UI for managing overrides

**Verdict:** Best balance of simplicity, compliance, and flexibility for Clinivise's target market.

### 5.3 Option C: Fully Custom Permission Builder

**Description:** Allow admins to create entirely custom roles by selecting individual permissions from a comprehensive list. Similar to CentralReach's model.

**Implementation:**

- Define ~40-60 individual permissions
- Allow creation of custom role "templates" that bundle permissions
- Each role is a named collection of permissions
- New users are assigned a role template, with optional per-user overrides

**Pros:**

- Maximum flexibility
- Handles any organizational structure
- Enterprise-friendly for large multi-site practices

**Cons:**

- Massive implementation cost (permission builder UI, role template management, migration tooling)
- CentralReach's biggest pain point is this exact feature — users find it overwhelming
- Increases HIPAA audit surface (auditors must review custom roles, not just preset definitions)
- Easy to misconfigure (over-permissioned or under-permissioned users)
- Small practices (Clinivise's target) don't need or want this level of control
- The "role explosion" problem: custom roles proliferate and become unmaintainable

**Verdict:** Overkill for Phase 1-3. Consider only if Clinivise expands to enterprise/multi-site market.

---

## 6. Recommended Design for Clinivise

### 6.1 Approach: Preset Roles + Additive Overrides (Option B)

**Phase 1 (Now):** Expand the existing 6 preset roles with the full permission matrix from Section 4. No UI for overrides yet — just hardcoded defaults.

**Phase 1 Polish / Phase 2:** Add per-user override toggles on the Team page. Start with the most-requested overrides:

- `billing.read` — for BCBAs who need to see claim status
- `billing.write` — for BCBAs who also submit claims
- `authorizations.write` — for billing staff who manage auth renewals
- `scheduling.write` — for billing staff who also handle scheduling
- `reports.financial` — for BCBAs who need revenue visibility

**Phase 3+:** If demand emerges, add the ability to create named "custom roles" that bundle overrides. This is Option C, but deferred.

### 6.2 Expanded Permission Map

Replace the current 7-permission map with a comprehensive set. Here is the recommended permission structure:

```typescript
export const PERMISSIONS = {
  // ── Clients ────────────────────────────────────────────────
  "clients.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  "clients.write": ["owner", "admin", "bcba"],
  "clients.delete": ["owner", "admin"],
  "clients.insurance.read": ["owner", "admin", "bcba", "billing_staff"],
  "clients.insurance.write": ["owner", "admin", "billing_staff"],
  "clients.clinical.read": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "clients.clinical.write": ["owner", "admin", "bcba", "bcaba"],

  // ── Sessions ───────────────────────────────────────────────
  "sessions.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  "sessions.write": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "sessions.clinical.read": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "sessions.clinical.write": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "sessions.billing.read": ["owner", "admin", "bcba", "billing_staff"],
  "sessions.billing.write": ["owner", "admin", "billing_staff"],
  "sessions.signoff": ["owner", "admin", "bcba"],
  "sessions.bulk": ["owner", "admin"],

  // ── Authorizations ─────────────────────────────────────────
  "authorizations.read": ["owner", "admin", "bcba", "bcaba", "billing_staff"],
  "authorizations.write": ["owner", "admin", "bcba", "billing_staff"],
  "authorizations.upload": ["owner", "admin", "bcba", "billing_staff"],

  // ── Providers ──────────────────────────────────────────────
  "providers.read": ["owner", "admin", "bcba", "bcaba", "billing_staff"],
  "providers.write": ["owner", "admin"],
  "providers.credentials": ["owner", "admin", "billing_staff"],

  // ── Payers ─────────────────────────────────────────────────
  "payers.read": ["owner", "admin", "bcba", "billing_staff"],
  "payers.write": ["owner", "admin", "billing_staff"],
  "payers.rates": ["owner", "admin", "billing_staff"],

  // ── Billing (Phase 2) ─────────────────────────────────────
  "billing.read": ["owner", "admin", "billing_staff"],
  "billing.write": ["owner", "admin", "billing_staff"],
  "billing.claims.write": ["owner", "admin", "billing_staff"],
  "billing.payments.write": ["owner", "admin", "billing_staff"],
  "billing.reports": ["owner", "admin", "billing_staff"],

  // ── Reports ────────────────────────────────────────────────
  "reports.clinical": ["owner", "admin", "bcba", "bcaba"],
  "reports.financial": ["owner", "admin", "billing_staff"],
  "reports.utilization": ["owner", "admin", "bcba", "bcaba", "billing_staff"],
  "reports.export": ["owner", "admin"],

  // ── Settings & Admin ───────────────────────────────────────
  "settings.read": ["owner", "admin"],
  "settings.write": ["owner", "admin"],
  "team.read": ["owner", "admin"],
  "team.write": ["owner", "admin"],
  "team.invite": ["owner", "admin"],
  "team.roles": ["owner", "admin"],
  "audit.read": ["owner", "admin"],
  "organization.write": ["owner"],
  "subscription.manage": ["owner"],

  // ── AI Features ────────────────────────────────────────────
  "ai.auth_parse": ["owner", "admin", "bcba", "billing_staff"],
  "ai.session_assist": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "ai.claim_scrub": ["owner", "admin", "billing_staff"],
} as const;
```

### 6.3 Caseload Scoping (Data-Level Access)

The permission map above controls **feature-level** access (can you see the Sessions page?). **Data-level** access determines **which** sessions you see:

| Role          | Data Scope                                                                  |
| ------------- | --------------------------------------------------------------------------- |
| Owner         | All practice data                                                           |
| Admin         | All practice data                                                           |
| BCBA          | Own caseload: assigned clients + supervisees' assigned clients              |
| BCaBA         | Own caseload: assigned clients + supervisees' assigned clients (under BCBA) |
| RBT           | Own assignments only: sessions they are the rendering provider for          |
| Billing Staff | All clients (billing/insurance fields only)                                 |

**Implementation:** Add a `getCaseloadFilter(userId, role)` query helper that returns the appropriate WHERE clause:

- For owner/admin: `WHERE organization_id = ?`
- For bcba: `WHERE client_id IN (SELECT client_id FROM provider_clients WHERE provider_id = ? OR provider_id IN (SELECT id FROM providers WHERE supervisor_id = ?))`
- For rbt: `WHERE rendering_provider_id = ?`
- For billing_staff: `WHERE organization_id = ?` (but field-level filtering applied)

### 6.4 Implementation Plan: Clerk + Database Hybrid

**Why Hybrid?** Clerk handles authentication and organization membership. But Clerk's custom permissions model (limited to 10 custom roles, permissions tied to "features" in the Clerk dashboard) doesn't map well to ABA's nuanced data-level scoping. Our approach:

**Clerk's responsibilities:**

- Authentication (sign in, sign out, MFA)
- Organization membership (who belongs to which practice)
- Basic role storage (synced to our DB via webhook)
- Session management and token issuance

**Our DB's responsibilities:**

- Role assignment (stored in `users.role`)
- Permission evaluation (our `PERMISSIONS` map + override table)
- Caseload scoping (provider-client assignments)
- Data-level filtering (which clients/sessions a user can see)
- Override permissions (per-user additive permissions)
- Audit logging of access decisions

**Sync model:**

1. Clerk manages org membership (invite, accept, remove)
2. Clerk webhook fires on membership change
3. Our webhook handler creates/updates/deactivates user record in our `users` table
4. Role is set in our DB (not relying on Clerk's role system for permissions)
5. All permission checks run against our DB, not Clerk session claims
6. This avoids the "System Permissions aren't included in session claims" limitation

**New DB table for overrides (Phase 2):**

```sql
CREATE TABLE permission_overrides (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  permission TEXT NOT NULL,  -- e.g., 'billing.read'
  granted_by TEXT NOT NULL REFERENCES users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, user_id, permission)
);
```

**Permission check function (updated):**

```typescript
export async function hasPermission(
  userId: string,
  orgId: string,
  permission: Permission,
): Promise<boolean> {
  // 1. Check role-based default
  const user = await getUserWithRole(userId, orgId);
  if (!user) return false;

  const rolePermissions = PERMISSIONS[permission];
  if (rolePermissions?.includes(user.role)) return true;

  // 2. Check individual overrides (Phase 2)
  const override = await getActiveOverride(userId, orgId, permission);
  return !!override;
}
```

### 6.5 Team Page UI Design

The Team page should follow SimplePractice's model with Clinivise's design system:

**Page Layout:**

```
[Page Header: "Team" + "Invite Member" button]

[Metric Cards Row]
  - Total Members: 12
  - Active Today: 8
  - Pending Invitations: 2
  - Roles: 4 unique

[Section Card: "Team Members"]
  [Filter bar: Search | Role filter dropdown | Status filter]
  [Data table]
    Name | Email | Role | Status | Last Active | Actions
    ─────────────────────────────────────────────────────
    Dr. Sarah Kim | sarah@... | BCBA | Active | 2h ago | [Edit] [...]
    James Lee    | james@... | RBT  | Active | 15m ago | [Edit] [...]
    Maria G.     | maria@... | Billing Staff | Active | 1d ago | [Edit] [...]
    [Invited]    | new@...   | RBT  | Pending | — | [Resend] [Revoke]

[Section Card: "Role Definitions"]
  [Expandable role cards showing what each role can do]
    Owner: Full practice access. Can manage subscription, team roles, and settings.
    Admin: Full operational access. Can manage team, clients, and settings.
    BCBA: Full clinical access for caseload. Can manage authorizations and sessions.
    BCaBA: Clinical access under BCBA supervision. Can supervise RBTs.
    RBT: Direct care access. Can log sessions and view assigned clients.
    Billing Staff: Financial access. Can manage claims, payments, and authorizations.
```

**Member Detail / Edit Sheet (slide-over):**

```
[Member Header]
  Name: Dr. Sarah Kim
  Email: sarah@example.com
  Status: Active
  Joined: Jan 15, 2026
  Last Active: 2 hours ago

[Section: Role]
  Current Role: [BCBA ▼]  (dropdown)
  [Info text: "BCBAs have full clinical access for their caseload.
   See permission details below."]

[Section: Default Permissions (read-only display)]
  ✓ Clients — Read/Write (caseload)
  ✓ Sessions — Read/Write/Clinical (caseload)
  ✓ Authorizations — Read/Write (caseload)
  ✓ Providers — Read
  ✓ Reports — Clinical + Utilization
  ✗ Billing — No access
  ✗ Settings — No access
  ✗ Team — No access

[Section: Additional Permissions (Phase 2)]
  [Toggle] Billing — Read       [Off]
  [Toggle] Billing — Write      [Off]
  [Toggle] Financial Reports    [Off]
  [Toggle] Payer Rates          [Off]

[Section: Danger Zone]
  [Remove from practice] — requires confirmation
```

### 6.6 What to Build Now vs. Defer

**Build Now (Phase 1):**

1. Expand `PERMISSIONS` map from 7 to ~35 permissions (as specified in Section 6.2)
2. Add caseload scoping to queries (BCBAs see caseload, RBTs see assigned)
3. Update sidebar nav to reflect new permissions
4. Add `requirePermission()` checks to all server actions
5. Add `requirePermission()` checks to all page-level guards
6. Build Team page with member list, role display, and invite flow
7. Build role change UI (dropdown on member detail)
8. Add permission descriptions to role display (so users understand what each role can do)

**Defer to Phase 2:**

1. Per-user permission overrides (DB table + UI toggles)
2. Billing-specific permissions (no billing features yet)
3. Report-specific permissions (reports page not yet built)
4. AI feature permissions (AI features still basic)
5. Custom role builder (Option C — likely never needed for target market)
6. Permission audit reporting (who has what permissions, when changed)

**Defer to Phase 3+:**

1. Client-level access grants (specific user can see specific client, regardless of role)
2. Time-based permissions (temporary access for coverage)
3. Supervisor chain access (BCBA can see all supervisees' supervisees)
4. Break-glass emergency access
5. Permission request workflow (RBT requests access, BCBA approves)

---

## 7. Frontier Patterns

### 7.1 AI-Native Role Suggestions

Emerging SaaS platforms are beginning to use AI to suggest role assignments and permission adjustments:

- **Onboarding intelligence:** When adding a new team member, AI analyzes their job title, credentials, and the practice's existing role distribution to suggest the appropriate role. "You're adding Dr. Jones with a BCBA credential — suggested role: BCBA."
- **Permission drift detection:** AI monitors permission override accumulation and alerts admins when a user's effective permissions diverge significantly from their base role. "Maria (RBT) has 5 override permissions that collectively equal Admin access — consider changing her role."
- **Usage-based permission suggestions:** Track which features each role actually uses over time. If no RBT ever accesses a particular feature, suggest removing it from the RBT default permissions.

**Clinivise opportunity:** Since we already have an AI layer, we could add a "Smart Permissions" feature that suggests role assignments during team member onboarding based on credential type and job description.

### 7.2 Contextual Permissions

Moving beyond static role assignments to context-aware access:

- **Time-based access:** During a coverage situation (BCBA on vacation), temporarily grant another BCBA access to their caseload without changing roles.
- **Location-based access:** In multi-site practices, limit certain staff to data from their location only.
- **Status-based access:** When a client's authorization is in "pending" status, grant the billing staff write access to the clinical justification field (normally clinical-only) so they can facilitate the authorization process.

### 7.3 Attribute-Based Access Control (ABAC)

Beyond RBAC, the industry is moving toward ABAC where access decisions consider multiple attributes:

- User attributes (role, credential, location, department)
- Resource attributes (client status, document type, sensitivity level)
- Environmental attributes (time of day, IP address, device type)
- Action attributes (read vs write vs export)

**Example:** "A BCBA can edit treatment plans for active clients in their caseload during business hours from a managed device" — this is ABAC, not pure RBAC.

**Recommendation for Clinivise:** Stay with RBAC for now. ABAC adds complexity that our target market (small practices) doesn't need. Revisit if we expand to enterprise.

### 7.4 Credential-Aware Permission Enforcement

A frontier pattern specific to healthcare: tie system permissions to real-time credential status.

- If a BCBA's certification lapses (BACB shows expired), automatically restrict their access to read-only clinical and disable session sign-off.
- If an RBT's credential expires, block session logging until renewed.
- Integrate with BACB's certification verification API to check in real-time.

**Clinivise opportunity:** We already track `CREDENTIAL_TYPES` on providers. Adding expiration dates and auto-restriction on lapse would be a strong compliance differentiator.

### 7.5 Emerging Standards

- **SMART on FHIR:** Healthcare-specific authorization standard gaining traction. Defines scopes like `patient/Observation.read` that map to FHIR resource access. Relevant if Clinivise ever integrates with hospital EHR systems.
- **OpenFGA / Zanzibar:** Google's relationship-based access control model (used by Google Docs sharing). Could model complex ABA relationships (this RBT is supervised by this BCaBA who is supervised by this BCBA who owns this caseload).
- **Cedar (Amazon):** Policy language for fine-grained authorization. Could define rules like: `permit(principal in Role::"bcba", action == "signoff", resource in Caseload::"bcba-123")`.

**Recommendation:** None of these are needed now. Awareness is sufficient; adopt only if a specific integration requires it.

---

## 8. Risks & Edge Cases

### 8.1 Role Escalation

**Risk:** A user's role is changed (e.g., RBT promoted to BCaBA) but they retain cached permissions from the old role, or session tokens still carry old role claims.

**Mitigation:**

- Store role in our DB, not Clerk session claims
- Check role on every request (our `requireAuth()` already does this — it queries the DB)
- When role changes, the next page load gets the new role
- No need for session invalidation since we don't cache role in JWT

### 8.2 Multi-Role Users

**Risk:** In small practices, one person wears multiple hats (BCBA + billing + admin). Our system assigns one role per user.

**Mitigation (current):** Assign the highest role needed. A BCBA who does billing should be `admin` (which has both clinical and billing access).

**Mitigation (Phase 2):** Per-user permission overrides. The BCBA keeps the `bcba` role but gets `billing.read`, `billing.write` overrides. This is cleaner because it preserves the intent (they're a BCBA with extra billing access) rather than over-promoting to admin.

### 8.3 Supervisor Access Chain

**Risk:** When a BCBA supervises BCaBAs who supervise RBTs, the BCBA needs access to the full chain of client data. If the caseload scoping only looks one level deep, the BCBA can't see their BCaBA's RBTs' session data.

**Mitigation:** Caseload scoping must traverse the supervision chain:

1. BCBA's directly assigned clients
2. - Clients assigned to BCaBAs supervised by this BCBA
3. - Clients assigned to RBTs supervised by this BCBA or their BCaBAs

**SQL pattern:**

```sql
WHERE client_id IN (
  -- Direct assignments
  SELECT client_id FROM provider_clients WHERE provider_id = :bcba_id
  UNION
  -- Supervisees' assignments (BCaBAs and RBTs)
  SELECT client_id FROM provider_clients
  WHERE provider_id IN (
    SELECT id FROM providers WHERE supervisor_id = :bcba_id
  )
  UNION
  -- Supervisees' supervisees (RBTs under BCaBAs under this BCBA)
  SELECT client_id FROM provider_clients
  WHERE provider_id IN (
    SELECT id FROM providers WHERE supervisor_id IN (
      SELECT id FROM providers WHERE supervisor_id = :bcba_id
    )
  )
)
```

### 8.4 BCBA Departure and Client Reassignment

**Risk:** When a BCBA leaves the practice, all their clients need to be reassigned. During the transition, session notes and treatment plans must remain accessible to the new BCBA.

**Mitigation:**

1. **Before departure:** Admin reassigns all clients to new BCBA(s) using a bulk reassignment tool
2. **During transition:** Old BCBA's access is set to read-only for a configurable transition period (e.g., 30 days) to allow handover
3. **After departure:** Old BCBA's account is deactivated (soft delete — they can't log in, but their historical data attributions remain intact for audit purposes)
4. **Data integrity:** The old BCBA's name remains on historical session notes and treatment plans (they rendered/signed those services). The new BCBA is linked as the current supervising BCBA.

**Recommended workflow:**

```
Admin opens departing BCBA's profile
→ "Transfer Caseload" action
→ Select target BCBA(s)
→ Bulk reassign clients (with option to split)
→ System sends notification to new BCBA(s)
→ Admin sets departure date
→ On departure date: account auto-transitions to read-only
→ After transition period: account deactivated
```

### 8.5 Credential Expiry

**Risk:** An RBT's certification expires (BACB requires annual renewal). They should not be able to log sessions under an expired credential, as this would create billing compliance issues.

**Mitigation:**

- Track credential expiration dates on provider records
- System warning at 60/30/14/7 days before expiry
- On expiry: automatically restrict session logging (soft block with admin override)
- Admin can override if credential renewal is in progress (with audit log entry)
- Credential status should be visible on provider profile and in session form validation

### 8.6 External Auditor Access

**Risk:** Payers or compliance auditors may need temporary read-only access to specific client records during an audit.

**Mitigation:**

- Do NOT create system accounts for external auditors
- Instead, export audit-ready reports and documentation bundles
- If real-time access is needed, create a time-limited read-only account with specific client scope
- Log all auditor access separately in the audit trail
- Auto-deactivate after the audit period

### 8.7 Client-Level Access Restrictions

**Risk:** In some cases, a client needs to be restricted from certain staff members (e.g., conflict of interest, request by family, legal restriction).

**Mitigation (deferred):**

- Client-level access block list: specific users cannot see this client, regardless of role
- Implementation: add a `client_access_blocks` table
- Override caseload scoping to exclude blocked users
- Rare edge case — defer to Phase 3

### 8.8 Concurrent Role Changes During Active Session

**Risk:** A user's role is changed while they have an active session timer running. If they lose `sessions.write`, can they still save their in-progress session?

**Mitigation:**

- Permission checks happen at save time, not during data entry
- Grace period: if a session was started before the role change, allow saving within 24 hours
- Alternative: check permission at session start and don't re-check mid-session (simpler, slightly less secure)
- Recommended: the simpler approach. Re-checking at save time with a 24-hour grace period adds complexity for an extremely rare edge case.

---

## 9. Sources

### BACB & Regulatory

- [BACB Ethics Code for Behavior Analysts (2022)](https://www.bacb.com/wp-content/uploads/2022/01/Ethics-Code-for-Behavior-Analysts-240830-a.pdf)
- [RBT Ethics Code 2.0](https://www.bacb.com/wp-content/uploads/2022/01/RBT-Ethics-Code-240830-a.pdf)
- [BACB Ethics Information](https://www.bacb.com/ethics-information/ethics-codes/)
- [BCaBA Handbook](https://www.bacb.com/wp-content/uploads/2021/09/BCaBAHandbook_210915-2.pdf)
- [BCBA Handbook](https://www.bacb.com/wp-content/uploads/2025/08/BCBAHandbook_260130-a.pdf)
- [BACB Supervision & Training Requirements](https://www.bacb.com/supervision-and-training/)
- [BACB RBT Certification](https://www.bacb.com/rbt/)
- [BACB BCBA Certification](https://www.bacb.com/bcba/)

### HIPAA & Healthcare Compliance

- [HHS Summary of HIPAA Privacy Rule](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html)
- [HHS Summary of HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
- [HHS Minimum Necessary FAQ](https://www.hhs.gov/hipaa/for-professionals/faq/minimum-necessary/index.html)
- [HHS Uses and Disclosures for Treatment, Payment, and Operations](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/disclosures-treatment-payment-health-care-operations/index.html)
- [HIPAA Journal — Minimum Necessary Rule Standard](https://www.hipaajournal.com/ahima-hipaa-minimum-necessary-standard-3481/)
- [HIPAA Journal — Audit Checklist 2026](https://www.hipaajournal.com/hipaa-audit-checklist/)
- [HIPAA Journal — Psychotherapy Notes and HIPAA](https://www.hipaajournal.com/psychotherapy-notes-and-hipaa/)
- [Secureframe — Minimum Necessary Rule](https://secureframe.com/hub/hipaa/minimum-necessary-rule)
- [Kiteworks — HIPAA Audit Log Requirements](https://www.kiteworks.com/hipaa-compliance/hipaa-audit-log-requirements/)
- [HHS Audit Protocol (2018)](https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/audit/protocol/index.html)
- [Censinet — HIPAA Access Control Requirements](https://censinet.com/hipaa-access-control-requirements-explained)
- [Konfirmity — HIPAA Role-Based Access Control Best Practices 2026](https://www.konfirmity.com/blog/hipaa-role-based-access-control-for-hipaa)

### Competitor Platforms

- [CentralReach — Permissions Explained](https://help.centralreach.com/permissions-explained/)
- [CentralReach — Billing Module Permissions](https://help.centralreach.com/billing-module-permissions/)
- [CentralReach — Claims Module Permissions](https://help.centralreach.com/claims-module-permissions/)
- [CentralReach — Scheduling Module Permissions](https://help.centralreach.com/scheduling-module-permissions/)
- [CentralReach — Clinical Manager Permissions](https://help.centralreach.com/learn-manager-permissions/)
- [CentralReach — Organization Account Functionality](https://help.centralreach.com/organization-account-functionality/)
- [CentralReach Reviews — Capterra](https://www.capterra.com/p/140743/CentralReach/reviews/)
- [CentralReach Reviews — Software Advice](https://www.softwareadvice.com/medical/centralreach-profile/reviews/)
- [AlohaABA — Creating User Roles](https://support.alohaaba.com/portal/en/kb/articles/creating-assigning-user-roles)
- [AlohaABA — Compliance and Security](https://alohaaba.com/features/compliance-tracking-and-validation)
- [SimplePractice — Clinician Roles](https://support.simplepractice.com/hc/en-us/articles/360052700171-Clinician-roles-available-for-team-members)
- [SimplePractice — Administrative Roles](https://support.simplepractice.com/hc/en-us/articles/41959530341133-Administrative-roles-available-for-team-members)
- [SimplePractice — Team Members and Group Practices](https://support.simplepractice.com/hc/en-us/sections/360010505012-Team-Members-and-Group-Practices)
- [Theralytics — Security](https://www.theralytics.net/security)
- [Theralytics — Scheduling Software](https://www.theralytics.net/aba-therapy-scheduling-software)

### ABA Practice Operations

- [CentralReach — ABA Therapy Certification Explained](https://centralreach.com/blog/aba-therapy-certification-explained-rbt-bcaba-bcba-bcba-d/)
- [ABA Master's Programs — BCBA-D](https://abamastersprograms.org/licensure/bcba-d/)
- [FlashGenius — BCBA vs BCBA-D](https://flashgenius.net/blog-article/bcba-vs-bcba-d-requirements-exam-cost-and-roi)
- [ABA Technologies — RBT Training](https://www.abatechnologies.com/corporate/rbt-training)
- [Raven Health — HIPAA Features for ABA](https://ravenhealth.com/blog/hipaa-features-for-aba-practices/)
- [S Cubed — ABA Client Data Security Guide](https://scubed.io/blog/aba-client-data-security-guide)
- [Praxis Notes — ABA Documentation Best Practices for RBTs](https://www.praxisnotes.com/resources/aba-documentation-best-practices-rbts)
- [Praxis Notes — ABA Documentation Checklist RBTs 2025](https://www.praxisnotes.com/resources/aba-documentation-checklist-rbts-2025)
- [Raintree — Turnover in ABA Therapy](https://www.raintreeinc.com/blog/therapist-turnover-in-aba/)
- [ABA Matrix — Practice Management Software Tasks](https://www.abamatrix.com/aba-practice-management-software-tasks/)
- [Practice RBT Exam — ABA Administration Jobs](https://practicerbtexam.com/aba-administration-jobs/)
- [MBWRCM — BCBA Billing Guide for RBT Supervision](https://www.mbwrcm.com/the-revenue-cycle-blog/bcba-billing-rbt-supervision-guide)

### RBAC Design Patterns

- [EnterpriseReady — Role-Based Access Control Guide](https://www.enterpriseready.io/features/role-based-access-control/)
- [Perpetual — How to Design Effective SaaS Roles and Permissions](https://www.perpetualny.com/blog/how-to-design-effective-saas-roles-and-permissions)
- [UX Design / Licia — Designing Permissions for a SaaS App](https://uxdesign.cc/design-permissions-for-a-saas-app-db6c1825f20e)
- [ContentSquare — Structure Permissions in SaaS App](https://contentsquare.com/blog/structure-permissions-saas-app/)
- [Cerbos — 3 Most Common Authorization Designs for SaaS](https://www.cerbos.dev/blog/3-most-common-authorization-designs-for-saas-products)
- [AccountableHQ — RBAC in Healthcare](https://www.accountablehq.com/post/role-based-access-control-rbac-in-healthcare-benefits-examples-and-best-practices)
- [PMC / NIH — Health Information System RBAC Current Trends](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836325/)
- [Enter Health — Role-Based Access Control in Healthcare RCM](https://www.enter.health/post/role-based-access-control-healthcare-rcm)
- [IBM — What Is RBAC](https://www.ibm.com/think/topics/rbac)
- [Censinet — RBAC Best Practices for Clinical Applications](https://www.censinet.com/perspectives/rbac-best-practices-securing-clinical-applications)

### Clerk / Technical Implementation

- [Clerk — Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions)
- [Clerk — Check Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/check-access)
- [Clerk — Organizations Overview](https://clerk.com/docs/guides/organizations/overview)
- [Clerk — Basic RBAC with Metadata](https://clerk.com/docs/guides/secure/basic-rbac)
- [Clerk — Organization Roles and Permission API Management (2025)](https://clerk.com/changelog/2025-11-24-organization-roles-and-permission-bapi-management)
- [Clerk — clerkMiddleware()](https://clerk.com/docs/reference/nextjs/clerk-middleware)
- [Clerk — Protect Component](https://clerk.com/docs/nextjs/reference/components/control/protect)
- [Clerk — Implement RBAC in Next.js 15](https://clerk.com/blog/nextjs-role-based-access-control)

### Healthcare Access Control Patterns

- [Censinet — Break-Glass Access Pros and Cons](https://censinet.com/perspectives/break-glass-access-pros-and-cons-for-healthcare)
- [Yale HIPAA — Break Glass Procedure](https://hipaa.yale.edu/security/break-glass-procedure-granting-emergency-access-critical-ephi-systems)
- [AMA — Break-the-Glass EHR Functionality](https://www.ama-assn.org/practice-management/digital/break-glass-ehr-functionality)
- [HHS — HC3 Intelligence Briefing: Access Control on Health Information Systems](https://www.hhs.gov/sites/default/files/hc3-intelligence-briefing-access-control-on-health-information-systems.pdf)
