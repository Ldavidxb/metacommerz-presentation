import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line, CartesianGrid, ReferenceLine } from "recharts";

const fmt = (v) => `CHF ${Math.round(v).toLocaleString("de-CH")}`;
const pct = (v) => `${v.toFixed(1)}%`;

// ═══════════════ DATA ═══════════════
const revBudget = 250000;
const revActual = 173888;
const revShortfall = revBudget - revActual;
const revPct = (revActual / revBudget) * 100;

const categories = [
  { name: "Küche", budget: 163750, actual: 117933, cogs: 33743, cogsBudgetPct: 26.5, color: "#E94560" },
  { name: "Wein", budget: 54000, actual: 28146, cogs: 7455, cogsBudgetPct: 35.0, color: "#533483" },
  { name: "Mineral", budget: 13500, actual: 12380, cogs: 533, cogsBudgetPct: 3.0, color: "#38ADA9" },
  { name: "Spirituosen", budget: 11750, actual: 10000, cogs: 1422, cogsBudgetPct: 22.0, color: "#4A69BD" },
  { name: "Kaffee", budget: 5000, actual: 3539, cogs: 347, cogsBudgetPct: 8.0, color: "#F6B93B" },
  { name: "Bier", budget: 2000, actual: 1680, cogs: 522, cogsBudgetPct: 18.4, color: "#78E08F" },
];

const catWithMetrics = categories.map(c => ({
  ...c,
  achPct: (c.actual / c.budget * 100),
  cogsActPct: (c.cogs / c.actual * 100),
  cogsVar: (c.cogs / c.actual * 100) - c.cogsBudgetPct,
  grossProfit: c.actual - c.cogs,
  grossMargin: ((c.actual - c.cogs) / c.actual * 100),
}));

const totalCOGS = categories.reduce((s, c) => s + c.cogs, 0);
const totalGross = revActual - totalCOGS;

// P&L estimate
const pnl = {
  revenue: revActual,
  cogs: totalCOGS,
  grossProfit: totalGross,
  grossMarginPct: (totalGross / revActual * 100),
  personnel: 98208,
  betriebskosten: 34449,
  betriebsergebnis: totalGross - 98208 - 34449,
  miete: 21322,
  unterhalt: 9000,
  ebitda: totalGross - 98208 - 34449 - 21322 - 9000,
  abschreibung: 4500,
  netResult: totalGross - 98208 - 34449 - 21322 - 9000 - 4500,
};

// Payment data
const payments = [
  { name: "Karte (Lightspeed)", value: 165070, pct: 94.9 },
  { name: "Bar", value: 7857, pct: 4.5 },
  { name: "Rechnung", value: 1460, pct: 0.8 },
  { name: "Maison/Andere", value: -499, pct: -0.3 },
];

// Per-item analysis
const perItem = [
  { name: "Küche", items: 5851, revenue: 117933, avg: 20.16 },
  { name: "Wein", items: 1291, revenue: 28146, avg: 21.80 },
  { name: "Mineral", items: 1665, revenue: 12380, avg: 7.43 },
  { name: "Spirituosen", items: 566, revenue: 10000, avg: 17.67 },
  { name: "Kaffee", items: 655, revenue: 3539, avg: 5.40 },
  { name: "Bier", items: 207, revenue: 1680, avg: 8.12 },
];

// Budget monthly
const monthlyBudget = [
  { m: "Jan", rev: 140000, actual: null },
  { m: "Feb", rev: 180000, actual: null },
  { m: "Mär", rev: 250000, actual: null },
  { m: "Apr", rev: 250000, actual: null },
  { m: "Mai", rev: 250000, actual: null },
  { m: "Jun", rev: 250000, actual: 173888 },
  { m: "Jul", rev: 275000, actual: null },
  { m: "Aug", rev: 270000, actual: null },
  { m: "Sep", rev: 250000, actual: null },
  { m: "Okt", rev: 250000, actual: null },
  { m: "Nov", rev: 300000, actual: null },
  { m: "Dez", rev: 260000, actual: null },
];

const COLORS = ["#E94560", "#533483", "#38ADA9", "#4A69BD", "#F6B93B", "#78E08F", "#FA983A", "#1E3799"];

