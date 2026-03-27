import { useState } from "react";

// ── WIREFRAME DESIGN SYSTEM ──────────────────────────────────────────────────
const C = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  text: "#111827",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  primaryBorder: "#BFDBFE",
  success: "#059669",
  successBg: "#ECFDF5",
  warning: "#D97706",
  warningBg: "#FFFBEB",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
};

const font = "'Instrument Sans', 'SF Pro Display', -apple-system, system-ui, sans-serif";
const mono = "'JetBrains Mono', 'SF Mono', monospace";

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Placeholder = ({ h = 40, label, dashed }) => (
  <div
    style={{
      height: h,
      border: `${dashed ? "2px dashed" : "1px solid"} ${C.border}`,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dashed ? C.borderLight : C.surface,
      color: C.textLight,
      fontSize: 12,
      fontWeight: 500,
    }}
  >
    {label}
  </div>
);

const WireBtn = ({ children, primary, sm, icon, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: sm ? "5px 10px" : "7px 14px",
      borderRadius: 7,
      border: `1px solid ${primary ? C.primary : C.border}`,
      background: primary ? C.primary : C.surface,
      color: primary ? "#fff" : C.text,
      fontSize: sm ? 12 : 13,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: font,
    }}
  >
    {icon && <span style={{ fontSize: sm ? 13 : 15 }}>{icon}</span>}
    {children}
  </button>
);

const WireBadge = ({ children, color = "gray" }) => {
  const m = {
    green: [C.successBg, C.success],
    yellow: [C.warningBg, C.warning],
    red: [C.dangerBg, C.danger],
    blue: [C.primaryLight, C.primary],
    purple: [C.purpleBg, C.purple],
    gray: [C.borderLight, C.textMuted],
  };
  const [bg, fg] = m[color] || m.gray;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 99,
        background: bg,
        color: fg,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
};

const WireCard = ({ title, children, action, noPad }) => (
  <div
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      overflow: "hidden",
    }}
  >
    {title && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: `1px solid ${C.borderLight}`,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</span>
        {action}
      </div>
    )}
    <div style={noPad ? {} : { padding: 16 }}>{children}</div>
  </div>
);

const WireTable = ({ columns, rows, onRowClick }) => (
  <div style={{ overflow: "auto" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns.map((c) => c.w || "1fr").join(" "),
        padding: "8px 16px",
        borderBottom: `1px solid ${C.border}`,
        background: C.borderLight,
      }}
    >
      {columns.map((c, i) => (
        <span
          key={i}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: C.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.3,
          }}
        >
          {c.label}
        </span>
      ))}
    </div>
    {rows.map((row, ri) => (
      <div
        key={ri}
        onClick={onRowClick}
        style={{
          display: "grid",
          gridTemplateColumns: columns.map((c) => c.w || "1fr").join(" "),
          padding: "10px 16px",
          borderBottom: `1px solid ${C.borderLight}`,
          cursor: onRowClick ? "pointer" : "default",
          fontSize: 13,
          alignItems: "center",
        }}
      >
        {row.map((cell, ci) => (
          <div key={ci}>{cell}</div>
        ))}
      </div>
    ))}
  </div>
);

const WireInput = ({ label, placeholder, type, w }) => (
  <div style={{ flex: w ? undefined : 1, width: w }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 500,
        color: C.textMuted,
        marginBottom: 4,
      }}
    >
      {label}
    </label>
    {type === "select" ? (
      <div
        style={{
          padding: "7px 10px",
          borderRadius: 7,
          border: `1px solid ${C.border}`,
          background: C.surface,
          color: C.textLight,
          fontSize: 13,
        }}
      >
        {placeholder || "Select..."}
      </div>
    ) : type === "textarea" ? (
      <div
        style={{
          padding: "7px 10px",
          borderRadius: 7,
          border: `1px solid ${C.border}`,
          background: C.surface,
          color: C.textLight,
          fontSize: 13,
          height: 60,
        }}
      >
        {placeholder}
      </div>
    ) : (
      <div
        style={{
          padding: "7px 10px",
          borderRadius: 7,
          border: `1px solid ${C.border}`,
          background: C.surface,
          color: C.textLight,
          fontSize: 13,
        }}
      >
        {placeholder}
      </div>
    )}
  </div>
);

const WireMetric = ({ label, value, sub, color }) => (
  <div
    style={{
      flex: 1,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: "14px 16px",
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: C.textMuted,
        textTransform: "uppercase",
        letterSpacing: 0.3,
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: color || C.text, letterSpacing: -0.5 }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{sub}</div>}
  </div>
);

const WireBar = ({ pct, label }) => {
  const clr = pct >= 80 ? C.success : pct >= 50 ? C.primary : pct >= 30 ? C.warning : C.danger;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: clr }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: C.borderLight, borderRadius: 99 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: clr, borderRadius: 99 }} />
      </div>
    </div>
  );
};

const WireTabs = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
    {tabs.map((t) => (
      <button
        key={t}
        onClick={() => onChange(t)}
        style={{
          padding: "8px 16px",
          border: "none",
          borderBottom: `2px solid ${active === t ? C.primary : "transparent"}`,
          background: "none",
          color: active === t ? C.primary : C.textMuted,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: font,
        }}
      >
        {t}
      </button>
    ))}
  </div>
);

