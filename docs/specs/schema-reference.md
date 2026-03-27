# Clinivise Database Schema Reference

> **Generated:** 2026-03-26 | **Source:** `src/server/db/schema/*.ts` + `src/lib/constants.ts`
>
> This is the authoritative schema reference for the Clinivise database. All tables use Drizzle ORM with Neon Postgres. IDs are `nanoid()`, enums are `text` columns validated by `as const` arrays in `src/lib/constants.ts`, and every tenant-scoped table includes `organization_id`.

---

## Summary

| #   | Table                    | Domain   | Columns | Description                                |
| --- | ------------------------ | -------- | ------- | ------------------------------------------ |
| 1   | `organizations`          | Core     | 28      | Practice/billing entity                    |
| 2   | `users`                  | Core     | 12      | Staff accounts (Clerk-synced)              |
| 3   | `providers`              | Core     | 18      | Clinical providers (BCBA, RBT, etc.)       |
| 4   | `clients`                | Core     | 25      | Patients receiving ABA services            |
| 5   | `client_insurance`       | Core     | 22      | Client insurance policies                  |
| 6   | `client_contacts`        | Core     | 16      | Client caregivers/emergency contacts       |
| 7   | `client_providers`       | Core     | 10      | Care team assignments (provider-to-client) |
| 8   | `payers`                 | Core     | 14      | Insurance companies                        |
| 9   | `goal_domains`           | Clinical | 7       | Org-level goal categories                  |
| 10  | `client_goals`           | Clinical | 27      | Treatment plan goals                       |
| 11  | `client_goal_objectives` | Clinical | 13      | Short-term objectives under goals          |
| 12  | `client_goal_targets`    | Clinical | 12      | Discrete teaching targets under objectives |
| 13  | `authorizations`         | Clinical | 18      | Payer authorizations for services          |
| 14  | `authorization_services` | Clinical | 11      | Per-CPT-code service lines within an auth  |
| 15  | `sessions`               | Clinical | 23      | Session/appointment logs                   |
| 16  | `session_notes`          | Clinical | 33      | Clinical session documentation (SOAP)      |
| 17  | `session_note_goals`     | Clinical | 24      | Per-goal data within a session note        |
| 18  | `session_note_behaviors` | Clinical | 13      | ABC incident tracking within a session     |
| 19  | `claims`                 | Billing  | 22      | Insurance claims (CMS-1500)                |
| 20  | `claim_lines`            | Billing  | 16      | Individual service lines on a claim        |
| 21  | `claim_responses`        | Billing  | 13      | ERA/835 responses from payers              |
| 22  | `eligibility_checks`     | Billing  | 19      | 270/271 eligibility verification results   |
| 23  | `documents`              | System   | 14      | Uploaded files (auth letters, cards, etc.) |
| 24  | `audit_logs`             | System   | 9       | Immutable audit trail                      |

**Total: 24 tables**

---

## Core Domain

### `organizations`

Practice entities. Each Clerk organization maps to one row. Contains both practice info and billing entity overrides (for CMS-1500 Box 33).

| Column                   | Type          | Nullable | Default              | FK  | Notes                                 |
| ------------------------ | ------------- | -------- | -------------------- | --- | ------------------------------------- |
| `id`                     | text          | NO       | `nanoid()`           | PK  |                                       |
| `clerk_org_id`           | text          | NO       |                      |     | Unique. Clerk organization ID         |
| `name`                   | text          | NO       |                      |     | Practice name                         |
| `npi`                    | text          | YES      |                      |     | Practice NPI                          |
| `tax_id`                 | text          | YES      |                      |     | Practice EIN/TIN                      |
| `phone`                  | text          | YES      |                      |     |                                       |
| `email`                  | text          | YES      |                      |     |                                       |
| `address_line_1`         | text          | YES      |                      |     |                                       |
| `address_line_2`         | text          | YES      |                      |     |                                       |
| `city`                   | text          | YES      |                      |     |                                       |
| `state`                  | text          | YES      |                      |     |                                       |
| `zip_code`               | text          | YES      |                      |     |                                       |
| `taxonomy_code`          | text          | YES      |                      |     | Practice-level taxonomy               |
| `billing_name`           | text          | YES      |                      |     | Legal entity name for CMS-1500 Box 33 |
| `billing_npi`            | text          | YES      |                      |     | Group/Type 2 NPI if different         |
| `billing_tax_id`         | text          | YES      |                      |     |                                       |
| `billing_address_line_1` | text          | YES      |                      |     |                                       |
| `billing_city`           | text          | YES      |                      |     |                                       |
| `billing_state`          | text          | YES      |                      |     |                                       |
| `billing_zip_code`       | text          | YES      |                      |     |                                       |
| `timezone`               | text          | NO       | `'America/New_York'` |     | IANA timezone                         |
| `stedi_api_key`          | text          | YES      |                      |     | Stedi billing API key                 |
| `is_active`              | boolean       | NO       | `true`               |     |                                       |
| `created_at`             | timestamp(tz) | NO       | `now()`              |     |                                       |
| `updated_at`             | timestamp(tz) | NO       | `now()`              |     | Auto-updates on write                 |

**Indexes:** None (besides PK + unique on `clerk_org_id`).

---

### `users`

Staff accounts synced from Clerk. One row per user per organization.

| Column            | Type          | Nullable | Default    | FK                           | Notes                                    |
| ----------------- | ------------- | -------- | ---------- | ---------------------------- | ---------------------------------------- |
| `id`              | text          | NO       | `nanoid()` | PK                           |                                          |
| `clerk_user_id`   | text          | YES      |            |                              | Clerk user ID (null before Clerk signup) |
| `organization_id` | text          | NO       |            | `organizations.id` (cascade) |                                          |
| `email`           | text          | NO       |            |                              |                                          |
| `first_name`      | text          | YES      |            |                              |                                          |
| `last_name`       | text          | YES      |            |                              |                                          |
| `role`            | text          | NO       | `'rbt'`    |                              | See `USER_ROLES`                         |
| `status`          | text          | NO       | `'active'` |                              | See `USER_STATUSES`                      |
| `is_active`       | boolean       | NO       | `true`     |                              |                                          |
| `invited_by`      | text          | YES      |            |                              | User ID who sent the invite              |
| `invited_at`      | timestamp(tz) | YES      |            |                              |                                          |
| `last_active_at`  | timestamp(tz) | YES      |            |                              |                                          |
| `created_at`      | timestamp(tz) | NO       | `now()`    |                              |                                          |
| `updated_at`      | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write                    |

**Indexes:**

- `users_org_idx` on `(organization_id)`
- `users_clerk_idx` on `(clerk_user_id)`
- `users_org_email_idx` UNIQUE on `(organization_id, email)`

---

### `providers`

Clinical providers who deliver or supervise ABA services. May or may not be linked to a `users` row (e.g., external supervisors).

| Column                 | Type          | Nullable | Default    | FK                           | Notes                                    |
| ---------------------- | ------------- | -------- | ---------- | ---------------------------- | ---------------------------------------- |
| `id`                   | text          | NO       | `nanoid()` | PK                           |                                          |
| `organization_id`      | text          | NO       |            | `organizations.id` (cascade) |                                          |
| `user_id`              | text          | YES      |            | `users.id` (set null)        | Link to staff account                    |
| `first_name`           | text          | NO       |            |                              |                                          |
| `last_name`            | text          | NO       |            |                              |                                          |
| `npi`                  | text          | YES      |            |                              | Individual/Type 1 NPI                    |
| `credential_type`      | text          | NO       |            |                              | See `CREDENTIAL_TYPES`                   |
| `credential_number`    | text          | YES      |            |                              | BACB certification number                |
| `credential_expiry`    | date          | YES      |            |                              |                                          |
| `state_license_number` | text          | YES      |            |                              | State behavior analyst license           |
| `state_license_expiry` | date          | YES      |            |                              |                                          |
| `taxonomy_code`        | text          | YES      |            |                              | Per-provider taxonomy (e.g., 103K00000X) |
| `email`                | text          | YES      |            |                              |                                          |
| `phone`                | text          | YES      |            |                              |                                          |
| `supervisor_id`        | text          | YES      |            | `providers.id` (set null)    | Self-referencing FK                      |
| `modifier_code`        | text          | YES      |            |                              | Billing modifier (HM, HN, HO, HP)        |
| `is_active`            | boolean       | NO       | `true`     |                              |                                          |
| `deleted_at`           | timestamp(tz) | YES      |            |                              | Soft delete                              |
| `created_at`           | timestamp(tz) | NO       | `now()`    |                              |                                          |
| `updated_at`           | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write                    |

