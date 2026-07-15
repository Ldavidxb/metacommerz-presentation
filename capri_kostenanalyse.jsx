import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Area, AreaChart, ComposedChart } from "recharts";

const COLORS = [
  "#1a1a2e", "#16213e", "#0f3460", "#e94560", "#533483",
  "#2b6777", "#c8d8e4", "#f6b93b", "#e55039", "#4a69bd",
  "#78e08f", "#fa983a", "#eb2f06", "#1e3799", "#3c6382",
  "#38ada9", "#b71540", "#079992", "#e58e26", "#0c2461"
];

const ACCENT_COLORS = [
  "#e94560", "#f6b93b", "#38ada9", "#4a69bd", "#78e08f",
  "#fa983a", "#533483", "#2b6777", "#eb2f06", "#1e3799",
  "#b71540", "#079992", "#e58e26", "#0c2461", "#3c6382",
  "#16213e", "#c8d8e4", "#0f3460", "#e55039", "#1a1a2e"
];

// Monthly data extracted from the Kontoauszug
const monthlyData = [
  {
    monat: "Dez 24",
    "Sachversicherungen": 0,
    "Patent/Abgaben": 1170.45,
    "Elektrizität/Gas": 0,
    "Nebenkosten": 0,
    "Reinigung/Wäsche": 0,
    "Fremdreinigung": 0,
    "Reinigungsmaterial": 0,
    "Betriebsmaterial": 0,
    "Büromaterial": 0,
    "Betr.mat. Restauration": 0,
    "Werbung": 0,
    "KK Kommissionen": 0,
    "Buchhaltung": 0,
    "Telefon": 0,
    "Blumen/Dekoration": 0,
    "IT Lizenzen": 0,
    "Unterhalt/Reparatur": 0,
    "Mietzins": 63672,
    "Zinsaufwand": 0,
    "Abschreibung": 0,
  },
  {
    monat: "Jan 25",
    "Sachversicherungen": 0,
    "Patent/Abgaben": 0,
    "Elektrizität/Gas": 0,
    "Nebenkosten": 0,
    "Reinigung/Wäsche": 0,
    "Fremdreinigung": 0,
    "Reinigungsmaterial": 0,
    "Betriebsmaterial": 0,
    "Büromaterial": 0,
    "Betr.mat. Restauration": 0,
    "Werbung": 0,
    "KK Kommissionen": 0,
    "Buchhaltung": 0,
    "Telefon": 0,
    "Blumen/Dekoration": 0,
    "IT Lizenzen": 0,
    "Unterhalt/Reparatur": 0,
    "Mietzins": 15918,
    "Zinsaufwand": 0,
    "Abschreibung": 0,
  },
  {
    monat: "Feb 25",
    "Sachversicherungen": 0,
    "Patent/Abgaben": 0,
    "Elektrizität/Gas": 0,
    "Nebenkosten": 0,
    "Reinigung/Wäsche": 0,
    "Fremdreinigung": 0,
    "Reinigungsmaterial": 568,
    "Betriebsmaterial": 0,
    "Büromaterial": 0,
    "Betr.mat. Restauration": 0,
    "Werbung": 0,
    "KK Kommissionen": 0,
    "Buchhaltung": 0,
    "Telefon": 0,
    "Blumen/Dekoration": 0,
    "IT Lizenzen": 0,
    "Unterhalt/Reparatur": 0,
    "Mietzins": 15568,
    "Zinsaufwand": 794.25,
    "Abschreibung": 0,
  },
  {
    monat: "Mär 25",
    "Sachversicherungen": 0,
    "Patent/Abgaben": 0,
    "Elektrizität/Gas": 0,
    "Nebenkosten": 0,
    "Reinigung/Wäsche": 0,
    "Fremdreinigung": 0,
    "Reinigungsmaterial": 0,
    "Betriebsmaterial": 1073,
    "Büromaterial": 166.31,
    "Betr.mat. Restauration": 0,
    "Werbung": 0,
    "KK Kommissionen": 0,
    "Buchhaltung": 0,
    "Telefon": 209.16,
    "Blumen/Dekoration": 0,
    "IT Lizenzen": 0,
    "Unterhalt/Reparatur": 0,
    "Mietzins": 15918,
    "Zinsaufwand": 1254.35,
    "Abschreibung": 0,
  },
  {
    monat: "Apr 25",
    "Sachversicherungen": 0,
    "Patent/Abgaben": 221,
    "Elektrizität/Gas": 732.01,
    "Nebenkosten": 4544,
    "Reinigung/Wäsche": 0,
    "Fremdreinigung": 1469.98,
    "Reinigungsmaterial": 921.6,
    "Betriebsmaterial": 828.15,
    "Büromaterial": 828.15,
    "Betr.mat. Restauration": 0,
    "Werbung": 8950.36,
    "KK Kommissionen": 0,
    "Buchhaltung": 4500,
    "Telefon": 209.16,
    "Blumen/Dekoration": 0,
    "IT Lizenzen": 0,
    "Unterhalt/Reparatur": 437.75,
    "Mietzins": 15918,
    "Zinsaufwand": 2672.3,
    "Abschreibung": 0,
  },
  {
    monat: "Mai 25",
    "Sachversicherungen": 3102,
    "Patent/Abgaben": 0,
    "Elektrizität/Gas": 2453.28,
    "Nebenkosten": 568,
    "Reinigung/Wäsche": 8280.61,
    "Fremdreinigung": 1926.92,
    "Reinigungsmaterial": 2815,
    "Betriebsmaterial": 4975,
    "Büromaterial": 1439.45,
    "Betr.mat. Restauration": 3293.24,
    "Werbung": 1181.75,
    "KK Kommissionen": 1742.39,
    "Buchhaltung": 4500,
    "Telefon": 406.01,
    "Blumen/Dekoration": 935.68,
    "IT Lizenzen": 2346.81,
    "Unterhalt/Reparatur": 5373,
    "Mietzins": 15918,
    "Zinsaufwand": 3281.75,
    "Abschreibung": 13333.35,
  },
  {
    monat: "Jun 25",
    "Sachversicherungen": 387.75,
    "Patent/Abgaben": 0,
    "Elektrizität/Gas": 3060.69,
    "Nebenkosten": 568,
    "Reinigung/Wäsche": 1956.4,
    "Fremdreinigung": 3430.16,
    "Reinigungsmaterial": 371.88,
    "Betriebsmaterial": 7132,
    "Büromaterial": 600.37,
    "Betr.mat. Restauration": 2098.07,
    "Werbung": 3700,
    "KK Kommissionen": 3093,
    "Buchhaltung": 4500,
    "Telefon": 567.02,
    "Blumen/Dekoration": 1233.21,
    "IT Lizenzen": 1362.09,
    "Unterhalt/Reparatur": 1530.67,
    "Mietzins": 15918,
    "Zinsaufwand": 3613.35,
    "Abschreibung": 13333.35,
  },
  {
    monat: "Jul 25",
    "Sachversicherungen": 387.75,
    "Patent/Abgaben": 0,
    "Elektrizität/Gas": 2977.24,
    "Nebenkosten": 568,
    "Reinigung/Wäsche": 4004.1,
    "Fremdreinigung": 3430.16,
    "Reinigungsmaterial": 1348.29,
    "Betriebsmaterial": 1590,
    "Büromaterial": 614.34,
    "Betr.mat. Restauration": 696.95,
    "Werbung": 540.62,
    "KK Kommissionen": 4329,
    "Buchhaltung": 17159.99,
    "Telefon": 537.47,
    "Blumen/Dekoration": 467.84,
    "IT Lizenzen": 841.89,
    "Unterhalt/Reparatur": 1249.17,
    "Mietzins": 15918,
    "Zinsaufwand": 4040.35,
    "Abschreibung": 13333.35,
  },
  {
    monat: "Aug 25",
    "Sachversicherungen": 387.75,
    "Patent/Abgaben": 91.2,
    "Elektrizität/Gas": 2888.53,
    "Nebenkosten": 568,
    "Reinigung/Wäsche": 3881.05,
    "Fremdreinigung": 3457,
    "Reinigungsmaterial": 123.6,
    "Betriebsmaterial": 2100,
    "Büromaterial": 68.09,
    "Betr.mat. Restauration": 583.21,
    "Werbung": 2030.02,
    "KK Kommissionen": 3572,
    "Buchhaltung": 4500,
    "Telefon": 216.47,
    "Blumen/Dekoration": 561.89,
    "IT Lizenzen": 791.83,
    "Unterhalt/Reparatur": 0,
    "Mietzins": 15350,
    "Zinsaufwand": 4041.5,
    "Abschreibung": 13333.35,
  },
  {
    monat: "Sep 25",
    "Sachversicherungen": 387.75,
    "Patent/Abgaben": 0,
    "Elektrizität/Gas": 3113.65,
    "Nebenkosten": 525.44,
    "Reinigung/Wäsche": 4702.45,
    "Fremdreinigung": 3430.16,
    "Reinigungsmaterial": 0,
    "Betriebsmaterial": 3020,
    "Büromaterial": 531.33,
    "Betr.mat. Restauration": 367.13,
    "Werbung": 2030.02,
    "KK Kommissionen": 3388,
    "Buchhaltung": 3959.99,
    "Telefon": 755.73,
    "Blumen/Dekoration": 1309.01,
    "IT Lizenzen": 750.76,
    "Unterhalt/Reparatur": 7261.56,
    "Mietzins": 15350,
    "Zinsaufwand": 3913.9,
    "Abschreibung": 13333.35,
  },
  {
    monat: "Okt 25",
    "Sachversicherungen": 387.75,
    "Patent/Abgaben": 94,
    "Elektrizität/Gas": 2819.61,
    "Nebenkosten": 1136,
    "Reinigung/Wäsche": 4690.18,
    "Fremdreinigung": 2958.37,
    "Reinigungsmaterial": 743.99,
    "Betriebsmaterial": 2950,
    "Büromaterial": 0,
    "Betr.mat. Restauration": 1560.59,
    "Werbung": 0,
    "KK Kommissionen": 3410,
    "Buchhaltung": 3600,
    "Telefon": 216.6,
    "Blumen/Dekoration": 584.8,
    "IT Lizenzen": 951.27,
    "Unterhalt/Reparatur": 6130.63,
    "Mietzins": 15350,
    "Zinsaufwand": 4044.6,
    "Abschreibung": 13333.35,
  },
  {
    monat: "Nov 25",
    "Sachversicherungen": 387.75,
    "Patent/Abgaben": 94,
    "Elektrizität/Gas": 2649.03,
    "Nebenkosten": 1136,
    "Reinigung/Wäsche": 5444.35,
    "Fremdreinigung": 2909.81,
    "Reinigungsmaterial": 92.52,
    "Betriebsmaterial": 4580,
    "Büromaterial": 233.63,
    "Betr.mat. Restauration": 676.13,
    "Werbung": 4430,
    "KK Kommissionen": 3055,
    "Buchhaltung": 10980.02,
    "Telefon": 236.47,
    "Blumen/Dekoration": 2347.06,
    "IT Lizenzen": 843.18,
    "Unterhalt/Reparatur": 2492.92,
    "Mietzins": 15350,
    "Zinsaufwand": 3914.1,
    "Abschreibung": 13333.35,
  },
  {
    monat: "Dez 25",
    "Sachversicherungen": 387.75,
    "Patent/Abgaben": 94,
    "Elektrizität/Gas": 5986.59,
    "Nebenkosten": 568,
    "Reinigung/Wäsche": 5977.45,
    "Fremdreinigung": 1980.57,
    "Reinigungsmaterial": 0,
    "Betriebsmaterial": 1820,
    "Büromaterial": 0,
    "Betr.mat. Restauration": 617.25,
    "Werbung": 2250,
    "KK Kommissionen": 2591,
    "Buchhaltung": 4080.02,
    "Telefon": 216.47,
    "Blumen/Dekoration": 350.88,
    "IT Lizenzen": 2356.7,
    "Unterhalt/Reparatur": 2326.57,
    "Mietzins": 16918,
    "Zinsaufwand": 4044.6,
    "Abschreibung": 13333.35,
  },
];