const Alert = ({ icon, title, desc, type, action }) => {
  const bg = type === "critical" ? C.dangerBg : type === "warning" ? C.warningBg : C.primaryLight;
  const border = type === "critical" ? "#FECACA" : type === "warning" ? "#FDE68A" : C.primaryBorder;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</span>
        <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 6 }}>{desc}</span>
      </div>
      {action && <WireBtn sm>{action}</WireBtn>}
    </div>
  );
};

const Annotation = ({ children }) => (
  <div
    style={{
      padding: "8px 12px",
      background: "#FFFDE7",
      border: "1px dashed #FBC02D",
      borderRadius: 6,
      fontSize: 11,
      color: "#F57F17",
      fontWeight: 500,
      marginBottom: 12,
    }}
  >
    📐 {children}
  </div>
);

// ── PAGE WIREFRAMES ──────────────────────────────────────────────────────────
const DashboardPage = () => (
  <div>
    <Annotation>
      Dashboard / Overview — The "morning command center." Shows what needs attention TODAY. This is
      the default landing page after login.
    </Annotation>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Dashboard</h2>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "2px 0 0" }}>
          Good morning — here's what needs attention today.
        </p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <WireBtn sm icon="📄">
          Export
        </WireBtn>
        <WireBtn sm primary icon="＋">
          Log Session
        </WireBtn>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
      <WireMetric label="Active Clients" value="24" sub="28 total" />
      <WireMetric label="Avg Utilization" value="72%" color={C.success} sub="across active auths" />
      <WireMetric label="Hours This Week" value="187" sub="target: 240" color={C.primary} />
      <WireMetric label="Action Items" value="7" sub="3 critical" color={C.danger} />
    </div>
    <WireCard title="Priority Alerts" action={<WireBadge color="red">3 critical</WireBadge>} noPad>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Alert
          icon="⛔"
          title="Liam Johnson"
          desc="Insurance inactive — UHC coverage not found"
          type="critical"
          action="Verify"
        />
        <Alert
          icon="🔴"
          title="Emma Rodriguez"
          desc="Auth expired 3 days ago — sessions unbillable"
          type="critical"
          action="Renew"
        />
        <Alert
          icon="⚠️"
          title="Liam Johnson"
          desc="2 sessions flagged — may not be billable"
          type="critical"
          action="Review"
        />
        <Alert
          icon="🟡"
          title="Olivia Thompson"
          desc="Auth expires in 10 days"
          type="warning"
          action="Renew"
        />
        <Alert
          icon="📉"
          title="Noah Williams"
          desc="Low utilization: 24% used, projected 57% at expiry"
          type="warning"
          action="Review"
        />
        <Alert
          icon="📉"
          title="Mason Davis"
          desc="Low utilization: 21% used, projected 48% at expiry"
          type="warning"
          action="Review"
        />
      </div>
    </WireCard>
    <div style={{ height: 12 }} />
    <WireCard title="Client Overview" noPad action={<WireBtn sm>View All →</WireBtn>}>
      <WireTable
        columns={[
          { label: "Client", w: "2fr" },
          { label: "Payer" },
          { label: "Eligibility", w: "0.8fr" },
          { label: "Auth Utilization", w: "1.5fr" },
          { label: "Auth Status", w: "0.8fr" },
        ]}
        rows={[
          [
            <span style={{ fontWeight: 600 }}>
              Ethan Miller{" "}
              <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 11 }}>
                · F84.0 · Age 8
              </span>
            </span>,
            "BCBS",
            <WireBadge color="green">Active</WireBadge>,
            <WireBar pct={61} label="73/120 hrs" />,
            <WireBadge color="green">90d left</WireBadge>,
          ],
          [
            <span style={{ fontWeight: 600 }}>
              Sophia Garcia{" "}
              <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 11 }}>
                · F84.0 · Age 6
              </span>
            </span>,
            "Aetna",
            <WireBadge color="green">Active</WireBadge>,
            <WireBar pct={35} label="51/145 hrs" />,
            <WireBadge color="green">120d left</WireBadge>,
          ],
          [
            <span style={{ fontWeight: 600 }}>
              Liam Johnson{" "}
              <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 11 }}>
                · F84.0 · Age 8
              </span>
            </span>,
            "UHC",
            <WireBadge color="red">Inactive</WireBadge>,
            <WireBar pct={64} label="61/95 hrs" />,
            <WireBadge color="green">60d left</WireBadge>,
          ],
          [
            <span style={{ fontWeight: 600 }}>
              Olivia Thompson{" "}
              <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 11 }}>
                · F84.0 · Age 6
              </span>
            </span>,
            "Cigna",
            <WireBadge color="green">Active</WireBadge>,
            <WireBar pct={90} label="63/70 hrs" />,
            <WireBadge color="yellow">10d left</WireBadge>,
          ],
          [
            <span style={{ fontWeight: 600 }}>
              Emma Rodriguez{" "}
              <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 11 }}>
                · F84.0 · Age 8
              </span>
            </span>,
            "Aetna",
            <WireBadge color="green">Active</WireBadge>,
            <WireBar pct={97} label="92/95 hrs" />,
            <WireBadge color="red">Expired</WireBadge>,
          ],
        ]}
      />
    </WireCard>
  </div>
);