**Indexes:**

- `providers_org_idx` on `(organization_id)`
- `providers_user_idx` on `(user_id)`
- `providers_supervisor_idx` on `(supervisor_id)`

---

### `clients`

Patients receiving ABA therapy services.

| Column                      | Type          | Nullable | Default                      | FK                           | Notes                              |
| --------------------------- | ------------- | -------- | ---------------------------- | ---------------------------- | ---------------------------------- |
| `id`                        | text          | NO       | `nanoid()`                   | PK                           |                                    |
| `organization_id`           | text          | NO       |                              | `organizations.id` (cascade) |                                    |
| `first_name`                | text          | NO       |                              |                              |                                    |
| `last_name`                 | text          | NO       |                              |                              |                                    |
| `date_of_birth`             | date          | NO       |                              |                              |                                    |
| `gender`                    | text          | YES      |                              |                              | See `GENDERS`                      |
| `phone`                     | text          | YES      |                              |                              |                                    |
| `email`                     | text          | YES      |                              |                              |                                    |
| `address_line_1`            | text          | YES      |                              |                              |                                    |
| `address_line_2`            | text          | YES      |                              |                              |                                    |
| `city`                      | text          | YES      |                              |                              |                                    |
| `state`                     | text          | YES      |                              |                              |                                    |
| `zip_code`                  | text          | YES      |                              |                              |                                    |
| `diagnosis_code`            | text          | YES      | `'F84.0'`                    |                              | Primary ICD-10                     |
| `diagnosis_description`     | text          | YES      | `'Autism Spectrum Disorder'` |                              |                                    |
| `secondary_diagnosis_codes` | text[]        | YES      |                              |                              | Array of ICD-10 codes              |
| `primary_language`          | text          | YES      |                              |                              | BACB ethics + Medicaid requirement |
| `interpreter_needed`        | boolean       | YES      |                              |                              |                                    |
| `referring_provider_name`   | text          | YES      |                              |                              | CMS-1500 Box 17                    |
| `referring_provider_npi`    | text          | YES      |                              |                              | CMS-1500 Box 17b                   |
| `medicaid_id`               | text          | YES      |                              |                              | State Medicaid recipient ID        |
| `intake_date`               | date          | YES      |                              |                              |                                    |
| `status`                    | text          | NO       | `'inquiry'`                  |                              | See `CLIENT_STATUSES`              |
| `referral_source`           | text          | YES      |                              |                              | See `REFERRAL_SOURCES`             |
| `hold_reason`               | text          | YES      |                              |                              |                                    |
| `notes`                     | text          | YES      |                              |                              |                                    |
| `deleted_at`                | timestamp(tz) | YES      |                              |                              | Soft delete                        |
| `created_at`                | timestamp(tz) | NO       | `now()`                      |                              |                                    |
| `updated_at`                | timestamp(tz) | NO       | `now()`                      |                              | Auto-updates on write              |

**Indexes:**

- `clients_org_idx` on `(organization_id)`
- `clients_name_idx` on `(organization_id, last_name, first_name)`
- `clients_status_idx` on `(organization_id, status)`

---

### `client_insurance`

Insurance policies linked to a client. Supports primary/secondary/tertiary priority.

| Column                       | Type          | Nullable | Default        | FK                           | Notes                              |
| ---------------------------- | ------------- | -------- | -------------- | ---------------------------- | ---------------------------------- |
| `id`                         | text          | NO       | `nanoid()`     | PK                           |                                    |
| `organization_id`            | text          | NO       |                | `organizations.id` (cascade) |                                    |
| `client_id`                  | text          | NO       |                | `clients.id` (restrict)      |                                    |
| `payer_id`                   | text          | NO       |                | `payers.id` (restrict)       |                                    |
| `member_id`                  | text          | NO       |                |                              | Insurance member/subscriber ID     |
| `group_number`               | text          | YES      |                |                              |                                    |
| `subscriber_first_name`      | text          | YES      |                |                              |                                    |
| `subscriber_last_name`       | text          | YES      |                |                              |                                    |
| `subscriber_date_of_birth`   | date          | YES      |                |                              |                                    |
| `subscriber_gender`          | text          | YES      |                |                              |                                    |
| `plan_name`                  | text          | YES      |                |                              |                                    |
| `relationship_to_subscriber` | text          | YES      | `'self'`       |                              | See `SUBSCRIBER_RELATIONSHIPS`     |
| `subscriber_address_line_1`  | text          | YES      |                |                              |                                    |
| `subscriber_city`            | text          | YES      |                |                              |                                    |
| `subscriber_state`           | text          | YES      |                |                              |                                    |
| `subscriber_zip_code`        | text          | YES      |                |                              |                                    |
| `priority`                   | integer       | NO       | `1`            |                              | 1=primary, 2=secondary, 3=tertiary |
| `effective_date`             | date          | YES      |                |                              |                                    |
| `termination_date`           | date          | YES      |                |                              |                                    |
| `verification_status`        | text          | NO       | `'unverified'` |                              | See `VERIFICATION_STATUSES`        |
| `verified_at`                | timestamp(tz) | YES      |                |                              |                                    |
| `card_front_url`             | text          | YES      |                |                              | Vercel Blob URL                    |
| `card_back_url`              | text          | YES      |                |                              | Vercel Blob URL                    |
| `is_active`                  | boolean       | NO       | `true`         |                              |                                    |
| `deleted_at`                 | timestamp(tz) | YES      |                |                              | Soft delete                        |
| `created_at`                 | timestamp(tz) | NO       | `now()`        |                              |                                    |
| `updated_at`                 | timestamp(tz) | NO       | `now()`        |                              | Auto-updates on write              |

**Indexes:**

- `client_insurance_org_idx` on `(organization_id)`
- `client_insurance_client_idx` on `(client_id)`
- `client_insurance_payer_idx` on `(payer_id)`
- `client_insurance_org_client_deleted_idx` on `(organization_id, client_id, deleted_at)`
- `client_insurance_org_payer_deleted_idx` on `(organization_id, payer_id, deleted_at)`

---

### `client_contacts`

Caregivers, guardians, and emergency contacts for a client.

| Column                   | Type          | Nullable | Default    | FK                           | Notes                            |
| ------------------------ | ------------- | -------- | ---------- | ---------------------------- | -------------------------------- |
| `id`                     | text          | NO       | `nanoid()` | PK                           |                                  |
| `organization_id`        | text          | NO       |            | `organizations.id` (cascade) |                                  |
| `client_id`              | text          | NO       |            | `clients.id` (restrict)      |                                  |
| `first_name`             | text          | NO       |            |                              |                                  |
| `last_name`              | text          | NO       |            |                              |                                  |
| `phone`                  | text          | YES      |            |                              |                                  |
| `email`                  | text          | YES      |            |                              |                                  |
| `relationship`           | text          | NO       |            |                              | See `CONTACT_RELATIONSHIP_TYPES` |
| `is_legal_guardian`      | boolean       | NO       | `false`    |                              |                                  |
| `is_emergency_contact`   | boolean       | NO       | `false`    |                              |                                  |
| `is_billing_responsible` | boolean       | NO       | `false`    |                              |                                  |
| `can_receive_phi`        | boolean       | NO       | `false`    |                              |                                  |
| `can_pickup`             | boolean       | NO       | `false`    |                              |                                  |
| `lives_with_client`      | boolean       | NO       | `false`    |                              |                                  |
| `priority`               | integer       | NO       | `1`        |                              | Contact order                    |
| `notes`                  | text          | YES      |            |                              |                                  |
| `created_at`             | timestamp(tz) | NO       | `now()`    |                              |                                  |
| `updated_at`             | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write            |

**Indexes:**

- `client_contacts_org_idx` on `(organization_id)`
- `client_contacts_client_idx` on `(organization_id, client_id)`