// Category totals for pie chart
const categoryTotals = [
  { name: "Mietzins", value: 122800, konto: "7350" },
  { name: "Abschreibung", value: 106666.80, konto: "7900" },
  { name: "Buchhaltung", value: 37320.03, konto: "6071" },
  { name: "Zinsaufwand", value: 35615.05, konto: "7850" },
  { name: "Reinigung/Wäsche", value: 32864.09, konto: "6020" },
  { name: "Werbung", value: 28284.73, konto: "6041" },
  { name: "Betriebsmaterial", value: 25191.64, konto: "6031" },
  { name: "Elektrizität/Gas", value: 25162.08, konto: "6011" },
  { name: "Fremdreinigung", value: 23523.11, konto: "6021" },
  { name: "KK Kommissionen", value: 23195.84, konto: "6044" },
  { name: "Unterhalt/Reparatur", value: 21846.42, konto: "7000/7020" },
  { name: "IT Lizenzen", value: 10716.19, konto: "7040" },
  { name: "Betr.mat. Restauration", value: 9948.23, konto: "6035" },
  { name: "Nebenkosten", value: 9045.44, konto: "6015" },
  { name: "Blumen/Dekoration", value: 8270.92, konto: "6081" },
  { name: "Verkaufsförderung", value: 7961.75, konto: "6042/60420" },
  { name: "Kleininventar", value: 7281.31, konto: "7140" },
  { name: "Reinigungsmaterial", value: 6798.18, konto: "6022" },
  { name: "Büromaterial", value: 6298.78, konto: "6032" },
  { name: "Entsorgung", value: 5440.27, konto: "6025" },
  { name: "Werbedrucksachen", value: 5116.55, konto: "6047" },
  { name: "Telefon", value: 3564.96, konto: "6075" },
  { name: "Sachversicherungen", value: 3102, konto: "6001" },
  { name: "Patent/Abgaben", value: 1670.65, konto: "6002" },
  { name: "Übrige", value: 3458.89, konto: "div." },
];

