# Clinivise Competitive Strategy

> **Positioning:** Free ABA practice management with built-in intelligence. The only platform where authorizations track themselves, sessions document themselves, and claims scrub themselves — so you can focus on clients, not paperwork.
>
> **Last updated:** 2026-03-27

---

## Market Position

| Dimension         | CentralReach             | AlohaABA  | Theralytics        | Hipp Health           | Passage Health       | **Clinivise**                         |
| ----------------- | ------------------------ | --------- | ------------------ | --------------------- | -------------------- | ------------------------------------- |
| **Price**         | ~$50/employee            | $30/staff | $15-25/client      | Gated                 | Gated                | **Free + 2-4% billing**               |
| **UX Quality**    | Poor (legacy)            | Decent    | Good               | Modern (AI-native)    | Clean                | **Excellent (Mira design system)**    |
| **Auth Tracking** | Full but buried          | Basic     | Basic              | AI compliance agent   | Auto scheduling check| **Full lifecycle, inline everywhere** |
| **AI**            | 5 bolted-on products     | None      | AI notes (new)     | **Heavy (core DNA)**  | Frontera AI ($42M)   | **Native — invisible intelligence**   |
| **Chart Review**  | NoteGuardAI (extra cost) | None      | None               | Compliance agent      | None                 | **Built-in, free tier**               |
| **Target**        | Enterprise               | Small-mid | Small              | Growth-stage          | Small-mid            | **Small (1-50), growing to mid**      |
| **Data Moat**     | 4B data points           | None      | None               | None                  | Frontera partnership | **Growing — payer rules flywheel**    |
| **Funding**       | PE-backed (large)        | Unknown   | Bootstrapped       | $6.2M seed (Oct 2025)| $42M (Frontera)      | **Bootstrapped**                      |

---

## Competitor Weaknesses → Clinivise Features

### CentralReach (the incumbent to dethrone)

| Their Weakness                         | Evidence                                                                    | Our Exploit                                                                                              |
| -------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Inconsistent save behavior**         | Users report data loss from crashes, auto-logouts mid-entry                 | Auto-save with visible state on every form. localStorage persistence. "Clinivise never loses your work." |
| **Deep navigation**                    | "Several clicks" for basic operations, 87% complain about advanced features | Cmd+K command palette, flat sidebar, max 2 clicks to any data entry form                                 |
| **Enterprise complexity**              | Weeks of training needed, small practices priced out                        | Zero-training UI. If an RBT can't figure it out in 5 minutes, we failed.                                 |
| **AI bolted on**                       | 5 separate "AI products" — each a separate workflow                         | AI invisible and woven in. Forms pre-fill. Dashboards surface insights. No "click here for AI" buttons.  |
| **Auth data buried in billing module** | Utilization not visible where clinicians work                               | Auth utilization inline on session form, client detail, dashboard. Visible at every decision point.      |
| **ScheduleAI "hasn't saved time yet"** | User reviews                                                                | Don't ship AI scheduling until it actually works. Start with auth-aware constraints (proven pattern).    |

**Positioning:** "CentralReach was built for enterprises. Clinivise was built for the practices CentralReach left behind."

### AlohaABA (the "good enough" competitor)

| Their Weakness                  | Our Exploit                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------- |
| No per-CPT utilization tracking | Per-service-line utilization bars with color thresholds                         |
| Non-customizable dashboards     | Role-specific dashboards (RBT vs BCBA vs billing vs owner)                      |
| Cumbersome note navigation      | Inline notes, ghost text drafts, one-tap session logging                        |
| No AI features                  | AI auth letter parsing, session note drafts, completeness checks                |
| Slow performance                | Server Components + Suspense streaming. Fast by architecture, not optimization. |

**Positioning:** "AlohaABA is simple. Clinivise is simple AND smart."

### Theralytics (the small-practice benchmark)

| Their Weakness              | Our Exploit                                                 |
| --------------------------- | ----------------------------------------------------------- |
| $15/user pricing            | Free PM tier. Period.                                       |
| No AI                       | AI-native from day one                                      |
| Limited payer customization | Payer rules engine with AI-assisted extraction from manuals |
| Basic denial management     | Pre-claim scrubbing + denial prediction (Phase 2)           |

**Positioning:** "Everything you love about Theralytics, but free, and with intelligence built in."

### Hipp Health (most direct competitor — AI-native all-in-one)

$6.2M seed (Oct 2025), founded by ex-Workday VP + ex-Pipe ML lead. Same thesis as us: modern, AI-native, all-in-one. Plans to expand into OT and speech therapy.

| Their Weakness                                                          | Our Exploit                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| No traditional auth dashboard (AI-agent-only approach)                  | Dashboard baseline + AI monitoring. Practices expect visual utilization — we give both.           |
| $6.2M burn rate with gated pricing                                      | Free PM tier, revenue-share billing. Lower switching cost.                                       |
| Platform features gated, not transparent                                | Open pricing, clear feature set. Practices can evaluate before committing.                       |
| Multi-therapy expansion dilutes ABA focus                               | ABA-first depth. Every workflow designed for ABA-specific needs.                                 |