---

### `client_providers`

Care team assignments. Junction table linking providers to clients with roles and time-bounded assignments. Care team is suggestive (drives defaults), not restrictive (any provider can log sessions for any client).

| Column            | Type          | Nullable | Default    | FK                           | Notes                  |
| ----------------- | ------------- | -------- | ---------- | ---------------------------- | ---------------------- |
| `id`              | text          | NO       | `nanoid()` | PK                           |                        |
| `organization_id` | text          | NO       |            | `organizations.id` (cascade) |                        |
| `client_id`       | text          | NO       |            | `clients.id` (cascade)       |                        |
| `provider_id`     | text          | NO       |            | `providers.id` (cascade)     |                        |
| `role`            | text          | NO       |            |                              | See `CARE_TEAM_ROLES`  |
| `is_primary`      | boolean       | NO       | `false`    |                              | One primary per client |
| `start_date`      | date          | NO       |            |                              | Assignment start       |
| `end_date`        | date          | YES      |            |                              | Null = active          |
| `notes`           | text          | YES      |            |                              |                        |
| `created_at`      | timestamp(tz) | NO       | `now()`    |                              |                        |
| `updated_at`      | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write  |

**Indexes:**

- `client_providers_client_idx` on `(organization_id, client_id)`
- `client_providers_provider_idx` on `(organization_id, provider_id)`

---

### `payers`

Insurance companies / payer organizations.

| Column                  | Type          | Nullable | Default        | FK                           | Notes                         |
| ----------------------- | ------------- | -------- | -------------- | ---------------------------- | ----------------------------- |
| `id`                    | text          | NO       | `nanoid()`     | PK                           |                               |
| `organization_id`       | text          | NO       |                | `organizations.id` (cascade) |                               |
| `name`                  | text          | NO       |                |                              |                               |
| `stedi_payer_id`        | text          | YES      |                |                              | Stedi API payer identifier    |
| `electronic_payer_id`   | text          | YES      |                |                              | 5-digit EDI payer ID          |
| `payer_type`            | text          | YES      | `'commercial'` |                              | See `PAYER_TYPES`             |
| `phone`                 | text          | YES      |                |                              |                               |
| `auth_phone`            | text          | YES      |                |                              | Authorization department      |
| `auth_department_email` | text          | YES      |                |                              |                               |
| `portal_url`            | text          | YES      |                |                              | Provider portal URL           |
| `claims_address`        | text          | YES      |                |                              | Paper claims mailing address  |
| `timely_filing_days`    | integer       | YES      |                |                              | Days allowed to submit claims |
| `unit_calc_method`      | text          | YES      | `'ama'`        |                              | See `UNIT_CALC_METHODS`       |
| `notes`                 | text          | YES      |                |                              |                               |
| `is_active`             | boolean       | NO       | `true`         |                              |                               |
| `created_at`            | timestamp(tz) | NO       | `now()`        |                              |                               |
| `updated_at`            | timestamp(tz) | NO       | `now()`        |                              | Auto-updates on write         |

**Indexes:**

- `payers_org_idx` on `(organization_id)`
- `payers_stedi_idx` on `(stedi_payer_id)`

---

## Clinical Domain

### `goal_domains`

Organization-level goal categories. Seeded with defaults per org (Communication, Social Skills, etc.).

| Column            | Type          | Nullable | Default    | FK                           | Notes                 |
| ----------------- | ------------- | -------- | ---------- | ---------------------------- | --------------------- |
| `id`              | text          | NO       | `nanoid()` | PK                           |                       |
| `organization_id` | text          | NO       |            | `organizations.id` (cascade) |                       |
| `name`            | text          | NO       |            |                              | Domain name           |
| `sort_order`      | integer       | NO       | `0`        |                              | Display order         |
| `is_default`      | boolean       | NO       | `false`    |                              | System-seeded domain  |
| `created_at`      | timestamp(tz) | NO       | `now()`    |                              |                       |
| `updated_at`      | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write |

**Indexes:**

- `goal_domains_org_idx` on `(organization_id)`

---

### `client_goals`

Treatment plan goals for a client. Supports skill acquisition and behavior reduction types.

| Column                   | Type          | Nullable | Default               | FK                           | Notes                                             |
| ------------------------ | ------------- | -------- | --------------------- | ---------------------------- | ------------------------------------------------- |
| `id`                     | text          | NO       | `nanoid()`            | PK                           |                                                   |
| `organization_id`        | text          | NO       |                       | `organizations.id` (cascade) |                                                   |
| `client_id`              | text          | NO       |                       | `clients.id` (cascade)       |                                                   |
| `domain_id`              | text          | YES      |                       | `goal_domains.id` (set null) |                                                   |
| `goal_number`            | integer       | NO       |                       |                              | Sequence within client                            |
| `title`                  | text          | NO       |                       |                              |                                                   |
| `description`            | text          | YES      |                       |                              |                                                   |
| `goal_type`              | text          | NO       | `'skill_acquisition'` |                              | See `GOAL_TYPES`                                  |
| `status`                 | text          | NO       | `'active'`            |                              | See `GOAL_STATUSES`                               |
| `baseline_data`          | text          | YES      |                       |                              |                                                   |
| `mastery_criteria`       | text          | YES      |                       |                              |                                                   |
| `target_behavior`        | text          | YES      |                       |                              |                                                   |
| `function_of_behavior`   | text          | YES      |                       |                              | See `BEHAVIOR_FUNCTIONS`. Behavior reduction only |
| `replacement_behavior`   | text          | YES      |                       |                              | Functionally equivalent replacement               |
| `operational_definition` | text          | YES      |                       |                              | Observable, measurable definition                 |
| `severity_level`         | text          | YES      |                       |                              | See `BEHAVIOR_SEVERITIES`                         |
| `crisis_protocol`        | text          | YES      |                       |                              | Escalation plan                                   |
| `antecedent_strategies`  | text          | YES      |                       |                              | Prevention strategies                             |
| `consequence_strategies` | text          | YES      |                       |                              | Reactive strategies from BIP                      |
| `assessment_source`      | text          | YES      |                       |                              | See `ASSESSMENT_SOURCES`                          |
| `assessment_item_ref`    | text          | YES      |                       |                              | e.g., "VB-MAPP Mand Level 2, M8"                  |
| `start_date`             | date          | YES      |                       |                              |                                                   |
| `target_date`            | date          | YES      |                       |                              |                                                   |
| `met_date`               | date          | YES      |                       |                              |                                                   |
| `treatment_plan_ref`     | text          | YES      |                       |                              |                                                   |
| `sort_order`             | integer       | NO       | `0`                   |                              |                                                   |
| `notes`                  | text          | YES      |                       |                              |                                                   |
| `deleted_at`             | timestamp(tz) | YES      |                       |                              | Soft delete                                       |
| `created_at`             | timestamp(tz) | NO       | `now()`               |                              |                                                   |
| `updated_at`             | timestamp(tz) | NO       | `now()`               |                              | Auto-updates on write                             |

**Indexes:**

- `client_goals_org_idx` on `(organization_id)`
- `client_goals_client_idx` on `(organization_id, client_id)`
- `client_goals_domain_idx` on `(domain_id)`

---

### `client_goal_objectives`

Short-term objectives nested under a goal.

| Column                 | Type          | Nullable | Default    | FK                           | Notes                       |
| ---------------------- | ------------- | -------- | ---------- | ---------------------------- | --------------------------- |
| `id`                   | text          | NO       | `nanoid()` | PK                           |                             |
| `organization_id`      | text          | NO       |            | `organizations.id` (cascade) |                             |
| `goal_id`              | text          | NO       |            | `client_goals.id` (cascade)  |                             |
| `objective_number`     | integer       | NO       |            |                              | Sequence within goal        |
| `description`          | text          | NO       |            |                              |                             |
| `status`               | text          | NO       | `'active'` |                              | See `GOAL_STATUSES`         |
| `mastery_criteria`     | text          | YES      |            |                              |                             |
| `current_performance`  | text          | YES      |            |                              |                             |
| `data_collection_type` | text          | YES      |            |                              | See `DATA_COLLECTION_TYPES` |
| `met_date`             | date          | YES      |            |                              |                             |
| `sort_order`           | integer       | NO       | `0`        |                              |                             |
| `notes`                | text          | YES      |            |                              |                             |
| `deleted_at`           | timestamp(tz) | YES      |            |                              | Soft delete                 |
| `created_at`           | timestamp(tz) | NO       | `now()`    |                              |                             |
| `updated_at`           | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write       |