const topCosts = [
  { kategorie: "Mietzins (7350)", betrag: 122800, anteil: 22.3, trend: "stabil", einsparung: "mittel" },
  { kategorie: "Abschreibung (7900)", betrag: 106666.80, anteil: 19.4, trend: "stabil", einsparung: "gering" },
  { kategorie: "Buchhaltung (6071)", betrag: 37320.03, anteil: 6.8, trend: "steigend", einsparung: "hoch" },
  { kategorie: "Zinsaufwand (7850)", betrag: 35615.05, anteil: 6.5, trend: "stabil", einsparung: "mittel" },
  { kategorie: "Reinigung/Wäsche (6020)", betrag: 32864.09, anteil: 6.0, trend: "steigend", einsparung: "hoch" },
  { kategorie: "Werbung (6041)", betrag: 28284.73, anteil: 5.1, trend: "schwankend", einsparung: "hoch" },
  { kategorie: "Betriebsmaterial (6031)", betrag: 25191.64, anteil: 4.6, trend: "steigend", einsparung: "mittel" },
  { kategorie: "Elektrizität/Gas (6011)", betrag: 25162.08, anteil: 4.6, trend: "steigend", einsparung: "mittel" },
  { kategorie: "Fremdreinigung (6021)", betrag: 23523.11, anteil: 4.3, trend: "stabil", einsparung: "hoch" },
  { kategorie: "KK Kommissionen (6044)", betrag: 23195.84, anteil: 4.2, trend: "steigend", einsparung: "mittel" },
];

