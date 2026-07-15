import { useState } from "react";

const C = {
  bg: "#0B0B1A", card: "rgba(255,255,255,0.035)", border: "rgba(255,255,255,0.07)",
  accent: "#E94560", gold: "#F6B93B", teal: "#38ADA9", green: "#78E08F",
  blue: "#4A69BD", purple: "#533483", orange: "#FA983A",
  text: "#FFFFFF", sub: "#8899AA", muted: "#555566",
};

const Badge = ({ color, children }) => (
  <span style={{ background: color, color: "#FFF", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: 0.5 }}>{children}</span>
);

const PromoCard = ({ icon, title, when, target, items, revenue, margin, color }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
      <div>
        <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{title}</div>
        <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{when}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: C.sub }}>Ziel-Kundschaft</div>
        <div style={{ fontSize: 12, color: color, fontWeight: 600 }}>{target}</div>
      </div>
    </div>
    <div style={{ marginBottom: 12 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}>
          <span style={{ color: color, fontWeight: 700, fontSize: 12, minWidth: 18 }}>{i + 1}.</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{item.name}</div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{item.detail}</div>
          </div>
          {item.price && <div style={{ fontSize: 11, color: C.gold, fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>{item.price}</div>}
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ fontSize: 11 }}><span style={{ color: C.sub }}>Umsatzpotenzial: </span><span style={{ color: C.green, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{revenue}</span></div>
      <div style={{ fontSize: 11 }}><span style={{ color: C.sub }}>Erw. Marge: </span><span style={{ color: C.teal, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{margin}</span></div>
    </div>
  </div>
);

const ShiftBlock = ({ label, hours, crew, color, tasks }) => (
  <div style={{ flex: 1, minWidth: 160, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
    <div style={{ fontSize: 11, color: color, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{hours}</div>
    <div style={{ fontSize: 18, color, fontWeight: 700, fontFamily: "'Space Mono', monospace", margin: "6px 0" }}>{crew}</div>
    <div style={{ fontSize: 10, color: C.sub }}>
      {tasks.map((t, i) => <div key={i} style={{ padding: "2px 0" }}>· {t}</div>)}
    </div>
  </div>
);

const tabs = [
  { id: "bev", label: "Getränke-Promos" },
  { id: "food", label: "Food-Promos" },
  { id: "workforce", label: "Workforce" },
  { id: "summary", label: "Übersicht" },
];

export default function App() {
  const [tab, setTab] = useState("bev");

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.bg} 0%, #12122e 50%, ${C.bg} 100%)`, color: C.text, fontFamily: "'DM Sans', sans-serif", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.accent, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>CAPRI AG · STRATEGIEPLAN</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "4px 0 0" }}>Promo-Konzepte & Workforce-Optimierung</h1>
        <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>Detaillierte Massnahmen für Umsatzsteigerung und Kostenkontrolle</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? C.accent : "rgba(255,255,255,0.05)", border: "none",
            color: tab === t.id ? "#FFF" : C.sub, padding: "8px 16px", borderRadius: 6,
            cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══════════ BEVERAGES TAB ═══════════ */}
      {tab === "bev" && (
        <>
          <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Bier-Programm</h2>
            <p style={{ fontSize: 12, color: C.sub, margin: "4px 0 0" }}>Aktuell: 1% Umsatzanteil (CHF 1'680/Mt.) · Ziel: 5% (CHF 8'700/Mt.)</p>
          </div>

          <PromoCard
            icon="🍺" title="Craft Beer Flight" when="Täglich, ganztags" target="Bier-Interessierte, Paare"
            color={C.gold}
            items={[
              { name: "3er Degustations-Flight", detail: "3 × 1.5 dl Schweizer Craft-Biere (z.B. Chopfab Bleifrei, Bier Factory IPA, Feldschlösschen 1876) auf Holzbrett mit Beschreibungskarte", price: "CHF 18" },
              { name: "Bier zum Menü", detail: "Service bietet Bier als Alternative zur Weinbegleitung an — besonders zu Fleisch- und Pastagang. Karte zeigt 'Bier-Empfehlung' neben Wein", price: "CHF 8–12/Glas" },
              { name: "Bier vom Fass einführen", detail: "1–2 Zapfhähne (z.B. Chopfab, lokale Brauerei). COGS sinkt von 31% auf ~15%. Investition ~CHF 2'000 einmalig, ROI in 3 Monaten", price: "CHF 7–9/3dl" },
              { name: "Weekend Bier & Burger Special", detail: "Sa/So Mittag: Handmade Burger + Craft-Bier-Kombi. Spricht jüngeres Publikum an, füllt schwachen Samstag-Lunch", price: "CHF 32" },
            ]}
            revenue="+CHF 5'000–7'000/Mt." margin="75–85%"
          />

          <div style={{ borderLeft: `3px solid ${C.purple}`, paddingLeft: 12, marginBottom: 20, marginTop: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Wein-Programm</h2>
            <p style={{ fontSize: 12, color: C.sub, margin: "4px 0 0" }}>Aktuell: 16.2% (CHF 28'146) · Budget: CHF 54'000 · Marge: 73.5% — grösster Hebel!</p>
          </div>

          <PromoCard
            icon="🍷" title="Weinbegleitung & By-the-Glass" when="Lunch & Dinner" target="Feinschmecker, Geschäftsessen"
            color={C.purple}
            items={[
              { name: "3-Gang Weinbegleitung", detail: "Kuratiert vom Sommelier: 3 × 1 dl passend zum Menü. Auf Menükarte prominent als eigene Zeile pro Gang", price: "CHF 39" },
              { name: "5-Gang Weinbegleitung Premium", detail: "Für Tasting-Menü. Inkl. Aperitif-Glas und Dessertwein. Ermöglicht Verkauf hochwertiger Positionen glas-weise", price: "CHF 69" },
              { name: "Wein-Mittwoch", detail: "Mittwochs: Alle offenen Weine −20% (z.B. CHF 12 statt CHF 15). Zieht Stammgäste an schwachem Wochentag. Weinumsatz steigt trotz Rabatt durch Volumen", price: "−20% offen" },
              { name: "Weekend Discovery Glass", detail: "Fr/Sa: 1 Premium-Wein (normalerweise nur flaschenweise) als 'Entdeckerglas' für CHF 16–22. Erzeugt Gesprächsstoff und Flaschennachfrage", price: "CHF 16–22" },
              { name: "Service-Schulung: Proaktive Empfehlung", detail: "Jeder Gast bekommt eine Weinempfehlung beim Servieren. 'Dazu passt unser XY hervorragend' — erwiesenermassen +25% Weinbestellungen", price: "—" },
            ]}
            revenue="+CHF 8'000–15'000/Mt." margin="73–78%"
          />

          <div style={{ borderLeft: `3px solid ${C.blue}`, paddingLeft: 12, marginBottom: 20, marginTop: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Cocktails & Spirituosen</h2>
            <p style={{ fontSize: 12, color: C.sub, margin: "4px 0 0" }}>Aktuell: 5.8% (CHF 10'000) · Marge: 85.8% — beste Marge aller Kategorien!</p>
          </div>

          <PromoCard
            icon="🍸" title="Aperitivo Hour & Signature Cocktails" when="17:00–19:00 täglich + ganztags" target="After-Work, Pre-Dinner Gäste"
            color={C.blue}
            items={[
              { name: "Aperitivo Hour (17–19 Uhr)", detail: "Negroni, Aperol Spritz, Hugo für CHF 14 statt CHF 18 inkl. Oliven/Grissini. Füllt leere Stunde zwischen Lunch und Dinner, generiert Dinner-Reservierungen", price: "CHF 14" },
              { name: "4 Signature Cocktails", detail: "Capri-branded: z.B. 'Dufour Sour' (Whiskey Sour Variation), 'Seefeld Spritz' (Prosecco/Elderflower), 'Capri Negroni' (mit CH Gin), 'Limmat Mule'. Auf separater Cocktailkarte", price: "CHF 18–22" },
              { name: "Digestif-Push am Tischende", detail: "Service bietet nach dem Dessert aktiv Grappa/Amaro/Limoncello an. 'Darf ich Ihnen zum Abschluss einen Digestif empfehlen?' — erwiesen +15% Spirituosenverkauf", price: "CHF 12–16" },
              { name: "Weekend Late-Night Cocktails", detail: "Fr/Sa ab 21:30: Cocktailkarte mit DJ/Lounge-Musik. Verlängert den Abend, generiert Zusatzumsatz ohne Küchenkosten", price: "CHF 18–22" },
            ]}
            revenue="+CHF 4'000–6'000/Mt." margin="82–88%"
          />

          <div style={{ borderLeft: `3px solid ${C.teal}`, paddingLeft: 12, marginBottom: 20, marginTop: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Alkoholfreie Getränke & Kaffee</h2>
            <p style={{ fontSize: 12, color: C.sub, margin: "4px 0 0" }}>Aktuell: Mineral 7.1% + Kaffee 2.0% · Kaffee-Marge: 90.2%</p>
          </div>

          <PromoCard
            icon="🫧" title="Premium Non-Alcoholic Program" when="Ganztags" target="Nicht-Trinker, Health-Conscious, Fahrer"
            color={C.teal}
            items={[
              { name: "3 Signature Mocktails", detail: "Gleiche Präsentation wie Cocktails (Coupette, Garnish). z.B. 'Seedling Spritz' (Elderflower/Tonic/Cucumber), 'Capri Sunrise' (Passionfruit/Ginger/Lime). COGS ~CHF 1.50", price: "CHF 14–16" },
              { name: "Alkoholfreie Weinbegleitung", detail: "Zum Tasting-Menü: 3 alkoholfreie Pairing-Getränke (Kombucha, Shrub, Tee-Infusion). Trend-Thema, spricht neue Zielgruppe an", price: "CHF 29" },
              { name: "House Lemonade / Iced Tea", detail: "Hausgemacht mit saisonalen Zutaten (Basilikum-Zitrone, Pfirsich-Rosmarin). Karaffe für 2 Personen. Extrem hohe Marge (COGS ~CHF 0.80)", price: "CHF 9/Glas, CHF 22/Karaffe" },
              { name: "Caffè Speciale Nachmittags-Push", detail: "14–17 Uhr: Specialty Coffee (Flat White, Cortado, Cold Brew) + Mini-Dessert Kombi. Füllt totes Nachmittagsloch", price: "CHF 12–15" },
            ]}
            revenue="+CHF 2'000–3'500/Mt." margin="85–92%"
          />
        </>
      )}

      {/* ═══════════ FOOD TAB ═══════════ */}
      {tab === "food" && (
        <>
          <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Mittagsgeschäft (Mo–Fr)</h2>
            <p style={{ fontSize: 12, color: C.sub, margin: "4px 0 0" }}>Grösster Hebel: +10 Covers/Tag = +CHF 30'000/Mt. · Dufourstrasse = Büroquartier</p>
          </div>

          <PromoCard
            icon="☀️" title="Business Lunch Programm" when="Mo–Fr, 11:30–14:00" target="Büro-Angestellte, Geschäftsessen"
            color={C.accent}
            items={[
              { name: "Express-Lunch (2 Gänge)", detail: "Vorspeise + Hauptgang oder Hauptgang + Dessert. Wechselt wöchentlich. Serviert in max. 45 Min. Garantie auf der Karte vermerken — Geschäftsleute brauchen Planbarkeit", price: "CHF 35" },
              { name: "Business-Lunch (3 Gänge)", detail: "Vorspeise + Hauptgang + Dessert/Kaffee. Menü wechselt täglich, 2 Optionen pro Gang (Fleisch/Fisch + Vegi). Kommunikation: Weekly Newsletter an Firmen-Mailingliste", price: "CHF 45" },
              { name: "Sharing Antipasti Lunch", detail: "Für 2–4 Personen: Platte mit 5–6 italienischen Vorspeisen zum Teilen + Focaccia. Ideal für informelle Meetings. Hohe Marge da Zutaten flexibel wählbar", price: "CHF 28/Person" },
              { name: "Firmenpartnerschaften Dufourstrasse", detail: "Anschreiben/Flyer an 10–15 Firmen im Umkreis 300m. Angebot: 10er-Karte Business Lunch mit 10% Rabatt (CHF 315 statt 350). Bindet Stammkunden, planbare Auslastung", price: "10er-Karte CHF 315" },
            ]}
            revenue="+CHF 20'000–35'000/Mt." margin="68–72%"
          />

          <PromoCard
            icon="🌅" title="Abend-Specials & Upselling" when="Mo–So, 18:00–22:00" target="Paare, Gruppen, Stammgäste"
            color={C.purple}
            items={[
              { name: "Tasting-Menü (5 Gänge)", detail: "Signature-Erlebnis: 5 Gänge vom Küchenchef mit optionaler Weinbegleitung. Auf der Karte als 'Empfehlung des Hauses' hervorheben. Höchster Bon-Wert pro Gast", price: "CHF 89 (+ WHF CHF 49)" },
              { name: "Tasting-Menü Premium (7 Gänge)", detail: "Für besondere Anlässe: 7 Gänge inkl. Amuse-Bouche und Petit Fours. Weinbegleitung Premium. Positionierung als 'Capri Experience'", price: "CHF 129 (+ WHF CHF 79)" },
              { name: "Proaktives Dessert-Upselling", detail: "Service zeigt Dessertwagen oder -karte UNGEFRAGT nach dem Hauptgang. Studien zeigen: Wenn aktiv gefragt, bestellen 40% ein Dessert vs. 15% wenn nicht gefragt. Bei Ø CHF 15/Dessert = +CHF 4'500/Mt.", price: "Ø CHF 15" },
              { name: "Pre-Theater / Early Bird", detail: "Mo–Do 18:00–19:00: 3-Gang-Menü zum Spezialpreis. Füllt den frühen Abend, Tisch wird bis 20:00 frei für zweite Sitzung", price: "CHF 49" },
            ]}
            revenue="+CHF 8'000–15'000/Mt." margin="70–75%"
          />

          <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: 12, marginBottom: 20, marginTop: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Wochenend-Programm (Sa & So)</h2>
            <p style={{ fontSize: 12, color: C.sub, margin: "4px 0 0" }}>Samstag-Lunch und Sonntag sind typische Schwachstellen — hier gezielt aktivieren</p>
          </div>

          <PromoCard
            icon="🥂" title="Samstag-Specials" when="Samstag ganztags" target="Familien, Freundesgruppen, Touristen"
            color={C.gold}
            items={[
              { name: "Saturday Brunch (11:00–14:30)", detail: "Italienisch inspiriert: Frittata, Focaccia, Burrata, Prosciutto, Granola, frische Säfte. Inkl. 1 Prosecco oder frisch gepresster OJ. Brunch ist ein starker Samstag-Magnet in Zürich", price: "CHF 45/Person" },
              { name: "Aperitivo Platte + Prosecco", detail: "Ab 16:00: Sharing-Antipasti für 2 mit Flasche Prosecco. Zieht Pre-Dinner-Gäste an, viele bleiben zum Essen", price: "CHF 59 für 2" },
              { name: "Samstag Live-Cooking / Chef's Table", detail: "1× monatlich: Offene Küche, 6-Gang-Menü mit Küchenchef-Erklärung. Max. 12 Gäste. Exklusiv-Erlebnis, starke Social-Media-Inhalte. COGS gleich, aber Preis +60%", price: "CHF 149/Person" },
            ]}
            revenue="+CHF 6'000–10'000/Mt." margin="65–72%"
          />

          <PromoCard
            icon="🌿" title="Sonntag-Programm" when="Sonntag 11:00–21:00" target="Familien, Spaziergänger, Langschläfer"
            color={C.green}
            items={[
              { name: "Sonntagsbraten / Pranzo della Domenica", detail: "Traditionelles Sonntagsmenü: Klassiker wie Ossobuco, Brasato, oder Arrosto mit saisonalem Gemüse. Familienformat: Platte in der Tischmitte. Nostalgie-Faktor + Margin-stark (Schmorgerichte = günstige Cuts)", price: "CHF 38/Person" },
              { name: "Sonntags-Family-Deal", detail: "Familien (2 Erw. + Kinder): Kinder essen 50% Rabatt auf Kinderteller. Positionierung: 'La Famiglia — Sonntags bei Capri'. Kindergerichte haben ~80% Marge", price: "Kinder 50%" },
              { name: "Sonntag Caffè & Dolci (14–17 Uhr)", detail: "Nachmittags-Angebot: Auswahl an hausgemachten Dolci + Caffè Speciale. Füllt Nachmittagsloch, kein zusätzliches Küchenpersonal nötig (Patisserie-Vorbereitung morgens)", price: "CHF 16" },
              { name: "Sonntagabend: Pasta-Spezial", detail: "Reduziertes Abendangebot: 4 frische Pasta-Variationen + Antipasti. Weniger Mise-en-place nötig → tiefere Personalkosten am Sonntagabend. Hohe Marge (Pasta COGS ~18%)", price: "CHF 26–32" },
            ]}
            revenue="+CHF 4'000–8'000/Mt." margin="72–78%"
          />
        </>
      )}

      {/* ═══════════ WORKFORCE TAB ═══════════ */}
      {tab === "workforce" && (
        <>
          <div style={{ background: "rgba(233,69,96,0.08)", border: "1px solid rgba(233,69,96,0.2)", borderRadius: 10, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>Kernproblem: Personalquote 56.5% statt 35.6%</div>
            <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.6 }}>
              Bei CHF 173'888 Umsatz und geschätzten CHF 98'208 Personalkosten liegt die Quote dramatisch über dem Budget-Ziel. Die Fixkosten-Struktur (Admin CHF 18'297, Küche CHF 44'941, Service CHF 23'563, Sozialkosten CHF 10'522 = CHF 97'323) ist auf CHF 250'000 Umsatz dimensioniert. Ziel: Flexible Anpassung an tatsächliches Volumen, ohne Qualität zu verlieren.
            </div>
          </div>

          <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Schichtmodell: Montag–Donnerstag (Low Days)</h2>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>KÜCHE</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <ShiftBlock label="Prep / Mise" hours="07:00–11:00" crew="2 Köche" color={C.teal}
              tasks={["Mise-en-place Lunch", "Saucen, Fonds", "Teigwaren frisch"]} />
            <ShiftBlock label="Lunch Service" hours="11:00–14:30" crew="3 Köche" color={C.gold}
              tasks={["Küchenchef + 2 CDP", "Reduzierte Karte: 6 Positionen", "Business-Lunch-Fokus"]} />
            <ShiftBlock label="Pause / Prep" hours="14:30–17:30" crew="1 Koch" color={C.sub}
              tasks={["Dinner Mise-en-place", "Bestellungen, Warenkontrolle", "Dessert-Vorbereitung"]} />
            <ShiftBlock label="Dinner Service" hours="17:30–22:30" crew="3–4 Köche" color={C.accent}
              tasks={["Vollbesetzung ab 18:00", "Küchenchef + 2–3 CDP", "Volle Abendkarte"]} />
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>SERVICE</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <ShiftBlock label="Lunch Service" hours="11:00–14:30" crew="2 Service" color={C.gold}
              tasks={["1 Chef de Rang + 1 Commis", "Max. 30 Covers", "Gedecke vereinfachen"]} />
            <ShiftBlock label="Aperitivo" hours="17:00–18:30" crew="1 Barkeeper" color={C.blue}
              tasks={["Bar & Aperitivo-Gäste", "Setup Dinner-Tische", "Vorbereitungen"]} />
            <ShiftBlock label="Dinner Service" hours="18:00–23:00" crew="3–4 Service" color={C.accent}
              tasks={["Chef de Service + 2–3 Rang", "Weinempfehlung aktiv", "Dessert/Digestif-Push"]} />
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Einsparung Mo–Do: Split-Shift-Modell</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Bereich", "Aktuell (geschätzt)", "Optimiert", "Einsparung/Tag"].map(h => (
                    <th key={h} style={{ textAlign: h === "Bereich" ? "left" : "right", padding: "6px 8px", color: C.sub, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { area: "Küche", curr: "4 FTE × 10h", opt: "2–4 gestaffelt", save: "CHF 280" },
                  { area: "Service", curr: "3 FTE × 9h", opt: "1–4 gestaffelt", save: "CHF 210" },
                  { area: "Admin", curr: "1 FTE × 8.5h", opt: "1 FTE (unverändert)", save: "—" },
                ].map(r => (
                  <tr key={r.area} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px", fontWeight: 600 }}>{r.area}</td>
                    <td style={{ textAlign: "right", padding: "8px", color: C.sub }}>{r.curr}</td>
                    <td style={{ textAlign: "right", padding: "8px", color: C.teal }}>{r.opt}</td>
                    <td style={{ textAlign: "right", padding: "8px", color: C.green, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{r.save}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: `2px solid rgba(255,255,255,0.15)` }}>
                  <td style={{ padding: "8px", fontWeight: 700 }}>Total Mo–Do</td>
                  <td colSpan={2}></td>
                  <td style={{ textAlign: "right", padding: "8px", color: C.green, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>CHF 490/Tag</td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 8 }}>× 17 Tage/Monat (Mo–Do) = <span style={{ color: C.green, fontWeight: 700 }}>CHF 8'330/Monat Einsparung</span></div>
          </div>

          <div style={{ borderLeft: `3px solid ${C.orange}`, paddingLeft: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Schichtmodell: Freitag & Samstag (Peak Days)</h2>
          </div>

          <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.6, marginBottom: 16 }}>
            Fr/Sa sind Umsatz-Tage — hier geht es um maximale Kapazität und Upselling, nicht um Sparen. Volle Besetzung mit Fokus auf Weinverkauf, Cocktails und Tasting-Menü.
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <ShiftBlock label="Prep" hours="08:00–11:00" crew="3 Köche" color={C.teal}
              tasks={["Weekend Mise-en-place", "Brunch-Prep (Sa)", "Spezialgerichte"]} />
            <ShiftBlock label="Lunch/Brunch" hours="11:00–15:00" crew="4 Küche + 3 Service" color={C.gold}
              tasks={["Sa: Brunch-Service", "Volle Kapazität", "Aperitivo-Vorbereitung"]} />
            <ShiftBlock label="Dinner" hours="17:30–23:30" crew="5 Küche + 4 Service" color={C.accent}
              tasks={["Vollbesetzung", "Tasting-Menü aktiv", "Late-Night-Cocktails Fr/Sa"]} />
          </div>

          <div style={{ borderLeft: `3px solid ${C.green}`, paddingLeft: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Schichtmodell: Sonntag (Smart Day)</h2>
          </div>

          <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.6, marginBottom: 16 }}>
            Sonntag ist ein Spezialfall: Potenzial für Familien-Lunch, aber tiefer Abend. Strategie: Starker Mittag mit reduziertem Abend (nur Pasta-Karte).
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <ShiftBlock label="Brunch/Lunch" hours="10:00–15:00" crew="3 Küche + 3 Service" color={C.gold}
              tasks={["Sonntagsbraten-Menü", "Family Service", "Caffè & Dolci ab 14h"]} />
            <ShiftBlock label="Abend (reduziert)" hours="18:00–21:00" crew="2 Küche + 2 Service" color={C.teal}
              tasks={["Nur Pasta-Karte (4 Gerichte)", "Antipasti & Desserts", "Früh schliessen (21:00)"]} />
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Sonntag-Einsparung: Reduzierter Abendbetrieb</div>
            <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.6 }}>
              <p>Statt Vollbesetzung (5 Küche + 4 Service) bis 22:30 → Nur 2+2 bis 21:00 mit reduzierter Pasta-Karte.</p>
              <p style={{ marginTop: 6 }}><strong style={{ color: C.gold }}>Einsparung:</strong> ~3 FTE × 4.5h = <strong style={{ color: C.green }}>CHF 540/Sonntag = CHF 2'160/Monat</strong></p>
              <p style={{ marginTop: 6 }}><strong style={{ color: C.gold }}>Kompensation:</strong> Pasta-Menü hat ~18% COGS (deutlich unter den 26.5% Küchenschnitt) → bessere Marge trotz weniger Umsatz.</p>
            </div>
          </div>

          <div style={{ borderLeft: `3px solid ${C.blue}`, paddingLeft: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Zusätzliche Workforce-Massnahmen</h2>
          </div>

          {[
            { title: "Aleno-Daten für Schichtplanung nutzen", detail: "Reservierungsdaten aus Aleno (bereits im Einsatz) als Grundlage für den täglichen Personalplan. 48h-Vorhersage: wenn weniger als 25 Reservierungen für Dinner → reduzierte Besetzung (−1 Koch, −1 Service). Spart CHF 180/Abend bei 4–5 schwachen Abenden/Monat = CHF 720–900.", color: C.blue },
            { title: "Cross-Training Service ↔ Bar", detail: "Service-Personal in Cocktail-Herstellung schulen. An ruhigen Abenden kann 1 Person Service + Bar abdecken, statt 2 separate Positionen. Investition: 2 Schulungstage. Einsparung: 1 FTE an 8 Abenden/Monat = CHF 1'200.", color: C.teal },
            { title: "Flexible Arbeitsverträge / Stundenlohn", detail: "Für 2–3 Positionen (Commis de Cuisine, Commis de Rang): Umstellung von Festanstellung auf Stundenlohn mit Mindest-/Maximalstunden. Ermöglicht Anpassung an Auslastung ohne Kündigungen. Wichtig: GAV-Konformität sicherstellen.", color: C.gold },
            { title: "Admin-Kosten überprüfen (CHF 18'297/Mt.)", detail: "Admin-Löhne machen 20% der Personalkosten aus — ungewöhnlich hoch für ein einzelnes Restaurant. Prüfen: Welche Admin-Funktionen können digitalisiert werden? Ist die Buchhaltung (TESMAG, CHF 3'792/Mt.) bereits eingerechnet oder on top? Ziel: Admin unter 15% der Personalkosten = Einsparung CHF 4'600/Mt.", color: C.accent },
          ].map((item, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.6 }}>{item.detail}</div>
            </div>
          ))}

          <div style={{ background: "rgba(120,224,143,0.08)", border: "1px solid rgba(120,224,143,0.2)", borderRadius: 10, padding: 16, marginTop: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 8 }}>Gesamtes Einsparpotenzial: Personal</div>
            <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>Split-Shift Mo–Do</span>
                <span style={{ color: C.green, fontFamily: "'Space Mono', monospace" }}>CHF 8'330/Mt.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>Sonntag reduzierter Abend</span>
                <span style={{ color: C.green, fontFamily: "'Space Mono', monospace" }}>CHF 2'160/Mt.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>Aleno-basierte Flex-Besetzung</span>
                <span style={{ color: C.green, fontFamily: "'Space Mono', monospace" }}>CHF 900/Mt.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>Cross-Training Service/Bar</span>
                <span style={{ color: C.green, fontFamily: "'Space Mono', monospace" }}>CHF 1'200/Mt.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>Admin-Optimierung (konservativ)</span>
                <span style={{ color: C.green, fontFamily: "'Space Mono', monospace" }}>CHF 2'000/Mt.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", borderTop: `2px solid rgba(120,224,143,0.3)`, marginTop: 4, fontWeight: 700, fontSize: 14 }}>
                <span style={{ color: C.text }}>TOTAL EINSPARUNG</span>
                <span style={{ color: C.green, fontFamily: "'Space Mono', monospace" }}>CHF 14'590/Mt.</span>
              </div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 6 }}>
                Neue Personalquote: ~48.1% (statt 56.5%) → noch über Ziel (35.6%), aber CHF 14.5K näher an Break-Even
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════ SUMMARY TAB ═══════════ */}
      {tab === "summary" && (
        <>
          <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Gesamtwirkung: Revenue + Cost Measures</h2>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Umsatzsteigerung — Monatliches Potenzial</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Massnahme", "Min.", "Max.", "Zeitrahmen", "Marge"].map(h => (
                    <th key={h} style={{ textAlign: h === "Massnahme" ? "left" : "right", padding: "6px 8px", color: C.sub, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { m: "Weinbegleitung & By-the-Glass", min: 8000, max: 15000, time: "Sofort", margin: "74%" },
                  { m: "Business Lunch (Mo–Fr)", min: 20000, max: 35000, time: "3–4 Wo.", margin: "70%" },
                  { m: "Craft Beer Programm", min: 5000, max: 7000, time: "2 Wo.", margin: "80%" },
                  { m: "Aperitivo & Cocktails", min: 4000, max: 6000, time: "2 Wo.", margin: "85%" },
                  { m: "Weekend Brunch/Specials", min: 6000, max: 10000, time: "3 Wo.", margin: "68%" },
                  { m: "Sonntags-Programm", min: 4000, max: 8000, time: "2 Wo.", margin: "75%" },
                  { m: "Dessert/Digestif Upselling", min: 3000, max: 6000, time: "Sofort", margin: "78%" },
                  { m: "Premium Mocktails & Kaffee", min: 2000, max: 3500, time: "1 Wo.", margin: "88%" },
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px", fontWeight: 600 }}>{r.m}</td>
                    <td style={{ textAlign: "right", padding: "8px", fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.teal }}>+{(r.min / 1000).toFixed(0)}K</td>
                    <td style={{ textAlign: "right", padding: "8px", fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.green }}>+{(r.max / 1000).toFixed(0)}K</td>
                    <td style={{ textAlign: "right", padding: "8px", color: C.gold, fontSize: 11 }}>{r.time}</td>
                    <td style={{ textAlign: "right", padding: "8px", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{r.margin}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: `2px solid rgba(255,255,255,0.15)`, background: "rgba(120,224,143,0.05)" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 700, fontSize: 13 }}>TOTAL UMSATZ-POTENZIAL</td>
                  <td style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700, color: C.teal, fontFamily: "'Space Mono', monospace" }}>+52K</td>
                  <td style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700, color: C.green, fontFamily: "'Space Mono', monospace" }}>+90.5K</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Kostensenkung — Monatliches Potenzial</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Massnahme", "Einsparung/Mt.", "Zeitrahmen"].map(h => (
                    <th key={h} style={{ textAlign: h === "Massnahme" ? "left" : "right", padding: "6px 8px", color: C.sub, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { m: "Split-Shift Mo–Do", save: "CHF 8'330", time: "Sofort" },
                  { m: "Sonntag reduzierter Abend", save: "CHF 2'160", time: "Sofort" },
                  { m: "Küche COGS 28.6% → 26.5%", save: "CHF 2'476", time: "2–4 Wo." },
                  { m: "Admin-Optimierung", save: "CHF 2'000", time: "1–2 Mt." },
                  { m: "Cross-Training / Aleno-Flex", save: "CHF 2'100", time: "1 Mt." },
                  { m: "Bier-COGS 31% → 18%", save: "CHF 214", time: "Sofort" },
                  { m: "Offeriert-Kontrolle", save: "CHF 500", time: "Sofort" },
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px", fontWeight: 600 }}>{r.m}</td>
                    <td style={{ textAlign: "right", padding: "8px", fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.green }}>−{r.save}</td>
                    <td style={{ textAlign: "right", padding: "8px", color: C.gold, fontSize: 11 }}>{r.time}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: `2px solid rgba(255,255,255,0.15)`, background: "rgba(120,224,143,0.05)" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 700, fontSize: 13 }}>TOTAL KOSTENSENKUNG</td>
                  <td style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700, color: C.green, fontFamily: "'Space Mono', monospace" }}>−CHF 17'780</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(233,69,96,0.1), rgba(120,224,143,0.1))", border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, textAlign: "center" }}>Projizierte Monats-P&L nach Massnahmen</div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "AKTUELL", rev: "CHF 174K", result: "−CHF 38K", color: C.accent, sub: "Monatlicher Verlust" },
                { label: "KONSERVATIV (+52K Rev, −18K Cost)", rev: "CHF 226K", result: "+CHF 32K", color: C.gold, sub: "Knapp über Break-Even" },
                { label: "OPTIMISTISCH (+90K Rev, −18K Cost)", rev: "CHF 264K", result: "+CHF 70K", color: C.green, sub: "Über Budget-Niveau" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, minWidth: 180, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, textAlign: "center" }}>
                  <Badge color={s.color}>{s.label}</Badge>
                  <div style={{ fontSize: 13, color: C.sub, marginTop: 10 }}>Umsatz</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Space Mono', monospace" }}>{s.rev}</div>
                  <div style={{ fontSize: 13, color: C.sub, marginTop: 8 }}>Ergebnis</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Space Mono', monospace" }}>{s.result}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Umsetzungs-Fahrplan</div>
            {[
              { phase: "WOCHE 1–2", color: C.accent, items: ["Weinbegleitung auf Menükarte drucken", "Service-Schulung: Wein/Dessert/Digestif-Push", "Craft Beer bestellen (2 Fass-Zapf + 4 Flaschen)", "3 Signature Cocktails & 3 Mocktails entwickeln", "Split-Shift-Dienstpläne Mo–Do einführen", "Sonntag-Pasta-Abendkarte erstellen"] },
              { phase: "WOCHE 3–4", color: C.gold, items: ["Business Lunch starten (2/3-Gang-Menü)", "Firmen-Mailing Dufourstrasse", "Samstag-Brunch lancieren", "Aperitivo Hour (17–19h) bewerben", "Aleno-Daten in Personalplanung integrieren", "Admin-Funktionen auf Digitalisierung prüfen"] },
              { phase: "MONAT 2–3", color: C.green, items: ["Tasting-Menü 5/7-Gang einführen", "Chef's Table monatliches Event", "Sonntagsbraten-Programm starten", "Cross-Training Service/Bar durchführen", "Küche-COGS: Portionskontrolle & CookpIT-Review", "Erste Ergebnismessung & Anpassung"] },
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <Badge color={p.color}>{p.phase}</Badge>
                <div style={{ marginTop: 8, paddingLeft: 4 }}>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 12, color: "#CCC", padding: "3px 0", display: "flex", gap: 8 }}>
                      <span style={{ color: p.color }}>→</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 32, padding: "12px 0", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted, textAlign: "center" }}>
        Capri AG · Dufourstrasse 80 · 8008 Zürich · Strategie & Workforce-Optimierung · Juli 2026
      </div>
    </div>
  );
}