**Indexes:**

- `client_goal_objectives_org_idx` on `(organization_id)`
- `client_goal_objectives_goal_idx` on `(goal_id)`

---

### `client_goal_targets`

Discrete teaching targets within an objective. The daily teaching unit for RBTs (e.g., "cookie", "ball", "brush teeth step 4").

| Column             | Type          | Nullable | Default    | FK                                    | Notes                                            |
| ------------------ | ------------- | -------- | ---------- | ------------------------------------- | ------------------------------------------------ |
| `id`               | text          | NO       | `nanoid()` | PK                                    |                                                  |
| `organization_id`  | text          | NO       |            | `organizations.id` (cascade)          |                                                  |
| `objective_id`     | text          | NO       |            | `client_goal_objectives.id` (cascade) |                                                  |
| `target_number`    | integer       | NO       |            |                                       | Sequence within objective                        |
| `target_name`      | text          | NO       |            |                                       | e.g., "cookie", "ball"                           |
| `description`      | text          | YES      |            |                                       |                                                  |
| `status`           | text          | NO       | `'active'` |                                       | active / mastered / maintenance / generalization |
| `mastery_criteria` | text          | YES      |            |                                       |                                                  |
| `met_date`         | date          | YES      |            |                                       |                                                  |
| `sort_order`       | integer       | NO       | `0`        |                                       |                                                  |
| `notes`            | text          | YES      |            |                                       |                                                  |
| `deleted_at`       | timestamp(tz) | YES      |            |                                       | Soft delete                                      |
| `created_at`       | timestamp(tz) | NO       | `now()`    |                                       |                                                  |
| `updated_at`       | timestamp(tz) | NO       | `now()`    |                                       | Auto-updates on write                            |

**Indexes:**

- `client_goal_targets_org_idx` on `(organization_id)`
- `client_goal_targets_obj_idx` on `(objective_id)`

---

### `authorizations`

Payer authorizations for ABA services. Linked to a client, payer, and insurance policy. Supports self-referencing for re-authorizations.

| Column                      | Type          | Nullable | Default     | FK                               | Notes                                                        |
| --------------------------- | ------------- | -------- | ----------- | -------------------------------- | ------------------------------------------------------------ |
| `id`                        | text          | NO       | `nanoid()`  | PK                               |                                                              |
| `organization_id`           | text          | NO       |             | `organizations.id` (cascade)     |                                                              |
| `client_id`                 | text          | NO       |             | `clients.id` (restrict)          |                                                              |
| `payer_id`                  | text          | NO       |             | `payers.id` (restrict)           |                                                              |
| `client_insurance_id`       | text          | NO       |             | `client_insurance.id` (restrict) |                                                              |
| `previous_authorization_id` | text          | YES      |             | `authorizations.id` (set null)   | Self-referencing for re-auths                                |
| `authorization_number`      | text          | YES      |             |                                  | Payer-assigned auth number                                   |
| `status`                    | text          | NO       | `'pending'` |                                  | See `AUTH_STATUSES`                                          |
| `start_date`                | date          | NO       |             |                                  |                                                              |
| `end_date`                  | date          | NO       |             |                                  |                                                              |
| `auth_type`                 | text          | YES      |             |                                  | initial / recertification / concurrent_review / peer_to_peer |
| `requesting_provider_id`    | text          | YES      |             |                                  | BCBA who requested the auth                                  |
| `denial_reason`             | text          | YES      |             |                                  | When status = denied                                         |
| `appeal_deadline`           | date          | YES      |             |                                  | Typically 30-60 days from denial                             |
| `diagnosis_code`            | text          | YES      | `'F84.0'`   |                                  |                                                              |
| `notes`                     | text          | YES      |             |                                  |                                                              |
| `ai_parsed_data`            | text          | YES      |             |                                  | AI-extracted auth letter data                                |
| `ai_confidence_score`       | numeric(5,2)  | YES      |             |                                  | AI parsing confidence                                        |
| `deleted_at`                | timestamp(tz) | YES      |             |                                  | Soft delete                                                  |
| `created_at`                | timestamp(tz) | NO       | `now()`     |                                  |                                                              |
| `updated_at`                | timestamp(tz) | NO       | `now()`     |                                  | Auto-updates on write                                        |

**Indexes:**

- `auths_org_idx` on `(organization_id)`
- `auths_client_idx` on `(client_id)`
- `auths_status_idx` on `(organization_id, status)`
- `auths_end_date_idx` on `(organization_id, end_date)`
- `auths_prev_auth_idx` on `(previous_authorization_id)`

**Check constraints:**

- `auth_date_range`: `end_date >= start_date`

---

### `authorization_services`

Per-CPT-code service lines within an authorization. Tracks approved vs. used units for utilization monitoring.

| Column               | Type          | Nullable | Default    | FK                            | Notes                                 |
| -------------------- | ------------- | -------- | ---------- | ----------------------------- | ------------------------------------- |
| `id`                 | text          | NO       | `nanoid()` | PK                            |                                       |
| `organization_id`    | text          | NO       |            | `organizations.id` (cascade)  |                                       |
| `authorization_id`   | text          | NO       |            | `authorizations.id` (cascade) |                                       |
| `cpt_code`           | text          | NO       |            |                               | ABA CPT code (e.g., "97153")          |
| `approved_units`     | integer       | NO       |            |                               | Total authorized units                |
| `used_units`         | integer       | NO       | `0`        |                               | Units consumed. Atomic increment only |
| `frequency`          | text          | YES      |            |                               | See `SERVICE_FREQUENCIES`             |
| `max_units_per_day`  | integer       | YES      |            |                               | Daily cap                             |
| `max_units_per_week` | integer       | YES      |            |                               | Weekly cap                            |
| `notes`              | text          | YES      |            |                               |                                       |
| `created_at`         | timestamp(tz) | NO       | `now()`    |                               |                                       |
| `updated_at`         | timestamp(tz) | NO       | `now()`    |                               | Auto-updates on write                 |

**Indexes:**

- `auth_services_org_idx` on `(organization_id)`
- `auth_services_auth_idx` on `(authorization_id)`
- `auth_services_cpt_idx` on `(authorization_id, cpt_code)`

**Check constraints:**

- `used_units_non_negative`: `used_units >= 0`
- `approved_units_positive`: `approved_units > 0`

---

### `sessions`

Session/appointment logs. Central table linking client, provider, authorization, and billing.

| Column                     | Type          | Nullable | Default       | FK                                     | Notes                                         |
| -------------------------- | ------------- | -------- | ------------- | -------------------------------------- | --------------------------------------------- |
| `id`                       | text          | NO       | `nanoid()`    | PK                                     |                                               |
| `organization_id`          | text          | NO       |               | `organizations.id` (cascade)           |                                               |
| `client_id`                | text          | NO       |               | `clients.id` (restrict)                |                                               |
| `provider_id`              | text          | NO       |               | `providers.id` (restrict)              |                                               |
| `supervisor_id`            | text          | YES      |               | `providers.id` (set null)              | Supervising BCBA                              |
| `authorization_id`         | text          | YES      |               | `authorizations.id` (set null)         |                                               |
| `authorization_service_id` | text          | YES      |               | `authorization_services.id` (set null) |                                               |
| `session_date`             | date          | NO       |               |                                        |                                               |
| `start_time`               | timestamp(tz) | YES      |               |                                        |                                               |
| `end_time`                 | timestamp(tz) | YES      |               |                                        |                                               |
| `cpt_code`                 | text          | NO       |               |                                        | See `ABA_CPT_CODES`                           |
| `modifier_codes`           | text[]        | YES      |               |                                        | Billing modifiers array                       |
| `units`                    | integer       | NO       |               |                                        | Billed units (15-min per CMS 8-min rule)      |
| `place_of_service`         | text          | NO       | `'12'`        |                                        | See `PLACE_OF_SERVICE_CODES`                  |
| `status`                   | text          | NO       | `'completed'` |                                        | See `SESSION_STATUSES`                        |
| `cancellation_reason`      | text          | YES      |               |                                        | When status = cancelled                       |
| `cancelled_by`             | text          | YES      |               |                                        | client / provider / practice                  |
| `service_address`          | text          | YES      |               |                                        | For home/community sessions (CMS-1500 Box 32) |
| `actual_minutes`           | integer       | YES      |               |                                        | Actual session duration                       |
| `unit_calc_method`         | text          | YES      |               |                                        | See `UNIT_CALC_METHODS`                       |
| `idempotency_key`          | text          | YES      |               |                                        | Prevents duplicate session creation           |
| `notes`                    | text          | YES      |               |                                        |                                               |
| `claim_id`                 | text          | YES      |               |                                        | FK to claims (app-level enforcement)          |
| `billed_amount`            | numeric(10,2) | YES      |               |                                        |                                               |
| `created_at`               | timestamp(tz) | NO       | `now()`       |                                        |                                               |
| `updated_at`               | timestamp(tz) | NO       | `now()`       |                                        | Auto-updates on write                         |

