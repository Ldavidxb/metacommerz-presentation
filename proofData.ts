import type { Band, Phase, Scenario } from './types';

export const C = {
  cyan:'#22d3ee', purple:'#a78bfa', amber:'#eab308', green:'#34d399',
  blue:'#3b82f6', red:'#ef4444', orange:'#fb923c', pink:'#f472b6',
  text:'#e0e0f0', sub:'#a0a0b8',
  /** One tertiary token, validated 4.5:1 on the darkest card surface. */
  muted:'#8c8cae',
  /**
   * Small BARE text needs these on-dark variants — #ef4444 measures only
   * 4.11:1 on #0d0d1a. Use the base colours for dots, bars and borders,
   * never for type below ~18px.
   */
  redText:'#f87171', amberText:'#fbbf24',
  card:'#0d0d1a', deep:'#08080f', border:'#2a2a4a', page:'#0a0a14',
} as const;

export const SANS = "'Inter',sans-serif";
export const MONO = "'JetBrains Mono',monospace";

export const ICON = {
  fleet:'M5 17h14M6 17v-4l2-5h8l2 5v4M7.5 17v2M16.5 17v2M8 13h8',
  pharma:'M10.5 3.5a5 5 0 017 7l-7 7a5 5 0 01-7-7zM7 7l10 10',
  finance:'M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M3 10l9-7 9 7',
  factory:'M3 21h18M4 21V10l5 3V10l5 3V7l5 3v11M8 17h.01M13 17h.01M18 17h.01',
  supply:'M21 16V8l-9-5-9 5v8l9 5 9-5zM3.3 7.3L12 12l8.7-4.7M12 22V12',
  custom:'M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5M12 9a3 3 0 100 6 3 3 0 000-6z',
  deny:'M12 3a9 9 0 100 18 9 9 0 000-18zM6 6l12 12',
  challenge:'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z',
  allow:'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12l3 3 5-6',
  block:'M18 6L6 18M6 6l12 12', alert:'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  lock:'M19 11H5v10h14V11zM8 11V7a4 4 0 018 0v4', log:'M6 2h9l5 5v15H6zM14 2v6h6',
  key:'M15 2a7 7 0 00-6.7 9L2 17.3V22h4.7l6.3-6.3A7 7 0 1015 2zM17 7h.01',
  eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z',
  check:'M20 6L9 17l-5-5',
}; as const;

/** Nine signal bands. Ranges are inclusive and tile 0–255 exactly. */
export const BANDS: Band[] = [
  { name:'Security', lo:0, hi:17, color:C.red },
  { name:'Compliance', lo:18, hi:27, color:C.green },
  { name:'Geo-risk', lo:28, hi:40, color:C.amber },
  { name:'Threat intel', lo:41, hi:55, color:C.orange },
  { name:'TPRM', lo:56, hi:70, color:C.purple },
  { name:'Supply chain', lo:71, hi:90, color:C.cyan },
  { name:'Physical / IoT', lo:91, hi:120, color:C.pink },
  { name:'Behavioural', lo:121, hi:150, color:C.blue },
  { name:'Reserved', lo:151, hi:255, color:C.muted },
];

/**
 * Each scenario declares which bands it lights and how hard, so the heatmap
 * reads as a signature of the scenario rather than uniform noise.
 *
 * `nominal` exists so ALLOW is reachable — every other scenario scores above
 * the challenge threshold, and a decision engine that can only deny is not
 * demonstrating judgement.
 */