const ClientsPage = () => (
  <div>
    <Annotation>
      Clients List — Searchable, filterable table. Cards view toggle optional. Click any row to open
      client detail.
    </Annotation>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Clients</h2>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "2px 0 0" }}>
          28 clients in your caseload
        </p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <div
          style={{
            padding: "7px 12px",
            borderRadius: 7,
            border: `1px solid ${C.border}`,
            color: C.textLight,
            fontSize: 13,
            width: 220,
          }}
        >
          🔍 Search clients...
        </div>
        <WireBtn sm>Filters</WireBtn>
        <WireBtn sm>Import CSV</WireBtn>
        <WireBtn primary icon="＋">
          Add Client
        </WireBtn>
      </div>
    </div>
    <WireCard noPad>
      <WireTable
        columns={[
          { label: "Client", w: "2fr" },
          { label: "Guardian" },
          { label: "Payer" },
          { label: "BCBA" },
          { label: "Eligibility", w: "0.7fr" },
          { label: "Auth Status", w: "0.8fr" },
          { label: "", w: "0.4fr" },
        ]}
        rows={[
          [
            <div>
              <div style={{ fontWeight: 600 }}>Ethan Miller</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>DOB: Mar 15, 2018 · F84.0</div>
            </div>,
            "Rebecca Miller",
            "BCBS",
            "Dr. Sarah Chen",
            <WireBadge color="green">Active</WireBadge>,
            <WireBadge color="green">90d</WireBadge>,
            <span style={{ color: C.textLight }}>→</span>,
          ],
          [
            <div>
              <div style={{ fontWeight: 600 }}>Sophia Garcia</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>DOB: Jul 22, 2019 · F84.0</div>
            </div>,
            "Maria & Carlos Garcia",
            "Aetna",
            "Marcus Williams",
            <WireBadge color="green">Active</WireBadge>,
            <WireBadge color="green">120d</WireBadge>,
            <span style={{ color: C.textLight }}>→</span>,
          ],
          [
            <div>
              <div style={{ fontWeight: 600 }}>Liam Johnson</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>DOB: Nov 3, 2017 · F84.0</div>
            </div>,
            "Tanya Johnson",
            "UHC",
            "Jessica Torres",
            <WireBadge color="red">Inactive</WireBadge>,
            <WireBadge color="green">60d</WireBadge>,
            <span style={{ color: C.textLight }}>→</span>,
          ],
          [
            <div>
              <div style={{ fontWeight: 600 }}>Olivia Thompson</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>DOB: Jan 18, 2020 · F84.0</div>
            </div>,
            "James Thompson",
            "Cigna",
            "Dr. Sarah Chen",
            <WireBadge color="green">Active</WireBadge>,
            <WireBadge color="yellow">10d</WireBadge>,
            <span style={{ color: C.textLight }}>→</span>,
          ],
          [
            <div>
              <div style={{ fontWeight: 600 }}>Noah Williams</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>DOB: May 30, 2016 · F84.0</div>
            </div>,
            "DeShawn & Lisa Williams",
            "Medicaid",
            "Marcus Williams",
            <WireBadge color="green">Active</WireBadge>,
            <WireBadge color="green">135d</WireBadge>,
            <span style={{ color: C.textLight }}>→</span>,
          ],
        ]}
      />
    </WireCard>
  </div>
);