**Indexes:**

- `sessions_org_idx` on `(organization_id)`
- `sessions_client_idx` on `(client_id)`
- `sessions_provider_idx` on `(provider_id)`
- `sessions_auth_idx` on `(authorization_id)`
- `sessions_auth_service_idx` on `(authorization_service_id)`
- `sessions_date_idx` on `(organization_id, session_date)`
- `sessions_claim_idx` on `(claim_id)`
- `sessions_status_idx` on `(organization_id, status)`
- `sessions_idempotency_idx` UNIQUE on `(organization_id, idempotency_key)` WHERE `idempotency_key IS NOT NULL`

---

### `session_notes`

One clinical note per session. CPT-specific sections are nullable — only populate fields relevant to the session's CPT code.

| Column                            | Type          | Nullable | Default    | FK                           | Notes                                      |
| --------------------------------- | ------------- | -------- | ---------- | ---------------------------- | ------------------------------------------ |
| `id`                              | text          | NO       | `nanoid()` | PK                           |                                            |
| `organization_id`                 | text          | NO       |            | `organizations.id` (cascade) |                                            |
| `session_id`                      | text          | NO       |            | `sessions.id` (cascade)      |                                            |
| `note_type`                       | text          | NO       |            |                              | See `NOTE_TYPES`                           |
| `others_present`                  | text          | YES      |            |                              | Names + relationships                      |
| `subjective_notes`                | text          | YES      |            |                              | SOAP "S"                                   |
| `client_presentation`             | text          | YES      |            |                              | SOAP "O" start                             |
| `session_narrative`               | text          | YES      |            |                              | Free-text summary                          |
| `barriers_to_performance`         | text          | YES      |            |                              | TRICARE requirement                        |
| `caregiver_communication`         | text          | YES      |            |                              | Informal caregiver communication           |
| `plan_next_session`               | text          | YES      |            |                              | SOAP "P"                                   |
| `modification_rationale`          | text          | YES      |            |                              | 97155: data prompting change               |
| `modification_description`        | text          | YES      |            |                              | 97155: what was changed                    |
| `client_response_to_modification` | text          | YES      |            |                              | 97155                                      |
| `updated_protocol`                | text          | YES      |            |                              | 97155: new protocol going forward          |
| `caregiver_name`                  | text          | YES      |            |                              | 97156                                      |
| `caregiver_relationship`          | text          | YES      |            |                              | 97156. See `CAREGIVER_RELATIONSHIPS`       |
| `client_present`                  | boolean       | YES      |            |                              | 97156                                      |
| `training_objectives`             | text          | YES      |            |                              | 97156                                      |
| `teaching_method`                 | text          | YES      |            |                              | 97156: explain, model, role-play, feedback |
| `caregiver_competency`            | text          | YES      |            |                              | 97156: fidelity assessment                 |
| `generalization_plan`             | text          | YES      |            |                              | 97156                                      |
| `homework_assigned`               | text          | YES      |            |                              | 97156                                      |
| `assessment_tools_used`           | text[]        | YES      |            |                              | 97151. See `ASSESSMENT_TOOLS`              |
| `face_to_face_minutes`            | integer       | YES      |            |                              | 97151                                      |
| `non_face_to_face_minutes`        | integer       | YES      |            |                              | 97151                                      |
| `caregiver_participated`          | boolean       | YES      |            |                              | 97151                                      |
| `findings_summary`                | text          | YES      |            |                              | 97151                                      |
| `recommendations`                 | text          | YES      |            |                              | 97151                                      |
| `status`                          | text          | NO       | `'draft'`  |                              | See `NOTE_STATUSES`                        |
| `signed_by_id`                    | text          | YES      |            | `providers.id` (set null)    |                                            |
| `signed_at`                       | timestamp(tz) | YES      |            |                              |                                            |
| `cosigned_by_id`                  | text          | YES      |            | `providers.id` (set null)    | Supervisor co-signature                    |
| `cosigned_at`                     | timestamp(tz) | YES      |            |                              |                                            |
| `created_at`                      | timestamp(tz) | NO       | `now()`    |                              |                                            |
| `updated_at`                      | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write                      |

**Indexes:**

- `session_notes_org_idx` on `(organization_id)`
- `session_notes_session_idx` UNIQUE on `(session_id)` — enforces one note per session
- `session_notes_status_idx` on `(organization_id, status)`
- `session_notes_signed_by_idx` on `(signed_by_id)`

---

### `session_note_goals`

Per-goal data within a session note. Tracks trials, prompts, frequency, duration, and progress per goal targeted in a session.

| Column               | Type          | Nullable | Default            | FK                           | Notes                               |
| -------------------- | ------------- | -------- | ------------------ | ---------------------------- | ----------------------------------- |
| `id`                 | text          | NO       | `nanoid()`         | PK                           |                                     |
| `organization_id`    | text          | NO       |                    | `organizations.id` (cascade) |                                     |
| `session_note_id`    | text          | NO       |                    | `session_notes.id` (cascade) |                                     |
| `goal_id`            | text          | YES      |                    | `client_goals.id` (set null) | Nullable for ad-hoc goals           |
| `goal_name`          | text          | NO       |                    |                              | Snapshot name                       |
| `procedure`          | text          | YES      |                    |                              | ABA technique. See `ABA_TECHNIQUES` |
| `measurement_type`   | text          | NO       | `'discrete_trial'` |                              | See `MEASUREMENT_TYPES`             |
| `trials_completed`   | integer       | YES      |                    |                              | Discrete trial data                 |
| `trials_correct`     | integer       | YES      |                    |                              |                                     |
| `percentage_correct` | numeric(5,2)  | YES      |                    |                              |                                     |
| `frequency_count`    | integer       | YES      |                    |                              | Frequency data                      |
| `duration_seconds`   | integer       | YES      |                    |                              | Duration data                       |
| `rate_per_minute`    | numeric(7,2)  | YES      |                    |                              | Rate data                           |
| `latency_seconds`    | integer       | YES      |                    |                              | Latency data                        |
| `steps_completed`    | integer       | YES      |                    |                              | Task analysis data                  |
| `steps_total`        | integer       | YES      |                    |                              |                                     |
| `probe_correct`      | integer       | YES      |                    |                              | Probe data                          |
| `probe_total`        | integer       | YES      |                    |                              |                                     |
| `rating_scale_value` | integer       | YES      |                    |                              | Rating scale data                   |
| `rating_scale_max`   | integer       | YES      |                    |                              |                                     |
| `intervals_scored`   | integer       | YES      |                    |                              | Interval recording data             |
| `intervals_total`    | integer       | YES      |                    |                              |                                     |
| `prompt_level`       | text          | YES      |                    |                              | See `PROMPT_LEVELS`                 |
| `reinforcement`      | text          | YES      |                    |                              | Type and schedule                   |
| `progress_status`    | text          | NO       | `'not_assessed'`   |                              | See `GOAL_PROGRESS_STATUSES`        |
| `notes`              | text          | YES      |                    |                              |                                     |
| `sort_order`         | integer       | NO       | `0`                |                              |                                     |
| `created_at`         | timestamp(tz) | NO       | `now()`            |                              |                                     |
| `updated_at`         | timestamp(tz) | NO       | `now()`            |                              | Auto-updates on write               |