**Positioning:** "Hipp bets on AI replacing your dashboard. We bet on AI making your dashboard smarter."

### Passage Health (clean PM + Frontera AI)

Ranked #1 in multiple 2026 comparison articles. Strong content/SEO strategy. Frontera AI partnership ($42M) gives them AI muscle.

| Their Weakness                                                          | Our Exploit                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| AI is a partnership (Frontera), not native                              | AI built into the core product, not a bolt-on integration                                        |
| Pricing gated behind sales calls                                        | Transparent free tier. Try before you buy.                                                       |
| Auth-to-scheduling integration is their best feature                    | Match their scheduling integration AND add utilization intelligence + predictive burndown         |
| No public free tier                                                     | Free PM tier removes all switching friction                                                      |

**Positioning:** "Passage is clean. Clinivise is clean AND free AND intelligent."

### Raven Health (secondary — pricing model validator)

Validates our revenue-share pricing model (free + 2% of claims). However, platform features are entirely gated behind demos with limited public documentation. Passage Health's comparison claims Raven has "no automated authorization checks." Useful as a pricing reference, not for feature analysis.

| Their Weakness                                                          | Our Exploit                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| No billing depth (monetization is billing, but features are thin)       | Full claims lifecycle via Stedi — this is literally how we make money                            |
| No automated authorization checks (per Passage comparison)              | Full auth lifecycle with utilization bars, expiry alerts, scheduling enforcement                  |
| Shallow AI (just note generation)                                       | Full AI lifecycle: auth parsing → utilization intelligence → claim scrubbing → denial prediction |
| Limited public info makes evaluation hard for practices                 | Transparent features, open pricing, self-serve evaluation                                        |

**Positioning:** "Same free model, 10x the depth."

### Other Competitors

| Competitor         | Key Weakness                                                            | Our Advantage                                                                                               |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **CR Essentials**  | CentralReach brand baggage, enterprise DNA under small-practice skin    | Built small-first, not trimmed-down enterprise. No legacy architecture.                                     |
| **Artemis ABA**    | Salesforce-built (heavy UX), mid-market positioning, gated pricing      | Lightweight modern stack. Free tier. ABA-focused, not Salesforce-generic.                                   |
| **RethinkBH**      | Can't edit data after entry, terrible support, doesn't scale            | Edit anything with audit trail. Modern architecture that scales.                                            |
| **Motivity**       | PM features still maturing, expensive ($48/learner all-in-one)          | PM-first with clinical depth coming. Free tier.                                                             |
| **Noteable**       | Multi-disciplinary dilutes ABA depth, $300/mo for 5 staff              | ABA-native depth at free tier. Every workflow ABA-specific.                                                 |
| **ABA Matrix**     | Auth tracking not prominent, gated pricing                              | Auth lifecycle is our core differentiator. Transparent pricing.                                             |
| **PortiaPro**      | Family-owned, smaller team, US+Canada split focus                       | Focused US market. Modern infrastructure. AI-native.                                                        |
| **SimplePractice** | Not ABA-specific, no auto-decrementing auth units, no ABA billing codes | ABA-native: CPT codes, modifiers, CMS 8-minute rule, auth lifecycle built in.                               |
| **ABA Engine**     | No clinical features, no billing, no AI, 5 employees, bootstrapped      | Full stack PM + billing + AI. Absorb their best operational ideas (intake pipeline, geographic scheduling). |
| **Brellium**       | Separate tool, costs extra, not a PM platform                           | Chart review built into free PM tier. Small practices get audit protection without another vendor.          |

---

## The 7 Strategic Moves

### Move 1: Authorization Lifecycle Ownership

Nobody owns the full auth lifecycle. We do: AI letter parsing → structured intake → per-service utilization tracking → predictive burndown → expiry alerts at point of action → re-auth request drafting → payer turnaround tracking.

**Why it wins:** Authorization management is the intersection of clinical care and billing revenue. Every practice deals with it daily. Doing it 10x better than anyone else is the product story that gets BCBAs and practice owners to switch.

### Move 2: Design as Competitive Moat

SimplePractice proved superior UX is a durable moat in healthcare PM. CentralReach can't retrofit good design onto legacy architecture. We build on modern foundations (shadcn/ui Mira, Tailwind v4, React 19 Server Components).

**Specific advantages:**

- 12px base text (Mira compact) — billing staff see more data per screen
- Semantic color tokens — consistent status indicators everywhere
- Skeleton loading — pages feel fast even on Neon cold starts
- Inline utilization bars — visible at every decision point, not buried in reports
- Role-specific density — RBTs see simple, BCBAs see rich, billing staff see dense

### Move 3: Free Tier as Distribution

CentralReach ~$50/employee. AlohaABA $30/staff. Theralytics $15/user. We're free.

The free PM tier is the wedge. Practices switch because there's zero risk. We monetize when they use billing (Phase 2, 2-4% of collections). The conversion path: free PM → love it → trust it → route billing through it.

**Critical:** The free tier must be genuinely excellent, not a crippled trial. Every PM feature is free forever. Billing features are the upgrade.