const ClientDetailPage = () => {
  const [tab, setTab] = useState("Overview");
  return (
    <div>
      <Annotation>
        Client Detail — Tabbed layout with overview, insurance, authorizations, sessions, documents.
        All data for one client in one place.
      </Annotation>
      <div style={{ fontSize: 13, color: C.primary, marginBottom: 8, cursor: "pointer" }}>
        ← Back to Clients
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Ethan Miller</h2>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            DOB: Mar 15, 2018 · Age 8 · F84.0: Autism Spectrum Disorder
          </div>
          <div style={{ fontSize: 13, color: C.textMuted }}>
            Guardian: Rebecca Miller · (512) 555-0142 · rmiller@email.com
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <WireBadge color="green">Eligible</WireBadge>
          <WireBadge color="green">Auth: 90d left</WireBadge>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <WireBtn primary icon="＋">
          Log Session
        </WireBtn>
        <WireBtn icon="📄">Upload Auth Letter</WireBtn>
        <WireBtn icon="✓">Run Eligibility Check</WireBtn>
      </div>
      <WireTabs
        tabs={["Overview", "Insurance", "Authorizations", "Sessions", "Documents"]}
        active={tab}
        onChange={setTab}
      />

      {tab === "Overview" && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <WireMetric label="Total Approved" value="120 hrs" sub="97153: 100 · 97155: 20" />
            <WireMetric label="Used" value="73 hrs" sub="61% utilized" color={C.primary} />
            <WireMetric label="Weekly Avg" value="12.3 hrs" sub="Target: 15 hrs/wk" />
            <WireMetric label="Days Left" value="90" sub="Auth expires Jun 18" color={C.success} />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}
          >
            <WireCard title="Insurance">
              {[
                ["Payer", "Blue Cross Blue Shield"],
                ["Member ID", "BCB998877123"],
                ["Group", "GRP-44521"],
                ["Copay", "$20"],
                ["Deductible", "$1,500 (met)"],
                ["In-Network", "Yes"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: `1px solid ${C.borderLight}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: C.textMuted }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.textLight, marginTop: 6 }}>
                Last checked: Mar 19, 2026
              </div>
            </WireCard>
            <WireCard title="Care Team">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["SC", "Dr. Sarah Chen, BCBA-D", "Clinical Director"],
                  ["DP", "David Park, RBT", "Behavior Technician"],
                ].map(([init, name, role]) => (
                  <div key={init} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: C.primaryLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.primary,
                      }}
                    >
                      {init}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </WireCard>
          </div>
          <WireCard title="Authorized Services">
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <span
                    style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: C.primary }}
                  >
                    97153
                  </span>
                  <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 6 }}>
                    Adaptive behavior treatment
                  </span>
                </div>
                <span style={{ fontSize: 12, color: C.textMuted }}>38 hrs remaining</span>
              </div>
              <WireBar pct={62} label="62/100 hrs" />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <span
                    style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: C.primary }}
                  >
                    97155
                  </span>
                  <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 6 }}>
                    Protocol modification
                  </span>
                </div>
                <span style={{ fontSize: 12, color: C.textMuted }}>9 hrs remaining</span>
              </div>
              <WireBar pct={55} label="11/20 hrs" />
            </div>
          </WireCard>
        </>
      )}

      {tab === "Insurance" && (
        <>
          <Annotation>
            Insurance tab — Manage client's insurance policies. Primary and secondary. Link to
            eligibility checks.
          </Annotation>
          <WireCard title="Primary Insurance" action={<WireBtn sm>Edit</WireBtn>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
              {[
                ["Payer", "Blue Cross Blue Shield"],
                ["Member ID", "BCB998877123"],
                ["Group #", "GRP-44521"],
                ["Subscriber", "Rebecca Miller (Self)"],
                ["Effective Date", "Jan 1, 2025"],
                ["Term Date", "—"],
                ["Copay", "$20/visit"],
                ["Deductible", "$1,500 / $1,500 met"],
                ["In-Network", "Yes"],
                ["Prior Auth Required", "Yes"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: `1px solid ${C.borderLight}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: C.textMuted }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </WireCard>
          <div style={{ height: 10 }} />
          <WireBtn icon="＋">Add Secondary Insurance</WireBtn>
        </>
      )}

      {tab === "Authorizations" && (
        <>
          <Annotation>
            Authorizations tab — All auths for this client. Upload new auth letters here. AI parsing
            populates fields.
          </Annotation>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <WireBtn primary icon="📄">
              Upload Auth Letter (AI Parse)
            </WireBtn>
            <WireBtn icon="＋">Add Manually</WireBtn>
          </div>
          <WireCard
            title="Current Authorization — AUTH-2024-0891"
            action={<WireBadge color="green">Active</WireBadge>}
            noPad
          >
            <div style={{ padding: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {[
                  ["Period", "Dec 20 → Jun 18"],
                  ["Days Left", "90"],
                  ["Weekly Target", "15 hrs"],
                  ["Projected Util", "78%"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: C.primary }}>97153</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>62/100 units used</span>
                </div>
                <WireBar pct={62} label="" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: C.primary }}>97155</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>11/20 units used</span>
                </div>
                <WireBar pct={55} label="" />
              </div>
            </div>
          </WireCard>
          <div style={{ height: 8 }} />
          <WireCard
            title="Previous Authorization — AUTH-2024-0331"
            action={<WireBadge color="gray">Expired</WireBadge>}
          >
            <div style={{ fontSize: 13, color: C.textMuted }}>
              Jun 20, 2024 → Dec 19, 2024 · 97153: 80/80 (100%) · 97155: 14/15 (93%)
            </div>
          </WireCard>
        </>
      )}

      {tab === "Sessions" && (
        <>
          <Annotation>
            Sessions tab — All sessions for this client. Quick log, filter by date, provider, CPT.
            Shows flagged sessions prominently.
          </Annotation>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <WireBtn primary icon="＋">
              Log Session
            </WireBtn>
            <WireBtn sm>This Week</WireBtn>
            <WireBtn sm>This Month</WireBtn>
            <WireBtn sm>All</WireBtn>
          </div>
          <WireCard noPad>
            <WireTable
              columns={[
                { label: "Date" },
                { label: "Time" },
                { label: "Provider" },
                { label: "CPT", w: "0.6fr" },
                { label: "Units", w: "0.5fr" },
                { label: "POS", w: "0.5fr" },
                { label: "Status", w: "0.7fr" },
              ]}
              rows={[
                [
                  "Mar 20",
                  "9:00a–12:00p",
                  "David Park, RBT",
                  <span style={{ fontFamily: mono, color: C.primary }}>97153</span>,
                  "12",
                  "12 (Home)",
                  <WireBadge color="green">Completed</WireBadge>,
                ],
                [
                  "Mar 19",
                  "9:00a–12:00p",
                  "David Park, RBT",
                  <span style={{ fontFamily: mono, color: C.primary }}>97153</span>,
                  "12",
                  "12 (Home)",
                  <WireBadge color="green">Completed</WireBadge>,
                ],
                [
                  "Mar 18",
                  "1:00p–3:00p",
                  "Dr. Sarah Chen, BCBA-D",
                  <span style={{ fontFamily: mono, color: C.primary }}>97155</span>,
                  "8",
                  "11 (Clinic)",
                  <WireBadge color="green">Completed</WireBadge>,
                ],
                [
                  "Mar 16",
                  "9:00a–12:00p",
                  "David Park, RBT",
                  <span style={{ fontFamily: mono, color: C.primary }}>97153</span>,
                  "12",
                  "12 (Home)",
                  <WireBadge color="green">Completed</WireBadge>,
                ],
              ]}
            />
          </WireCard>
        </>
      )}

      {tab === "Documents" && (
        <>
          <Annotation>
            Documents tab — Auth letters, referrals, assessments. Upload triggers AI parsing for
            auth letters.
          </Annotation>
          <WireBtn primary icon="📎" style={{ marginBottom: 12 }}>
            Upload Document
          </WireBtn>
          <WireCard noPad>
            <WireTable
              columns={[
                { label: "Document" },
                { label: "Type" },
                { label: "Uploaded" },
                { label: "AI Status", w: "0.8fr" },
                { label: "", w: "0.4fr" },
              ]}
              rows={[
                [
                  "AUTH-2024-0891_letter.pdf",
                  <WireBadge color="blue">Auth Letter</WireBadge>,
                  "Dec 22, 2025",
                  <WireBadge color="green">Parsed ✓</WireBadge>,
                  "↓",
                ],
                [
                  "referral_dr_smith.pdf",
                  <WireBadge color="purple">Referral</WireBadge>,
                  "Dec 15, 2025",
                  <WireBadge color="gray">N/A</WireBadge>,
                  "↓",
                ],
                [
                  "initial_assessment_2024.pdf",
                  <WireBadge>Assessment</WireBadge>,
                  "Jun 10, 2024",
                  <WireBadge color="gray">N/A</WireBadge>,
                  "↓",
                ],
              ]}
            />
          </WireCard>
        </>
      )}
    </div>
  );
};

const AuthorizationsPage = () => (
  <div>
    <Annotation>
      Authorizations — All auths across all clients. Filter by status. Primary tool for tracking
      renewals and utilization.
    </Annotation>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Authorizations</h2>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "2px 0 0" }}>
          Track all client authorizations and renewals
        </p>
      </div>
      <WireBtn primary icon="📄">
        Upload Auth Letter
      </WireBtn>
    </div>
    <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
      {["All", "Active", "Expiring Soon", "Expired", "Pending"].map((f) => (
        <button
          key={f}
          style={{
            padding: "5px 12px",
            borderRadius: 6,
            border: `1px solid ${f === "All" ? C.primary : C.border}`,
            background: f === "All" ? C.primaryLight : C.surface,
            color: f === "All" ? C.primary : C.textMuted,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: font,
          }}
        >
          {f}
        </button>
      ))}
    </div>
    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
      <WireMetric label="Active" value="18" color={C.success} />
      <WireMetric label="Expiring (30d)" value="3" color={C.warning} />
      <WireMetric label="Expired" value="2" color={C.danger} />
      <WireMetric label="Avg Utilization" value="68%" color={C.primary} />
    </div>
    <WireCard noPad>
      <WireTable
        columns={[
          { label: "Client", w: "1.5fr" },
          { label: "Auth ID" },
          { label: "Period" },
          { label: "Days Left", w: "0.7fr" },
          { label: "Utilization", w: "1.3fr" },
          { label: "Projected", w: "0.7fr" },
          { label: "Status", w: "0.7fr" },
        ]}
        rows={[
          [
            <span style={{ fontWeight: 600 }}>Ethan Miller</span>,
            <span style={{ fontFamily: mono, fontSize: 12 }}>AUTH-0891</span>,
            "Dec 20 – Jun 18",
            "90",
            <WireBar pct={61} label="73/120" />,
            "78%",
            <WireBadge color="green">Active</WireBadge>,
          ],
          [
            <span style={{ fontWeight: 600 }}>Sophia Garcia</span>,
            <span style={{ fontFamily: mono, fontSize: 12 }}>AUTH-1102</span>,
            "Jan 19 – Jul 18",
            "120",
            <WireBar pct={35} label="51/145" />,
            "62%",
            <WireBadge color="green">Active</WireBadge>,
          ],
          [
            <span style={{ fontWeight: 600 }}>Olivia Thompson</span>,
            <span style={{ fontFamily: mono, fontSize: 12 }}>AUTH-0443</span>,
            "Oct 21 – Mar 30",
            "10",
            <WireBar pct={90} label="63/70" />,
            "96%",
            <WireBadge color="yellow">Expiring</WireBadge>,
          ],
          [
            <span style={{ fontWeight: 600 }}>Emma Rodriguez</span>,
            <span style={{ fontFamily: mono, fontSize: 12 }}>AUTH-0220</span>,
            "Sep 1 – Mar 17",
            <span style={{ color: C.danger }}>-3</span>,
            <WireBar pct={97} label="92/95" />,
            "—",
            <WireBadge color="red">Expired</WireBadge>,
          ],
        ]}
      />
    </WireCard>
  </div>
);

