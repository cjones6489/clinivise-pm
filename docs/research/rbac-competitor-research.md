# RBAC Competitor Research: ABA Therapy & Healthcare PM Tools

## Comparison Table

| Platform            | # Roles                                   | Preset/Custom                                                            | Granularity                                                                               | Role Management Location                        | Known Issues                                                                                              |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **CentralReach**    | System groups + unlimited custom          | Both (system presets + fully custom groups)                              | Very high: 10+ permission modules, dozens of individual toggles per module                | Permissions module (padlock icon)               | Overly complex for small practices; weeks of setup; requires IT staff; steep learning curve               |
| **AlohaABA**        | Custom roles (user-defined)               | Custom (3-tier per feature: No Access / View Only / Full Access)         | Medium-high: per-module, per-feature permission matrix                                    | Settings > Security > User Roles                | Limited public documentation; no preset templates mentioned                                               |
| **SimplePractice**  | ~7 preset roles                           | Preset only (no custom roles)                                            | Low-medium: preset bundles, few additional toggleable permissions                         | Settings > Team Members (Account Owner manages) | Rigid; can't customize roles; must delete and re-invite to change role type; not designed for large teams |
| **Motivity**        | 1 preset (Owner) + unlimited custom       | Both (Owner preset + custom roles)                                       | Medium-high: 3-position slider per permission (None / If Assigned / Full)                 | Settings > Roles                                | Clinically focused (learner/data permissions); limited practice management scope                          |
| **TherapyNotes**    | 6 preset roles                            | Preset only (stackable; users can hold multiple)                         | Low-medium: role = fixed bundle of capabilities; one global toggle for patient visibility | User Management (Practice Admin only)           | No custom roles; no per-feature granularity; adequate for small practices but inflexible                  |
| **Theralytics**     | ~3 preset roles                           | Preset (configurable scheduling permissions)                             | Low-medium: role-based with configurable scheduling rules                                 | Settings (exact path undocumented publicly)     | Minimal public documentation on permission system                                                         |
| **Raven Health**    | Role-based (BCBA, RBT, Admin, Parent)     | Preset (role = job function)                                             | Low: auto-scoped views per role type                                                      | Not publicly documented                         | Sparse documentation; unclear if customizable                                                             |
| **Healthie**        | 2 base roles + unlimited custom templates | Both (Standard/Support base + custom permission templates)               | Very high: 70+ individual permissions across 13 categories                                | Settings > Organization > Members               | Complexity overhead for small teams; 70+ checkboxes can overwhelm; powerful but requires deliberate setup |
| **Practice Better** | Up to 20 custom roles                     | Custom (with preset suggestions: Scheduling Assistant, Bookkeeper, etc.) | High: per-resource permissions (view/modify/delete) + client tag filtering                | Team page > Roles                               | 20-role cap; dependency-based auto-enabling can confuse admins                                            |

---

## Detailed Findings Per Platform

### 1. CentralReach

**The enterprise ABA platform. Maximum flexibility, maximum complexity.**

**Role system:**

- **System Permission Groups**: Preset, read-only groups provided by CentralReach (e.g., "System Admin", "Hidden Contacts"). These cannot be modified.
- **Custom Permission Groups**: Unlimited. CentralReach recommends creating custom groups based on job descriptions. The easiest method is duplicating a system group and editing it.
- One group can be set as the **Default Employee Group** for new hires.

**Permission modules (10+ documented):**

1. Scheduling
2. Billing (service codes, fee schedules, pay rates, charge rates)
3. Clinical (assessments, reports, ABLLS-R/AFLS access)
4. Claims
5. Human Resources
6. Contacts (bulk connection tools)
7. Learn (LMS content, admin/manager roles)
8. Insights (reporting/analytics)
9. Tasks
10. Messages
11. Files
12. Notes

Each module contains multiple individual permission toggles. The Billing module alone controls access to service codes, fee schedules, employee pay rates, and client charge rates independently.

**Navigation:** Padlock icon > Permissions module. Only the organization account or users with Permissions module access can manage groups.

**Known issues:**