// ═══════════════ COMPONENTS ═══════════════
const KPI = ({ label, value, sub, alert, good }) => (
  <div style={{
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${alert ? "rgba(233,69,96,0.3)" : good ? "rgba(120,224,143,0.3)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 8, padding: "14px 16px", flex: 1, minWidth: 140,
  }}>
    <div style={{ fontSize: 11, color: "#8899AA", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: alert ? "#E94560" : good ? "#78E08F" : "#FFFFFF", fontFamily: "'Space Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: alert ? "#E94560" : "#8899AA", marginTop: 4 }}>{sub}</div>}
  </div>
);

const Section = ({ title, children, id }) => (
  <div id={id} style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", marginBottom: 16, fontFamily: "'DM Sans', sans-serif", borderLeft: "3px solid #E94560", paddingLeft: 12 }}>{title}</h2>
    {children}
  </div>
);

const Alert = ({ type, title, children }) => (
  <div style={{
    background: type === "danger" ? "rgba(233,69,96,0.08)" : type === "warning" ? "rgba(246,185,59,0.08)" : "rgba(120,224,143,0.08)",
    border: `1px solid ${type === "danger" ? "rgba(233,69,96,0.25)" : type === "warning" ? "rgba(246,185,59,0.25)" : "rgba(120,224,143,0.25)"}`,
    borderRadius: 8, padding: "12px 16px", marginBottom: 10,
  }}>
    <div style={{ fontWeight: 700, fontSize: 13, color: type === "danger" ? "#E94560" : type === "warning" ? "#F6B93B" : "#78E08F", marginBottom: 4 }}>
      {type === "danger" ? "⚠" : type === "warning" ? "△" : "✓"} {title}
    </div>
    <div style={{ fontSize: 12, color: "#CCCCCC", lineHeight: 1.5 }}>{children}</div>
  </div>
);

const Rec = ({ nr, title, impact, effort, children }) => (
  <div style={{
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8, padding: "14px 16px", marginBottom: 10,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ background: "#E94560", color: "#FFF", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{nr}</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: "#FFFFFF" }}>{title}</span>
    </div>
    <div style={{ fontSize: 12, color: "#CCCCCC", lineHeight: 1.6, marginBottom: 8 }}>{children}</div>
    <div style={{ display: "flex", gap: 16 }}>
      <span style={{ fontSize: 11, color: "#78E08F" }}>Impact: {impact}</span>
      <span style={{ fontSize: 11, color: "#F6B93B" }}>Aufwand: {effort}</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px" }}>
      <div style={{ fontSize: 12, color: "#FFF", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 11, color: p.color || "#CCC" }}>
          {p.name}: {typeof p.value === "number" ? (p.value > 200 ? fmt(p.value) : pct(p.value)) : p.value}
        </div>
      ))}
    </div>
  );
};

// ═══════════════ TABS ═══════════════
const tabs = [
  { id: "overview", label: "Übersicht" },
  { id: "revenue", label: "Umsatz" },
  { id: "cogs", label: "Warenkosten" },
  { id: "pnl", label: "P&L" },
  { id: "recs", label: "Massnahmen" },
];