**Indexes:**

- `session_note_goals_note_idx` on `(session_note_id)`
- `session_note_goals_goal_idx` on `(goal_id)`

---

### `session_note_behaviors`

ABC (Antecedent-Behavior-Consequence) incident tracking within a session note.

| Column                 | Type          | Nullable | Default    | FK                           | Notes                                  |
| ---------------------- | ------------- | -------- | ---------- | ---------------------------- | -------------------------------------- |
| `id`                   | text          | NO       | `nanoid()` | PK                           |                                        |
| `organization_id`      | text          | NO       |            | `organizations.id` (cascade) |                                        |
| `session_note_id`      | text          | NO       |            | `session_notes.id` (cascade) |                                        |
| `behavior_name`        | text          | NO       |            |                              | From BIP (elopement, aggression, etc.) |
| `occurrence_time`      | text          | YES      |            |                              | e.g., "10:23 AM"                       |
| `antecedent`           | text          | YES      |            |                              | A — trigger                            |
| `behavior_description` | text          | YES      |            |                              | B — what happened                      |
| `consequence`          | text          | YES      |            |                              | C — staff response                     |
| `duration_seconds`     | integer       | YES      |            |                              |                                        |
| `intensity`            | text          | YES      |            |                              | See `BEHAVIOR_INTENSITIES`             |
| `notes`                | text          | YES      |            |                              |                                        |
| `sort_order`           | integer       | NO       | `0`        |                              |                                        |
| `created_at`           | timestamp(tz) | NO       | `now()`    |                              |                                        |
| `updated_at`           | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write                  |

**Indexes:**

- `session_note_behaviors_note_idx` on `(session_note_id)`

---

## Billing Domain

> Phase 2 stubs. Tables exist for FK integrity and schema completeness but have no CRUD actions yet.

### `claims`

Insurance claims (CMS-1500 form data).

| Column                   | Type          | Nullable | Default    | FK                               | Notes                          |
| ------------------------ | ------------- | -------- | ---------- | -------------------------------- | ------------------------------ |
| `id`                     | text          | NO       | `nanoid()` | PK                               |                                |
| `organization_id`        | text          | NO       |            | `organizations.id` (cascade)     |                                |
| `client_id`              | text          | NO       |            | `clients.id` (restrict)          |                                |
| `client_insurance_id`    | text          | NO       |            | `client_insurance.id` (restrict) |                                |
| `payer_id`               | text          | NO       |            | `payers.id` (restrict)           |                                |
| `rendering_provider_id`  | text          | NO       |            | `providers.id` (restrict)        |                                |
| `billing_provider_id`    | text          | YES      |            | `providers.id` (set null)        |                                |
| `authorization_id`       | text          | YES      |            | `authorizations.id` (set null)   |                                |
| `claim_number`           | text          | YES      |            |                                  | Practice-assigned claim number |
| `stedi_transaction_id`   | text          | YES      |            |                                  | Stedi API transaction ID       |
| `status`                 | text          | NO       | `'draft'`  |                                  | See `CLAIM_STATUSES`           |
| `service_date`           | date          | NO       |            |                                  |                                |
| `submitted_at`           | timestamp(tz) | YES      |            |                                  |                                |
| `total_billed_amount`    | numeric(10,2) | YES      |            |                                  |                                |
| `total_allowed_amount`   | numeric(10,2) | YES      |            |                                  |                                |
| `total_paid_amount`      | numeric(10,2) | YES      |            |                                  |                                |
| `patient_responsibility` | numeric(10,2) | YES      |            |                                  |                                |
| `diagnosis_code`         | text          | YES      | `'F84.0'`  |                                  |                                |
| `place_of_service`       | text          | YES      |            |                                  | See `PLACE_OF_SERVICE_CODES`   |
| `ai_pre_check_result`    | jsonb         | YES      |            |                                  | AI claim scrubbing result      |
| `ai_pre_check_at`        | timestamp(tz) | YES      |            |                                  |                                |
| `notes`                  | text          | YES      |            |                                  |                                |
| `created_at`             | timestamp(tz) | NO       | `now()`    |                                  |                                |
| `updated_at`             | timestamp(tz) | NO       | `now()`    |                                  | Auto-updates on write          |

**Indexes:**

- `claims_org_idx` on `(organization_id)`
- `claims_client_idx` on `(client_id)`
- `claims_status_idx` on `(organization_id, status)`
- `claims_stedi_idx` on `(stedi_transaction_id)`
- `claims_payer_idx` on `(payer_id)`

---

### `claim_lines`

Individual service lines on a claim.

| Column                   | Type          | Nullable | Default    | FK                           | Notes                 |
| ------------------------ | ------------- | -------- | ---------- | ---------------------------- | --------------------- |
| `id`                     | text          | NO       | `nanoid()` | PK                           |                       |
| `organization_id`        | text          | NO       |            | `organizations.id` (cascade) |                       |
| `claim_id`               | text          | NO       |            | `claims.id` (cascade)        |                       |
| `session_id`             | text          | YES      |            | `sessions.id` (set null)     |                       |
| `line_number`            | integer       | NO       |            |                              | Sequence on the claim |
| `cpt_code`               | text          | NO       |            |                              |                       |
| `modifier_codes`         | text[]        | YES      |            |                              |                       |
| `units`                  | integer       | NO       |            |                              |                       |
| `charge_amount`          | numeric(10,2) | NO       |            |                              |                       |
| `allowed_amount`         | numeric(10,2) | YES      |            |                              |                       |
| `paid_amount`            | numeric(10,2) | YES      |            |                              |                       |
| `adjustment_reason_code` | text          | YES      |            |                              | CARC/RARC code        |
| `adjustment_amount`      | numeric(10,2) | YES      |            |                              |                       |
| `remark_code`            | text          | YES      |            |                              |                       |
| `service_date_from`      | date          | NO       |            |                              |                       |
| `service_date_to`        | date          | YES      |            |                              |                       |
| `rendering_provider_npi` | text          | YES      |            |                              |                       |
| `created_at`             | timestamp(tz) | NO       | `now()`    |                              |                       |
| `updated_at`             | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write |

**Indexes:**

- `claim_lines_org_idx` on `(organization_id)`
- `claim_lines_claim_idx` on `(claim_id)`
- `claim_lines_session_idx` on `(session_id)`

---

### `claim_responses`

ERA/835 responses and claim status updates from payers.

| Column                 | Type          | Nullable | Default    | FK                           | Notes                 |
| ---------------------- | ------------- | -------- | ---------- | ---------------------------- | --------------------- |
| `id`                   | text          | NO       | `nanoid()` | PK                           |                       |
| `organization_id`      | text          | NO       |            | `organizations.id` (cascade) |                       |
| `claim_id`             | text          | NO       |            | `claims.id` (cascade)        |                       |
| `response_type`        | text          | NO       |            |                              | e.g., "277", "835"    |
| `stedi_transaction_id` | text          | YES      |            |                              |                       |
| `raw_response`         | jsonb         | YES      |            |                              | Full EDI response     |
| `status_code`          | text          | YES      |            |                              |                       |
| `status_description`   | text          | YES      |            |                              |                       |
| `effective_date`       | date          | YES      |            |                              |                       |
| `check_number`         | text          | YES      |            |                              | EFT/check number      |
| `check_amount`         | numeric(10,2) | YES      |            |                              |                       |
| `received_at`          | timestamp(tz) | NO       | `now()`    |                              |                       |
| `created_at`           | timestamp(tz) | NO       | `now()`    |                              |                       |
| `updated_at`           | timestamp(tz) | NO       | `now()`    |                              | Auto-updates on write |

**Indexes:**

- `claim_responses_org_idx` on `(organization_id)`
- `claim_responses_claim_idx` on `(claim_id)`
- `claim_responses_type_idx` on `(response_type)`

---

### `eligibility_checks`

270/271 eligibility verification results from Stedi.