- "CentralReach requires more configuration but handles more complex setups... migration can take weeks" (competitor comparison sites)
- "Choose CentralReach only if you are a large, multi-location ABA organization with IT support" (Passage Health)
- The Permissions module permission itself is described as "the most powerful permission a user can have" -- a meta-permission problem
- Users report a significant learning curve, clunky interface, and technical difficulties
- Overkill for practices under ~50 staff

**Key takeaway for Clinivise:** CentralReach proves that full custom permission groups with per-module granularity is powerful but creates massive onboarding friction. Small practices (our target) don't have IT staff to configure 12 permission modules with dozens of toggles each.

---

### 2. AlohaABA

**Mid-market ABA platform. Simpler than CentralReach, still granular.**

**Role system:**

- Custom roles created by admins
- Each role defines access per feature/module using a 3-tier system: **No Access**, **View Only**, **Full Access**
- Navigation: **Settings > Security > User Roles**
- Per-feature scoping (e.g., Client > Client Authorizations can be set independently)

**Permission categories (inferred from features):**

- Client profiles and authorizations
- Billing and claims
- Scheduling
- Payroll
- Reporting and analytics
- Files, rates, and resources

**HIPAA features:** Audit trail of access to client information, granular access controls.

**Known issues:**

- Limited public documentation of the full permissions matrix
- No mention of preset role templates (every practice builds from scratch)
- Reviews praise usability and customer support but don't specifically mention permissions UX
- Missing unique client identifier in some views complicates workflows

**Key takeaway for Clinivise:** AlohaABA's 3-tier model (No Access / View Only / Full Access) per feature is a clean pattern that balances granularity with simplicity. Worth emulating as a future enhancement, but even this may be more than Phase 1 needs.

---

### 3. SimplePractice

**General therapy PM (not ABA-specific). Preset roles, no customization.**

**Clinician roles (mutually exclusive, pick one):**

1. **Clinician with Entire Practice Access** -- manage all clients (scheduling, documentation, billing, operational tools)
2. **Clinician with Full Client List Access** -- view all clients, fully manage own clients
3. **Clinician with Billing Access** -- manage care, documentation, and billing for own clients only
4. **Clinician with Basic Access** -- manage care and documentation for own clients only

**Administrative roles (stackable on top of clinician role):** 5. **Practice Manager** ($39/mo, free if combined with clinician role) -- operational and billing management 6. **Practice Biller** (free) -- limited access to all client profiles, billing documents, payments, reports, payroll 7. **Practice Scheduler** (free) -- limited client profile view, scheduling tasks for all clients

**Special role:** 8. **Supervisor** (free, stackable) -- review and co-sign notes of supervised clinicians

**Account Owner** is a permanent role (the person who created the account) with full access to everything.

**Navigation:** Settings > Team Members. Account Owners and Practice Managers can add members and assign roles.

**Additional permissions:** Account Owners can grant a few additional toggleable permissions beyond the base role, but these are limited.

**Known issues:**

- **Rigid role structure**: "SimplePractice's one-size-fits-most approach can frustrate practices with specialized requirements"
- **Cannot change role type** without deleting and re-inviting the team member
- **No custom roles**: compared unfavorably to Healthie's 70+ granular permissions
- **Limited customization/reporting** cited in Capterra reviews
- **Not designed for large teams**: group features built for small teams

**Key takeaway for Clinivise:** SimplePractice proves that preset roles work well for small practices (their core market). The 4 clinician tiers + 3 admin roles pattern is elegant. The main complaints are about rigidity when practices grow -- exactly where custom roles become valuable. Their mistake is having no customization escape hatch at all.

---

### 4. Motivity

**ABA-focused clinical data collection platform with practice management.**

**Role system:**

- **Owner** (permanent, preset, cannot be edited or deleted). Every org needs at least one.
- **Custom roles**: Created by admins. Common examples: Administrator, BCBA, Caregiver, Implementations Team, RBT.
- Roles can be **cloned** from existing roles to speed up creation.

**Permission model: 3-position slider**

- Left: No access
- Center: Access "If on team" / "If assigned" (scoped to assigned learners/libraries)
- Right: Full permission (all learners, libraries, learner groups)

**Configurable permissions include:**