export const SCENARIOS: Scenario[] = [
  { key:'fleet', name:'Autonomous fleet', icon:ICON.fleet, risk:.82, domain:'physical_ai',
    desc:'GPS spoofing across 12 vehicles in convoy. Geofence breach plus firmware mismatch.',
    weights:{ 'Physical / IoT':.88, 'Geo-risk':.72, 'Behavioural':.44, 'Security':.38 },
    actions:[['Convoy halted at safe stop','fleet-control',ICON.block],['Firmware rollback staged','ota-service',ICON.lock],['SOC incident opened','soc-bridge',ICON.alert]] },
  { key:'pharma', name:'Pharma cold chain', icon:ICON.pharma, risk:.71, domain:'supply_chain',
    desc:'Temperature excursion in a vaccine shipment. 3°C over threshold for 47 minutes.',
    weights:{ 'Supply chain':.84, 'Compliance':.62, 'Geo-risk':.4, 'TPRM':.36 },
    actions:[['Batch quarantined on arrival','wms',ICON.block],['Stability review triggered','qms',ICON.log],['Consignee notified','edi',ICON.alert]] },
  { key:'finance', name:'Insider lateral move', icon:ICON.finance, risk:.91, domain:'cyber',
    desc:'Privileged account touching 14 systems in 90 seconds. Out of hours, VPN from a sanctioned region.',
    weights:{ 'Security':.93, 'Behavioural':.86, 'Threat intel':.58, 'Geo-risk':.66 },
    actions:[['Session terminated','iam',ICON.block],['Credentials revoked','vault',ICON.lock],['Forensic capture started','edr',ICON.log]] },
  { key:'factory', name:'Factory OT anomaly', icon:ICON.factory, risk:.78, domain:'iot_ot',
    desc:'PLC firmware mismatch, with an unexpected write to safety controller registers.',
    weights:{ 'Physical / IoT':.9, 'Security':.55, 'Compliance':.44, 'Threat intel':.34 },
    actions:[['Write blocked at the gateway','ot-proxy',ICON.block],['Line placed in safe state','scada',ICON.lock],['Engineering paged','oncall',ICON.alert]] },
  { key:'supply', name:'Supplier sanction hit', icon:ICON.supply, risk:.67, domain:'tprm',
    desc:'Tier-3 supplier flagged on the OFAC SDN list, with an active PO for a critical component.',
    weights:{ 'TPRM':.86, 'Geo-risk':.7, 'Compliance':.6, 'Supply chain':.5 },
    actions:[['PO placed on hold','erp',ICON.block],['Legal review requested','grc',ICON.log],['Alternate source surfaced','sourcing',ICON.eye]] },
  { key:'nominal', name:'Nominal baseline', icon:ICON.custom, risk:.18, domain:'baseline',
    desc:'Routine access during business hours from a managed device. Included so ALLOW is reachable.',
    weights:{ 'Compliance':.42, 'Behavioural':.2, 'Security':.14 },
    actions:[['Access granted','iam',ICON.check],['Decision logged','audit',ICON.log],['Baseline monitoring','telemetry',ICON.eye]] },
];

export const PHASES: Phase[] = [
  { key:'observe', label:'Observe', sub:'256-dim', color:C.cyan },
  { key:'orient', label:'Orient', sub:'ring-native', color:C.purple },
  { key:'decide', label:'Decide', sub:'verdict', color:C.amber },
  { key:'act', label:'Act', sub:'enforce', color:C.green },
];

// ── ring geometry ────────────────────────────────────────────

export const CX = 170, CY = 170, R = 112;
/** Quarter arcs with an 8° gap, starting at 12 o'clock. */
function arcPath(i) {
  const a1 = (i * 90 - 86) * Math.PI / 180, a2 = (i * 90 - 4) * Math.PI / 180;
  const x1 = (CX + R * Math.cos(a1)).toFixed(2), y1 = (CY + R * Math.sin(a1)).toFixed(2);
  const x2 = (CX + R * Math.cos(a2)).toFixed(2), y2 = (CY + R * Math.sin(a2)).toFixed(2);
  return 'M' + x1 + ' ' + y1 + ' A' + R + ' ' + R + ' 0 0 1 ' + x2 + ' ' + y2;
}
function labelPos(i) {
  const a = (i * 90 - 45) * Math.PI / 180;
  return { x: (CX + 148 * Math.cos(a)) / 340 * 100, y: (CY + 148 * Math.sin(a)) / 340 * 100 };
}

// ── helpers ──────────────────────────────────────────────────

export function randomHex(bytes: number): string {
  let s = '';
  for (let i = 0; i < bytes; i++) s += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return s;
}

export function badge(t: string, c: string): React.CSSProperties {
  return {
    display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20,
    flexShrink:0, whiteSpace:'nowrap', font: `600 8.5px ${MONO}`, letterSpacing:'.06em',
    textTransform:'uppercase', color:c, background:`${c}1A`, border:`1px solid ${c}4D`,
  };
}

/** Base colour → text-safe variant. Identity for colours already safe. */
export function textSafe(c: string): string {
  return c === C.red ? C.redText : c === C.amber ? C.amberText : c;
}

export function bandOf(i: number): Band {
  return BANDS.find(b => i >= b.lo && i <= b.hi)!;
}

/** Log-scale bar position: 10µs → 1000ms mapped across 0–100%. */
export function logPos(us: number): number {
  return Math.max(4, Math.min(100, (Math.log10(us) + 1) / 6.5 * 100));
}
