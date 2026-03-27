# Navigation, Visual Design & Settings Pages: Competitive Research

> Research date: 2026-03-21
> Platforms studied: CentralReach, AlohaABA, SimplePractice, Jane App, Healthie, Theralytics, Raven Health, Artemis ABA, Motivity, Noteable, Passage Health

---

## 1. Navigation Patterns

### Platform-by-Platform Breakdown

#### CentralReach

- **Type**: Top horizontal navigation bar (icon row at top of every page)
- **Menu items**: Dashboard, Contacts, Scheduling, Billing, Files, Tasks, Learn, Insights, Permissions, Messages
- **Icons**: Icon-only in the top nav bar; each module represented by a distinct icon. Hovering reveals module name
- **Active state**: Visual highlight on the selected module icon
- **Grouping**: Flat list of modules with no hierarchical grouping -- all modules are peers
- **Search**: No global command palette documented; search within individual modules (Contacts search, etc.)
- **Mobile**: CR Mobile app uses a hamburger menu revealing a module list. Modules in mobile: Schedule, My Learners, Map View, Data Collection, Session Notes. Optimized for RBTs doing field work
- **Notes**: CentralReach's top-nav approach is unusual in modern SaaS. It works because they have 10+ dense modules that each function like standalone apps. Feels more like an enterprise suite than a unified product

#### AlohaABA

- **Type**: Left sidebar navigation (modern design)
- **Menu items**: Dashboard, Scheduling, Clients, Billing, Claims, Authorizations, Payroll, Reports
- **Icons**: Icon + text labels in sidebar
- **Active state**: Highlighted/selected background on active item
- **Grouping**: Flat list with logical ordering (dashboard first, operational items in middle, reports at end)
- **Search**: Client search available within the main interface
- **Mobile**: Responsive design accessible on desktop and mobile. Calendar and scheduling accessible on mobile devices
- **Notes**: Users praise it as "easy to use" and "pretty to look at." Rated as Best Value ABA Software. Clean, modern interface compared to CentralReach's enterprise feel

#### SimplePractice

- **Type**: Left sidebar navigation (collapsible)
- **Menu items**: Home, Calendar, Clients, Billing, Analytics, Messages, Documents, Requests, Marketing, Settings
- **Icons**: Icon + text labels; sidebar can collapse to icon-only mode
- **Active state**: Highlighted background on selected item
- **Grouping**: Flat list with settings at the bottom. Settings internally organized into 3 categories: Operations, Billing, Client Care
- **Search**: Client search within the clients view
- **Mobile**: Dedicated clinician mobile app (iOS/Android). Collapsed sidebar on smaller screens
- **Notes**: Most polished consumer-grade UI in the therapy PM space. The collapsible sidebar with icon-only mode is the gold standard pattern. Settings organization into Operations/Billing/Client Care is an excellent model

#### Jane App

- **Type**: Top horizontal tab navigation
- **Menu items**: Schedule, Patients, Products, Reports, Admin/Settings
- **Icons**: Minimal icon usage in top tabs -- primarily text labels
- **Active state**: Standard tab underline/highlight pattern
- **Grouping**: Tabs organized by workflow: clinical (Schedule, Patients), business (Products, Reports), admin (Admin, Settings)
- **Search**: No global search/command palette documented. Users report difficulty navigating the extensive database without a search button
- **Mobile**: Mobile app for clients/patients. Admin interface is responsive web
- **Notes**: Top navigation works well for Jane's simpler structure (5-6 main tabs). Blue banner with light background. Day View is the central hub. Color-coded appointments (green shades for status). Popular with physical therapy / wellness -- less common in ABA

#### Healthie

- **Type**: Left sidebar navigation (customizable)
- **Menu items**: Home/Dashboard, Calendar, Clients, Charting, Documents, Billing, Settings (customizable)
- **Icons**: FontAwesome icon library; practices can choose icons for each nav item
- **Active state**: Highlighted sidebar item
- **Grouping**: Flat list; practices can add/remove items and custom URL links
- **Search**: Available within individual sections
- **Mobile**: White-label mobile app with customizable navigation
- **Notes**: Most customizable navigation of any platform studied. Sidebar items can be added, removed, or reordered. No limit on items but they recommend UX consideration. API-first company -- navigation is programmatically configurable