- Viewing learners
- Adding/editing learners
- Assigning programs
- Viewing, editing, adding data
- Setting target states (supervisors vs. BTs)
- Managing team assignments
- Managing roles

**Navigation:** Settings > Roles

**Known issues:**

- Clinically focused -- strong on learner/data permissions, less documented on billing/scheduling/HR permissions
- Primarily a data collection tool with PM features, not a full PM platform

**Key takeaway for Clinivise:** Motivity's 3-position slider (None / If Assigned / Full) is an excellent UX pattern for the ABA context. The "If Assigned" middle tier maps perfectly to how ABA practices work -- RBTs see only their assigned clients, BCBAs see all. This is worth studying for our data-level access control.

---

### 5. TherapyNotes

**General therapy PM. Clean preset roles, no customization, built for small practices.**

**Roles (6 preset, stackable -- users can hold multiple):**

1. **Clinician** -- access own assigned clients' documentation; create clinical notes
2. **Practice Scheduler** -- access all clinicians' schedules; add/edit/remove clients; create non-clinical notes only
3. **Practice Biller** -- full billing access (claims, payments, billing reports)
4. **Practice Administrator** -- create/edit user accounts, assign roles, reset passwords, configure global settings
5. **Clinical Administrator** -- full access to ALL clients and notes (regardless of assignment); can assign any client to any clinician
6. **Supervisor** -- access, review, approve, co-sign notes of supervised clinicians/interns

**Security settings:**

- One global toggle: Hide/Show unassigned patients from Clinicians and Interns
- Practice Administrator manages all role assignments

**Navigation:** User management section, accessible only to Practice Administrators.

**Known issues:**

- No custom roles
- No per-feature granularity (each role is a fixed bundle)
- Single global patient visibility toggle is blunt
- Adequate for small practices but inflexible for larger ones

**Key takeaway for Clinivise:** TherapyNotes is the closest analog to what we should build for Phase 1. Six clear, stackable roles that map to actual job functions. No configuration overhead. The stackable approach (a user can be both Clinician + Supervisor) is smart and matches ABA workflows where BCBAs wear multiple hats.

---

### 6. Theralytics

**ABA-focused PM platform. Limited public documentation on RBAC.**

**Roles (3 documented):**

1. Administrator
2. Clinician
3. Scheduler

**Permission features:**

- Customizable scheduling permissions (centralized or shared with staff)
- Multi-location support with staff-based permission controls
- Self-scheduling with admin override capability
- Role-based access controls mentioned in security documentation

**Navigation:** Settings (exact path not publicly documented)

**Known issues:**

- Very limited public documentation on the permission system
- Unclear how granular non-scheduling permissions are
- Positioned as simpler alternative to CentralReach

**Key takeaway for Clinivise:** Theralytics keeps it simple with 3 roles. For a small-practice ABA tool, this might be sufficient, though adding a Biller role and BCBA/RBT distinction would better serve the ABA workflow.

---

### 7. Raven Health

**ABA-focused platform. Role-based views, minimal documentation.**

**Roles (4 documented user types):**

1. BCBA -- full supervisory data, complete patient records
2. RBT -- session programs and notes for assigned clients only
3. Administrator -- scheduling, staff assignments, client records
4. Parent/Teacher (portal) -- own child's progress only

**Permission model:** Automatic view scoping based on role type. When a BCBA logs in, they automatically see supervisory data. When an RBT logs in, they see only their assigned clients.

**Known issues:**

- No documentation on customizability
- Unclear if roles can be modified or if they're hardcoded
- No mention of billing-specific permissions

**Key takeaway for Clinivise:** Raven Health's approach of automatic view scoping per role type is the simplest possible RBAC model. It requires zero configuration from the practice owner. Good for the "it just works" experience but limits flexibility.

---

### 8. Healthie (Adjacent -- General Health/Wellness PM)

**The "power user" platform. Maximum granularity with template system to manage complexity.**

**Base roles (2):**

1. **Standard** -- providers who see clients, schedule appointments, receive payments. Per-member fee.
2. **Support** -- assistants/admins handling back-end tasks. Cannot be designated as a provider. Often free (1 per Standard member).

**Permission system:**