### Move 4: AI-Native, Not AI-Bolted-On

CentralReach has 5 separate AI products. Each is a separate button, separate workflow, separate mental model. Clinivise: the session form pre-fills from context. The auth letter becomes structured data in 15 seconds. The dashboard surfaces insights without being asked. The claim gets scrubbed before you hit submit.

**This is the Cursor vs Copilot play.** Same underlying models, fundamentally different experience. CentralReach can't retrofit this because their UI wasn't built assuming AI exists.

### Move 5: Practitioner Trust Through Transparency

ABA practitioners are burned by software that hallucinates (Mentalyc) and loses work (CentralReach). Trust is our product.

**Trust features:**

- Linked evidence on every AI output (click to see source)
- Confidence scores (green/amber/red) — never false certainty
- Visible save state on every form
- AI suggestions logged separately from confirmed values
- Field-by-field confirmation on AI extractions — no "Confirm All"
- "AI-assisted" badge, never "AI-generated" — the clinician is always the author

### Move 6: Compliance as a Feature, Not a Burden

OIG is auditing ABA Medicaid state by state ($56M Indiana, $77.8M Colorado, $18.5M Wisconsin). Small practices are terrified and unprotected.

Clinivise builds chart review into the free tier:

- Deterministic checks (missing signatures, time/unit mismatch, credential validation) — ships with sessions
- Quality scoring (cloned note detection, individualization) — Phase 2
- Supervision compliance tracking (BACB 5% ratio, 30/45/60 day alerts) — ships with dashboard

**Positioning:** "The only free ABA tool that protects you from audits."

### Move 7: The Payer Intelligence Flywheel

Start with top-10 payer rules (manually seeded). AI extracts rules from payer manuals (Phase 2). Denied claims teach the system new rules. Practice-contributed rules crowdsource intelligence.

Every practice that joins makes the system smarter for every other practice. This is the long-term moat — the payer rules + denial pattern database gets better with every claim. It's the network effect that makes Clinivise harder to replace over time.

---

## Messaging by Persona

### Practice Owner / Admin

> "Stop paying $30-50/staff for software your team doesn't like. Clinivise is free, modern, and smart enough to prevent the billing errors that cost you money."

### BCBA

> "See authorization utilization at a glance — not buried in a billing module. Upload an auth letter and have it in the system in 15 seconds. Know when auths are expiring before it's too late."

### RBT

> "Log a session in 30 seconds. The form knows your client, your CPT code, and your remaining units. Stop fighting with software and focus on your clients."

### Billing Staff

> "Claims get scrubbed before you submit them. Payer-specific rules are built in. Denials drop because the system catches errors before they happen."

---

## What We Don't Compete On (And Shouldn't)

| Area                                                                       | Why Not                                                  | Who Owns It               |
| -------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------- |
| **Clinical data collection** (behavior graphing, trial-by-trial recording) | Deep domain, Motivity and Catalyst own this              | Partner or build Phase 3+ |
| **Telehealth**                                                             | Commodity feature, many good options exist               | Integrate (Zoom, Doxy.me) |
| **Payroll**                                                                | AlohaABA and CentralReach have this, low differentiation | Defer indefinitely        |
| **Parent portal**                                                          | Table stakes, not a differentiator                       | Phase 2-3                 |
| **Insurance phone calls**                                                  | LunaBill/Infinitus do this better (100M+ call minutes)   | Partner, don't build      |

---

## Success Metrics

### Phase 1 (PM Foundation)

| Metric                             | Target                  | Why                        |
| ---------------------------------- | ----------------------- | -------------------------- |
| Practices actively using PM        | 10+                     | Product-market signal      |
| Weekly active rate                 | >60% (3+ of 5 workdays) | Stickiness                 |
| Net Promoter Score                 | >50                     | Would they recommend us?   |
| Time to log a session              | <30 seconds             | Speed is the product       |
| AI auth letter extraction accuracy | >80%                    | Validates AI-native thesis |

### Phase 2 (Billing + AI)

| Metric                                      | Target                          | Why                       |
| ------------------------------------------- | ------------------------------- | ------------------------- |
| Practices routing billing through Clinivise | >30% of PM users                | Monetization conversion   |
| Claim denial rate                           | <10% (industry avg ~15-20%)     | Proves AI scrubbing works |
| Revenue per practice (our 2-4% take)        | >$200/month avg                 | Unit economics            |
| Payer rules in database                     | >500 rules across top 20 payers | Flywheel building         |

### Phase 3 (Moat)

| Metric                           | Target              | Why                    |
| -------------------------------- | ------------------- | ---------------------- |
| Practices on platform            | 100+                | Scale                  |
| Denial prediction accuracy       | >75%                | Real ML advantage      |
| Practice-contributed payer rules | >20% of total rules | Network effect         |
| Churn rate                       | <5% monthly         | Stickiness proves moat |

---

_Derived from: `docs/research/deep-research-ui-ux.md`, `docs/research/deep-research-ai-native.md`, `docs/ai/ai-competitive-landscape.md`, `docs/ai/ai-feature-brainstorm.md`, and competitive research across 15+ ABA platforms._