const SessionsPage = () => (
  <div>
    <Annotation>
      Sessions — All sessions across all clients. Bulk actions for billing. Import CSV for practices
      migrating from spreadsheets.
    </Annotation>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Sessions</h2>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "2px 0 0" }}>
          142 sessions logged this month
        </p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <WireBtn sm>Import CSV</WireBtn>
        <WireBtn primary icon="＋">
          Log Session
        </WireBtn>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
      <WireMetric label="This Week" value="42.5 hrs" />
      <WireMetric label="Sessions (7d)" value="38" />
      <WireMetric label="Flagged" value="2" color={C.danger} />
      <WireMetric label="Unbilled" value="18" sub="Ready for claims" color={C.warning} />
    </div>
    <WireCard noPad>
      <WireTable
        columns={[
          { label: "Date" },
          { label: "Client", w: "1.5fr" },
          { label: "Provider" },
          { label: "CPT", w: "0.5fr" },
          { label: "Units", w: "0.5fr" },
          { label: "POS", w: "0.5fr" },
          { label: "Status", w: "0.7fr" },
          { label: "Billed", w: "0.6fr" },
        ]}
        rows={[
          [
            "Mar 20",
            <span style={{ fontWeight: 500 }}>Ethan Miller</span>,
            "David Park",
            <span style={{ fontFamily: mono, color: C.primary }}>97153</span>,
            "12",
            "12",
            <WireBadge color="green">Done</WireBadge>,
            <WireBadge color="gray">No</WireBadge>,
          ],
          [
            "Mar 20",
            <span style={{ fontWeight: 500 }}>Ava Chen</span>,
            "Aisha Johnson",
            <span style={{ fontFamily: mono, color: C.primary }}>97153</span>,
            "14",
            "12",
            <WireBadge color="green">Done</WireBadge>,
            <WireBadge color="gray">No</WireBadge>,
          ],
          [
            "Mar 19",
            <span style={{ fontWeight: 500 }}>Liam Johnson</span>,
            "David Park",
            <span style={{ fontFamily: mono, color: C.primary }}>97153</span>,
            "12",
            "12",
            <WireBadge color="red">Flagged</WireBadge>,
            <WireBadge color="gray">No</WireBadge>,
          ],
          [
            "Mar 19",
            <span style={{ fontWeight: 500 }}>Sophia Garcia</span>,
            "Aisha Johnson",
            <span style={{ fontFamily: mono, color: C.primary }}>97153</span>,
            "16",
            "12",
            <WireBadge color="green">Done</WireBadge>,
            <WireBadge color="blue">Billed</WireBadge>,
          ],
        ]}
      />
    </WireCard>
  </div>
);