| Column                    | Type          | Nullable | Default    | FK                               | Notes                      |
| ------------------------- | ------------- | -------- | ---------- | -------------------------------- | -------------------------- |
| `id`                      | text          | NO       | `nanoid()` | PK                               |                            |
| `organization_id`         | text          | NO       |            | `organizations.id` (cascade)     |                            |
| `client_id`               | text          | NO       |            | `clients.id` (restrict)          |                            |
| `client_insurance_id`     | text          | NO       |            | `client_insurance.id` (restrict) |                            |
| `payer_id`                | text          | NO       |            | `payers.id` (restrict)           |                            |
| `stedi_transaction_id`    | text          | YES      |            |                                  |                            |
| `request_payload`         | jsonb         | YES      |            |                                  |                            |
| `response_payload`        | jsonb         | YES      |            |                                  |                            |
| `is_eligible`             | boolean       | YES      |            |                                  |                            |
| `plan_name`               | text          | YES      |            |                                  |                            |
| `plan_type`               | text          | YES      |            |                                  |                            |
| `copay`                   | numeric(10,2) | YES      |            |                                  |                            |
| `coinsurance`             | text          | YES      |            |                                  |                            |
| `deductible`              | numeric(10,2) | YES      |            |                                  |                            |
| `deductible_remaining`    | numeric(10,2) | YES      |            |                                  |                            |
| `out_of_pocket_max`       | numeric(10,2) | YES      |            |                                  |                            |
| `out_of_pocket_remaining` | numeric(10,2) | YES      |            |                                  |                            |
| `aba_specific_benefits`   | jsonb         | YES      |            |                                  | ABA-specific plan benefits |
| `ai_interpretation`       | text          | YES      |            |                                  | AI summary of eligibility  |
| `checked_at`              | timestamp(tz) | NO       | `now()`    |                                  |                            |
| `created_at`              | timestamp(tz) | NO       | `now()`    |                                  |                            |
| `updated_at`              | timestamp(tz) | NO       | `now()`    |                                  | Auto-updates on write      |

**Indexes:**

- `eligibility_org_idx` on `(organization_id)`
- `eligibility_client_idx` on `(client_id)`
- `eligibility_date_idx` on `(organization_id, checked_at)`

---

## System Domain

### `documents`

Uploaded files: authorization letters, insurance cards, assessment reports, treatment plans.

| Column                | Type          | Nullable | Default     | FK                             | Notes                        |
| --------------------- | ------------- | -------- | ----------- | ------------------------------ | ---------------------------- |
| `id`                  | text          | NO       | `nanoid()`  | PK                             |                              |
| `organization_id`     | text          | NO       |             | `organizations.id` (cascade)   |                              |
| `client_id`           | text          | YES      |             | `clients.id` (set null)        |                              |
| `authorization_id`    | text          | YES      |             | `authorizations.id` (set null) |                              |
| `claim_id`            | text          | YES      |             | `claims.id` (set null)         |                              |
| `document_type`       | text          | NO       |             |                                | See `DOCUMENT_TYPES`         |
| `file_name`           | text          | NO       |             |                                |                              |
| `file_url`            | text          | NO       |             |                                | Vercel Blob URL              |
| `file_size_bytes`     | integer       | YES      |             |                                |                              |
| `mime_type`           | text          | YES      |             |                                |                              |
| `uploaded_by_user_id` | text          | YES      |             | `users.id` (set null)          |                              |
| `ai_processed`        | text          | YES      | `'pending'` |                                | See `AI_PROCESSING_STATUSES` |
| `ai_extracted_data`   | text          | YES      |             |                                | AI-parsed document content   |
| `created_at`          | timestamp(tz) | NO       | `now()`     |                                |                              |
| `updated_at`          | timestamp(tz) | NO       | `now()`     |                                | Auto-updates on write        |

**Indexes:**

- `documents_org_idx` on `(organization_id)`
- `documents_client_idx` on `(client_id)`
- `documents_auth_idx` on `(authorization_id)`

---

### `audit_logs`

Immutable audit trail for all data access and mutations. No `updated_at` — rows are append-only.

| Column            | Type          | Nullable | Default    | FK                           | Notes                                      |
| ----------------- | ------------- | -------- | ---------- | ---------------------------- | ------------------------------------------ |
| `id`              | text          | NO       | `nanoid()` | PK                           |                                            |
| `organization_id` | text          | NO       |            | `organizations.id` (cascade) |                                            |
| `user_id`         | text          | YES      |            |                              | User who performed the action              |
| `action`          | text          | NO       |            |                              | e.g., "create", "update", "delete"         |
| `entity_type`     | text          | NO       |            |                              | e.g., "client", "session", "authorization" |
| `entity_id`       | text          | YES      |            |                              | ID of the affected entity                  |
| `metadata`        | jsonb         | YES      |            |                              | Contextual data (changes, etc.)            |
| `ip_address`      | text          | YES      |            |                              |                                            |
| `user_agent`      | text          | YES      |            |                              |                                            |
| `created_at`      | timestamp(tz) | NO       | `now()`    |                              | Immutable timestamp                        |

**Indexes:**

- `audit_org_idx` on `(organization_id)`
- `audit_user_idx` on `(user_id)`
- `audit_entity_idx` on `(entity_type, entity_id)`
- `audit_date_idx` on `(organization_id, created_at)`

---

## Constants & Enum Values

All enum-like values are defined as `as const` arrays in `src/lib/constants.ts`. Columns store plain `text`; validation happens at the application boundary via Zod.

### Core Enums

| Constant                     | Column(s)                                     | Values                                                                                                                                               |
| ---------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `USER_ROLES`                 | `users.role`                                  | `owner`, `admin`, `bcba`, `bcaba`, `rbt`, `billing_staff`                                                                                            |
| `USER_STATUSES`              | `users.status`                                | `invited`, `active`, `deactivated`                                                                                                                   |
| `CREDENTIAL_TYPES`           | `providers.credential_type`                   | `bcba`, `bcba_d`, `bcaba`, `rbt`, `other`                                                                                                            |
| `CARE_TEAM_ROLES`            | `client_providers.role`                       | `supervising_bcba`, `bcba`, `bcaba`, `lead_rbt`, `rbt`                                                                                               |
| `CLIENT_STATUSES`            | `clients.status`                              | `inquiry`, `intake`, `waitlist`, `pending_assessment`, `pending_treatment_auth`, `active`, `on_hold`, `discharged`, `archived`                       |
| `GENDERS`                    | `clients.gender`                              | `M`, `F`, `U`                                                                                                                                        |
| `REFERRAL_SOURCES`           | `clients.referral_source`                     | `pediatrician`, `school`, `self_referral`, `insurance`, `other_provider`, `website`, `word_of_mouth`, `other`                                        |
| `CONTACT_RELATIONSHIP_TYPES` | `client_contacts.relationship`                | `mother`, `father`, `stepmother`, `stepfather`, `grandmother`, `grandfather`, `legal_guardian`, `foster_parent`, `aunt`, `uncle`, `sibling`, `other` |
| `PAYER_TYPES`                | `payers.payer_type`                           | `commercial`, `medicaid`, `medicare`, `tricare`                                                                                                      |
| `SUBSCRIBER_RELATIONSHIPS`   | `client_insurance.relationship_to_subscriber` | `self`, `spouse`, `child`, `other`                                                                                                                   |
| `VERIFICATION_STATUSES`      | `client_insurance.verification_status`        | `unverified`, `verified`, `failed`                                                                                                                   |

### Clinical Enums

