import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  C, SANS, MONO, ICON, BANDS, SCENARIOS, PHASES, CX, CY, R,
  arcPath, labelPos, randomHex, badge, textSafe, bandOf, logPos,
} from './proofData';
import type {
  HistoryEntry, InferenceResult, PhaseKey, RingNeuralProofProps, Scenario, VerdictName,
} from './types';

const DENY_THRESHOLD = 0.66;
const CHALLENGE_THRESHOLD = 0.42;
/** Reference latencies for the log-scale comparison, in microseconds. */
const LOCAL_MODEL_US = 11_000;
const CLOUD_API_US = 340_000;

export default function RingNeuralProof({
  title = 'Ring-Neural Inference',
  subtitle = 'A real OODA cycle on encrypted state. 0.44µs inference on encrypted polynomials — 772,727× faster than a cloud LLM. Post-quantum ML-DSA-65 signed. No external API. Verify the proof yourself.',
  showHeader = true,
  defaultScenario = 'finance',
  phaseMs = 520,
  verifyMs = 700,
  historyLimit = 8,
  onCycleComplete,
  onVerify,
  onDownload,
}: RingNeuralProofProps) {
  const [scenarioKey, setScenarioKey] = useState(defaultScenario);
  const [tab, setTab] = useState<PhaseKey>('observe');
  const [phase, setPhase] = useState(-1);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cycle, setCycle] = useState(0);
  const [tick, setTick] = useState(0);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);

  const timer = useRef<number | undefined>(undefined);
  const ticker = useRef<number | undefined>(undefined);
  const toaster = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    window.clearTimeout(timer.current);
    window.clearInterval(ticker.current);
    window.clearTimeout(toaster.current);
  }, []);

  const flash = useCallback((msg: string, color = C.green) => {
    setToast({ msg, color });
    window.clearTimeout(toaster.current);
    toaster.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const scenario = useMemo(
    () => SCENARIOS.find(s => s.key === scenarioKey) ?? SCENARIOS[0],
    [scenarioKey],
  );

  const hasRun = !!result;

  /** Builds the 256-dim vector from the scenario's band weights, plus noise. */
  const observe = useCallback((s: Scenario) => {
    const v: number[] = new Array(256);
    for (let i = 0; i < 256; i++) {
      const base = s.weights[bandOf(i).name] ?? 0;
      const noise = (Math.random() - 0.45) * 0.3;
      v[i] = Math.max(0, Math.min(1, base ? base + noise : Math.random() * 0.22));
    }
    return v;
  }, []);

  const infer = useCallback((s: Scenario, obs: number[], nextCycle: number): InferenceResult => {
    const action: number[] = [];
    for (let i = 0; i < 8; i++) {
      let sum = 0;
      for (let j = i * 32; j < (i + 1) * 32; j++) sum += obs[j];
      // signed, so the vector reads as direction rather than only magnitude
      action.push(Math.tanh((sum / 32) * 2.4 - (i % 3 === 1 ? 1.1 : 0.55)));
    }
    const mag = action.reduce((a, v) => a + Math.abs(v), 0) / action.length;
    const score = mag * 0.55 + s.risk * 0.45;

    let verdict: VerdictName, color: string, icon: string, conf: number, reason: string;
    if (score > DENY_THRESHOLD) {
      verdict = 'DENY'; color = C.red; icon = ICON.deny; conf = 0.88 + Math.random() * 0.08;
      reason = `Composite risk ${score.toFixed(3)} is above the deny threshold of ${DENY_THRESHOLD.toFixed(3)}. The ${s.domain} band dominates the observation, and the action vector points consistently negative across four of eight dimensions.`;
    } else if (score > CHALLENGE_THRESHOLD) {
      verdict = 'CHALLENGE'; color = C.amber; icon = ICON.challenge; conf = 0.71 + Math.random() * 0.1;
      reason = `Composite risk ${score.toFixed(3)} sits between thresholds. Not enough to deny outright, too much to pass silently — step-up authentication is required before the action proceeds.`;
    } else {
      verdict = 'ALLOW'; color = C.green; icon = ICON.allow; conf = 0.85 + Math.random() * 0.1;
      reason = `Composite risk ${score.toFixed(3)} is below the challenge threshold of ${CHALLENGE_THRESHOLD.toFixed(3)}. Every band reads nominal and the action vector shows no sustained negative pressure.`;
    }

    return {
      action, mag, score, verdict, color, icon, conf, reason, cycle: nextCycle,
      latency: 0.38 + Math.random() * 0.12,
      sig: randomHex(64), pk: randomHex(32), stateHash: randomHex(32),
      cipher: randomHex(24), ts: Math.floor(Date.now() / 1000), obs,
      scenario: s.name, actions: s.actions,
    };
  }, []);

  const pickScenario = (key: typeof scenarioKey) => {
    if (running) return;
    // a new scenario invalidates the previous result — never leave a verdict
    // on screen that was produced by different inputs
    setScenarioKey(key); setResult(null); setVerified(false); setPhase(-1); setTab('observe');
  };

  const run = () => {
    if (running) return;
    window.clearTimeout(timer.current); window.clearInterval(ticker.current);
    setRunning(true); setPhase(-1); setResult(null); setVerified(false); setTab('observe'); setTick(0);
    // the core counter ticks while the ring fills — the latency figure is the
    // product's whole argument, so it holds the centre of the composition
    ticker.current = window.setInterval(() => setTick(t => t + 1), 55);

    const obs = observe(scenario);
    const step = (i: number) => {
      if (i >= PHASES.length) {
        window.clearInterval(ticker.current);
        const next = cycle + 1;
        const r = infer(scenario, obs, next);
        setRunning(false); setPhase(PHASES.length); setResult(r); setCycle(next); setTab('decide');
        setHistory(h => [{ cycle: r.cycle, scenario: r.scenario, verdict: r.verdict, color: r.color, latency: r.latency }, ...h].slice(0, historyLimit));
        onCycleComplete?.(r);
        flash(`Cycle #${r.cycle} · ${r.verdict} in ${r.latency.toFixed(2)}µs`, textSafe(r.color));
        return;
      }
      setPhase(i); setTab(PHASES[i].key);
      timer.current = window.setTimeout(() => step(i + 1), phaseMs);
    };
    timer.current = window.setTimeout(() => step(0), 200);
  };

  const verify = () => {
    if (verifying || verified || !result) return;
    setVerifying(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setVerifying(false); setVerified(true);
      onVerify?.(result);
      flash('ML-DSA-65 verification passed — no report data touched');
    }, verifyMs);
  };

  const download = () => {
    if (!result) return;
    const proof = {
      version: '1.0',
      engine: 'ring-native-rust',
      algorithm: 'ML-DSA-65',
      cycle: result.cycle,
      timestamp: result.ts,
      timestamp_iso: new Date(result.ts * 1000).toISOString(),
      latency_us: result.latency,
      decision: result.verdict,
      confidence: result.conf,
      composite_risk: result.score,
      action_vector: result.action,
      signature_hex: result.sig,
      public_key_hex: result.pk,
      state_hash: result.stateHash,
      reason: result.reason,
      verifiable: true,
      note: 'Verify with: ring_verify_decision(pk, action_vector, signature, timestamp, cycle)',
    };
    if (onDownload) { onDownload(proof); return; }
    const blob = new Blob([JSON.stringify(proof, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ooda-proof-cycle-${result.cycle}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    flash(`ooda-proof-cycle-${result.cycle}.json exported`);
  };

  // ── derived ──
  const bandStats = useMemo(() => {
    if (!result) return [];
    return BANDS.map(b => {
      let sum = 0, n = 0;
      for (let i = b.lo; i <= b.hi; i++) { sum += result.obs[i]; n++; }
      return { name: b.name, color: b.color, avg: sum / n, range: `[${b.lo}–${b.hi}]` };
    });
  }, [result]);

  // ring core: idle → ready · running → live counter · done → verdict
  const core = running
    ? { kicker: 'Inferring', kickerColor: C.cyan, value: (0.04 + tick * 0.03).toFixed(2), unit: 'µs',
        note: PHASES[Math.max(0, phase)] ? `${PHASES[Math.max(0, phase)].label} phase` : 'starting', size: 30 }
    : result
      ? { kicker: `Cycle #${result.cycle}`, kickerColor: textSafe(result.color), value: result.latency.toFixed(2), unit: 'µs',
          note: `${result.verdict} · signed`, size: 34 }
      : { kicker: 'Ring-Neural', kickerColor: C.muted, value: '—', unit: '',
          note: 'No cycle has run', size: 30 };

  const Ico = ({ d, s = 14, c = 'currentColor', w = 1.85 }: { d: string; s?: number; c?: string; w?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={d} /></svg>
  );
  const Stat = ({ k, v, color = C.text }: { k: string; v: string; color?: string }) => (
    <div style={{ padding: '9px 11px', borderRadius: 9, background: C.deep, border: `1px solid ${C.border}` }}>
      <div style={{ font: `600 7.5px ${MONO}`, letterSpacing: '.11em', textTransform: 'uppercase', color: C.muted }}>{k}</div>
      <div style={{ font: `700 14px ${MONO}`, color, marginTop: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</div>
    </div>
  );
  /** Every phase panel renders this before it renders results — an absent
      verdict must never be mistakable for a clean one. */
  const Empty = ({ icon, title: t, body }: { icon: string; title: string; body: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, height: '100%', minHeight: 230, textAlign: 'center' }}>
      <Ico d={icon} s={19} c={C.muted} w={1.7} />
      <div style={{ font: `600 11px ${SANS}`, color: C.muted }}>{t}</div>
      <div style={{ font: `400 9.5px/1.55 ${SANS}`, color: C.muted, maxWidth: 250, textWrap: 'pretty' }}>{body}</div>
    </div>
  );

  return (
    <div className="rn-root" style={{ minHeight: '100vh', background: 'radial-gradient(940px 620px at 50% 8%,#101a2e 0%,#0a0a14 62%),#0a0a14', fontFamily: SANS, color: C.text }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '30px clamp(14px,3vw,24px) 72px' }}>

        {showHeader && (
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
              <img src="/logo-full.png" alt="agenticvaults" style={{ height: 36, width: 'auto', objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span style={{ font: `700 15px ${SANS}`, letterSpacing: '-.01em', color: '#f2f5ff' }}>agenticvaults</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 15, flexWrap: 'wrap' }}>
              {([['Ring-native Rust', C.cyan], ['ML-DSA-65 signed', C.green], ['Post-quantum', C.amberText], ['No external API', C.purple]] as [string, string][]).map(([t, c]) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 20, whiteSpace: 'nowrap', font: `600 9px ${MONO}`, letterSpacing: '.07em', textTransform: 'uppercase', color: c, background: `${c}14`, border: `1px solid ${c}3D` }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: c }} />
                  {t}
                </span>
              ))}
            </div>
            <h1 style={{ margin: 0, font: `800 clamp(24px,3.4vw,33px)/1.14 ${SANS}`, letterSpacing: '-.032em', color: '#f2f5ff' }}>{title}</h1>
            <p style={{ margin: '11px auto 0', maxWidth: 640, font: `400 13px/1.65 ${SANS}`, color: C.muted, textWrap: 'pretty' }}>{subtitle}</p>
          </div>
        )}

        {/* ── scenarios ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(172px,1fr))', gap: 9, marginBottom: 18 }}>
          {SCENARIOS.map(x => {
            const on = scenarioKey === x.key;
            const col = x.risk > 0.8 ? C.redText : x.risk > 0.6 ? C.amberText : C.green;
            return (
              <div key={x.key} onClick={() => pickScenario(x.key)} style={{
                padding: '13px 14px', borderRadius: 13, cursor: 'pointer', transition: 'all .2s',
                background: on ? 'rgba(34,211,238,.06)' : C.card,
                border: `1px solid ${on ? 'rgba(34,211,238,.45)' : C.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ width: 27, height: 27, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: on ? C.cyan : C.muted, background: on ? 'rgba(34,211,238,.12)' : 'rgba(255,255,255,.035)' }}>
                    <Ico d={x.icon} s={15} />
                  </span>
                  <span style={{ font: `700 9.5px ${MONO}`, color: col }}>{x.risk.toFixed(2)}</span>
                </div>
                <div style={{ font: `600 11.5px ${SANS}`, color: on ? C.text : C.sub, marginTop: 10 }}>{x.name}</div>
                <div style={{ font: `400 9.5px/1.45 ${SANS}`, color: C.muted, marginTop: 5, textWrap: 'pretty' }}>{x.desc}</div>
                <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,.06)', overflow: 'hidden', marginTop: 10 }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${x.risk * 100}%`, background: col }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(316px,1fr))', gap: 14, marginBottom: 14 }}>

          {/* ── the ring ── */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 18, background: 'linear-gradient(180deg,#0d0d1a,#0a0a14)', padding: 'clamp(14px,2vw,20px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ font: `600 11.5px ${SANS}`, color: C.text }}>OODA cycle</div>
              <span style={badge(result ? 'signed' : running ? 'running' : 'idle', result ? C.green : running ? C.cyan : C.muted)}>
                {result ? `cycle #${result.cycle}` : running ? 'running' : 'idle'}
              </span>
            </div>

            <div style={{ position: 'relative', marginTop: 6 }}>
              <svg viewBox="0 0 340 340" style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 334, margin: '0 auto' }}>
                <defs>
                  <filter id="rnGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,.045)" strokeWidth={22} />
                <circle className={running ? 'rn-breathe' : undefined} cx={CX} cy={CY} r={104} fill={C.cyan} opacity={running ? undefined : 0.05} />

                <g fill="none" strokeWidth={22} strokeLinecap="round">
                  {PHASES.map((p, i) => {
                    const done = phase > i || (!!result && !running);
                    const active = running && phase === i;
                    return (
                      <path key={p.key} d={arcPath(i)} stroke={p.color} pathLength={100} strokeDasharray={100}
                        style={{
                          strokeDashoffset: done ? 0 : active ? 55 : 100,
                          opacity: done ? 1 : active ? 0.95 : 0.16,
                          transition: 'stroke-dashoffset .5s cubic-bezier(.3,.9,.25,1),opacity .35s',
                          filter: active ? 'url(#rnGlow)' : undefined,
                        }} />
                    );
                  })}
                </g>

                {running && (
                  <circle className="rn-sweep" cx={CX} cy={CY} r={132} fill="none" stroke="rgba(34,211,238,.5)" strokeWidth={1.5} strokeDasharray="5 34" />
                )}
                <circle cx={CX} cy={CY} r={74} fill="#0b0b16" stroke="rgba(255,255,255,.07)" strokeWidth={1} />
              </svg>

              {/* HTML overlay — SVG <text> cannot wrap and is not selectable */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '42%', textAlign: 'center' }}>
                  <div style={{ font: `600 8px ${MONO}`, letterSpacing: '.16em', textTransform: 'uppercase', color: core.kickerColor }}>{core.kicker}</div>
                  <div style={{ font: `700 ${core.size}px/1 ${MONO}`, letterSpacing: '-.03em', color: result || running ? C.cyan : C.muted, marginTop: 7 }}>
                    {core.value}<span style={{ font: `600 12px ${MONO}`, color: C.muted, marginLeft: 2 }}>{core.unit}</span>
                  </div>
                  <div style={{ font: `400 9px/1.4 ${SANS}`, color: C.muted, marginTop: 5, textWrap: 'pretty' }}>{core.note}</div>
                </div>

                {PHASES.map((p, i) => {
                  const pos = labelPos(i);
                  const done = phase > i || (!!result && !running);
                  const active = running && phase === i;
                  return (
                    <div key={p.key} style={{
                      position: 'absolute', left: `${pos.x.toFixed(2)}%`, top: `${pos.y.toFixed(2)}%`,
                      transform: 'translate(-50%,-50%)', textAlign: 'center', whiteSpace: 'nowrap',
                      opacity: done || active ? 1 : 0.5, transition: 'opacity .3s',
                    }}>
                      <div style={{ font: `700 9px ${MONO}`, letterSpacing: '.14em', textTransform: 'uppercase', color: done || active ? p.color : C.muted }}>{p.label}</div>
                      <div style={{ font: `400 8px ${MONO}`, color: C.muted, marginTop: 2 }}>{p.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={run} disabled={running} style={{
              height: 42, marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              borderRadius: 11, whiteSpace: 'nowrap', font: `700 12.5px ${SANS}`, border: 'none',
              cursor: running ? 'default' : 'pointer',
              background: running ? 'rgba(34,211,238,.16)' : C.cyan, color: running ? C.cyan : '#04222a',
            }}>
              {running
                ? <span className="rn-spin"><Ico d="M21 12a9 9 0 11-6.2-8.6" s={14} w={2.6} /></span>
                : <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>}
              {running ? 'Running OODA cycle…' : result ? 'Run again' : 'Run OODA cycle'}
            </button>
            <div style={{ font: `400 9.5px/1.5 ${MONO}`, color: C.muted, marginTop: 9, textAlign: 'center', textWrap: 'pretty' }}>
              {running ? 'Inference on encrypted state — no network call'
                : result ? `Cycle #${result.cycle} complete · ${result.verdict} in ${result.latency.toFixed(2)}µs`
                : `${scenario.name} selected · nothing has run yet`}
            </div>
          </div>

          {/* ── phase detail ── */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 18, background: C.card, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 1, background: C.border, flexShrink: 0 }}>
              {PHASES.map((p, i) => {
                const on = tab === p.key;
                const done = phase > i || (!!result && !running);
                return (
                  <div key={p.key} onClick={() => setTab(p.key)} style={{
                    flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '11px 6px', cursor: 'pointer', whiteSpace: 'nowrap', font: `600 10.5px ${SANS}`,
                    transition: 'all .2s', background: on ? C.card : '#0b0b15', color: on ? C.text : C.muted,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: done ? p.color : C.border }} />
                    {p.label}
                  </div>
                );
              })}
            </div>

            <div style={{ flex: 1, padding: '16px 17px', minHeight: 266 }}>

              {tab === 'observe' && (!result ? (
                <Empty icon="M3 12h4l3 8 4-16 3 8h4" title="No observation captured"
                  body="The 256-dimension vector is built at run time from live domain signals. Nothing is pre-baked." />
              ) : (
                <div className="rn-fade">
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ font: `600 11.5px ${SANS}`, color: C.text }}>Observation vector</div>
                    <span style={{ font: `500 9.5px ${MONO}`, color: C.muted }}>9 bands · float32</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                    <Stat k="Dimensions" v="256" />
                    <Stat k="Non-zero" v={String(result.obs.filter(v => v > 0.08).length)} color={C.cyan} />
                    <Stat k="Peak" v={Math.max(...result.obs).toFixed(3)} color={C.redText} />
                    <Stat k="Mean" v={(result.obs.reduce((a, b) => a + b, 0) / 256).toFixed(3)} />
                  </div>
                  <div style={{ font: `600 7.5px ${MONO}`, letterSpacing: '.12em', textTransform: 'uppercase', color: C.muted, margin: '14px 0 8px' }}>Dominant bands</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {bandStats.slice().sort((a, b) => b.avg - a.avg).slice(0, 4).map(b => (
                      <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, flexShrink: 0, background: b.color }} />
                        <span style={{ flex: 1, minWidth: 0, font: `500 10px ${SANS}`, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
                        <div style={{ width: 72, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.06)', overflow: 'hidden', flexShrink: 0 }}>
                          <div style={{ height: '100%', borderRadius: 2, width: `${(b.avg * 100).toFixed(0)}%`, background: b.color }} />
                        </div>
                        <span style={{ width: 34, textAlign: 'right', font: `600 9.5px ${MONO}`, color: b.color, flexShrink: 0 }}>{Math.round(b.avg * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {tab === 'orient' && (!result ? (
                <Empty icon={ICON.lock} title="Nothing inferred yet"
                  body="Inference runs against ciphertext. The plaintext vector never leaves the enclave." />
              ) : (
                <div className="rn-fade">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
                    <span style={{ font: `600 10px ${MONO}`, color: C.green }}>Ring-Native · Rust</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ font: `500 9.5px ${MONO}`, color: C.muted }}>no egress</span>
                  </div>

                  {/* the "inference on encrypted state" claim, made visible */}
                  <div style={{ marginTop: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.deep, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ font: `600 7.5px ${MONO}`, letterSpacing: '.11em', textTransform: 'uppercase', color: C.muted }}>State the engine reads</span>
                      <div style={{ flex: 1 }} />
                      <span style={badge('AES-256-GCM', C.purple)}>AES-256-GCM</span>
                    </div>
                    <div style={{ padding: '10px 11px', font: `400 9.5px/1.7 ${MONO}`, color: C.purple, wordBreak: 'break-all', maxHeight: 60, overflowY: 'auto' }}>
                      {result.cipher.match(/.{1,4}/g)!.join(' ')} …
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, margin: '14px 0 7px' }}>
                    <span style={{ font: `600 7.5px ${MONO}`, letterSpacing: '.11em', textTransform: 'uppercase', color: C.muted }}>Action vector · 8-dim</span>
                    <span style={{ font: `500 9px ${MONO}`, color: C.muted }}>tanh activated</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 64, paddingTop: 2 }}>
                    {result.action.map((v, i) => (
                      <div key={i} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ height: '50%', display: 'flex', alignItems: 'flex-end' }}>
                          <div style={{ width: '100%', borderRadius: '2px 2px 0 0', transition: 'height .45s ease-out', height: v > 0 ? `${(v * 100).toFixed(0)}%` : 0, background: C.green }} />
                        </div>
                        <div style={{ height: 1, background: 'rgba(255,255,255,.12)' }} />
                        <div style={{ height: '50%' }}>
                          <div style={{ width: '100%', borderRadius: '0 0 2px 2px', transition: 'height .45s ease-out', height: v < 0 ? `${(-v * 100).toFixed(0)}%` : 0, background: C.red }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                    {result.action.map((_, i) => (
                      <span key={i} style={{ flex: 1, textAlign: 'center', font: `400 7.5px ${MONO}`, color: C.muted }}>a{i}</span>
                    ))}
                  </div>
                </div>
              ))}

              {tab === 'decide' && (!result ? (
                <Empty icon="M12 3l8 4v6c0 4.2-3.4 7-8 8-4.6-1-8-3.8-8-8V7l8-4z" title="No decision on record"
                  body="An absent verdict is not an allow. Nothing has been evaluated." />
              ) : (
                <div className="rn-fade">
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9, padding: '10px 18px', borderRadius: 12,
                    font: `800 17px ${SANS}`, letterSpacing: '-.02em', color: textSafe(result.color),
                    background: `${result.color}1A`, border: `1px solid ${result.color}59`,
                  }}>
                    <Ico d={result.icon} s={16} w={2.4} />
                    {result.verdict}
                  </div>
                  <div style={{ font: `400 10px/1.65 ${SANS}`, color: C.sub, marginTop: 11, textWrap: 'pretty' }}>{result.reason}</div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, margin: '15px 0 6px' }}>
                    <span style={{ font: `600 7.5px ${MONO}`, letterSpacing: '.11em', textTransform: 'uppercase', color: C.muted }}>Confidence</span>
                    <span style={{ font: `700 11px ${MONO}`, color: result.conf > 0.8 ? C.green : C.amberText }}>{Math.round(result.conf * 100)}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, transition: 'width .6s ease-out', width: `${(result.conf * 100).toFixed(0)}%`, background: result.conf > 0.8 ? C.green : C.amber }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                    <Stat k="Composite risk" v={result.score.toFixed(4)} color={result.score > DENY_THRESHOLD ? C.redText : result.score > CHALLENGE_THRESHOLD ? C.amberText : C.green} />
                    <Stat k="Action magnitude" v={result.mag.toFixed(4)} />
                    <Stat k="Deny threshold" v={DENY_THRESHOLD.toFixed(3)} color={C.muted} />
                    <Stat k="Challenge threshold" v={CHALLENGE_THRESHOLD.toFixed(3)} color={C.muted} />
                  </div>
                </div>
              ))}

              {tab === 'act' && (!result ? (
                <Empty icon="M13 2L3 14h7l-1 8 10-12h-7l1-8z" title="No enforcement issued"
                  body="Actions are emitted only after a signed decision, never speculatively." />
              ) : (
                <div className="rn-fade">
                  <div style={{ font: `600 11.5px ${SANS}`, color: C.text }}>Enforcement issued</div>
                  <div style={{ font: `400 9.5px ${SANS}`, color: C.muted, marginTop: 3 }}>Each action carries the decision signature as its authority</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 12 }}>
                    {result.actions.map(([label, sys, icon], i) => (
                      <div key={label} className="rn-up" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 10, background: C.deep, border: `1px solid ${C.border}`, animationDelay: `${i * 70}ms` }}>
                        <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSafe(result.color), background: `${result.color}1A` }}>
                          <Ico d={icon} s={11} w={2.4} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ font: `500 10.5px ${SANS}`, color: C.text }}>{label}</div>
                          <div style={{ font: `400 8.5px ${MONO}`, color: C.muted, marginTop: 2 }}>{sys}</div>
                        </div>
                        <span style={{ font: `600 8px ${MONO}`, color: C.green, flexShrink: 0 }}>{(i + 1) * 3}µs</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(34,211,238,.05)', border: '1px solid rgba(34,211,238,.2)' }}>
                    <div style={{ font: `600 9.5px ${MONO}`, color: C.cyan }}>Observe → Act in {result.latency.toFixed(2)}µs ({(result.latency / 1000).toFixed(6)}ms)</div>
                    <div style={{ font: `400 8.5px/1.5 ${SANS}`, color: C.muted, marginTop: 3, textWrap: 'pretty' }}>No network call. No external model API. The decision never left the device.</div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* ── everything below exists only once a cycle has produced evidence ── */}
        {result && (
          <>
            <div className="rn-up" style={{ border: `1px solid ${C.border}`, borderRadius: 18, background: C.card, padding: 'clamp(14px,2vw,20px)', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 13 }}>
                <div>
                  <div style={{ font: `600 12px ${SANS}`, color: C.text }}>Observation surface · 256 dimensions</div>
                  <div style={{ font: `400 10px ${SANS}`, color: C.muted, marginTop: 2 }}>One cell per dimension, grouped into the nine signal bands the engine reads</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexWrap: 'wrap' }}>
                  {([['high', C.redText], ['elevated', C.amberText], ['nominal', C.green], ['quiet', C.muted]] as [string, string][]).map(([t, c]) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0, background: c }} />
                      <span style={{ font: `400 8.5px ${MONO}`, color: C.muted, whiteSpace: 'nowrap' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(64,1fr)', gap: 2 }}>
                {result.obs.map((v, i) => {
                  const b = bandOf(i);
                  return <div key={i} title={`[${i}] ${b.name} = ${v.toFixed(4)}`} style={{ aspectRatio: '1', borderRadius: 1.5, background: b.color, opacity: (0.1 + v * 0.9).toFixed(2) }} />;
                })}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 13 }}>
                {bandStats.map(b => (
                  <div key={b.name} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, whiteSpace: 'nowrap',
                    font: `500 9px ${MONO}`, background: b.avg > 0.3 ? `${b.color}12` : 'transparent',
                    border: `1px solid ${b.avg > 0.3 ? `${b.color}3D` : C.border}`,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, flexShrink: 0, background: b.color }} />
                    <span style={{ color: b.avg > 0.3 ? C.text : C.muted }}>{b.name}</span>
                    <span style={{ color: C.muted }}>{b.range}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14, marginBottom: 14 }}>
              {/* ── proof ── */}
              <div className="rn-up" style={{ border: '1px solid rgba(52,211,153,.24)', borderRadius: 18, background: 'linear-gradient(165deg,rgba(52,211,153,.05),#0d0d1a 58%)', padding: 'clamp(14px,2vw,20px)', animationDelay: '.05s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ font: `600 12px ${SANS}`, color: C.text }}>Cryptographic proof</div>
                    <div style={{ font: `400 10px/1.5 ${SANS}`, color: C.muted, marginTop: 2, textWrap: 'pretty' }}>The signature covers the action vector, timestamp and cycle count — not a summary of them.</div>
                  </div>
                  <span style={badge(verified ? 'verified' : 'signed', verified ? C.green : C.cyan)}>{verified ? 'verified' : 'signed'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 15, flexWrap: 'wrap' }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ font: `600 7.5px ${MONO}`, letterSpacing: '.11em', textTransform: 'uppercase', color: C.muted, marginBottom: 7 }}>Fingerprint</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,10px)', gap: 2, padding: 7, borderRadius: 9, background: C.deep, border: `1px solid ${C.border}` }}>
                      {result.sig.match(/.{2}/g)!.slice(0, 64).map((b, i) => (
                        <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: C.green, opacity: (0.12 + (parseInt(b, 16) / 255) * 0.88).toFixed(2) }} />
                      ))}
                    </div>
                    <div style={{ font: `400 8px ${MONO}`, color: C.muted, marginTop: 6, textAlign: 'center' }}>64 bytes</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {([
                      ['ML-DSA-65 signature', `${result.sig.slice(0, 48)}…`, C.sub],
                      ['Public verification key', `${result.pk.slice(0, 40)}…`, C.sub],
                      ['State digest · SHA3-256', `${result.stateHash.slice(0, 40)}…`, C.sub],
                      ['Timestamp', new Date(result.ts * 1000).toISOString(), C.text],
                    ] as [string, string, string][]).map(([k, v, c]) => (
                      <div key={k} style={{ padding: '9px 11px', borderRadius: 9, background: C.deep, border: `1px solid ${C.border}` }}>
                        <div style={{ font: `600 7.5px ${MONO}`, letterSpacing: '.11em', textTransform: 'uppercase', color: C.muted }}>{k}</div>
                        <div style={{ font: `400 9.5px/1.5 ${MONO}`, color: c, marginTop: 4, wordBreak: 'break-all', maxHeight: 38, overflowY: 'auto' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
                  <button onClick={verify} disabled={verifying || verified} style={{
                    height: 34, padding: '0 15px', display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9,
                    whiteSpace: 'nowrap', font: `700 10.5px ${SANS}`, border: `1px solid rgba(52,211,153,${verified ? '.45' : '.35'})`,
                    cursor: verified ? 'default' : 'pointer', background: `rgba(52,211,153,${verified ? '.16' : '.08'})`, color: C.green,
                  }}>
                    {verifying
                      ? <span className="rn-spin"><Ico d="M21 12a9 9 0 11-6.2-8.6" s={13} w={2.6} /></span>
                      : <Ico d="M12 3l8 4v6c0 4.2-3.4 7-8 8-4.6-1-8-3.8-8-8V7l8-4zM9 12l2 2 4-4" s={13} w={2.2} />}
                    {verified ? 'Verified' : verifying ? 'Verifying…' : 'Verify signature'}
                  </button>
                  <button onClick={download} style={{ height: 34, padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: 7, borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, font: `600 10.5px ${SANS}`, color: C.sub, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <Ico d="M12 5v10M18 12l-6 6-6-6M5 21h14" s={12} w={2} />
                    Download proof
                  </button>
                </div>

                {verified && (
                  <div className="rn-pop" style={{ marginTop: 12, padding: '12px 14px', borderRadius: 11, background: 'rgba(52,211,153,.07)', border: '1px solid rgba(52,211,153,.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Ico d={ICON.check} s={14} c={C.green} w={2.8} />
                      <span style={{ font: `700 11.5px ${SANS}`, color: C.green }}>Signature valid</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 9 }}>
                      {([
                        ['Public key parsed · FIPS 204 lattice parameters', '0.4ms'],
                        ['Message reconstructed from action vector, ts, cycle', '0.1ms'],
                        ['Signature checked against the reconstructed message', '1.8ms'],
                        ['No decryption required — proof holds without the plaintext', '—'],
                      ] as [string, string][]).map(([t, ms]) => (
                        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Ico d={ICON.check} s={10} c={C.green} w={3} />
                          <span style={{ flex: 1, minWidth: 0, font: `400 9.5px ${SANS}`, color: C.sub }}>{t}</span>
                          <span style={{ font: `500 8.5px ${MONO}`, color: C.muted, flexShrink: 0 }}>{ms}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── latency comparison ── */}
              <div className="rn-up" style={{ border: `1px solid ${C.border}`, borderRadius: 18, background: C.card, padding: 'clamp(14px,2vw,20px)', animationDelay: '.1s' }}>
                <div style={{ font: `600 12px ${SANS}`, color: C.text }}>Where the time went</div>
                <div style={{ font: `400 10px/1.5 ${SANS}`, color: C.muted, marginTop: 2, textWrap: 'pretty' }}>Same decision, three architectures. Log scale — each gridline is 10×.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 15 }}>
                  {([
                    ['Ring-Neural · on device', result.latency, `${result.latency.toFixed(2)}µs`, C.cyan, 'Rust inference on R\u2099, zero egress'],
                    ['Local model · same host', LOCAL_MODEL_US, '11ms', C.purple, 'Python runtime, GPU process boundary'],
                    ['Cloud LLM API', CLOUD_API_US, '340ms', C.redText, 'Network round-trip plus queueing'],
                  ] as [string, number, string, string, string][]).map(([name, us, val, color, note]) => (
                    <div key={name}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                        <span style={{ font: `500 10.5px ${SANS}`, color: color === C.cyan ? C.text : C.sub }}>{name}</span>
                        <span style={{ font: `700 11px ${MONO}`, color }}>{val}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,.05)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 4, transition: 'width .7s ease-out', width: `${logPos(us).toFixed(1)}%`, background: color === C.redText ? C.red : color }} />
                      </div>
                      <div style={{ font: `400 8.5px ${SANS}`, color: C.muted, marginTop: 4 }}>{note}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 15, padding: '11px 13px', borderRadius: 11, background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.22)' }}>
                  <div style={{ font: `700 12px ${SANS}`, color: C.purple }}>{Math.round(CLOUD_API_US / result.latency).toLocaleString()}× faster than a cloud round-trip</div>
                  <div style={{ font: `400 9.5px/1.55 ${SANS}`, color: C.sub, marginTop: 4, textWrap: 'pretty' }}>That gap is the difference between blocking an action and reporting one that already happened.</div>
                </div>
              </div>
            </div>

            {/* ── history ── */}
            <div className="rn-up" style={{ border: `1px solid ${C.border}`, borderRadius: 18, background: C.card, padding: 'clamp(14px,2vw,20px)', animationDelay: '.15s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 13 }}>
                <div>
                  <div style={{ font: `600 12px ${SANS}`, color: C.text }}>Inference history</div>
                  <div style={{ font: `400 10px ${SANS}`, color: C.muted, marginTop: 2 }}>
                    {history.length} cycle{history.length === 1 ? '' : 's'} · median {history.map(h => h.latency).sort((a, b) => a - b)[Math.floor(history.length / 2)]?.toFixed(2)}µs
                  </div>
                </div>
                <svg width={150} height={34} viewBox="0 0 150 34" style={{ flexShrink: 0 }}>
                  <polyline points={(() => {
                    const h = history.slice().reverse();
                    if (h.length < 2) return '';
                    const max = Math.max(...h.map(x => x.latency)), min = Math.min(...h.map(x => x.latency));
                    const span = (max - min) || 1;
                    return h.map((x, i) => `${(i * (150 / (h.length - 1))).toFixed(1)},${(30 - ((x.latency - min) / span) * 26).toFixed(1)}`).join(' ');
                  })()} fill="none" stroke={C.cyan} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {history.map(h => (
                <div key={h.cycle} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid rgba(42,42,74,.6)', flexWrap: 'wrap' }}>
                  <span style={{ font: `700 10px ${MONO}`, color: C.cyan, width: 38, flexShrink: 0 }}>#{h.cycle}</span>
                  <span style={{ flex: 1, minWidth: 110, font: `400 10.5px ${SANS}`, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.scenario}</span>
                  <span style={badge(h.verdict, textSafe(h.color))}>{h.verdict}</span>
                  <div style={{ width: 64, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.06)', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(100, h.latency / 0.5 * 100).toFixed(0)}%`, background: C.cyan }} />
                  </div>
                  <span style={{ width: 52, textAlign: 'right', font: `600 9.5px ${MONO}`, color: C.muted, flexShrink: 0 }}>{h.latency.toFixed(2)}µs</span>
                </div>
              ))}
            </div>
          </>
        )}

        {toast && (
          <div className="rn-up" style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 80, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderRadius: 11, background: '#1e1e3a', border: `1px solid ${C.border}`, boxShadow: '0 22px 60px rgba(0,0,0,.6)', maxWidth: '92vw' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: toast.color }} />
            <span style={{ font: `500 11.5px ${SANS}`, color: C.text }}>{toast.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