const SessionFormPage = () => (
  <div>
    <Annotation>
      Log Session Form — Quick entry. Auto-calculates units from time. Shows auth warnings.
      Auto-populates modifiers from provider credential.
    </Annotation>
    <div style={{ fontSize: 13, color: C.primary, marginBottom: 8, cursor: "pointer" }}>
      ← Back to Sessions
    </div>
    <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>Log Session</h2>
    <WireCard>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <WireInput label="Client *" type="select" placeholder="Select client..." />
        <WireInput label="Provider *" type="select" placeholder="Select provider..." />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <WireInput label="Date *" placeholder="Mar 20, 2026" />
        <WireInput label="Start Time *" placeholder="9:00 AM" />
        <WireInput label="End Time *" placeholder="12:00 PM" />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <WireInput label="CPT Code *" type="select" placeholder="97153 — Adaptive behavior" />
        <WireInput label="Place of Service *" type="select" placeholder="12 — Home" />
      </div>

      <div
        style={{
          background: C.primaryLight,
          border: `1px solid ${C.primaryBorder}`,
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 4 }}>
          Auto-calculated
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          <div>
            <span style={{ color: C.textMuted }}>Duration:</span> <strong>3h 0m</strong>
          </div>
          <div>
            <span style={{ color: C.textMuted }}>Units (15-min):</span> <strong>12</strong>
          </div>
          <div>
            <span style={{ color: C.textMuted }}>Modifier:</span> <strong>HM</strong>{" "}
            <span style={{ color: C.textMuted }}>(RBT)</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: C.successBg,
          border: `1px solid #A7F3D0`,
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: C.success, marginBottom: 4 }}>
          Authorization Check ✓
        </div>
        <div style={{ fontSize: 13, color: C.text }}>
          Auth AUTH-0891 has 38 units remaining for 97153. This session uses 12 units → 26 remaining
          after.
        </div>
      </div>

      <WireInput label="Notes (optional)" type="textarea" placeholder="Session notes..." />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <WireBtn primary>Save Session</WireBtn>
        <WireBtn>Cancel</WireBtn>
      </div>
    </WireCard>
  </div>
);