- **70+ individual permissions** across **13 categories**:
  1. General Team Member Permissions & Roles
  2. Organization/Account Permissions
  3. Client Management Permissions
  4. Appointments and Calendar Permissions
  5. Billing Permissions
  6. Charting Permissions
  7. Chat Permissions
  8. Client Activity Permissions
  9. Faxing Permissions
  10. Fullscript Permissions
  11. Labs Permissions
  12. Sharing Organization Resources Permissions
  13. Care Team Member Permissions

- Checkbox-based activation model
- **Permission Templates**: Admins create reusable templates (e.g., "New Provider", "Billing Assistant") that can be applied during onboarding or retroactively
- Client tag-based access filtering (restrict team members to specific client segments)

**Navigation:** Settings > Organization > Members > Create Permissions Template

**Known issues:**

- 70+ checkboxes can overwhelm small practices
- Requires deliberate template creation to avoid per-user chaos
- More complexity than most small practices need
- Powerful escape hatch when practices grow

**Key takeaway for Clinivise:** Healthie demonstrates the "preset templates over fully custom roles" pattern. Instead of custom role definitions, they use 2 base roles + reusable permission templates. This is the most sophisticated system in this research but adds significant cognitive overhead. Their 13 permission categories show what "fully granular" looks like -- and it's a lot.

---

### 9. Practice Better (Adjacent -- Health/Wellness PM)

**Mid-complexity. Custom roles with preset suggestions.**

**Role system:**

- Up to **20 custom roles** per practice
- Preset suggestions for common roles: Scheduling Assistant, Bookkeeper, etc.
- Each role defines permissions per resource (view / modify / delete)
- Client Tag-based access filtering at both role and individual level

**User types:**

1. **Team Owner** -- full access (clinic owner / solo practitioner)
2. **Practitioner** -- creates and manages own resources
3. **Practice Admin** -- manages team members, permissions, subscription
4. **Administrative User** -- scheduling assistants, bookkeepers (creates resources on behalf of practitioners)

**Advanced features:**

- Dependency-based auto-enabling (enabling "View Bookings" auto-enables "View basic information")
- Per-team-member access overrides beyond role-level settings

**Navigation:** Team page > Roles section

**Known issues:**

- 20-role maximum
- Dependency auto-enabling can confuse admins
- More complex than necessary for solo practitioners

---

## Custom Roles: Valued or Overengineered?

### The Evidence

**Platforms offering custom roles:** CentralReach, AlohaABA, Motivity, Healthie, Practice Better
**Platforms with preset-only roles:** SimplePractice, TherapyNotes, Theralytics, Raven Health

**Pattern:** The ABA-specific enterprise tools (CentralReach) and the more mature general health platforms (Healthie, Practice Better) offer custom roles. The small-practice-focused tools (SimplePractice, TherapyNotes) and newer ABA startups (Raven Health) stick with presets.

### User Sentiment

- SimplePractice users **complain about rigidity** when they can't customize roles -- but they're also the ones who chose SimplePractice _because_ it's simple
- CentralReach users **complain about complexity** -- setup takes weeks, requires IT support
- Healthie's approach (presets + templates) gets positive reception but is acknowledged as requiring deliberate setup

### Best Practice Consensus

From the SaaS permissions design research:

1. **Start with 2-3 default preset roles** based on job functions
2. **Allow admins to create custom roles later** as an escape hatch
3. **Use three layers of granularity**: page-level > operation-level > data-level
4. **Plain language descriptions** for role distinctions
5. **Group-level role assignment** to reduce per-user configuration

The "role explosion" anti-pattern (too many overly specific roles) is the most cited risk of custom roles. For small practices (1-50 staff), preset roles with a future customization path is the recommended approach.

### Recommendation for Clinivise

**Phase 1: Preset roles only.** Four roles matching ABA job functions:

- **Admin** (practice owner -- full access)
- **BCBA** (clinical supervisor -- full clinical + read billing)
- **RBT** (technician -- own assigned clients only)
- **Billing Staff** (claims, payments, reports -- no clinical notes)

This maps to TherapyNotes' simplicity with ABA-specific role names. The stackable model (a BCBA who also does billing) can be handled by giving BCBAs optional billing access rather than requiring multiple roles.

