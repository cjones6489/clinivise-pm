# AI-Powered & Specialized Scheduling in ABA Therapy

> Research date: 2026-03-27
> Purpose: Understand the frontier of AI scheduling, geographic optimization, auth-aware scheduling, and related automation in ABA therapy platforms. Inform Clinivise's future scheduling feature design.

---

## Table of Contents

1. [Platform-by-Platform Analysis](#platform-by-platform-analysis)
2. [General AI Scheduling Trends in Healthcare](#general-ai-scheduling-trends)
3. [Parent/Caregiver Scheduling Portals](#parent-caregiver-portals)
4. [Telehealth vs In-Person Scheduling](#telehealth-scheduling)
5. [Waitlist Management & Auto-Fill](#waitlist-management)
6. [Staff Availability Management](#staff-availability)
7. [Key Takeaways for Clinivise](#key-takeaways)

---

## Platform-by-Platform Analysis

### 1. TheraDriver (theradriver.ai / theradriver.com)

**What it is:** A standalone AI scheduling optimization platform for home- and community-based ABA providers. NOT an EHR/PM — it sits alongside existing systems.

**How AI is used:**
- One-click optimal schedule generation that analyzes staff availability, authorizations, client needs, and supervision requirements simultaneously
- Geographic clustering and session sequencing for route planning
- Dynamic rescheduling — handles same-day cancellations and reassigns staff in minutes (claims 5x faster than manual)
- Clinical pairing management (tracks RBT certifications, BCBA supervision assignments, staff competencies, distance between client locations)

**Integration model:** Standalone add-on that integrates with existing EHRs. Auto-syncs schedules to the practice's EHR so nothing needs double-entry. However, currently has NO native integrations with major systems like CentralReach, Lumary, or Passage — implementation may require manual imports or middleware.

**Key features:**
- Automated staff communication (push notifications when schedules change)
- HIPAA-compliant family messaging (milestones, progress, resources)
- Short-form video RBT training with analytics on knowledge gaps
- Analytics: client dosage, utilization, productivity, cancellations, technician leaderboard, BCBA billable hours
- Treatment plan automation (AI-powered clinical docs)

**Drive time / geographic optimization:**
- Route planning with geographic clustering and session sequencing
- Urban/metro-area coverage optimization
- **Real-time, time-of-day-aware drive time optimization is NOT yet live** — it's a core roadmap priority. Evaluating real-time optimization partnerships as of July 2025.

**Auth-aware features:** Analyzes authorizations as part of schedule generation. Limited detail on how deep this goes (alerts vs. hard blocks vs. utilization tracking).

**Pricing:** Not publicly available. Contact sales.

**Market position:**
- 21 US employees, 3 Top-35 provider clients
- Capterra rating: 5.0
- Last funding: August 2023
- Best suited for mid-size to enterprise ABA providers doing in-home services in metro areas
- Exploring expansion into adjacent recurring care verticals

**Claimed results:**
- 20% improvement in technician utilization
- 28% reduction in cancellation rates
- 3x improvement in administrative overhead

---

### 2. ABA Engine (abaengine.com)

**What it is:** A practice management platform with automated scheduling, intake, communication, and parent portal. More PM-focused than AI-scheduling-focused.

**How AI is used:**
- Map-based algorithm to match clients with nearby clinicians, cutting travel time
- AI Language Translation across parent portal, forms, and messaging
- Automated intake workflows with time tracking
- Not a true AI scheduling optimizer — more of a rules-based automation engine

**Integration model:** Standalone all-in-one PM. Three separate portals: Parent, Employee, Admin. Enterprise tier adds integration with select 3rd-party apps.

**Key features:**
- Automated appointment confirmations and reminders
- Custom form builder for practice-specific intake
- Task management with expiration alerts
- Dashboards and visual reporting
- Multilingual parent communication

**Drive time / geographic optimization:**
- Map-based geographic matching to pair clients with nearby providers
- No evidence of route optimization or drive-time-between-appointments calculation

**Auth-aware features:** Not explicitly documented in available sources.

**Pricing (4 tiers):**
| Tier | Client Cap | Admin Seats | Additional Admin Cost |
|------|-----------|------------|---------------------|
| Startup | 100 | 1 owner + 1 | $150/mo |
| Growth | 200 | 1 owner + 3 | $100/mo |
| Scale | 350 | 1 owner + 5 | $75/mo |
| Enterprise | 350+ | 1 owner + 15 | $25/mo |

All tiers include the same core features. Per-client pricing not disclosed.

**Market position:** Positioned for small-to-mid practices. Saves ~2 hours/week per client through automation. Less clinical depth than competitors.

---

### 3. Hi Rasmus (hirasmus.com)

**What it is:** A clinical-first platform (data collection, graphing, AI documentation) with scheduling as a secondary feature. Partners with PM tools like AlohaABA for billing.

**How AI is used:**
- AI-powered documentation and session note generation
- AI notifications for mastered or regressing goals
- Scheduling itself is NOT AI-powered — it's a manual drag-and-drop calendar
- No evidence of AI scheduling optimization

**Integration model:** Clinical platform that integrates with PM tools. Key integration: Hi Rasmus + AlohaABA for clinical + billing. Also integrates with other PM systems.

**Key features (scheduling-specific):**
- Drag-and-drop appointment creation with multiple calendar views (day, week, timeline)
- Color-coding by status, service type, user, or client
- Advanced filtering (by user roles, client characteristics like pet presence, service needs)
- Saved filter views
- Grouped scheduling views (by client or by staff)
- Customizable service types, session requirements, places of service, cancellation reasons
- Availability management by user, location, or service
- Staff reassignment via drag-and-drop (with client access checks)

**Drive time / geographic optimization:** Not present.

**Auth-aware features:** Not documented in scheduling module. Auth tracking likely lives in the PM partner tool.

**Pricing:** $24/learner/month for clinical platform. Scheduling is part of the subscription.

**Market position:** Strong clinical depth, mobile-first, offline capability. Used by thousands of professionals globally. Not trying to be a PM — intentionally partners with PM tools. Best for practices that want best-in-class data collection and are willing to use a separate PM tool.

---

### 4. Catalyst / Ensora Data Collection (formerly DataFinch)

**What it is:** A data collection and practice management suite, rebranded as Ensora Health. Part of the Therapy Brands family (which also owns TheraNest and Fusion).

**How AI is used:**
- AI Session Assistant (new feature)
- Automated graphing and auto-mastery for data collection
- Progress note generation
- No evidence of AI-powered scheduling optimization

**Integration model:** Part of the larger Ensora Health ecosystem. Ensora ABA Therapy handles schedules/billing/PM. Ensora Data Collection handles clinical data. CodeMetro by Ensora handles coding. These are separate products that integrate.

**Key features:**
- Completed sessions automatically tracked against authorizations (triggers alerts when hours run low)
- SOAP notes flow from data collection into PM — linking sessions to appointments for documentation and billing
- Waitlist management as part of client journey
- Curriculum libraries, video/audio recording, preference assessments
- DTT, task analysis, interval, duration, rate, ABC data, cold probes

**Drive time / geographic optimization:** Not documented.

**Auth-aware features:** Completed sessions auto-tracked against authorizations with low-hours alerts. Authorization status integrated into the scheduling-to-billing pipeline.

**Pricing:** Not publicly listed for the full suite. Data collection app has a free trial.

**Market position:** Enterprise-oriented through Therapy Brands umbrella. Strong data collection heritage (Catalyst was well-known). Rebranding to Ensora has caused some market confusion. Better for mid-to-large practices already in the Therapy Brands ecosystem.

---

### 5. CentralReach ScheduleAI

**What it is:** The scheduling module within CentralReach's enterprise platform, powered by their proprietary "cari" AI agent. The most sophisticated AI scheduling in ABA.

**How AI is used:**
- **Multi-factor optimization engine**: Analyzes hundreds of data points simultaneously to generate optimal schedules
- **Real-time scoring**: Every open slot scored against RBT credentials, languages, drive time, historical acceptance rates, and client preferences
- **Authorization fill**: Can create new events to maximize remaining authorized hours (subject to availability, session length constraints, certified provider requirements)
- **Cancellation coverage**: Automates finding replacement providers considering client preferences and provider experience (coming soon: embedded cancellations that reoptimize the full schedule)
- **Interactive drafts**: Bulk editing and partial publishing of optimized schedules for scenario planning (coming soon)

**Integration model:** Embedded module within CentralReach's all-in-one platform. Deep integration with CR's practice management, EMR, claims, and analytics. Not available standalone.

**Key features:**
- Drafts, modifies, and optimizes schedules in minutes
- Accounts for: language preferences, preferred providers, location of services, drive time, authorized service hours, client/technician availability, cancellations
- Provider and client locations must be geolocated in their profiles
- Compliance automation: credentialing requirements, authorization hour limits, labor law requirements, payer-specific requirements
- Travel events contain drive time info (hours, minutes, miles)
- Real-time schedule updates

**Drive time / geographic optimization:**
- **Yes — built in.** Smart scheduling prioritizes efficient routes, reducing unnecessary travel
- Provider and client locations must be geo-located in profiles
- Travel time between appointments is calculated and displayed
- Route optimization for in-home sessions

**Auth-aware features:**
- Monitors insurance-approved hours for each client
- Blocks scheduling beyond authorized limits
- Fills authorized hours by creating new events within constraints
- Compliance safeguards for credentialing, authorization limits, labor law, payer rules

**Pricing:** Enterprise only, quote-based. CentralReach is generally the most expensive option in ABA software.

**Market position:** The incumbent enterprise leader. 4,000+ practices. Dominant in large multi-location organizations. ScheduleAI is their competitive moat against smaller competitors.

**Case study results (Behavioral Innovations):**
- 75% time savings in schedule creation (8-10 hours down to 2-3 hours)
- Minimum 20% increase in scheduled appointments
- Manages schedules for 3,000 employees across 86 clinics

---

### Bonus: Other Platforms with Notable Scheduling Features

#### Hipp Health
- AI scheduling keeps track of utilization rates, suggests optimal session times
- Collects patient and provider time preferences, adjusts calendar for optimal use
- Reduces friction for rescheduling/cancellation
- Analyzes technician target hours, utilization, attrition signals, patient satisfaction
- $6.2M seed funding (Oct 2025). Early stage — scheduling depth is shallow compared to CR ScheduleAI

#### Artemis ABA
- Smart Match Search: matches clients to providers based on needs, availability, location, qualifications
- Authorization tracking integrated into scheduling (alerts on conflicts/auth issues)
- Dashboard for cancellations, authorizations, RBT supervision
- Color-coded scheduling with drag-and-drop
- Pricing: $39.99/user/month (Emerging plan)
- AI Session Notes and AI Treatment Plans are separate products, NOT part of scheduler

#### Motivity
- Expanding from clinical-only to all-in-one PM (announced 2025)
- Smart travel scheduling for in-home: auto-calculates travel time, eliminates overlaps
- Intelligent rules automate appointment setups
- Conflict prevention: auto-detects patient and provider scheduling conflicts
- Staff utilization tools show open availability, underutilized staff, scheduling gaps
- Pricing: $24/learner/month (clinical). PM pricing TBD.

#### Theralytics
- Built-in drive time and mileage tracking
- Scheduling with mileage/location filtering
- Multi-location calendar management
- Therapy room assignment
- Provider search by availability
- Pricing: Starts at $15/client/month, $20/client/month standard, $30/client/month with data collection. Transparent, no hidden fees. Free startup package until first client.

#### ABA Matrix
- Scheduling checks therapist availability, insurance rules, service limits in real time
- Driving time built into scheduler for travel tracking and payroll accuracy
- Authorization connected directly to scheduling, billing workflows
- Real-time monitoring of remaining authorized units with calendar integration
- Alerts on approaching authorization expiration
- Custom rules for hours, service codes, blackout dates

#### Raven Health
- Drag-and-drop scheduling, color-coded calendars
- True offline data collection with sync
- Mobile-first design (15-min RBT onboarding)
- AI session summaries
- Pricing: $29/client/month + $500 implementation
- Best for small practices wanting simplicity

#### RethinkBH
- AI scheduling with auto-search for best available appointment times
- Considers patient availability, clinician preferences, insurance requirements
- Credential validation (flags expired/invalid credentials)
- Multi-location support
- Recurring appointment management

#### Alpaca Health
- AI-driven platform for BCBAs (automates notetaking, treatment plan generation)
- Scheduling is part of the platform but NOT a primary differentiator
- Focus is on reducing BCBA administrative burden

---

## General AI Scheduling Trends in Healthcare

### Current State (2025-2026)
- **Only 28% of large U.S. health systems** have implemented AI-powered scheduling as of 2025, despite 41% planning investments
- Healthcare providers have largely focused on administrative AI over clinical AI in the past two years
- Agentic AI is emerging: Houston Methodist uses AI agents for scheduling, registration, consents, revenue cycle, prior authorization — projecting 25-50% cost reduction

### Technical Approaches
1. **Constraint optimization**: Hard constraints (credentials, authorization limits, labor law) that cannot be violated + soft constraints (preferences, travel time, historical patterns) minimized in a cost function
2. **Machine learning for demand forecasting**: LSTM, XGBoost, Random Forest models predict staffing needs
3. **No-show prediction**: ML models predict cancellation likelihood based on patient history, weather, time of day, appointment type — enabling proactive overbooking or backfill
4. **NLP-based intake**: Some platforms use conversational AI for initial scheduling (chatbots, voice)
5. **Reinforcement learning**: Emerging approach where the scheduler learns optimal strategies from outcomes over time

### Key Pattern: Two-Phase Scheduling
1. **Draft phase**: AI generates an optimized schedule proposal
2. **Human review phase**: Scheduler reviews, adjusts, and publishes

This pattern (used by CentralReach, TheraDriver, and emerging in others) avoids the "black box" problem — schedulers maintain control while AI handles the combinatorial complexity.

### EVV Integration
- Electronic Visit Verification (EVV) is required by most states for Medicaid-reimbursed in-home services (21st Century Cures Act)
- GPS/geofencing verifies provider is physically at client location at clock-in/clock-out
- Modern platforms integrate EVV directly into the scheduling flow rather than as a separate system
- Relevant for Clinivise: any in-home scheduling feature should plan for EVV compliance

---

## Parent/Caregiver Scheduling Portals

### Current State
Parent scheduling in ABA is **view-mostly, not self-serve**. The industry has NOT converged on full self-scheduling for parents.

### What platforms offer:
- **View-only access**: Parents see upcoming sessions, confirmations, directions (most platforms)
- **Confirm/decline**: Some platforms let parents confirm or request cancellation of scheduled sessions
- **Request appointments**: A few platforms (TherapyNotes, some with Essential+ plans) allow parents to request appointments — but these go through staff approval, NOT direct booking
- **Schedule viewing**: Parents see their child's schedule without accessing sensitive clinical data
- **Communication**: SMS, email, WhatsApp with multilingual templates. Follow-up triggers if parent doesn't reply
- **Document access**: Parents access session summaries, progress reports, invoices through the portal

### What no platform does (yet):
- True self-scheduling where parents pick any available slot and it's auto-confirmed
- Parent-initiated rescheduling that auto-adjusts the provider's route
- Parent preference learning (e.g., "this family always prefers morning sessions")

### Why self-scheduling is limited in ABA:
- Sessions are 2-4 hours (not 15-minute doctor visits) — harder to flex
- Provider continuity matters clinically (same RBT with same child)
- Authorization constraints limit what can be scheduled
- Geographic routing means one parent's change cascades to other appointments
- Clinical pairing (skill match, behavioral match) is too complex for parent self-service

### Opportunity for Clinivise:
Parent portal with session visibility, cancellation requests, and preference submission (preferred times, preferred days) — but NOT full self-scheduling. Feed preferences into scheduling optimization.

---

## Telehealth vs In-Person Scheduling

### How platforms handle hybrid models:
- Sessions tagged with location type: clinic, in-home, telehealth, school, community
- Travel buffer times applied automatically for in-home sessions (not for telehealth)
- Custom rules per session type (e.g., telehealth only for supervision, in-home only for direct therapy)
- Some platforms auto-generate telehealth links when sessions are tagged as virtual
- CPT codes may differ for telehealth vs in-person — scheduler should auto-map

### ABA-specific telehealth patterns:
- **Parent training** and **BCBA supervision** commonly done via telehealth
- **Direct therapy (RBT sessions)** almost always in-person — telehealth for direct ABA is limited and payer-dependent
- **Hybrid scheduling**: A BCBA might do morning in-home supervision, then afternoon telehealth parent training
- Some states have specific telehealth billing requirements that affect scheduling

### What good platforms do:
- Single calendar showing both telehealth and in-person appointments with visual differentiation
- Travel time auto-calculated only for in-person sessions
- Telehealth sessions don't affect geographic routing optimization
- Place-of-service codes auto-mapped to the appointment type
- Video platform integration (built-in or linked: Zoom, Doxy, etc.)

---

## Waitlist Management & Auto-Fill

### Current capabilities across platforms:

**Basic tier (most platforms):**
- Manual waitlist (list of clients waiting for services)
- Manual backfill when sessions cancel (scheduler calls/texts families)

**Mid tier (Ensora, Artemis, some others):**
- Waitlist integrated into intake pipeline (intake -> waitlist -> active client)
- Cancellation notifications to waitlisted families
- Basic matching (insurance, location)

**Advanced tier (CentralReach, emerging in TheraDriver):**
- Auto-fill cancelled slots based on proximity, authorization status, therapist skill match
- When a slot opens: SMS to top-ranked patient with confirmation link, email to runners-up, automated phone calls for non-responders
- Once confirmed: auto-book and update all records
- Claimed: automated waitlist tools fill 70%+ of cancelled slots

### The cancellation problem in ABA:
- Cancellation rates in ABA reach 20-30% (telehealth even higher)
- Each cancelled session = lost revenue + lost clinical hours for the child
- Manual backfill takes 20-45 minutes per cancellation (phone calls, checking auth, checking availability)
- AI backfill is one of the highest-ROI scheduling features

### Smart backfill requirements:
1. Check which waitlisted/active clients have availability at that time
2. Check authorization status (hours remaining, date range valid)
3. Check geographic proximity (for in-home: can the provider reach the new client?)
4. Check clinical match (credentials, skills, behavioral considerations)
5. Rank candidates and auto-notify
6. Handle confirmation/decline workflow
7. Update schedule, route, and authorization tracking

---

## Staff Availability Management

### How providers set their hours across platforms:

**Basic approach (most small-practice tools):**
- Weekly recurring availability blocks (e.g., Monday 8am-5pm, Tuesday 9am-3pm)
- Time-off requests through the platform
- Admin manually checks availability before scheduling

**Mid-tier approach (Theralytics, Artemis, Hi Rasmus):**
- Availability by user, location, and service type
- Visual availability display in scheduler
- Conflict prevention (auto-block scheduling during time off)
- Multiple views: by staff member, by client, by location

**Advanced approach (CentralReach, Motivity, RethinkBH):**
- Provider self-service availability with admin approval
- Availability overlaid with credential status (auto-block if credential expired)
- Utilization dashboards showing booked vs available hours per provider
- Target hours per provider (hours they want to work) vs scheduled hours vs delivered hours
- Underutilization alerts (provider has capacity but isn't being scheduled)
- Geographic availability (provider only available in certain areas on certain days)

### ABA-specific availability complexity:
- RBTs often work split shifts (e.g., 8-11am, 3-7pm to match child's school schedule)
- BCBAs have complex schedules: supervision time, parent training, assessments, team meetings, direct sessions
- Many RBTs are part-time or have multiple clients across different locations
- Drive time between clients affects available capacity (2 hours of drive time = 2 fewer billable hours)
- Credential expiration affects availability (can't schedule an RBT with expired registration)

---

## Key Takeaways for Clinivise

### 1. Scheduling Is a Competitive Moat — But Not for MVP

CentralReach ScheduleAI is the gold standard, but it took years and massive investment. For Clinivise Phase 5+, scheduling should be auth-aware and drive-time-conscious, but true AI optimization is a later play.

### 2. Auth-Aware Scheduling Is Table Stakes

Every serious platform connects authorizations to scheduling. The minimum viable scheduling feature MUST:
- Show remaining authorized hours when creating appointments
- Warn (not block) when scheduling would exceed authorized hours
- Track scheduled hours vs authorized hours in real time
- Alert on approaching authorization expiration

### 3. Drive Time Matters for In-Home, Not Clinic-Based

Only relevant when providers travel between client homes. For clinic-based practices, this is irrelevant. TheraDriver's geographic clustering is interesting but even they don't have real-time drive time yet. Start with simple travel time buffers between appointments.

### 4. The Two-Phase Pattern Is Smart

AI generates draft schedule -> human reviews and publishes. This avoids the trust problem. Even CentralReach uses this pattern. Clinivise should follow it.

### 5. Cancellation Backfill Is High-ROI

The single highest-impact AI scheduling feature across the industry. ABA cancellation rates are 20-30%. Auto-notifying waitlisted or available clients when a slot opens is a massive value-add. This could be a Phase 5-6 differentiator.

### 6. Parent Portal = View + Request, Not Self-Schedule

No platform offers true parent self-scheduling in ABA, for good clinical and logistical reasons. A parent portal should show schedule, allow cancellation requests, and capture preferences — NOT allow direct booking.

### 7. Staff Availability Is a Prerequisite

Before any scheduling optimization, you need structured staff availability data. Build the availability management foundation before the optimization engine. This includes: recurring availability blocks, time-off requests, credential-based scheduling constraints.

### 8. EVV Is a Future Requirement

For Medicaid-reimbursed in-home services, EVV compliance will be required. Plan the scheduling data model to accommodate GPS clock-in/clock-out verification. Not needed for MVP, but the schema should not preclude it.

### 9. Dosage Gap Is a Real Problem

The gap between BCBA-recommended hours and insurance-authorized hours creates scheduling tension. A good scheduler surfaces this: "Client is authorized for 20 hrs/week but only scheduled for 14." This is an insight, not an AI feature — just math on existing data.

### 10. Integration Model Matters

TheraDriver proves there's a market for standalone scheduling optimization. But for an all-in-one like Clinivise, scheduling must be deeply embedded — connected to authorizations, billing, session notes, and clinical data. Don't build scheduling as a silo.

---

## Feature Priority Matrix for Clinivise Scheduling

| Feature | Priority | Phase | Rationale |
|---------|----------|-------|-----------|
| Basic calendar (drag-drop, recurring) | Must-have | Phase 5 | Table stakes |
| Auth-aware scheduling (warnings) | Must-have | Phase 5 | Prevents revenue loss |
| Staff availability management | Must-have | Phase 5 | Prerequisite for everything |
| Session type tagging (telehealth/in-home/clinic) | Must-have | Phase 5 | Hybrid model support |
| Travel time buffers between appointments | Should-have | Phase 5 | In-home service accuracy |
| Parent schedule visibility | Should-have | Phase 5-6 | Reduces admin calls |
| Cancellation tracking + analytics | Should-have | Phase 5 | Identify patterns |
| Utilization dashboards (scheduled vs authorized) | Should-have | Phase 5 | Key business metric |
| Automated reminders (SMS/email) | Should-have | Phase 5-6 | Reduces no-shows |
| Waitlist management | Nice-to-have | Phase 6 | Pipeline management |
| Smart provider matching | Nice-to-have | Phase 6 | Credential + skill matching |
| Auto-fill cancelled slots | Differentiator | Phase 6-7 | High ROI, complex |
| AI schedule optimization (draft) | Differentiator | Phase 7+ | Requires mature data |
| Drive time / route optimization | Differentiator | Phase 7+ | In-home practices only |
| EVV / geofencing | Compliance | Phase 7+ | Medicaid requirement |
| No-show prediction | Frontier | Phase 8+ | Requires ML pipeline |

---

## Sources

- [TheraDriver](https://www.theradriver.ai/) — AI scheduling for ABA
- [TheraDriver Platform Profile](https://www.missionviewpoint.com/platform-profile-theradriver/) — Mission Viewpoint analysis
- [TheraDriver x Flychain Partnership](https://www.flychain.us/resources/flychain-x-theradriver-aba-scheduling-software-partnership)
- [ABA Engine](https://abaengine.com/) — Automated scheduling + PM
- [ABA Engine Automated Scheduling](https://abaengine.com/features/automated-scheduling/)
- [Hi Rasmus Scheduling](https://hirasmus.com/product/scheduling/) — Clinical platform scheduling
- [Hi Rasmus Integrations](https://hirasmus.com/product/integrations/)
- [Ensora Health (formerly Catalyst/DataFinch)](https://ensorahealth.com/product/aba-suite/)
- [CentralReach ScheduleAI](https://centralreach.com/products/scheduleai/) — Enterprise AI scheduling
- [CentralReach In-Home Scheduling](https://centralreach.com/blog/creating-optimal-schedules-for-in-home-aba-sessions/)
- [CentralReach + Behavioral Innovations Case Study](https://centralreach.com/blog/behavioral-innovations-transforms-applied-behavior-analysis-scheduling-operations-with-centralreachs-ai-powered-scheduling-solution-cr-scheduleai/)
- [Hipp Health Smart Scheduling](https://www.hipp.health/product/smart-aba-scheduling-software)
- [Artemis ABA Scheduler](https://www.artemisaba.com/scheduler)
- [Motivity ABA Scheduling](https://www.motivity.net/solutions/aba-scheduling)
- [Theralytics Scheduling](https://www.theralytics.net/aba-therapy-scheduling-software)
- [ABA Matrix Scheduling](https://www.abamatrix.com/aba-scheduling-made-simple-for-better-outcomes/)
- [Raven Health](https://ravenhealth.com/)
- [RethinkBH Scheduling](https://www.rethinkbehavioralhealth.com/our-solutions/aba-scheduling/)
- [Alpaca Health](https://www.alpacahealth.io/)
- [Passage Health ABA Scheduler Comparison](https://www.passagehealth.com/blog/aba-scheduler-software)
- [VGPM Best ABA Scheduling 2026](https://vgsoft.co/blog/best-aba-scheduling-software-2026)
- [CentralReach EVV](https://centralreach.com/blog/are-you-ready-for-electronic-visit-verification-evv/)
- [AI Scheduling in Healthcare 2025](https://www.sprypt.com/blog/ai-at-the-front-desk)
- [Healthcare AI Scheduling Optimization 2026](https://www.thefutureofpatientlogistics.com/scheduling-optimization-healthcare-2026/)
- [AI for Hospital Scheduling (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12796984/)
- [ML for No-Show Prediction (Nature)](https://www.nature.com/articles/s41746-022-00594-w)
- [ABA Treatment Dosage Research (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11219665/)