const empfehlungen = [
  {
    bereich: "Reinigung Gesamt (6020 + 6021)",
    kosten: "CHF 56'387",
    potenzial: "CHF 8'000 – 12'000",
    icon: "🧹",
    prioritaet: "Hoch",
    massnahmen: [
      "Wäscherei Samstagern: Konditionen neu verhandeln oder Alternativofferten einholen – Rechnungen steigen monatlich kontinuierlich an",
      "Fair4all GmbH: Monatliche Pauschale von ca. CHF 3'430 hinterfragen – Reinigungsumfang prüfen und ggf. reduzieren",
      "Inhouse-Reinigung für Teile des Betriebs evaluieren vs. Vollauslagerung",
    ],
  },
  {
    bereich: "Buchhaltung Honorare (6071)",
    kosten: "CHF 37'320",
    potenzial: "CHF 10'000 – 15'000",
    icon: "📊",
    prioritaet: "Hoch",
    massnahmen: [
      "TESMAG-Rechnungen zeigen grosse Schwankungen (CHF 3'960 bis CHF 17'160) – Leistungsumfang standardisieren",
      "Monatliche Transaktionspauschale mit Buchhaltungsbüro verhandeln statt Stundenabrechnung",
      "Automatisierung der Buchhaltungsprozesse (z.B. beleglose Verbuchung, API-Anbindung an Kassensystem)",
    ],
  },
  {
    bereich: "Werbung & Verkaufsförderung (6041/6042)",
    kosten: "CHF 36'247",
    potenzial: "CHF 5'000 – 8'000",
    icon: "📣",
    prioritaet: "Mittel",
    massnahmen: [
      "Fanny Eisl Honorare (Total ca. CHF 21'160): Leistungsvertrag mit klaren KPIs und messbarem ROI definieren",
      "Florian Kalotay (2x CHF 2'030): Kosten-Nutzen-Analyse der Kampagnen durchführen",
      "Verkaufsförderung 0% (Offeriert-Posten CHF 5'786): Gratis-Abgaben systematisch tracken und limitieren",
    ],
  },
  {
    bereich: "Betriebsmaterial (6031 + 6035)",
    kosten: "CHF 35'140",
    potenzial: "CHF 4'000 – 6'000",
    icon: "📦",
    prioritaet: "Mittel",
    massnahmen: [
      "Viele Kleineinkäufe bei Coop, Migros, Galaxus, Temu – Sammelbestellungen über einen Hauptlieferanten bündeln",
      "Sinnesdüfte AG: Zwei Rechnungen à CHF 3'737 und CHF 2'997 – Duftkonzept überprüfen, günstigere Alternativen testen",
      "E. Weber & Cie: Zahlreiche Kleinbestellungen konsolidieren für Mengenrabatte",
    ],
  },
  {
    bereich: "Elektrizität & Gas (6011)",
    kosten: "CHF 25'162",
    potenzial: "CHF 3'000 – 5'000",
    icon: "⚡",
    prioritaet: "Mittel",
    massnahmen: [
      "Energieverbrauch zeigt starken Anstieg von CHF 2'453 (Mai) auf CHF 5'987 (Dez) – Energieaudit durchführen",
      "Energie 360 Grad AG Rechnung Dez: CHF 1'787 – Gasliefervertrag überprüfen und ggf. Anbieter wechseln",
      "LED-Beleuchtung, intelligente Thermostate und Standby-Management einführen",
    ],
  },
  {
    bereich: "KK Kommissionen (6044)",
    kosten: "CHF 23'196",
    potenzial: "CHF 3'000 – 5'000",
    icon: "💳",
    prioritaet: "Mittel",
    massnahmen: [
      "Lightspeed Payments Kommissionen: Alternative Zahlungsabwickler vergleichen (SumUp, Worldline)",
      "Gebührenstruktur mit Lightspeed neu verhandeln bei steigendem Transaktionsvolumen",
      "Barzahlungsanteil leicht erhöhen durch Anreize (z.B. Treuekarte)",
    ],
  },
  {
    bereich: "IT Lizenzen (7040)",
    kosten: "CHF 10'716",
    potenzial: "CHF 1'500 – 2'500",
    icon: "💻",
    prioritaet: "Niedrig",
    massnahmen: [
      "CookpIT AG (CHF 4'150 + monatl. Splitt): Nutzung evaluieren – wird das System voll ausgeschöpft?",
      "Lightspeed monatliche Gebühren (CHF 147/Mt.): Jahresabo für Rabatt prüfen",
      "aleno AG (CHF 250-598/Mt.): Tarif überprüfen und ggf. auf günstigeren Plan wechseln",
    ],
  },
  {
    bereich: "Blumen & Dekoration (6081)",
    kosten: "CHF 8'271",
    potenzial: "CHF 2'000 – 3'000",
    icon: "🌸",
    prioritaet: "Niedrig",
    massnahmen: [
      "Martin Grossenbacher monatliche Abos: Lieferfrequenz reduzieren oder saisonale Arrangements wählen",
      "Temu-Dekoeinkäufe (CHF 841 + CHF 259): Auf langlebige Dekoelemente umstellen statt häufige Neuanschaffungen",
      "Budget für Dekoration festlegen und monatlich überwachen",
    ],
  },
];