#### Theralytics

- **Type**: Dashboard-centric with module navigation
- **Menu items**: Dashboard, Scheduling, Billing, Data Collection, Documentation, Reporting
- **Icons**: Not specifically documented but interface described as "clean and easy to navigate"
- **Active state**: Standard highlight patterns
- **Grouping**: Organized around ABA-specific workflows
- **Mobile**: Mobile access available
- **Notes**: Activity Dashboard is the central hub showing scheduling, billing, and reporting data in one view. Users can customize which metrics appear. Built specifically for ABA -- navigation reflects ABA workflows

#### Artemis ABA

- **Type**: Unified dashboard with module navigation
- **Menu items**: Scheduling, Sessions, Billing, Payroll, Reports, Analytics
- **Icons**: Interface uses icons alongside text
- **Active state**: Standard patterns
- **Grouping**: Linear workflow: scheduling > sessions > billing > payroll > reports
- **Mobile**: Compatible with desktops, tablets, and smartphones
- **Notes**: Drag-and-drop scheduling. Multiple calendar views (month, week, day, list). Interactive dashboards with built-in graphs, charts, and filters. Emphasis on "step-by-step flow" through the workflow

#### Motivity

- **Type**: Not fully documented; described as easy to navigate
- **Menu items**: Data Collection, Scheduling, Billing, Credentialing, Reporting/BI
- **Icons**: Not specifically documented
- **Mobile**: Mobile-friendly interface for RBTs
- **Notes**: 130+ features organized into major modules. Amazon QuickSight-powered BI dashboards. Strongest credential tracking of any platform studied. Enterprise plans include customizable dashboards and an integrated intake portal

#### Raven Health

- **Type**: Mobile-first interface with dashboard navigation
- **Menu items**: Dashboard, Scheduling, Data Collection, Session Notes, Billing, Reports
- **Icons**: Simplified icon set for mobile
- **Mobile**: Mobile-first design -- built for therapists in homes and schools. Works offline. Quick note-taking, graphs, and program updates on phone/tablet
- **Notes**: Clean interface that "maximizes space but allows for detail." Compared to Athena Health UX. Drag-and-drop scheduling. AI-driven practice management dashboard

### Comparison Table

| Platform                | Nav Type         | Item Count   | Collapsible      | Command Palette | Mobile Strategy     | ABA-Specific Nav     |
| ----------------------- | ---------------- | ------------ | ---------------- | --------------- | ------------------- | -------------------- |
| CentralReach            | Top bar (icons)  | 10           | No               | No              | Separate mobile app | Yes (Learn module)   |
| AlohaABA                | Left sidebar     | ~8           | Unknown          | No              | Responsive web      | Yes                  |
| SimplePractice          | Left sidebar     | 10           | Yes (icon-only)  | No              | Native mobile app   | No (general therapy) |
| Jane App                | Top tabs         | 5            | No               | No              | Responsive web      | No (wellness)        |
| Healthie                | Left sidebar     | Customizable | Unknown          | No              | White-label mobile  | No (general health)  |
| Theralytics             | Dashboard + nav  | ~6           | Unknown          | No              | Mobile access       | Yes                  |
| Artemis ABA             | Dashboard + nav  | ~6           | Unknown          | No              | Responsive          | Yes                  |
| Motivity                | Module nav       | ~5           | Unknown          | No              | Mobile-friendly     | Yes                  |
| Raven Health            | Mobile-first     | ~6           | N/A              | No              | Mobile-first        | Yes                  |
| **Clinivise (current)** | **Left sidebar** | **6**        | **Yes (shadcn)** | **No**          | **Not yet**         | **Yes**              |

### Navigation Recommendations for Clinivise

1. **Keep the left sidebar** -- it is the dominant pattern in modern SaaS and practice management. CentralReach's top bar and Jane's top tabs are outliers. The sidebar scales better as features grow.

2. **Maintain collapsible mode** -- SimplePractice's icon-only collapse is the gold standard. Clinivise already has this via shadcn Sidebar. Ensure tooltips appear on hover in collapsed mode.