export default function App() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg, #0a0a1a 0%, #12122e 50%, #0a0a1a 100%)",
      color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", padding: "24px 20px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#E94560", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>CAPRI AG · MONATSANALYSE</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#FFFFFF" }}>Juni 2026 — Finanzanalyse</h1>
        <div style={{ fontSize: 12, color: "#8899AA", marginTop: 4 }}>Umsatz, Warenkosten, P&L-Schätzung & Handlungsempfehlungen</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? "#E94560" : "rgba(255,255,255,0.05)",
            border: "none", color: tab === t.id ? "#FFF" : "#8899AA",
            padding: "8px 16px", borderRadius: 6, cursor: "pointer",
            fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══════════ OVERVIEW TAB ═══════════ */}
      {tab === "overview" && (
        <>
          <Section title="Executive Summary">
            <Alert type="danger" title="Umsatz 30.4% unter Budget">
              Juni-Umsatz CHF 173'888 vs. Budget CHF 250'000. Tagesumsatz Ø CHF 5'796 statt geplanter CHF 8'333. Die grösste Abweichung liegt beim Weinumsatz (−48%) und der Küche (−28%).
            </Alert>
            <Alert type="warning" title="Personalkosten-Quote kritisch">
              Bei einem geschätzten Personalaufwand von CHF 98'208 (Budgetwert) erreicht die Personalquote 56.5% statt der geplanten 35.6%. Die Fixkostenlast ist bei diesem Umsatzniveau nicht tragbar.
            </Alert>
            <Alert type="warning" title="Bier-Segment praktisch inexistent">
              Mit nur 1.0% Umsatzanteil (CHF 1'680) und 207 verkauften Einheiten ist Bier eine verpasste Chance. Ø CHF 8.12 pro Bier bei hohen Warenkosten (31.1% vs. 18.4% Budget).
            </Alert>
            <Alert type="success" title="Warenkosten insgesamt im Rahmen">
              Gesamte COGS-Quote bei 25.3% vs. Budget 26.4%. Besonders Wein (26.5% vs. 35% Budget) und Spirituosen (14.2% vs. 22%) performieren deutlich besser als geplant.
            </Alert>
          </Section>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            <KPI label="Umsatz Juni" value="CHF 173'888" sub={`−30.4% vs. Budget (${fmt(revBudget)})`} alert />
            <KPI label="Warenkosten" value="CHF 44'079" sub="25.3% vom Umsatz" good />
            <KPI label="Rohertrag" value={fmt(totalGross)} sub={pct(pnl.grossMarginPct) + " Bruttomarge"} />
            <KPI label="EBITDA (Est.)" value={fmt(pnl.ebitda)} sub="Geschätzter Monatsverlust" alert />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            <KPI label="Quittungen" value="1'148" sub="Ø 38.3 pro Tag" />
            <KPI label="Ø Quittung" value="CHF 151" sub="Bruttowert pro Bon" />
            <KPI label="Trinkgeld" value="CHF 12'231" sub="7.0% des Umsatzes" good />
            <KPI label="Kartenzahlung" value="94.9%" sub="Lightspeed Payments" />
          </div>

          <Section title="Budget-Erreichung nach Kategorie">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={catWithMetrics} layout="vertical" margin={{ left: 80, right: 30 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#8899AA", fontSize: 10 }} tickFormatter={v => v + "%"} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#CCC", fontSize: 12 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={100} stroke="#78E08F" strokeDasharray="3 3" strokeWidth={1} />
                <Bar dataKey="achPct" name="Zielerreichung" radius={[0, 4, 4, 0]} barSize={20}>
                  {catWithMetrics.map((c, i) => (
                    <Cell key={i} fill={c.achPct >= 85 ? "#38ADA9" : c.achPct >= 70 ? "#F6B93B" : "#E94560"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#E94560" }}>● &lt;70% kritisch</span>
              <span style={{ fontSize: 11, color: "#F6B93B" }}>● 70–85% Warnung</span>
              <span style={{ fontSize: 11, color: "#38ADA9" }}>● &gt;85% akzeptabel</span>
            </div>
          </Section>
        </>
      )}

      {/* ═══════════ REVENUE TAB ═══════════ */}
      {tab === "revenue" && (
        <>
          <Section title="Umsatzanalyse: Ist vs. Budget">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={catWithMetrics} margin={{ left: 10, right: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#CCC", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8899AA", fontSize: 10 }} tickFormatter={v => (v / 1000) + "K"} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="actual" name="Ist" radius={[4, 4, 0, 0]} barSize={24}>
                  {catWithMetrics.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Umsatz-Zusammensetzung">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
              <div style={{ flex: "0 0 260px" }}>
                <ResponsiveContainer width={260} height={260}>
                  <PieChart>
                    <Pie data={catWithMetrics} dataKey="actual" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: "#555" }}
                      style={{ fontSize: 10 }}>
                      {catWithMetrics.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip formatter={v => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      {["Kategorie", "Ist", "Budget", "Diff", "Erzielt"].map(h => (
                        <th key={h} style={{ textAlign: h === "Kategorie" ? "left" : "right", padding: "6px 8px", color: "#8899AA", fontSize: 10, letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {catWithMetrics.map(c => (
                      <tr key={c.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: c.color, marginRight: 6 }} />
                          {c.name}
                        </td>
                        <td style={{ textAlign: "right", padding: "6px 8px", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(c.actual)}</td>
                        <td style={{ textAlign: "right", padding: "6px 8px", color: "#8899AA", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(c.budget)}</td>
                        <td style={{ textAlign: "right", padding: "6px 8px", color: "#E94560", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(c.actual - c.budget)}</td>
                        <td style={{ textAlign: "right", padding: "6px 8px", color: c.achPct >= 85 ? "#78E08F" : c.achPct >= 70 ? "#F6B93B" : "#E94560", fontWeight: 600, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{pct(c.achPct)}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: "2px solid rgba(255,255,255,0.15)" }}>
                      <td style={{ padding: "8px 8px", fontWeight: 700 }}>Total</td>
                      <td style={{ textAlign: "right", padding: "8px 8px", fontWeight: 700, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(revActual)}</td>
                      <td style={{ textAlign: "right", padding: "8px 8px", fontWeight: 700, color: "#8899AA", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(revBudget)}</td>
                      <td style={{ textAlign: "right", padding: "8px 8px", fontWeight: 700, color: "#E94560", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(-revShortfall)}</td>
                      <td style={{ textAlign: "right", padding: "8px 8px", fontWeight: 700, color: "#E94560", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{pct(revPct)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          <Section title="Stückanalyse & Durchschnittspreis">
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={perItem} margin={{ left: 10, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#CCC", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: "#8899AA", fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#F6B93B", fontSize: 10 }} tickFormatter={v => `CHF ${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="items" name="Anzahl Stk." fill="rgba(56,173,169,0.5)" radius={[4, 4, 0, 0]} barSize={30} />
                <Line yAxisId="right" dataKey="avg" name="Ø Preis (CHF)" stroke="#F6B93B" strokeWidth={2} dot={{ fill: "#F6B93B", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Schlüsselbeobachtungen: Umsatz">
            <Alert type="danger" title="Wein: Nur 52% des Budgets erreicht (−CHF 25'854)">
              Grösste Einzelabweichung. Der Weinumsatz liegt bei CHF 28'146 statt CHF 54'000. Bei 1'291 verkauften Positionen und Ø CHF 21.80 pro Position muss entweder die Verkaufsfrequenz oder der Durchschnittspreis deutlich steigen. Empfehlung: Weinbegleitung zum Menü aktiv anbieten, Glas-Wein-Angebot ausbauen, Sommelier-Empfehlungen auf der Karte hervorheben.
            </Alert>
            <Alert type="danger" title="Küche: 28% unter Plan (−CHF 45'817)">
              Bei CHF 117'933 vs. CHF 163'750 Budget fehlen ca. 2'300 Hauptgerichte (bei Ø CHF 20.16). Dies deutet auf zu wenige Gäste hin, nicht auf ein Preisproblem. Empfehlung: Marketing verstärken, Mittagsgeschäft ausbauen, Events und Gruppenreservierungen fördern.
            </Alert>
            <Alert type="warning" title="Bier: 1% Umsatzanteil ist ungewöhnlich tief">
              207 Bier in einem Monat für ein gehobenes Restaurant — das sind nur 7 pro Tag. Ø Preis CHF 8.12 ist marktgerecht, aber die geringe Nachfrage deutet auf fehlendes Angebot oder mangelnde Sichtbarkeit hin. Craft-Bier-Selektion oder Bier-Pairing könnten den Anteil verdoppeln.
            </Alert>
          </Section>
        </>
      )}

      {/* ═══════════ COGS TAB ═══════════ */}
      {tab === "cogs" && (
        <>
          <Section title="Warenkosten: Ist vs. Budget-Ziel">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              <KPI label="Gesamte COGS" value={fmt(totalCOGS)} sub={pct(totalCOGS / revActual * 100) + " vom Umsatz"} good />
              <KPI label="Budget-Ziel" value="26.4%" sub="COGS-Quote laut Plan" />
              <KPI label="Differenz" value="+1.1%" sub="Besser als budgetiert" good />
              <KPI label="Rohertrag" value={fmt(totalGross)} sub={pct(pnl.grossMarginPct) + " Bruttomarge"} good />
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={catWithMetrics} margin={{ left: 10, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#CCC", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8899AA", fontSize: 10 }} tickFormatter={v => v + "%"} domain={[0, 40]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cogsBudgetPct" name="Budget COGS %" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="cogsActPct" name="Ist COGS %" radius={[4, 4, 0, 0]} barSize={20}>
                  {catWithMetrics.map((c, i) => (
                    <Cell key={i} fill={c.cogsVar > 2 ? "#E94560" : c.cogsVar > 0 ? "#F6B93B" : "#78E08F"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#78E08F" }}>● Unter Budget (gut)</span>
              <span style={{ fontSize: 11, color: "#F6B93B" }}>● Leicht drüber</span>
              <span style={{ fontSize: 11, color: "#E94560" }}>● Deutlich drüber</span>
            </div>
          </Section>

          <Section title="Detailtabelle: Warenkosten je Kategorie">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 550 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    {["Kategorie", "Umsatz", "COGS", "COGS %", "Budget %", "Abw.", "Rohertrag", "Marge"].map(h => (
                      <th key={h} style={{ textAlign: h === "Kategorie" ? "left" : "right", padding: "6px 8px", color: "#8899AA", fontSize: 10, letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catWithMetrics.map(c => (
                    <tr key={c.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: c.color, marginRight: 6 }} />
                        {c.name}
                      </td>
                      <td style={{ textAlign: "right", padding: "6px 8px", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(c.actual)}</td>
                      <td style={{ textAlign: "right", padding: "6px 8px", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(c.cogs)}</td>
                      <td style={{ textAlign: "right", padding: "6px 8px", fontWeight: 600, color: c.cogsVar > 2 ? "#E94560" : c.cogsVar > 0 ? "#F6B93B" : "#78E08F", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{pct(c.cogsActPct)}</td>
                      <td style={{ textAlign: "right", padding: "6px 8px", color: "#8899AA", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{pct(c.cogsBudgetPct)}</td>
                      <td style={{ textAlign: "right", padding: "6px 8px", color: c.cogsVar > 0 ? "#E94560" : "#78E08F", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{c.cogsVar > 0 ? "+" : ""}{pct(c.cogsVar)}</td>
                      <td style={{ textAlign: "right", padding: "6px 8px", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(c.grossProfit)}</td>
                      <td style={{ textAlign: "right", padding: "6px 8px", color: "#78E08F", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{pct(c.grossMargin)}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "2px solid rgba(255,255,255,0.15)" }}>
                    <td style={{ padding: "8px", fontWeight: 700 }}>Total</td>
                    <td style={{ textAlign: "right", padding: "8px", fontWeight: 700, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(revActual)}</td>
                    <td style={{ textAlign: "right", padding: "8px", fontWeight: 700, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(totalCOGS)}</td>
                    <td style={{ textAlign: "right", padding: "8px", fontWeight: 700, color: "#78E08F", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{pct(totalCOGS / revActual * 100)}</td>
                    <td style={{ textAlign: "right", padding: "8px", color: "#8899AA", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>26.4%</td>
                    <td style={{ textAlign: "right", padding: "8px", color: "#78E08F", fontWeight: 700, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>−1.1%</td>
                    <td style={{ textAlign: "right", padding: "8px", fontWeight: 700, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{fmt(totalGross)}</td>
                    <td style={{ textAlign: "right", padding: "8px", color: "#78E08F", fontWeight: 700, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{pct(pnl.grossMarginPct)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Lieferantenanalyse: Küche (grösster Posten)">
            <div style={{ fontSize: 12, color: "#CCCCCC", lineHeight: 1.7 }}>
              <p style={{ marginBottom: 10 }}>Die Küche macht 76.5% der gesamten Warenkosten aus (CHF 33'743 von CHF 44'079). Wichtigste Lieferanten im Juni:</p>
              {[
                { name: "MARINELLO + CO AG", amount: "CHF 8'193", note: "Grösster Einzellieferant" },
                { name: "Angst AG Zürich", amount: "CHF 8'394", note: "Zweiter Grosslieferant" },
                { name: "G. Bianchi AG", amount: "CHF 5'203", note: "Italienische Spezialitäten" },
                { name: "Augustus GmbH", amount: "CHF 2'532", note: "Spezialprodukte" },
                { name: "Luma Beef AG", amount: "CHF 2'419", note: "Premium-Fleisch" },
                { name: "Hugo Dubno AG", amount: "CHF 2'119", note: "Metzgereiprodukte" },
                { name: "Chäs&Co", amount: "CHF 3'022", note: "Käsehandel (2 Rechnungen)" },
                { name: "Landolt Weine AG", amount: "CHF 5'796", note: "Wein-Hauptlieferant" },
              ].map(s => (
                <div key={s.name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span>{s.name} <span style={{ color: "#8899AA", fontSize: 11 }}>— {s.note}</span></span>
                  <span style={{ fontFamily: "'Space Mono', monospace", color: "#F6B93B", fontSize: 11 }}>{s.amount}</span>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ═══════════ P&L TAB ═══════════ */}
      {tab === "pnl" && (
        <>
          <Section title="Geschätzte Erfolgsrechnung Juni 2026">
            <Alert type="danger" title="Geschätzter Monatsverlust: CHF −37'670">
              Bei gleichbleibenden Fixkosten (Personal, Miete, Betriebskosten laut Budget) und dem tatsächlichen Umsatz von CHF 173'888 ergibt sich ein deutlich negatives Ergebnis. Der Break-Even liegt bei ca. CHF 210'000 Monatsumsatz.
            </Alert>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", maxWidth: 600, borderCollapse: "collapse", fontSize: 13 }}>
                {[
                  { label: "Umsatz (brutto, inkl. MwSt.)", value: pnl.revenue, pct: 100, bold: true, bg: false },
                  { label: "Warenkosten", value: -pnl.cogs, pct: -(pnl.cogs / pnl.revenue * 100), bold: false },
                  { label: "Rohertrag (Bruttogewinn)", value: pnl.grossProfit, pct: pnl.grossMarginPct, bold: true, line: true },
                  { label: "Personalkosten (Budget)", value: -pnl.personnel, pct: -(pnl.personnel / pnl.revenue * 100), bold: false, alert: true },
                  { label: "Betriebskosten (Budget)", value: -pnl.betriebskosten, pct: -(pnl.betriebskosten / pnl.revenue * 100), bold: false },
                  { label: "Betriebsergebnis 1", value: pnl.betriebsergebnis, pct: (pnl.betriebsergebnis / pnl.revenue * 100), bold: true, line: true },
                  { label: "Miete", value: -pnl.miete, pct: -(pnl.miete / pnl.revenue * 100), bold: false },
                  { label: "Unterhalt", value: -pnl.unterhalt, pct: -(pnl.unterhalt / pnl.revenue * 100), bold: false },
                  { label: "EBITDA", value: pnl.ebitda, pct: (pnl.ebitda / pnl.revenue * 100), bold: true, line: true, alert: pnl.ebitda < 0 },
                  { label: "Abschreibungen", value: -pnl.abschreibung, pct: -(pnl.abschreibung / pnl.revenue * 100), bold: false },
                  { label: "Ergebnis nach Steuern", value: pnl.netResult, pct: (pnl.netResult / pnl.revenue * 100), bold: true, line: true, alert: pnl.netResult < 0 },
                ].map((row, i) => (
                  <tr key={i} style={{
                    borderTop: row.line ? "2px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.04)",
                    background: row.bold ? "rgba(255,255,255,0.03)" : "transparent",
                  }}>
                    <td style={{ padding: "8px 12px", fontWeight: row.bold ? 700 : 400, color: row.alert ? "#E94560" : "#FFFFFF" }}>{row.label}</td>
                    <td style={{ textAlign: "right", padding: "8px 12px", fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: row.bold ? 700 : 400, color: row.value < 0 ? (row.alert ? "#E94560" : "#CCCCCC") : row.alert ? "#E94560" : "#FFFFFF" }}>
                      {row.value < 0 ? "−" : ""}{fmt(Math.abs(row.value))}
                    </td>
                    <td style={{ textAlign: "right", padding: "8px 12px", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#8899AA" }}>
                      {row.pct < 0 ? "−" : ""}{Math.abs(row.pct).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </Section>

          <Section title="Kostenstruktur-Vergleich: Ist vs. Budget">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: "Warenkosten", budget: 26.4, ist: 25.3, label: "COGS" },
                { name: "Personal", budget: 35.6, ist: 56.5, label: "Staff" },
                { name: "Betriebsk.", budget: 14.0, ist: 19.8, label: "OpEx" },
                { name: "Miete/UH", budget: 12.4, ist: 17.4, label: "Rent" },
              ]} margin={{ left: 10, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#CCC", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8899AA", fontSize: 10 }} tickFormatter={v => v + "%"} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget" name="Budget %" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="ist" name="Ist % (v. Umsatz)" radius={[4, 4, 0, 0]} barSize={24}>
                  {[
                    { v: 25.3, b: 26.4 }, { v: 56.5, b: 35.6 }, { v: 19.8, b: 14.0 }, { v: 17.4, b: 12.4 },
                  ].map((c, i) => <Cell key={i} fill={c.v > c.b * 1.1 ? "#E94560" : c.v <= c.b ? "#78E08F" : "#F6B93B"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Break-Even Analyse">
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 13, color: "#CCC", lineHeight: 1.7 }}>
                <p><strong style={{ color: "#FFF" }}>Fixkosten (monatlich):</strong> Personal CHF 98'208 + Betriebskosten CHF 34'449 + Miete CHF 21'322 + Unterhalt CHF 9'000 + AfA CHF 4'500 = <strong style={{ color: "#F6B93B" }}>CHF 167'479</strong></p>
                <p><strong style={{ color: "#FFF" }}>Variable Kosten:</strong> COGS bei 25.3% → Deckungsbeitrag = 74.7%</p>
                <p><strong style={{ color: "#FFF" }}>Break-Even Umsatz:</strong> CHF 167'479 / 0.747 = <strong style={{ color: "#E94560" }}>CHF 224'201 / Monat</strong></p>
                <p><strong style={{ color: "#FFF" }}>Aktueller Umsatz:</strong> CHF 173'888 → <strong style={{ color: "#E94560" }}>CHF 50'313 unter Break-Even</strong></p>
                <p style={{ marginTop: 8 }}>Bei Ø CHF 151 pro Quittung benötigt Capri mindestens <strong style={{ color: "#F6B93B" }}>~1'485 Quittungen/Monat</strong> (vs. aktuell 1'148) oder eine Erhöhung des Ø-Bons auf <strong style={{ color: "#F6B93B" }}>~CHF 195</strong>.</p>
              </div>
            </div>
          </Section>
        </>
      )}

      {/* ═══════════ RECOMMENDATIONS TAB ═══════════ */}
      {tab === "recs" && (
        <>
          <Section title="Umsatzsteigerung — Sofortmassnahmen">
            <Rec nr="R1" title="Weinverkauf aktiv fördern (grösster Hebel: +CHF 20K/Mt.)" impact="Hoch" effort="Mittel">
              Der Weinumsatz liegt 48% unter Plan — das sind CHF 25'854 pro Monat. Dabei ist die Weinmarge hervorragend (73.5% Bruttomarge). <strong>Konkret:</strong> (1) Sommelier-Empfehlung auf jeder Menüseite, (2) Weinbegleitung zum 3-Gang-Menü für CHF 39/49 anbieten, (3) "Wein des Monats" am Tisch proaktiv vorstellen, (4) Offene Weine von 4 auf 8+ Positionen erweitern. Ziel: 30% mehr Weinverkäufe = +CHF 8'500/Mt.
            </Rec>
            <Rec nr="R2" title="Bier-Programm lancieren (Quick Win)" impact="Mittel" effort="Niedrig">
              Nur 207 Bier/Monat (7/Tag) bei 1% Umsatzanteil. Zum Vergleich: Industriestandard für gehobene Restaurants ist 5–8%. <strong>Konkret:</strong> (1) 3–4 Schweizer Craft-Biere ins Sortiment (z.B. Chopfab, Bier Factory, Feldschlösschen Spezial), (2) Bier-Pairing zum Menü anbieten (z.B. "Bier statt Wein" Option), (3) Aperitif-Bier auf der Getränkekarte sichtbar platzieren, (4) Bier vom Fass einführen (Marge steigt, COGS sinkt von 31% auf ~15%). Ziel: Verdreifachung auf 600 Bier/Mt. = +CHF 3'200/Mt. bei besserer Marge.
            </Rec>
            <Rec nr="R3" title="Gästefrequenz erhöhen (Mittagsgeschäft)" impact="Hoch" effort="Hoch">
              Mit 38 Quittungen/Tag fehlen ca. 12 Quittungen/Tag zum Break-Even. <strong>Konkret:</strong> (1) Business-Lunch-Angebot (2 Gänge CHF 39, 3 Gänge CHF 49), (2) Partnerschaften mit umliegenden Firmen an der Dufourstrasse, (3) Aleno-Reservierungssystem für Mittagstisch optimieren, (4) Google Business & TripAdvisor aktiv bewirtschaften. Ziel: +10 Covers/Tag = +CHF 30'000–40'000/Mt.
            </Rec>
            <Rec nr="R4" title="Spirituosen & Cocktails ausbauen" impact="Mittel" effort="Mittel">
              Spirituosen haben die beste Marge aller Kategorien (85.8%!) bei CHF 10'000 Umsatz. <strong>Konkret:</strong> (1) Signature Cocktails entwickeln (3–4 Stück), (2) Digestif-Empfehlung am Tischende aktiv anbieten, (3) Aperitivo-Angebot (17–19 Uhr) mit Negroni/Spritz. Potenzial: +CHF 3'000–5'000/Mt.
            </Rec>
          </Section>

          <Section title="Kostensenkung — Sofortmassnahmen">
            <Rec nr="K1" title="Küche-COGS von 28.6% auf 26.5% senken" impact="Mittel" effort="Mittel">
              Die Küche liegt 2.1 Prozentpunkte über dem Budget-Ziel. Bei CHF 117'933 Umsatz sind das CHF 2'476 zu viel. <strong>Konkret:</strong> (1) Tägliche Wareneinsatzkontrolle via CookpIT einführen, (2) Portionsgrössen standardisieren und wiegen, (3) Menu Engineering: margenstarke Gerichte prominent platzieren, (4) Saisonale Anpassung — teure Zutaten (Luma Beef CHF 2'419, Chäs&Co CHF 3'022) durch saisonale Alternativen ergänzen.
            </Rec>
            <Rec nr="K2" title="Bier-Wareneinsatz korrigieren (31% → 18%)" impact="Niedrig" effort="Niedrig">
              COGS 31.1% vs. Budget 18.4% — fast doppelt so hoch. Bei 207 Stück ist der absolute Betrag gering (CHF 214 Differenz), aber bei Wachstum relevant. <strong>Konkret:</strong> (1) Einkaufspreise prüfen (Stardrinks AG CHF 129 für Bier scheint hoch pro Lieferung), (2) Biersortiment auf margenstarke Positionen fokussieren, (3) Fassbierbezug statt Flaschen.
            </Rec>
            <Rec nr="K3" title="Personalplanung flexibilisieren" impact="Hoch" effort="Hoch">
              Bei 56.5% Personalquote (statt 35.6%) ist dies der grösste Kostenhebel. <strong>Konkret:</strong> (1) Schichtplanung an tatsächliches Gästeaufkommen anpassen, (2) Kurzarbeit oder Stundenreduktion für schwache Tage prüfen, (3) Teilzeitkräfte statt Festanstellungen für Randzeiten, (4) Admin-Kosten (CHF 18'297/Mt.) kritisch hinterfragen.
            </Rec>
            <Rec nr="K4" title="Offeriert/Gratis-Abgaben kontrollieren" impact="Niedrig" effort="Niedrig">
              Im Juni wurden Gratis-Abgaben (UMB Offeriert) von CHF 554 verbucht (Wein CHF 242, Küche CHF 273, Bier/Spirits/etc.). <strong>Konkret:</strong> Klare Policy für Offeriert-Mengen definieren, monatliches Budget setzen, Genehmigungsprozess einführen.
            </Rec>
          </Section>

          <Section title="Menu-Engineering: Empfehlungen">
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF", marginBottom: 10 }}>Getränkekarte optimieren</div>
              <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.7 }}>
                <p>Die aktuelle Umsatzverteilung (Küche 67.8%, Getränke 32.2%) zeigt Potenzial bei Getränken. Branchenstandard für gehobene Gastronomie ist 35–45% Getränkeanteil.</p>
                <p style={{ marginTop: 8 }}><strong style={{ color: "#78E08F" }}>Stars (hohe Marge + hoher Umsatz):</strong> Spirituosen (85.8% Marge) — aktiv empfehlen und ausbauen</p>
                <p><strong style={{ color: "#F6B93B" }}>Puzzles (hohe Marge, tiefer Umsatz):</strong> Kaffee (90.2% Marge, nur 2% Anteil) — Kaffeekarte überarbeiten, Spezialitäten einführen</p>
                <p><strong style={{ color: "#E94560" }}>Problemfälle:</strong> Bier (68.9% Marge bei 31% COGS, nur 1% Anteil) — Sortiment und Einkauf komplett überarbeiten</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF", marginBottom: 10 }}>Menükarte: Pricing-Analyse</div>
              <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.7 }}>
                <p>Ø CHF 20.16 pro Küchenposition deutet auf ein Mix aus Vorspeisen und Hauptgerichten hin. Um den Küchenumsatz zu steigern:</p>
                <p style={{ marginTop: 8 }}>(1) <strong style={{ color: "#FFF" }}>Tasting-Menü einführen:</strong> 5-Gang für CHF 89–119 steigert den Bon-Wert und bindet Weinbegleitung ein</p>
                <p>(2) <strong style={{ color: "#FFF" }}>Sharing-Konzept:</strong> Teilbare Vorspeisen (3–4 Stück) erhöhen die Bestellmenge pro Tisch</p>
                <p>(3) <strong style={{ color: "#FFF" }}>Dessert-Push:</strong> Proaktive Dessertempfehlung durch Service-Personal — steigert Bon um CHF 12–18</p>
                <p>(4) <strong style={{ color: "#FFF" }}>Premium-Positionen:</strong> 2–3 Signature Dishes mit höherem Preis (CHF 45–55) und starker Marge platzieren</p>
              </div>
            </div>
          </Section>

          <Section title="Prioritätenmatrix">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 500 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                    {["Massnahme", "Umsatz-Impact", "Kosten-Impact", "Aufwand", "Zeitrahmen"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px", color: "#8899AA", fontSize: 10, letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { m: "Weinverkauf fördern", rev: "+CHF 8.5K/Mt.", cost: "—", eff: "●●○", time: "Sofort" },
                    { m: "Bier-Sortiment", rev: "+CHF 3.2K/Mt.", cost: "−CHF 200", eff: "●○○", time: "2 Wochen" },
                    { m: "Business-Lunch", rev: "+CHF 30K/Mt.", cost: "—", eff: "●●●", time: "4–6 Wochen" },
                    { m: "Cocktail/Aperitivo", rev: "+CHF 4K/Mt.", cost: "—", eff: "●●○", time: "2–3 Wochen" },
                    { m: "Küche-COGS senken", rev: "—", cost: "−CHF 2.5K/Mt.", eff: "●●○", time: "Sofort" },
                    { m: "Personalplanung", rev: "—", cost: "−CHF 10–15K/Mt.", eff: "●●●", time: "1–2 Monate" },
                    { m: "Offeriert begrenzen", rev: "—", cost: "−CHF 500/Mt.", eff: "●○○", time: "Sofort" },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "8px", fontWeight: 600, color: "#FFF" }}>{r.m}</td>
                      <td style={{ padding: "8px", color: "#78E08F", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{r.rev}</td>
                      <td style={{ padding: "8px", color: "#38ADA9", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{r.cost}</td>
                      <td style={{ padding: "8px" }}>{r.eff}</td>
                      <td style={{ padding: "8px", color: "#F6B93B", fontSize: 11 }}>{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}

      <div style={{ marginTop: 32, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#555", textAlign: "center" }}>
        Capri AG · Dufourstrasse 80 · 8008 Zürich · Analyse basierend auf Lightspeed Sales Report, F&B Kontoauszug & Budget 2026 · Juli 2026
      </div>
    </div>
  );
}