const formatCHF = (val) => {
  if (val === undefined || val === null) return "CHF 0";
  return `CHF ${val.toLocaleString("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a1a2e",
        border: "1px solid #2a2a4e",
        borderRadius: 8,
        padding: "12px 16px",
        color: "#e0e0e0",
        fontSize: 12,
        maxHeight: 300,
        overflowY: "auto"
      }}>
        <p style={{ fontWeight: 700, marginBottom: 8, color: "#f6b93b" }}>{label}</p>
        {payload
          .filter(p => p.value > 0)
          .sort((a, b) => b.value - a.value)
          .map((p, i) => (
            <p key={i} style={{ margin: "3px 0", display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ color: p.color }}>● {p.name}</span>
              <span style={{ fontWeight: 600 }}>{formatCHF(p.value)}</span>
            </p>
          ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div style={{
        background: "#1a1a2e",
        border: "1px solid #2a2a4e",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#e0e0e0",
        fontSize: 12,
      }}>
        <p style={{ fontWeight: 700, color: "#f6b93b" }}>{d.name}</p>
        <p>{formatCHF(d.value)}</p>
        <p>{(d.payload.percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("uebersicht");
  const [showAllPie, setShowAllPie] = useState(false);

  const totalKosten = useMemo(() => categoryTotals.reduce((s, c) => s + c.value, 0), []);

  const pieData = useMemo(() => {
    if (showAllPie) return categoryTotals;
    const top10 = categoryTotals.slice(0, 10);
    const rest = categoryTotals.slice(10).reduce((s, c) => s + c.value, 0);
    return [...top10, { name: "Übrige", value: rest, konto: "div." }];
  }, [showAllPie]);

  const monthlyTotals = useMemo(() => {
    return monthlyData.map(m => {
      const total = Object.entries(m)
        .filter(([k]) => k !== "monat")
        .reduce((s, [, v]) => s + v, 0);
      return { monat: m.monat, total };
    });
  }, []);

  const operativeMonthly = useMemo(() => {
    return monthlyData.map(m => ({
      monat: m.monat,
      "Reinigung": (m["Reinigung/Wäsche"] || 0) + (m["Fremdreinigung"] || 0),
      "Energie": m["Elektrizität/Gas"] || 0,
      "Material": (m["Betriebsmaterial"] || 0) + (m["Betr.mat. Restauration"] || 0),
      "Werbung": m["Werbung"] || 0,
      "IT & Telefon": (m["IT Lizenzen"] || 0) + (m["Telefon"] || 0),
    }));
  }, []);

  const tabs = [
    { id: "uebersicht", label: "Übersicht" },
    { id: "details", label: "Monatsverlauf" },
    { id: "empfehlungen", label: "Einsparungen" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "linear-gradient(135deg, #0a0a1a 0%, #12122e 50%, #0a0a1a 100%)",
      color: "#e0e0e0",
      minHeight: "100vh",
      padding: "24px 20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 28,
          fontWeight: 700,
          background: "linear-gradient(135deg, #f6b93b, #e94560)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 6,
          letterSpacing: "-0.5px",
        }}>
          CAPRI AG — Betriebskostenanalyse
        </h1>
        <p style={{ color: "#888", fontSize: 14, fontFamily: "'Space Mono', monospace" }}>
          Geschäftsjahr 2025 · Dufourstrasse 80, 8008 Zürich
        </p>
      </div>

      {/* KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}>
        {[
          { label: "Gesamtkosten", value: formatCHF(totalKosten), color: "#e94560" },
          { label: "Ø Monatlich", value: formatCHF(totalKosten / 13), color: "#f6b93b" },
          { label: "Grösster Posten", value: "Mietzins", sub: formatCHF(122800), color: "#38ada9" },
          { label: "Einspar­potenzial", value: "CHF 37K–57K", color: "#78e08f" },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "18px 20px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: 3, height: "100%",
              background: kpi.color,
            }} />
            <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color: kpi.color, fontFamily: "'Space Mono', monospace" }}>
              {kpi.value}
            </p>
            {kpi.sub && <p style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 4,
        marginBottom: 24,
        background: "rgba(255,255,255,0.03)",
        borderRadius: 10,
        padding: 4,
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
              background: activeTab === tab.id ? "rgba(233,69,96,0.15)" : "transparent",
              color: activeTab === tab.id ? "#e94560" : "#888",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ÜBERSICHT */}
      {activeTab === "uebersicht" && (
        <div>
          {/* Pie + Top Kosten */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f6b93b" }}>Kostenverteilung</h3>
                <button
                  onClick={() => setShowAllPie(!showAllPie)}
                  style={{
                    background: "rgba(246,185,59,0.1)", border: "1px solid rgba(246,185,59,0.3)",
                    color: "#f6b93b", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {showAllPie ? "Top 10" : "Alle zeigen"}
                </button>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData.map(d => ({ ...d, percent: d.value / totalKosten }))}
                    cx="50%" cy="50%"
                    innerRadius={65} outerRadius={130}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={ACCENT_COLORS[i % ACCENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 20,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f6b93b", marginBottom: 14 }}>Top 10 Kostenkategorien</h3>
              <div style={{ fontSize: 12 }}>
                {topCosts.map((c, i) => {
                  const maxBetrag = topCosts[0].betrag;
                  const pct = (c.betrag / maxBetrag) * 100;
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ color: "#ccc", fontWeight: 500 }}>{c.kategorie}</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 600, color: "#f6b93b" }}>
                          {formatCHF(c.betrag)}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3,
                          overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${ACCENT_COLORS[i]}, ${ACCENT_COLORS[(i+1) % ACCENT_COLORS.length]})`,
                            borderRadius: 3,
                            transition: "width 0.8s ease",
                          }} />
                        </div>
                        <span style={{
                          fontSize: 10,
                          padding: "1px 6px",
                          borderRadius: 4,
                          background: c.einsparung === "hoch" ? "rgba(233,69,96,0.15)" : c.einsparung === "mittel" ? "rgba(246,185,59,0.15)" : "rgba(120,224,143,0.15)",
                          color: c.einsparung === "hoch" ? "#e94560" : c.einsparung === "mittel" ? "#f6b93b" : "#78e08f",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}>
                          {c.anteil}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monthly Total Bar Chart */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 20,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f6b93b", marginBottom: 16 }}>
              Gesamtkosten pro Monat
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={monthlyTotals}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="monat" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, color: "#e0e0e0", fontSize: 12 }}
                  formatter={(v) => [formatCHF(v), "Total"]}
                />
                <Bar dataKey="total" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="total" stroke="#e94560" strokeWidth={2} dot={false} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f6b93b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#e94560" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MONATSVERLAUF */}
      {activeTab === "details" && (
        <div>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 20,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f6b93b", marginBottom: 16 }}>
              Operative Kosten im Monatsverlauf
            </h3>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={operativeMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="monat" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#aaa" }} />
                <Area type="monotone" dataKey="Reinigung" stackId="1" fill="#e94560" stroke="#e94560" fillOpacity={0.4} />
                <Area type="monotone" dataKey="Energie" stackId="1" fill="#f6b93b" stroke="#f6b93b" fillOpacity={0.4} />
                <Area type="monotone" dataKey="Material" stackId="1" fill="#38ada9" stroke="#38ada9" fillOpacity={0.4} />
                <Area type="monotone" dataKey="Werbung" stackId="1" fill="#4a69bd" stroke="#4a69bd" fillOpacity={0.4} />
                <Area type="monotone" dataKey="IT & Telefon" stackId="1" fill="#78e08f" stroke="#78e08f" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stacked bar for fixed costs */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 20,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f6b93b", marginBottom: 16 }}>
              Fixkosten im Monatsverlauf
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="monat" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#aaa" }} />
                <Bar dataKey="Mietzins" stackId="a" fill="#533483" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Abschreibung" stackId="a" fill="#2b6777" />
                <Bar dataKey="Zinsaufwand" stackId="a" fill="#e94560" />
                <Bar dataKey="Buchhaltung" stackId="a" fill="#f6b93b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line chart for key variable costs */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 20,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f6b93b", marginBottom: 16 }}>
              Schlüsselkategorien – Trendanalyse
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData.slice(4)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="monat" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#aaa" }} />
                <Line type="monotone" dataKey="Reinigung/Wäsche" stroke="#e94560" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Elektrizität/Gas" stroke="#f6b93b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="KK Kommissionen" stroke="#38ada9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Werbung" stroke="#4a69bd" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Fremdreinigung" stroke="#78e08f" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* EMPFEHLUNGEN */}
      {activeTab === "empfehlungen" && (
        <div>
          <div style={{
            background: "linear-gradient(135deg, rgba(233,69,96,0.08), rgba(246,185,59,0.08))",
            border: "1px solid rgba(233,69,96,0.2)",
            borderRadius: 14,
            padding: 20,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f6b93b", marginBottom: 8 }}>
              💡 Zusammenfassung Einsparpotenzial
            </h3>
            <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>
              Basierend auf der Analyse des Kontoauszugs für das Geschäftsjahr 2025 wurden <strong style={{ color: "#e94560" }}>8 Bereiche</strong> mit
              einem geschätzten Gesamteinsparpotenzial von <strong style={{ color: "#78e08f" }}>CHF 37'000 – 57'000</strong> identifiziert.
              Die Empfehlungen sind nach Priorität und Umsetzbarkeit geordnet.
            </p>
          </div>

          {empfehlungen.map((e, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 20,
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, width: 4, height: "100%",
                background: e.prioritaet === "Hoch" ? "#e94560" : e.prioritaet === "Mittel" ? "#f6b93b" : "#38ada9",
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#eee", marginBottom: 4 }}>
                    {e.icon} {e.bereich}
                  </h4>
                  <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                    <span style={{ color: "#888" }}>Ist-Kosten: <strong style={{ color: "#e94560" }}>{e.kosten}</strong></span>
                    <span style={{ color: "#888" }}>Potenzial: <strong style={{ color: "#78e08f" }}>{e.potenzial}</strong></span>
                  </div>
                </div>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: e.prioritaet === "Hoch" ? "rgba(233,69,96,0.15)" : e.prioritaet === "Mittel" ? "rgba(246,185,59,0.15)" : "rgba(56,173,169,0.15)",
                  color: e.prioritaet === "Hoch" ? "#e94560" : e.prioritaet === "Mittel" ? "#f6b93b" : "#38ada9",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}>
                  {e.prioritaet}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, lineHeight: 1.8, color: "#bbb" }}>
                {e.massnahmen.map((m, j) => (
                  <li key={j} style={{ marginBottom: 4 }}>{m}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Summary Table */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 20,
            marginTop: 24,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f6b93b", marginBottom: 16 }}>
              Einsparpotenzial nach Priorität
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={empfehlungen.map(e => ({
                  name: e.bereich.split("(")[0].trim(),
                  min: parseInt(e.potenzial.match(/[\d']+/g)[0].replace("'", "")),
                  max: parseInt(e.potenzial.match(/[\d']+/g)[1].replace("'", "")),
                  prioritaet: e.prioritaet,
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={v => `${v}K`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#aaa", fontSize: 10 }} width={140} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, color: "#e0e0e0", fontSize: 12 }}
                  formatter={(v, n) => [`CHF ${v}'000`, n === "min" ? "Min." : "Max."]}
                />
                <Bar dataKey="min" fill="#38ada9" radius={[0, 4, 4, 0]} name="Min. Einsparung" />
                <Bar dataKey="max" fill="#e94560" radius={[0, 4, 4, 0]} name="Max. Einsparung" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: "center",
        marginTop: 32,
        padding: "16px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontSize: 11,
        color: "#555",
        fontFamily: "'Space Mono', monospace",
      }}>
        Capri AG · Kontoauszug Dez 2024 – Abschluss 2025 · Analyse erstellt am 10.02.2026
      </div>
    </div>
  );
}
