# Platform Navigation Audit — ABA EHR/PM Competitors

> Research date: 2026-03-27
> Scope: Sidebar/nav structure of 7 entry-to-mid-tier ABA platforms
> Purpose: Define Clinivise's information architecture before building more features

## Summary

All successful ABA platforms have 7-9 top-level nav items. Five are universal (table stakes):

1. Dashboard
2. Clients/Learners
3. Scheduling/Calendar
4. Billing/Claims
5. Reports/Analytics

Near-universal (6-7 of 7): Staff/Providers, Authorization tracking, Session documentation.

## Competitor Nav Structures

### Raven Health (~8 items)
Dashboard, Clients, Data Collection, Treatment Plans, Scheduling, Graphing & Reporting, Claims & Revenue, Compliance

### Hipp Health (~7 items)
Dashboard, Patients, Scheduling, Data Collection & Analytics, Session Notes, Billing, Compliance Agent

### Passage Health (~9 items)
Dashboard, Clients, Scheduling, Data Collection, Treatment Reports & Graphing, Billing & Claims, Team Members, Reports & Analytics, Documents

### AlohaABA (8 items)
Dashboard, Schedule, Clients, Staff, Billing, Payroll, Reports, Settings

### TherapyPM (~10 items)
Dashboard, Appointments, Patients, Staff, Billing, Documentation, Payroll, Telehealth, Settings, Reports

### TherapyLake (~9 items)
Dashboard, Clients, Scheduling, Billing & Claims, Session Notes/EMR, Credentialing, Staff, Reports, Payroll

### Motivity (~8 items)
Dashboard, Learners, Programs/Data Collection, Scheduling, Billing & RCM, Staff, Credentialing, Reports/BI

## Clinivise Current Nav (8 items, 3 groups)

```
Core:        Overview, Clients, Sessions, Authorizations
Management:  Providers, Payers
Admin:       Team, Settings
```

## Recommended Evolution

### Phase 2 (when scheduling + billing ship):
```
Core:        Overview, Clients, Calendar, Sessions, Authorizations
Billing:     Claims, Payers
Management:  Providers, Team
Admin:       Settings
```

### Phase 3+ (full platform):
```
Core:        Overview, Clients, Calendar, Sessions, Authorizations
Billing:     Claims, Payers, Reports
Management:  Providers, Team
Admin:       Settings
```

## Key Decisions

1. Keep nav at 8-10 items max (competitor sweet spot is 7-9)
2. Keep Authorizations as standalone top-level (differentiator — competitors bury it)
3. Calendar goes in Core when built (daily-use for all roles)
4. Create "Billing" group when claims ship (clinical team vs billing team mental model)
5. 3-group sidebar model is better than flat (only Clinivise + TherapyPM do this)
6. Do NOT add: Payroll, Telehealth, Data Collection (out of scope for our tier)
