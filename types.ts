export type ScenarioKey = 'fleet' | 'pharma' | 'finance' | 'factory' | 'supply' | 'nominal';
export type PhaseKey = 'observe' | 'orient' | 'decide' | 'act';
export type VerdictName = 'DENY' | 'CHALLENGE' | 'ALLOW';

export interface Band {
  name: string;
  /** Inclusive dimension range. The nine bands tile 0–255 exactly. */
  lo: number;
  hi: number;
  color: string;
}

/** [label, target system, SVG path] */
export type EnforcementAction = [string, string, string];

export interface Scenario {
  key: ScenarioKey;
  name: string;
  icon: string;
  /** Prior risk, blended 45/55 with the inferred action magnitude. */
  risk: number;
  domain: string;
  desc: string;
  /**
   * Which signal bands this scenario lights, and how hard. Keyed by band name.
   * This is what gives each scenario a distinct heatmap signature rather than
   * uniform noise.
   */
  weights: Record<string, number>;
  actions: EnforcementAction[];
}

export interface Phase {
  key: PhaseKey;
  label: string;
  sub: string;
  color: string;
}

export interface InferenceResult {
  /** 8-dim signed action vector, tanh activated. */
  action: number[];
  /** Mean absolute action magnitude. */
  mag: number;
  /** Composite risk = mag * 0.55 + scenario.risk * 0.45. */
  score: number;
  verdict: VerdictName;
  color: string;
  icon: string;
  conf: number;
  reason: string;
  cycle: number;
  latency: number;
  sig: string;
  pk: string;
  stateHash: string;
  cipher: string;
  ts: number;
  obs: number[];
  scenario: string;
  actions: EnforcementAction[];
}

export interface HistoryEntry {
  cycle: number;
  scenario: string;
  verdict: VerdictName;
  color: string;
  latency: number;
}

export interface RingNeuralProofProps {
  title?: string;
  subtitle?: string;
  /** Hide the headline block when the page already provides one. */
  showHeader?: boolean;
  defaultScenario?: ScenarioKey;
  /** Dwell time per OODA phase while the ring fills. */
  phaseMs?: number;
  /** How long the simulated signature verification takes. */
  verifyMs?: number;
  /** Cap on retained history rows. */
  historyLimit?: number;
  onCycleComplete?: (result: InferenceResult) => void;
  onVerify?: (result: InferenceResult) => void;
  /** Called with the proof payload. Omit to fall back to a browser download. */
  onDownload?: (proof: Record<string, unknown>) => void;
}