| Constant                 | Column(s)                                              | Values                                                                                              |
| ------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `GOAL_TYPES`             | `client_goals.goal_type`                               | `skill_acquisition`, `behavior_reduction`                                                           |
| `GOAL_STATUSES`          | `client_goals.status`, `client_goal_objectives.status` | `baseline`, `active`, `mastered`, `maintenance`, `generalization`, `met`, `on_hold`, `discontinued` |
| `BEHAVIOR_FUNCTIONS`     | `client_goals.function_of_behavior`                    | `escape`, `attention`, `tangible`, `sensory`, `automatic`, `multiple`                               |
| `BEHAVIOR_SEVERITIES`    | `client_goals.severity_level`                          | `mild`, `moderate`, `severe`, `crisis`                                                              |
| `ASSESSMENT_SOURCES`     | `client_goals.assessment_source`                       | `vb_mapp`, `ablls_r`, `afls`, `peak`, `vineland`, `clinical_observation`, `other`                   |
| `DATA_COLLECTION_TYPES`  | `client_goal_objectives.data_collection_type`          | `dtt`, `frequency`, `duration`, `task_analysis`, `interval`, `probe`, `rating_scale`                |
| `AUTH_STATUSES`          | `authorizations.status`                                | `pending`, `approved`, `denied`, `expired`, `exhausted`                                             |
| `SERVICE_FREQUENCIES`    | `authorization_services.frequency`                     | `daily`, `weekly`, `biweekly`, `monthly`, `as_needed`                                               |
| `SESSION_STATUSES`       | `sessions.status`                                      | `scheduled`, `completed`, `cancelled`, `no_show`, `flagged`                                         |
| `UNIT_CALC_METHODS`      | `sessions.unit_calc_method`, `payers.unit_calc_method` | `cms`, `ama`                                                                                        |
| `PLACE_OF_SERVICE_CODES` | `sessions.place_of_service`, `claims.place_of_service` | `02`, `03`, `10`, `11`, `12`, `99`                                                                  |

### Session Note Enums

| Constant                  | Column(s)                              | Values                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NOTE_TYPES`              | `session_notes.note_type`              | `97153_direct`, `97155_modification`, `97156_caregiver`, `97151_assessment`                                                                                                                                                                                                                                                                                                     |
| `NOTE_STATUSES`           | `session_notes.status`                 | `draft`, `signed`, `cosigned`, `locked`                                                                                                                                                                                                                                                                                                                                         |
| `MEASUREMENT_TYPES`       | `session_note_goals.measurement_type`  | `discrete_trial`, `frequency`, `duration`, `rate`, `latency`, `task_analysis`, `whole_interval`, `partial_interval`, `momentary_time_sampling`, `probe`, `rating_scale`, `permanent_product`, `other`                                                                                                                                                                           |
| `PROMPT_LEVELS`           | `session_note_goals.prompt_level`      | `FP`, `PP`, `M`, `V`, `G`, `PO`, `TX`, `VS`, `EC`, `I`                                                                                                                                                                                                                                                                                                                          |
| `GOAL_PROGRESS_STATUSES`  | `session_note_goals.progress_status`   | `met`, `partially_met`, `not_met`, `regression`, `maintenance`, `not_assessed`                                                                                                                                                                                                                                                                                                  |
| `BEHAVIOR_INTENSITIES`    | `session_note_behaviors.intensity`     | `mild`, `moderate`, `severe`                                                                                                                                                                                                                                                                                                                                                    |
| `CAREGIVER_RELATIONSHIPS` | `session_notes.caregiver_relationship` | `mother`, `father`, `parent`, `grandparent`, `sibling`, `teacher`, `aide`, `other`                                                                                                                                                                                                                                                                                              |
| `ABA_TECHNIQUES`          | `session_note_goals.procedure`         | `dtt`, `net`, `incidental_teaching`, `pivotal_response`, `fluency_training`, `chaining_forward`, `chaining_backward`, `shaping`, `task_analysis`, `modeling`, `prompting`, `fading`, `reinforcement`, `extinction`, `dra`, `dri`, `dro`, `functional_communication`, `social_skills_training`, `self_management`, `video_modeling`, `visual_supports`, `token_economy`, `other` |
| `ASSESSMENT_TOOLS`        | `session_notes.assessment_tools_used`  | `VB-MAPP`, `ABLLS-R`, `AFLS`, `Vineland-3`, `PEAK`, `ESDM Curriculum`, `FBA`, `FA`, `FAST`, `MAS`, `Other`                                                                                                                                                                                                                                                                      |

### Billing Enums

| Constant                 | Column(s)                 | Values                                                                                                        |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `CLAIM_STATUSES`         | `claims.status`           | `draft`, `ready`, `submitted`, `accepted`, `rejected`, `paid`, `partially_paid`, `denied`, `appealed`, `void` |
| `DOCUMENT_TYPES`         | `documents.document_type` | `authorization_letter`, `assessment_report`, `treatment_plan`, `insurance_card`, `other`                      |
| `AI_PROCESSING_STATUSES` | `documents.ai_processed`  | `pending`, `processing`, `completed`, `failed`                                                                |

### ABA CPT Codes

Defined in `ABA_CPT_CODES` object. Used in `sessions.cpt_code`, `authorization_services.cpt_code`, `claim_lines.cpt_code`.

| Code    | Description                                                           | Provider      | Max Units/Day |
| ------- | --------------------------------------------------------------------- | ------------- | ------------- |
| `97151` | Behavior identification assessment                                    | BCBA/QHP      | 32            |
| `97152` | Behavior identification supporting assessment                         | RBT under QHP | 16            |
| `97153` | Adaptive behavior treatment by protocol (1:1 direct therapy)          | RBT under QHP | 32            |
| `97154` | Group adaptive behavior treatment by protocol (2-8 patients)          | RBT under QHP | 18            |
| `97155` | Adaptive behavior treatment with protocol modification                | BCBA/QHP      | 24            |
| `97156` | Family adaptive behavior treatment guidance (caregiver training)      | BCBA/QHP      | 16            |
| `97157` | Multiple-family group treatment guidance                              | BCBA/QHP      | 16            |
| `97158` | Group treatment with protocol modification (2-8 patients)             | BCBA/QHP      | 16            |
| `0362T` | Multi-technician behavior assessment for destructive behavior         | QHP on-site   | 16            |
| `0373T` | Multi-technician adaptive behavior treatment for destructive behavior | QHP on-site   | 32            |

> `0362T` and `0373T` have retirement date of 2027-01-01.

### Session State Machine

Valid transitions defined in `VALID_SESSION_TRANSITIONS`:

```
scheduled  -> completed, cancelled, no_show
completed  -> cancelled, flagged
cancelled  -> (terminal)
no_show    -> (terminal)
flagged    -> completed, cancelled
```

### Authorization Alert Thresholds

Defined in `AUTH_ALERT_THRESHOLDS`:

| Threshold                  | Value | Description                                    |
| -------------------------- | ----- | ---------------------------------------------- |
| `EXPIRY_WARNING_DAYS`      | 30    | Days before expiry to warn                     |
| `UTILIZATION_WARNING_PCT`  | 80    | Warning at 80% utilized                        |
| `UTILIZATION_CRITICAL_PCT` | 95    | Critical at 95% utilized                       |
| `UNDER_UTILIZATION_PCT`    | 50    | Alert if <50% used with >50% of period elapsed |

### Billing Modifier Codes

Auto-assigned from `CREDENTIAL_MODIFIERS`:

| Credential | Modifier |
| ---------- | -------- |
| `rbt`      | HM       |
| `bcaba`    | HN       |
| `bcba`     | HO       |
| `bcba_d`   | HP       |

Priority ordering in `MODIFIER_PRIORITY`: credential (tier 1) > telehealth (tier 2) > distinct service (tier 3) > informational (tier 4). Max 4 modifiers per claim line.

### Default Goal Domains

Seeded per organization from `DEFAULT_GOAL_DOMAINS`: Communication, Social Skills, Adaptive Behavior, Behavior Reduction, Academic, Play & Leisure, Self-Care, Motor Skills, Vocational, Other.

---

## Design Conventions

| Pattern           | Rule                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| **IDs**           | `nanoid()` for all PKs. Never UUID, never auto-increment                        |
| **Money**         | `numeric(10, 2)` in Postgres. `decimal.js` for arithmetic. Never `parseFloat()` |
| **Enums**         | `text` columns + `as const` arrays + Zod. Never `pgEnum`                        |
| **Timestamps**    | `timestamp('col', { withTimezone: true })` for all date/time                    |
| **Soft delete**   | `deleted_at` timestamp where appropriate                                        |
| **Multi-tenancy** | Every table has `organization_id`. Every query filters by it                    |
| **Table names**   | `snake_case`, plural                                                            |
| **Column names**  | `snake_case`                                                                    |
| **Foreign keys**  | Explicit `onDelete` on every FK                                                 |
| **Indexes**       | On `organization_id`, all WHERE columns, composite for common queries           |