3. **Add a command palette (Cmd+K)** -- No competitor has this. It would be a major differentiator for power users. Use shadcn's `<Command>` component. Search clients, providers, authorizations, navigate to pages.

4. **Group navigation items** -- Current single "Core" group will need splitting as features grow. Recommended groups:
   - **Core**: Overview, Clients, Sessions
   - **Operations**: Authorizations, Providers, Schedule (future)
   - **Finance**: Billing, Claims, Reports (Phase 2)
   - **System**: Settings (pinned to bottom, separated from main groups)

5. **Current nav item order is good** -- Overview > Clients > Authorizations > Sessions > Providers > Settings follows the logical workflow. Consider adding "Schedule" between Overview and Clients when calendar features arrive.

6. **Settings should be pinned to sidebar bottom** -- Every platform puts settings at the bottom or in a separate section. Move it out of the main nav group. Put it above the OrganizationSwitcher in the footer area.

7. **Add breadcrumbs on detail pages** -- Already in the design system component list. CentralReach and SimplePractice both use breadcrumbs on detail/sub-pages.

---

## 2. Visual Design Language

### Color Palettes Across Platforms

| Platform       | Primary Color       | Accent         | Background             | Overall Feeling              |
| -------------- | ------------------- | -------------- | ---------------------- | ---------------------------- |
| CentralReach   | Dark blue (#1a2b5e) | Orange accents | White/light gray       | Corporate, enterprise, dense |
| AlohaABA       | Teal/green          | Warm accents   | White                  | Modern, clean, approachable  |
| SimplePractice | Blue-teal           | Orange CTAs    | White/light gray       | Consumer-grade, polished     |
| Jane App       | Blue (#4A90D9)      | Green (status) | White with blue banner | Clean, calming, professional |
| Healthie       | Teal/green          | Customizable   | White                  | Modern, wellness-oriented    |
| Raven Health   | Dark/navy           | Teal accents   | Light                  | Clean, minimal, modern       |
| Theralytics    | Blue                | Standard       | White                  | Professional, analytical     |
| Artemis ABA    | Purple/blue         | Standard       | White                  | Modern, professional         |

### Healthcare Color Psychology Findings

- **Blue**: Trust, confidence, sincerity. The most common primary color in healthcare software. Symbolizes reliability.
- **Teal (blue + green)**: Calming, refreshing, modern. Less intense than pure green; can be used more liberally without overwhelming. Perfect for healthcare SaaS that wants to feel both clinical and approachable.
- **Green**: Health, tranquility, growth. Works for status indicators (success, active, approved).
- **Warm neutrals**: Off-white and light gray backgrounds create a less sterile feel than pure white while maintaining readability.
- **Accent colors**: Orange and amber for attention-drawing elements (CTAs, notifications). Used sparingly against a blue/teal primary.

### Typography Patterns

- **Most platforms**: System fonts or clean sans-serifs (Inter, Open Sans, SF Pro)
- **Healthcare.gov design system**: Bitter (slab serif) for headlines, Open Sans for body
- **Trend**: Moving toward geometric sans-serifs (Inter, Geist) for modern feel
- **ABA-specific**: Data-dense interfaces favor smaller base sizes (12-13px body)
- **Numbers**: Tabular numerals are critical for billing/units/financial data

### Card/Container Design

- **Universal pattern**: White cards on light gray backgrounds
- **Border radius**: 8-12px is standard (Clinivise uses 10px -- right in range)
- **Shadows**: Minimal or none. Modern healthcare UIs prefer subtle borders over shadows
- **Headers**: Section cards with title bars (icon + label + optional action button)
- **Hover states**: Subtle background tint or slight elevation change

### Table Design

- **Compact rows**: 40-48px row height for data-dense views
- **Header style**: Uppercase, smaller font, muted color, sticky
- **Hover state**: Subtle background highlight on row hover
- **Status badges**: Colored pills/badges inline in table cells
- **Rich cells**: Primary info + secondary metadata stacked in same cell (name + subtitle)

### Button Styles

- **Primary**: Filled background (brand color), white text, medium border-radius
- **Secondary/Ghost**: Bordered or transparent, used for secondary actions
- **Destructive**: Red variant, often requiring confirmation dialog
- **Icon buttons**: Used for row actions (edit, delete, more menu)

### Overall Aesthetic Assessment

**What ABA practitioners hate about current tools:**

- CentralReach: "Overwhelming," "steep learning curve," "feels like 2010"
- Legacy platforms: Dense, cluttered, too many clicks to accomplish simple tasks
- Clinical-looking interfaces that feel like they were designed for compliance, not humans

**What practitioners respond to positively:**

- AlohaABA: "Pretty to look at," "easy to use"
- Raven Health: "Simple interface," "easy on the eyes"
- SimplePractice: Consumer-grade polish, feels like modern software

### Visual Design Recommendations for Clinivise

1. **Current Mira/shadcn base is excellent** -- The data-dense, compact aesthetic with Inter font is exactly right for an ABA PM tool. Do not make it spacious/airy.

2. **Consider adding a teal/blue accent** -- The current design system uses monochromatic gray tokens. The sidebar logo already uses `from-teal-400 via-blue-500 to-indigo-500`. Consider carrying a subtle teal accent into:
   - Active sidebar item indicator
   - Primary button color (instead of near-black)
   - Chart/visualization primary color
   - Progress bar fills
     This would differentiate Clinivise from the sea of gray enterprise tools while maintaining professionalism.

3. **Keep the warm neutral backgrounds** -- `oklch(1 0 0)` (pure white) for cards, `oklch(0.97 0 0)` for muted backgrounds. This is correct and matches the best-in-class platforms.

4. **Status colors are perfect** -- Emerald/amber/red/blue status system matches industry norms exactly. Don't change these.

5. **Typography scale is correct** -- `text-xs` (12px) base is right for a data-dense PM tool. Inter + Geist Mono is a strong pairing. The `tabular-nums` requirement is critical for billing data.

6. **Table design should be a competitive advantage** -- Rich table rows with stacked primary/secondary info, inline badges, and compact row heights (the wireframe pattern) are more polished than anything in the ABA space. CentralReach tables feel dated; Clinivise tables should feel modern.

### Specific Palette Recommendation

If adding brand color to the design system:

```
Primary brand: Teal-600 (#0d9488) or similar OKLCH equivalent
  - Use for: active nav items, primary buttons, links, chart accents
  - Reasoning: Teal reads as both clinical (blue-leaning) and warm (green-leaning).
    Every healthcare color psychology study recommends it. Differentiates from
    CentralReach (dark blue) and generic gray SaaS.

Keep as-is:
  - Background/surface: current white/near-white
  - Text: current near-black/muted-gray hierarchy
  - Status colors: emerald/amber/red/blue (unchanged)
  - Borders: current subtle gray (unchanged)
```

---

## 3. Settings & Provider Pages

### Settings Page Patterns Across Platforms

#### SimplePractice (Gold Standard for Settings Organization)

Three top-level categories with nested sections:

**Operations**

- Profile (Personal info, Clinical info/licenses, Notification preferences)
- Practice (Practice details, Locations, Billing addresses, Plan info, Demo client, Data export)
- Team (Team members, Payroll, Roles/permissions)

**Billing**

- Payment processing
- Billing profiles for insurance
- Client billing and insurance (Payers list, Billing documents, Automations)
- Superbill settings

**Client Care**

- Scheduling and inquiries (Calendar settings, Cancellation policy)
- Client portal
- Intake forms
- Reminders and notifications
- Telehealth

#### CentralReach

Settings are distributed across modules rather than centralized:

- **Permissions module** (dedicated padlock icon): User access, permission groups, role-based restrictions
- **Billing module settings**: Service codes, fee schedules, credential requirements per service
- **Contact profiles**: Individual employee setup (NPI, credentials, availability)
- **Organization account**: Org-wide settings, organization ID

#### Jane App

Settings accessible via Admin tab:

- Clinic Info & Locations
- Staff Access Levels (Full Access, Administrative/All Billing, Booking Only, Chart Only)
- Billing Settings
- Scheduling Settings
- Waitlist Configuration
- Client Pronouns and customization options

#### Healthie

Settings in top-right corner:

- Brand & Logo (custom colors, logo upload)
- Navigation customization (add/remove sidebar items)
- Charting templates
- Billing settings
- Client engagement settings
- API configuration

### Payer/Insurance Management

All platforms follow a similar pattern:

1. **Payer list page**: Searchable table of saved insurance payers
2. **Add payer flow**: Type-ahead search against a national payer database; auto-populates Payer ID
3. **Payer detail**: Payer name, Payer ID, clearinghouse services supported (electronic claims, ERA)
4. **Enrollment status**: Per-payer enrollment tracking for electronic claims and ERA
5. **Fee schedules**: Associate fee schedules with specific payers, providers, or locations
6. **Enable/disable**: Soft-disable payers without deleting them

### Team/Staff Management

Common fields and patterns across platforms:

**Staff list page shows:**

- Name + role (BCBA, RBT, Admin, Billing)
- Avatar/initials
- Status (Active, Inactive)
- Contact info (email, phone)
- NPI number
- Credential status (Valid, Expiring Soon, Expired)

**Staff detail/profile page contains:**

- Personal information (name, email, phone)
- Clinical information (NPI, taxonomy code, specialty)
- Credentials and certifications (license type, number, state, expiration date)
- Credential requirements linked to service codes (CentralReach: restrict scheduling based on credentials)
- Availability/scheduling preferences
- Caseload assignment (which clients they serve)
- Pay rates and payroll settings
- Permission level / access role
- CAQH information (for credentialing)
- Activity history / audit trail

### Provider/Staff Page Recommendations for Clinivise

#### Provider List Page

```
Columns:
- Avatar (initials) + Name + Role (stacked: "Dr. Sarah Chen" / "BCBA")
- NPI number
- Credential status badge (Valid | Expiring | Expired)
- Active clients count
- Status badge (Active | Inactive)
- Actions (View, Edit)

Filters: Role, Status, Credential Status
Search: By name or NPI
```

#### Provider Detail Page

```
Header: Name, role badge, status badge, "Edit" button

Sections (as cards):
1. Personal Information
   - Email, phone, address

2. Clinical Information
   - NPI (Type 1)
   - Taxonomy code
   - Specialty / service types
   - Certification (BCBA #, RBT #)
   - Certification expiration date
   - Supervising BCBA (for RBTs)

3. Credentials & Licenses
   - Table of credentials: Type, Number, State, Issue Date, Expiration, Status
   - "Add Credential" button
   - Visual alert for expiring/expired credentials

4. Caseload
   - List of assigned clients with link to client detail
   - Active authorization count per client

5. Availability (future)
   - Weekly schedule grid
   - Time off / blocked times

6. Activity History
   - Recent sessions logged
   - Audit trail of changes
```

### Settings Page Recommendations for Clinivise

Adopt SimplePractice's three-category model, adapted for ABA:

```
Settings (left sidebar navigation within settings page)

PRACTICE
├── Practice Details (name, address, phone, NPI Type 2, tax ID)
├── Locations (multi-location support, addresses)
├── Team Members (list, invite, roles, permissions)
└── Audit Log (view audit trail)

BILLING
├── Payers / Insurance Companies (add, edit, enable/disable)
├── Service Codes (CPT codes, fee schedules, modifier defaults)
├── Fee Schedules (per-payer rate tables)
└── Billing Preferences (claim defaults, rendering provider rules)

CLINICAL
├── Session Defaults (default duration, auto-fill preferences)
├── Authorization Alerts (threshold settings: 80%, 95%, expiration windows)
├── Note Templates (future: session note templates)
└── Unit Calculation (CMS vs AMA rule preference per payer)
```

---

## 4. Mobile/Tablet Considerations

### How Platforms Handle Mobile

#### CentralReach CR Mobile

- **Approach**: Separate native mobile app purpose-built for RBTs
- **Navigation**: Hamburger menu revealing module list
- **Key modules**: Schedule (today/tomorrow), My Learners (alphabetical list with search), Map View, Data Collection, Session Notes, Signatures
- **Offline**: Works offline for data collection -- syncs when connection returns
- **Design**: Simplified interface vs. desktop. Focus on the RBT's daily workflow: see schedule > go to client > collect data > write notes > get signatures

#### AlohaABA

- **Approach**: Responsive web accessible on desktop and mobile
- **Key mobile features**: Scheduling, data collection during sessions, billing
- **Notes**: In-session flow designed so clinicians can "stay present rather than buried in their screen"

#### SimplePractice

- **Approach**: Dedicated native app for clinicians (iOS/Android)
- **Key mobile features**: Schedule view, session notes, telehealth, messaging
- **Notes**: App Store presence adds credibility and discoverability

#### Raven Health

- **Approach**: Mobile-first design (primary design target is phone/tablet)
- **Key mobile features**: Data collection, session notes, graphs, program updates
- **Offline**: Works without internet (critical for home visits and schools)
- **Notes**: The only platform that is truly mobile-first rather than mobile-adapted

#### Jane App

- **Approach**: Mobile app for patients/clients. Admin interface is responsive web.
- **Notes**: Practitioner-facing features are desktop-optimized

### Mobile Navigation Patterns

1. **Bottom tab bar** (most common in native apps): 4-5 tabs for primary actions
   - Common pattern: Schedule | Clients | Session | Notes | More

2. **Hamburger menu** (CentralReach): Full module list accessible via menu icon
   - Pro: More items accessible. Con: Hidden navigation, extra tap.

3. **Responsive sidebar collapse** (web apps): Sidebar collapses to bottom bar or hamburger on small screens
   - Pro: Consistent with desktop. Con: May not feel native on mobile.

### Key Mobile/Tablet Design Considerations for ABA

1. **RBTs are the primary mobile users** -- They work in homes, schools, and clinics. They need to:
   - See today's schedule
   - Navigate to client location
   - Start a session / timer
   - Collect data (discrete trials, frequency, duration, interval)
   - Write session notes
   - Capture signatures (parent/caregiver)
   - Submit and move to next client

2. **Tablet is the sweet spot** -- Most RBTs use tablets (iPad) during sessions. Phone is for schedule/navigation between clients. Design for tablet-first mobile, phone-second.

3. **Large touch targets are critical** -- 44px minimum (Clinivise already mandates `min-h-11 min-w-11`). During sessions, clinicians may be managing a child while tapping buttons.

4. **Offline capability is table stakes** -- Home visits and school settings frequently have poor connectivity. Session data must persist locally and sync later.

5. **Simplified navigation on mobile** -- Don't show billing, reports, or admin functions on mobile. Mobile users need: Schedule, Clients, Session (data collection + notes), Profile.

### Mobile Recommendations for Clinivise

**Phase 1 (current -- responsive web):**

- Sidebar collapses to icon-only rail on tablet (`768-1024px`)
- Sidebar becomes a sheet/drawer on phone (`<768px`) triggered by hamburger icon
- Ensure all pages work at tablet width (single column layout)
- Touch targets: already mandated at 44px minimum

**Phase 2 (future -- mobile optimization):**

- Consider a dedicated mobile layout for Session logging with larger buttons, timer display, and simplified data entry
- Bottom tab bar on phone: Overview | Clients | + Session | Schedule | More
- The "+" action in the center for quick session logging (most frequent mobile action)

**Phase 3 (future -- native or PWA):**

- Offline data collection and sync
- Push notifications for schedule changes and authorization alerts
- Camera access for document capture (auth letters)

---

## Sources

### CentralReach

- [Navigating CentralReach](https://help.centralreach.com/navigating-centralreach/)
- [CR Mobile Modules](https://help.centralreach.com/cr-mobiles-modules/)
- [Add Employee Credentials](https://help.centralreach.com/add-employee-credentials/)
- [Permissions Module](https://help.centralreach.com/how-to-enable-admin-permissions/)
- [CR Mobile v25.4 Dashboard](https://community.centralreach.com/s/article/cr-mobile-v25-4-a-new-abi-cr-mobile-dashboard-cr-mobile-configurations-page-and-data-collection-enhancements)
- [Service Code Credential Requirements](https://help.centralreach.com/set-employee-credential-requirements-in-service-codes/)

### SimplePractice

- [Left Navigation Menu Updates](https://support.simplepractice.com/hc/en-us/articles/20101922882829-Updates-to-the-left-navigation-menu)
- [Operations Settings](https://support.simplepractice.com/hc/en-us/articles/24621381454093-Navigating-your-Operations-settings)
- [Billing Settings](https://support.simplepractice.com/hc/en-us/articles/24621228269453-Navigating-your-Billing-settings)
- [Account Settings Overview](https://support.simplepractice.com/hc/en-us/articles/23501088822413-Navigating-your-account-settings)
- [Adding Insurance Payers](https://support.simplepractice.com/hc/en-us/articles/360000095546-Adding-insurance-payers-and-selecting-the-correct-payer-ID)
- [Team Member Roles](https://support.simplepractice.com/hc/en-us/articles/360052700171-Clinician-roles-available-for-team-members)
- [Clinician Profile Page](https://support.simplepractice.com/hc/en-us/articles/24621381454093-Navigating-your-Operations-settings)

### Jane App

- [Working With the Schedule](https://jane.app/guide/working-with-the-schedule)
- [Patients Tab](https://jane.app/guide/the-patients-tab-a-snapshot-of-your-full-patient-list)
- [Staff Access Levels](https://jane.app/guide/staff-access-levels)
- [Setting Up Billing Settings](https://jane.app/guide/setting-up-your-billing-settings)
- [Patient Profile Dashboard](https://jane.app/guide/patient-profile-dashboard)

### Healthie

- [Adding or Removing Navigation Links](https://help.gethealthie.com/article/947-adding-or-removing-navigation-links)
- [Provider Dashboard](https://help.gethealthie.com/article/535-your-provider-dashboard)
- [Dashboards by Healthie](https://help.gethealthie.com/article/729-reporting-dashboards)
- [Brand & Logo Setup](https://help.gethealthie.com/article/125-setting-up-your-brand-company-information-and-colors)

### ABA-Specific Platforms

- [Theralytics Reporting & Analytics](https://www.theralytics.net/aba-reporting-and-analytics-software)
- [Raven Health Platform](https://ravenhealth.com/)
- [Artemis ABA Product Summary](https://www.artemisaba.com/artemis-product-summary)
- [Motivity Practice Management](https://www.motivity.net/solutions/aba-practice-management-all-in-one)
- [AlohaABA Practice Management](https://alohaaba.com/features/practice-management)
- [AlohaABA Authorization Management](https://alohaaba.com/features/authorization-management)
- [Passage Health Practice Management](https://www.passagehealth.com/practice-management)
- [Noteable ABA](https://mynoteable.com/aba)

### Design & UX Research

- [Healthcare Color Psychology](https://www.progress.com/blogs/using-color-psychology-healthcare-web-design)
- [Medical Color Palettes](https://piktochart.com/tips/medical-color-palette)
- [Healthcare UI Design 2026 Best Practices](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [Healthcare UX Trends 2026](https://www.excellentwebworld.com/healthcare-ux-ui-design-trends/)
- [HealthCare.gov Design System Colors](https://styleguide.healthcare.gov/design/colors/)
- [HealthCare.gov Typography](https://styleguide.healthcare.gov/design/typography/)
- [SaaS Navigation Menu Design](https://lollypop.design/blog/2025/december/saas-navigation-menu-design/)
- [Sidebar Design for Web Apps 2026](https://www.alfdesigngroup.com/post/improve-your-sidebar-design-for-web-apps)
- [SaaS Settings UI Examples](https://www.saasframe.io/categories/settings)
- [Table Status Badge Design](https://uxmovement.substack.com/p/why-youre-designing-table-status)
- [Command Palette UX Patterns](https://medium.com/design-bootcamp/command-palette-ux-patterns-1-d6b6e68f30c1)
- [Left-Side Vertical Navigation (NN/g)](https://www.nngroup.com/articles/vertical-nav/)
- [Healthcare Dashboard KPIs](https://arcadia.io/resources/healthcare-dashboard-examples)