const BillingPage = () => (
  <div>
    <Annotation>
      Billing Dashboard (Phase 2) — Claims lifecycle view. Generate from sessions, submit via Stedi,
      track payments. This is the revenue engine.
    </Annotation>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Billing</h2>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "2px 0 0" }}>
          Claims management and revenue tracking
        </p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <WireBtn sm>Export Report</WireBtn>
        <WireBtn primary icon="⚡">
          Generate Claims
        </WireBtn>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
      <WireMetric label="Unbilled Sessions" value="18" sub="$4,320 estimated" color={C.warning} />
      <WireMetric label="Claims Submitted" value="42" sub="This month" color={C.primary} />
      <WireMetric label="Collected" value="$38,450" sub="This month" color={C.success} />
      <WireMetric label="Denied" value="3" sub="$1,240 at risk" color={C.danger} />
    </div>
    <WireTabs
      tabs={["Ready to Bill", "Submitted", "Paid", "Denied"]}
      active="Ready to Bill"
      onChange={() => {}}
    />
    <WireCard
      title="18 Sessions Ready to Bill"
      action={
        <div style={{ display: "flex", gap: 6 }}>
          <WireBtn sm>Select All</WireBtn>
          <WireBtn sm primary>
            Submit Selected
          </WireBtn>
        </div>
      }
      noPad
    >
      <div
        style={{
          padding: "10px 16px",
          background: C.primaryLight,
          borderBottom: `1px solid ${C.primaryBorder}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 13 }}>🤖</span>
        <span style={{ fontSize: 12, color: C.primary, fontWeight: 500 }}>
          AI Pre-Claim Check: 15 claims ready (green), 2 warnings (review modifiers), 1 blocked
          (auth expired)
        </span>
      </div>
      <WireTable
        columns={[
          { label: "☐", w: "0.3fr" },
          { label: "Client", w: "1.5fr" },
          { label: "Date" },
          { label: "CPT", w: "0.5fr" },
          { label: "Units", w: "0.5fr" },
          { label: "Charge", w: "0.7fr" },
          { label: "AI Check", w: "0.8fr" },
        ]}
        rows={[
          [
            "☐",
            <span style={{ fontWeight: 500 }}>Ethan Miller</span>,
            "Mar 20",
            <span style={{ fontFamily: mono }}>97153</span>,
            "12",
            "$180.00",
            <WireBadge color="green">Ready ✓</WireBadge>,
          ],
          [
            "☐",
            <span style={{ fontWeight: 500 }}>Ava Chen</span>,
            "Mar 20",
            <span style={{ fontFamily: mono }}>97153</span>,
            "14",
            "$210.00",
            <WireBadge color="green">Ready ✓</WireBadge>,
          ],
          [
            "☐",
            <span style={{ fontWeight: 500 }}>Sophia Garcia</span>,
            "Mar 19",
            <span style={{ fontFamily: mono }}>97155</span>,
            "8",
            "$160.00",
            <WireBadge color="yellow">Review ⚠</WireBadge>,
          ],
          [
            "☐",
            <span style={{ fontWeight: 500 }}>Emma Rodriguez</span>,
            "Mar 17",
            <span style={{ fontFamily: mono }}>97153</span>,
            "12",
            "$180.00",
            <WireBadge color="red">Blocked ✕</WireBadge>,
          ],
        ]}
      />
    </WireCard>
  </div>
);

const EligibilityPage = () => (
  <div>
    <Annotation>
      Eligibility (Phase 2) — Stedi-powered insurance verification. Batch check all clients. History
      timeline. Plain-English AI interpretation.
    </Annotation>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Eligibility</h2>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "2px 0 0" }}>
          Insurance verification via Stedi 270/271
        </p>
      </div>
      <WireBtn primary icon="⚡">
        Batch Check All Clients
      </WireBtn>
    </div>
    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
      <WireMetric label="Active" value="22" color={C.success} />
      <WireMetric label="Inactive" value="1" color={C.danger} />
      <WireMetric label="Pending" value="2" color={C.warning} />
      <WireMetric label="Last Batch" value="Mar 18" sub="24 clients checked" />
    </div>
    <WireCard noPad>
      <WireTable
        columns={[
          { label: "Client", w: "1.5fr" },
          { label: "Payer" },
          { label: "Member ID" },
          { label: "Copay/Ded" },
          { label: "Status", w: "0.7fr" },
          { label: "Last Check" },
          { label: "History", w: "0.8fr" },
        ]}
        rows={[
          [
            <span style={{ fontWeight: 500 }}>Ethan Miller</span>,
            "BCBS",
            <span style={{ fontFamily: mono, fontSize: 12 }}>BCB998877</span>,
            "$20 / $1,500 met",
            <WireBadge color="green">Active</WireBadge>,
            "Mar 19",
            <span style={{ display: "flex", gap: 2 }}>
              {["green", "green", "green", "green"].map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: c === "green" ? C.success : C.danger,
                  }}
                />
              ))}
            </span>,
          ],
          [
            <span style={{ fontWeight: 500 }}>Liam Johnson</span>,
            "UHC",
            <span style={{ fontFamily: mono, fontSize: 12 }}>UHC334455</span>,
            "N/A",
            <WireBadge color="red">Inactive</WireBadge>,
            "Mar 20",
            <span style={{ display: "flex", gap: 2 }}>
              {["red", "green", "green"].map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: c === "green" ? C.success : C.danger,
                  }}
                />
              ))}
            </span>,
          ],
          [
            <span style={{ fontWeight: 500 }}>Sophia Garcia</span>,
            "Aetna",
            <span style={{ fontFamily: mono, fontSize: 12 }}>AET776655</span>,
            "$0 / $2,000 met",
            <WireBadge color="green">Active</WireBadge>,
            "Mar 18",
            <span style={{ display: "flex", gap: 2 }}>
              {["green", "green", "green"].map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: c === "green" ? C.success : C.danger,
                  }}
                />
              ))}
            </span>,
          ],
        ]}
      />
    </WireCard>
  </div>
);

const SettingsPage = () => (
  <div>
    <Annotation>
      Settings — Organization info, team management, payer configuration, Clinivise billing (Phase
      3). Clerk handles team/invite UI.
    </Annotation>
    <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>Settings</h2>
    <WireTabs
      tabs={["Organization", "Team", "Payers", "Billing"]}
      active="Organization"
      onChange={() => {}}
    />
    <WireCard title="Practice Information">
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <WireInput label="Practice Name" placeholder="Bright Futures ABA" />
        <WireInput label="NPI (Type 2)" placeholder="1234567890" />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <WireInput label="Tax ID / EIN" placeholder="12-3456789" />
        <WireInput label="Taxonomy Code" placeholder="103K00000X" />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <WireInput label="Address" placeholder="123 Therapy Lane" />
        <WireInput label="City" placeholder="Austin" />
        <WireInput label="State" placeholder="TX" w={80} />
        <WireInput label="ZIP" placeholder="78745" w={100} />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <WireInput label="Phone" placeholder="(512) 555-0100" />
        <WireInput label="Email" placeholder="admin@brightfutures.com" />
      </div>
      <WireBtn primary>Save Changes</WireBtn>
    </WireCard>
  </div>
);

// ── MAIN APP ─────────────────────────────────────────────────────────────────
const pages = {
  dashboard: { label: "Overview", icon: "◫", component: DashboardPage },
  clients: { label: "Clients", icon: "◉", component: ClientsPage },
  clientDetail: { label: "Client Detail", icon: "◉", component: ClientDetailPage, hidden: true },
  authorizations: { label: "Authorizations", icon: "◈", component: AuthorizationsPage },
  sessions: { label: "Sessions", icon: "▤", component: SessionsPage },
  sessionForm: { label: "Log Session", icon: "▤", component: SessionFormPage, hidden: true },
  billing: { label: "Billing", icon: "₿", component: BillingPage, phase2: true },
  eligibility: { label: "Eligibility", icon: "◇", component: EligibilityPage, phase2: true },
  settings: { label: "Settings", icon: "⚙", component: SettingsPage },
};

export default function CliniviseWireframes() {
  const [page, setPage] = useState("dashboard");
  const Page = pages[page]?.component || DashboardPage;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: C.bg,
        fontFamily: font,
        color: C.text,
        overflow: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:3px}`}</style>

      {/* Sidebar */}
      <div
        style={{
          width: 220,
          minWidth: 220,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "16px 14px",
            borderBottom: `1px solid ${C.borderLight}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.primary}, #7C3AED)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            C
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Clinivise</div>
            <div style={{ fontSize: 10, color: C.textLight, letterSpacing: 0.5 }}>
              PRACTICE MANAGEMENT
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 8px", flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.textLight,
              padding: "8px 10px 4px",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Core
          </div>
          {Object.entries(pages)
            .filter(([, v]) => !v.hidden && !v.phase2)
            .map(([key, val]) => (
              <div
                key={key}
                onClick={() => setPage(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 7,
                  marginBottom: 1,
                  cursor: "pointer",
                  background: page === key ? C.primaryLight : "transparent",
                  color: page === key ? C.primary : C.textMuted,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: 14 }}>{val.icon}</span>
                {val.label}
              </div>
            ))}
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.textLight,
              padding: "12px 10px 4px",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Phase 2
          </div>
          {Object.entries(pages)
            .filter(([, v]) => v.phase2)
            .map(([key, val]) => (
              <div
                key={key}
                onClick={() => setPage(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 7,
                  marginBottom: 1,
                  cursor: "pointer",
                  background: page === key ? C.primaryLight : "transparent",
                  color: page === key ? C.primary : C.textLight,
                  fontSize: 13,
                  fontWeight: 500,
                  fontStyle: "italic",
                }}
              >
                <span style={{ fontSize: 14 }}>{val.icon}</span>
                {val.label}
              </div>
            ))}
        </div>
        <div
          style={{
            padding: "10px 14px",
            borderTop: `1px solid ${C.borderLight}`,
            fontSize: 11,
            color: C.textLight,
          }}
        >
          <div style={{ fontWeight: 600, color: C.textMuted }}>Bright Futures ABA</div>
          NPI: 1234567890
        </div>
      </div>

      {/* Header + Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          style={{
            padding: "10px 20px",
            borderBottom: `1px solid ${C.border}`,
            background: C.surface,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid ${C.border}`,
                fontSize: 12,
                color: C.textMuted,
              }}
            >
              🔍 Search anything... <span style={{ color: C.textLight, marginLeft: 8 }}>⌘K</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>Bright Futures ABA</span>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 99,
                background: C.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: C.primary,
              }}
            >
              SC
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          <Page />
          {/* Quick nav for wireframe review */}
          <div
            style={{
              marginTop: 24,
              padding: 12,
              background: "#FFFDE7",
              border: "1px dashed #FBC02D",
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "#F57F17", marginBottom: 6 }}>
              📐 WIREFRAME NAVIGATION — Click to view each screen:
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[
                ["dashboard", "Dashboard"],
                ["clients", "Clients List"],
                ["clientDetail", "Client Detail"],
                ["authorizations", "Authorizations"],
                ["sessions", "Sessions List"],
                ["sessionForm", "Log Session Form"],
                ["billing", "Billing (Phase 2)"],
                ["eligibility", "Eligibility (Phase 2)"],
                ["settings", "Settings"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setPage(k)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 5,
                    border: `1px solid ${page === k ? C.primary : "#FBC02D"}`,
                    background: page === k ? C.primaryLight : "#FFF9C4",
                    color: page === k ? C.primary : "#F57F17",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: font,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