**Phase 2+ (if demanded):** Add custom roles using the Motivity/AlohaABA pattern -- a per-feature matrix with 3 tiers (No Access / View Only / Full Access). Use Healthie's "permission templates" concept to let admins save and reuse custom configurations.

**Never:** Build CentralReach-level granularity. Our target market (1-50 staff) doesn't need 12 permission modules with dozens of toggles each. That's how you lose to the simpler competitor.

---

## Sources

- [CentralReach Permissions Explained](https://help.centralreach.com/permissions-explained/)
- [CentralReach Creating Custom Permission Groups](https://help.centralreach.com/creating-a-custom-permission-group/)
- [CentralReach Billing Module Permissions](https://help.centralreach.com/billing-module-permissions/)
- [CentralReach Scheduling Module Permissions](https://help.centralreach.com/scheduling-module-permissions/)
- [CentralReach Claims Module Permissions](https://help.centralreach.com/claims-module-permissions/)
- [CentralReach Community: Set Up Permission Groups](https://community.centralreach.com/s/article/How-To-Set-Up-Permission-Groups)
- [AlohaABA Creating User Roles](https://support.alohaaba.com/portal/en/kb/articles/creating-assigning-user-roles)
- [AlohaABA Authorization Management](https://alohaaba.com/features/authorization-management)
- [AlohaABA HIPAA Compliance](https://alohaaba.com/blogs/keeping-up-with-hipaa-compliance-how-aba-practice-management-software-can-help)
- [SimplePractice Clinician Roles](https://support.simplepractice.com/hc/en-us/articles/360052700171-Clinician-roles-available-for-team-members)
- [SimplePractice Administrative Roles](https://support.simplepractice.com/hc/en-us/articles/41959530341133-Administrative-roles-available-for-team-members)
- [SimplePractice Managing Team Members](https://support.simplepractice.com/hc/en-us/articles/360052248892-Adding-and-managing-team-members)
- [Motivity Managing Roles and Permissions](https://help.motivity.net/managing-roles-and-permissions)
- [Motivity Permissions Features](https://www.motivity.net/feature/permissions)
- [TherapyNotes User Accounts and Roles](https://support.therapynotes.com/hc/en-us/articles/30661307097627-User-Accounts-and-Roles)
- [Theralytics Security](https://www.theralytics.net/security)
- [Theralytics ABA Scheduling Software](https://www.theralytics.net/aba-therapy-scheduling-software)
- [Raven Health HIPAA Features](https://ravenhealth.com/blog/hipaa-features-for-aba-practices/)
- [Raven Health Administrators](https://ravenhealth.com/who-we-serve-administrators-raven-health/)
- [Healthie Deep Dive: Team Member Permissions](https://help.gethealthie.com/article/801-deep-dive-organization-settings)
- [Healthie Permissions Templates](https://help.gethealthie.com/article/1177-organization-member-permissions-templates)
- [Healthie Managing Team Members](https://help.gethealthie.com/article/165-adjust-settings-permission-for-each-team-member)
- [Practice Better Managing Roles & Permissions](https://help.practicebetter.io/hc/en-us/articles/360035388752-Managing-Roles-Permissions)
- [Perpetual: How to Design Effective SaaS Roles and Permissions](https://www.perpetualny.com/blog/how-to-design-effective-saas-roles-and-permissions)
- [Enter Health: Role-Based Access Control in Healthcare RCM](https://www.enter.health/post/role-based-access-control-healthcare-rcm)
- [CentralReach Alternatives (Noteable)](https://mynoteable.com/blog/centralreachalternatives)
- [Passage Health: ABA Practice Management Software Rankings](https://www.passagehealth.com/blog/aba-practice-management-software)
- [AlohaABA Reviews - Capterra](https://www.capterra.com/p/192774/AlohaABA/reviews/)
- [SimplePractice Review - CrownCounseling](https://crowncounseling.com/reviews/simplepractice/)
- [ABA Software Tools Guide](https://behavioristbookclub.com/aba-software-tools-guide-choosing-setting-up-and-using-tech-without-the-headaches/)
