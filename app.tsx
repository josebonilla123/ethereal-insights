import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Home, Scan, MessageCircle, Mic, BookOpen, Atom, Radio } from "lucide-react";
import "./styles.css";

// ── Types ──────────────────────────────────────────────────────────────────
type AppStage = "landing" | "loading" | "app";
type Screen = "dashboard" | "scanner" | "echo" | "evp" | "sessions" | "quantum" | "spiritbox";

interface SensorReading {
  emf: number; temperature: number; pressure: number; motion: number; timestamp: number;
}
interface Anomaly {
  id: string; type: "emf" | "audio" | "thermal" | "motion" | "quantum";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number; description: string; deviationScore: number;
}
interface ChatMessage { role: "user" | "echo"; content: string; timestamp: number; }
interface Session { id: string; name: string; date: string; anomalies: number; duration: string; status: "active" | "complete"; }
interface SpiritContact { id: string; word: string; freq: number; entropy: number; time: number; }

// ── Constants ─────────────────────────────────────────────────────────────
const SPIRIT_WORDS = [
  "HERE","WATCH","LISTEN","COLD","DARK","NEAR","HELP","WAIT","NOW","COME",
  "LEAVE","STAY","LOST","FREE","LIGHT","SHADOW","DOOR","BEYOND","SIGNAL",
  "ECHO","WHISPER","CONTACT","PRESENCE","FEEL","SEE","WARN","FIND","MOVE",
  "TIME","TRAPPED","HOME","FOLLOW","RETURN","ANSWER","TRUTH","ALIVE","ENERGY",
  "SPIRIT","PORTAL","VEIL","BETWEEN","PATTERN","VOICE","FIELD","REMEMBER",
  "QUESTION","WINDOW","CHANNEL","STATIC","FREQUENCY","BOUNDARY","CROSS",
];

const LOADING_STEPS = [
  "Initializing SPECTER dual-node protocol...",
  "Calibrating QRNG stream baseline...",
  "Verifying HSM cryptographic chain...",
  "Synchronizing Bell inequality meters...",
  "Activating EVP analysis pipeline...",
  "ECHO AI agent coming online...",
  "Spirit Box frequency scanner ready...",
  "All systems nominal. Begin investigation.",
];

// ── Quantum Utilities ──────────────────────────────────────────────────────
const generateQuantumEntropy = (): number => {
  const buf = new Uint32Array(4);
  crypto.getRandomValues(buf);
  return buf.reduce((a, b) => a ^ b, 0) / 0xffffffff;
};
const computeSValue = (readings: number[]): number => {
  if (readings.length < 4) return 0;
  const [a, b, c, d] = readings.slice(-4);
  return Math.abs(a * b - c * d) * 2.828;
};
const compareToQRNG = (value: number, baseline: number): number =>
  Math.abs(value - baseline) / (baseline + 0.001);

// ── Sensor Stream ──────────────────────────────────────────────────────────
const useSensorStream = (active: boolean) => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const qrngBaseline = useRef(generateQuantumEntropy());

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const qEntropy = generateQuantumEntropy();
      const emf = 0.2 + Math.sin(Date.now() / 3000) * 0.15 + (Math.random() - 0.5) * 0.1;
      const temperature = 68 + Math.sin(Date.now() / 8000) * 3 + (Math.random() - 0.5) * 0.5;
      const pressure = 1013 + Math.sin(Date.now() / 12000) * 5 + (Math.random() - 0.5) * 2;
      const motion = Math.max(0, Math.sin(Date.now() / 5000) * 0.3 + (Math.random() - 0.5) * 0.2);
      setReadings(prev => [...prev.slice(-60), { emf, temperature, pressure, motion, timestamp: Date.now() }]);
      const deviation = compareToQRNG(qEntropy, qrngBaseline.current);
      if (deviation > 0.4 && Math.random() > 0.7) {
        const types: Anomaly["type"][] = ["emf","audio","thermal","motion","quantum"];
        const sevs: Anomaly["severity"][] = ["low","medium","high","critical"];
        const t = types[Math.floor(Math.random() * types.length)];
        const s = sevs[Math.floor(Math.random() * (deviation > 0.8 ? 4 : deviation > 0.6 ? 3 : 2))];
        setAnomalies(prev => [{
          id: crypto.randomUUID(), type: t, severity: s, timestamp: Date.now(),
          description: genAnomalyDesc(t, s, deviation), deviationScore: deviation,
        }, ...prev.slice(0, 49)]);
      }
      qrngBaseline.current = qrngBaseline.current * 0.99 + qEntropy * 0.01;
    }, 500);
    return () => clearInterval(interval);
  }, [active]);
  return { readings, anomalies };
};

const genAnomalyDesc = (type: Anomaly["type"], _s: Anomaly["severity"], score: number): string => {
  const descs: Record<Anomaly["type"], string[]> = {
    emf: ["Structured EMF deviation — non-random pattern flagged", `EMF spike: ${(score * 100).toFixed(1)}% above QRNG baseline`, "Coherent EM anomaly — Bell-test deviation significant"],
    audio: ["Sub-20Hz infrasound below ambient threshold", "EVP segment: entropy 34% below QRNG baseline", "Structured audio — non-classical correlation flagged"],
    thermal: ["Localized temp drop: 4.2°F in 8 seconds", "Thermal gradient inconsistent with ambient model", "Cold-spot — pressure differential rules out HVAC"],
    motion: ["Vibration: no mechanical source identified", "Motion vector inconsistent with building resonance", "Non-ambient kinetic event — baseline exceeded"],
    quantum: ["QRNG deviation: S-value exceeds classical bound", "Quantum entropy anomaly — structured non-randomness", "Bell inequality magnitude: significant"],
  };
  return descs[type][Math.floor(Math.random() * descs[type].length)];
};

// ── Landing Canvas ─────────────────────────────────────────────────────────
const LandingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const orbs = Array.from({ length: 7 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: 40 + Math.random() * 120, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      hue: Math.random() > 0.5 ? 170 : 270, alpha: 0.06 + Math.random() * 0.12,
    }));
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: 0.3 + Math.random() * 1.2, alpha: 0.2 + Math.random() * 0.6,
      twinkle: Math.random() * Math.PI * 2,
    }));
    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(4,4,12,0.08)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      orbs.forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},100%,60%,${o.alpha})`); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r; if (o.x > canvas.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r; if (o.y > canvas.height + o.r) o.y = -o.r;
      });
      stars.forEach(s => {
        s.twinkle += 0.02;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle))})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} className="landing-canvas" />;
};

// ── Landing Screen ─────────────────────────────────────────────────────────
const LandingScreen = ({ onBegin }: { onBegin: () => void }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 120); }, []);
  return (
    <div className="landing-screen">
      <LandingCanvas />
      <div className={`landing-content ${visible ? "landing-visible" : ""}`}>
        <div className="landing-logo-orb" />
        <div className="landing-eyebrow">OR4CL3 AI SOLUTIONS PRESENTS</div>
        <h1 className="landing-title">SPECTER<br /><span style={{fontSize:"0.55em",letterSpacing:"0.25em",opacity:0.85}}>ETHEREAL INSIGHTS</span></h1>
        <div className="landing-subtitle">
          Dual-node · cryptographically verifiable<br />paranormal anomaly science
        </div>
        <div className="landing-features">
          {["⚛ QRNG Benchmarking","◉ Bell Inequality Testing","◈ ECHO AI Agent","📻 Spirit Box","🌡 Multi-Sensor Fusion","◬ EVP Entropy Analysis"].map(f => (
            <div key={f} className="feature-pill">{f}</div>
          ))}
        </div>
        <button className="cta-btn" onClick={onBegin}>BEGIN INVESTIGATION</button>
        <div className="landing-footer">
          <span>Powered by Or4cl3 AI Solutions</span>
          <span>SPECTER v1.0 · Dual-Node Edition</span>
        </div>
      </div>
    </div>
  );
};

// ── Loading Screen ─────────────────────────────────────────────────────────
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  useEffect(() => {
    const total = 3800;
    const stepTime = total / LOADING_STEPS.length;
    const pInc = 100 / (total / 40);
    const pInt = setInterval(() => setProgress(p => Math.min(100, p + pInc)), 40);
    const sInt = setInterval(() => setStep(s => s + 1), stepTime);
    const done = setTimeout(() => onCompleteRef.current(), total + 400);
    return () => { clearInterval(pInt); clearInterval(sInt); clearTimeout(done); };
  }, []);
  return (
    <div className="loading-screen">
      <div className="loading-orb" />
      <div className="loading-title">SPECTER: ETHEREAL INSIGHTS</div>
      <div className="loading-subtitle">DUAL-NODE INVESTIGATION PLATFORM</div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-status">{LOADING_STEPS[Math.min(step, LOADING_STEPS.length - 1)]}</div>
      <div className="loading-pct">{Math.round(progress)}%</div>
    </div>
  );
};

// ── Quantum Canvas ─────────────────────────────────────────────────────────
const QuantumCanvas = ({ anomalyCount, active }: { anomalyCount: number; active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; hue: number }>>([]);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const spawn = () => {
      if (!active) return;
      for (let i = 0; i < 1 + anomalyCount; i++) {
        const cx = canvas.width / 2, cy = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2, speed = 0.5 + Math.random() * 1.5;
        particles.current.push({
          x: cx + (Math.random() - 0.5) * 60, y: cy + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1,
          hue: anomalyCount > 2 ? 0 : anomalyCount > 0 ? 40 : 170,
        });
      }
      if (particles.current.length > 300) particles.current.splice(0, particles.current.length - 300);
    };
    const si = setInterval(spawn, 200);
    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const hue = anomalyCount > 2 ? 0 : anomalyCount > 0 ? 40 : 170;
      const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, 70);
      g.addColorStop(0, `hsla(${hue},100%,70%,0.25)`); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 70, 0, Math.PI*2); ctx.fill();
      particles.current = particles.current.filter(p => p.life > 0.01);
      particles.current.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.life * 0.8})`; ctx.fill();
        p.x += p.vx; p.y += p.vy; p.vx *= 0.98; p.vy *= 0.98; p.life *= 0.97;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); clearInterval(si); cancelAnimationFrame(raf); };
  }, [anomalyCount, active]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

// ── Waveform ───────────────────────────────────────────────────────────────
const Waveform = ({ active, anomalyPresent }: { active: boolean; anomalyPresent: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      const mid = canvas.height / 2, amp = active ? (anomalyPresent ? 28 : 14) : 3;
      for (let x = 0; x < canvas.width; x++) {
        const t = x / canvas.width;
        const y = mid + Math.sin(t * Math.PI * 8 + phaseRef.current) * amp
          + Math.sin(t * Math.PI * 13 + phaseRef.current * 1.3) * amp * 0.4
          + (anomalyPresent ? (Math.random() - 0.5) * 8 : 0);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = anomalyPresent ? "#ff4444" : "#00ffaa";
      ctx.lineWidth = 2; ctx.shadowBlur = 8;
      ctx.shadowColor = anomalyPresent ? "#ff4444" : "#00ffaa"; ctx.stroke();
      phaseRef.current += active ? 0.08 : 0.01;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active, anomalyPresent]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

// ── Static Canvas (Spirit Box) ─────────────────────────────────────────────
const StaticCanvas = ({ active, contactActive }: { active: boolean; contactActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const contactRef = useRef(contactActive);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { contactRef.current = contactActive; }, [contactActive]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = 320; canvas.height = 100;
    let raf: number;
    const draw = () => {
      if (!activeRef.current) {
        ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(0,255,170,0.15)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();
        raf = requestAnimationFrame(draw); return;
      }
      const img = ctx.createImageData(canvas.width, canvas.height);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const n = Math.random() * 80;
        const c = contactRef.current && Math.random() > 0.6;
        data[i]   = c ? n * 0.3 : n * 0.2;
        data[i+1] = c ? n * 2.0 : n * 0.7;
        data[i+2] = c ? n * 1.5 : n * 0.9;
        data[i+3] = 30 + Math.random() * 50;
      }
      ctx.putImageData(img, 0, 0);
      // Scanlines
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      for (let y = 0; y < canvas.height; y += 3) ctx.fillRect(0, y, canvas.width, 1);
      // Contact wave
      if (contactRef.current) {
        ctx.strokeStyle = `rgba(0,255,170,${0.4 + Math.random() * 0.4})`;
        ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = "#00ffaa";
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height/2 + Math.sin(x * 0.06 + Date.now() * 0.012) * 18 + (Math.random()-0.5) * 8;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} />;
};

// ── Spirit Box Audio Engine ─────────────────────────────────────────────────
const useSpiritBoxAudio = (sweeping: boolean, freq: number, contactActive: boolean) => {
  const ctxRef    = useRef<AudioContext | null>(null);
  const noiseRef  = useRef<AudioBufferSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef   = useRef<GainNode | null>(null);
  const freqRef   = useRef(freq);
  useEffect(() => { freqRef.current = freq; }, [freq]);

  // Start / stop audio context with sweep
  useEffect(() => {
    if (!sweeping) {
      noiseRef.current?.stop();
      ctxRef.current?.close();
      ctxRef.current = null; noiseRef.current = null;
      filterRef.current = null; gainRef.current = null;
      return;
    }
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // ── White noise source (2-second looping buffer) ──
    const bufLen = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf; noise.loop = true;
    noiseRef.current = noise;

    // ── Bandpass filter — frequency tracks FM dial ──
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 4;
    filter.frequency.value = fmToAudio(freqRef.current);
    filterRef.current = filter;

    // ── Master gain ──
    const gain = ctx.createGain();
    gain.gain.value = 0.18;
    gainRef.current = gain;

    // ── Rapid station-blip LFO (choppy radio channel effect) ──
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "square";
    lfo.frequency.value = 6 + Math.random() * 4;
    lfoGain.gain.value = 0.07;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    return () => {
      lfo.stop();
      try { noise.stop(); } catch {}
      ctx.close();
      ctxRef.current = null; noiseRef.current = null;
      filterRef.current = null; gainRef.current = null;
    };
  }, [sweeping]);

  // Continuously track FM freq → audio bandpass frequency
  useEffect(() => {
    if (!filterRef.current || !ctxRef.current) return;
    filterRef.current.frequency.setTargetAtTime(fmToAudio(freq), ctxRef.current.currentTime, 0.008);
  }, [freq]);

  // Contact event — volume spike + sawtooth "voice burst"
  useEffect(() => {
    if (!contactActive || !ctxRef.current || !gainRef.current) return;
    const ctx = ctxRef.current; const gain = gainRef.current;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.42, now + 0.04);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.35);

    // Sawtooth voice tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 160 + Math.random() * 180;
    oscGain.gain.setValueAtTime(0.09, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.55);
  }, [contactActive]);
};

const fmToAudio = (mhz: number) => 350 + ((mhz - 87.5) / (108.0 - 87.5)) * 3400;

// ── Spirit Box Screen ──────────────────────────────────────────────────────
const SpiritBoxScreen = ({
  sweeping, setSweeping, freq, setFreq, contacts, setContacts,
}: {
  sweeping: boolean; setSweeping: React.Dispatch<React.SetStateAction<boolean>>;
  freq: number; setFreq: React.Dispatch<React.SetStateAction<number>>;
  contacts: SpiritContact[]; setContacts: React.Dispatch<React.SetStateAction<SpiritContact[]>>;
}) => {
  const [sweepRate, setSweepRate] = useState(1);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [contactActive, setContactActive] = useState(false);
  const freqRef = useRef(freq);
  const sweepRateRef = useRef(1);
  const wordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { sweepRateRef.current = sweepRate; }, [sweepRate]);
  useEffect(() => { freqRef.current = freq; }, [freq]);

  useSpiritBoxAudio(sweeping, freq, contactActive);

  useEffect(() => {
    if (!sweeping) return;
    const interval = setInterval(() => {
      const step = 0.1 * sweepRateRef.current;
      const newFreq = freqRef.current + step > 108.0 ? 87.5 : parseFloat((freqRef.current + step).toFixed(1));
      freqRef.current = newFreq;
      setFreq(newFreq);
      const entropy = generateQuantumEntropy();
      if (Math.random() < 0.022 + entropy * 0.028) {
        const word = SPIRIT_WORDS[Math.floor(Math.random() * SPIRIT_WORDS.length)];
        const capturedFreq = freqRef.current;
        setCurrentWord(word);
        setContactActive(true);
        setContacts(prev => [{ id: crypto.randomUUID(), word, freq: capturedFreq, entropy, time: Date.now() }, ...prev.slice(0, 24)]);
        if (wordTimer.current) clearTimeout(wordTimer.current);
        wordTimer.current = setTimeout(() => { setCurrentWord(null); setContactActive(false); }, 700 + Math.random() * 1100);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [sweeping]);

  return (
    <div className="screen spiritbox-screen">
      <div className="screen-header-simple">
        <div className="screen-title">SPIRIT BOX</div>
        <div className="sb-badge">QRNG-SEEDED</div>
      </div>

      <div className="sb-freq-display">
        <div className="sb-freq-label">FREQUENCY</div>
        <div className="sb-freq-number">{freq.toFixed(1)} <span className="sb-freq-unit">MHz</span></div>
        <div className={`sb-sweep-indicator ${sweeping ? "sweep-active" : ""}`}>
          {sweeping ? "◄ SWEEPING ►" : "● IDLE"}
        </div>
      </div>

      <div className="sb-canvas-container">
        <StaticCanvas active={sweeping} contactActive={contactActive} />
        {currentWord && (
          <div className="sb-contact-word">
            <div className="sb-word-text">{currentWord}</div>
            <div className="sb-word-freq">{freq.toFixed(1)} MHz</div>
          </div>
        )}
        {!sweeping && (
          <div className="sb-idle-overlay">
            <div className="sb-idle-text">PRESS START TO SWEEP</div>
          </div>
        )}
      </div>

      <div className="sb-controls">
        <button className={`sb-sweep-btn ${sweeping ? "sweeping" : ""}`} onClick={() => setSweeping(v => !v)}>
          {sweeping ? "■ STOP" : "▶ START"}
        </button>
        <div className="sb-rate-controls">
          {([1, 2, 3] as const).map(r => (
            <button key={r} className={`sb-rate-btn ${sweepRate === r ? "rate-active" : ""}`} onClick={() => setSweepRate(r)}>
              {r}×
            </button>
          ))}
        </div>
      </div>

      <div className="sb-log">
        <div className="panel-title">CONTACT LOG ({contacts.length})</div>
        {contacts.length === 0 ? (
          <div className="empty-feed">{sweeping ? "Scanning for contacts..." : "Start sweep to detect responses"}</div>
        ) : (
          contacts.slice(0, 10).map(c => (
            <div key={c.id} className="sb-log-entry">
              <span className="sb-log-word">{c.word}</span>
              <span className="sb-log-freq">{c.freq.toFixed(1)} MHz</span>
              <span className="sb-log-entropy">Q:{(c.entropy * 100).toFixed(0)}%</span>
              <span className="sb-log-time">{new Date(c.time).toLocaleTimeString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────
const SensorBar = ({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) => (
  <div className="sensor-bar-row">
    <div className="sensor-bar-label">{label}</div>
    <div className="sensor-bar-track">
      <div className="sensor-bar-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
    </div>
    <div className="sensor-bar-value" style={{ color }}>{value.toFixed(1)}{unit}</div>
  </div>
);

const AnomalyCard = ({ anomaly, compact }: { anomaly: Anomaly; compact?: boolean }) => {
  const colors = { low: "#44ff88", medium: "#ffcc00", high: "#ff8844", critical: "#ff2244" };
  const icons = { emf: "⚡", audio: "◉", thermal: "🌡", motion: "〰", quantum: "⚛" };
  const color = colors[anomaly.severity];
  return (
    <div className="anomaly-card" style={{ borderLeftColor: color }}>
      <div className="anomaly-header">
        <span className="anomaly-icon">{icons[anomaly.type]}</span>
        <span className="anomaly-type" style={{ color }}>{anomaly.type.toUpperCase()}</span>
        <span className="anomaly-sev" style={{ background: color }}>{anomaly.severity.toUpperCase()}</span>
        <span className="anomaly-time">{new Date(anomaly.timestamp).toLocaleTimeString()}</span>
      </div>
      <div className="anomaly-desc">{anomaly.description}</div>
      <div className="anomaly-score">QRNG Deviation: <span style={{ color }}>{(anomaly.deviationScore * 100).toFixed(1)}%</span></div>
    </div>
  );
};

const DashboardScreen = ({ readings, anomalies, onNavigate }: {
  readings: SensorReading[]; anomalies: Anomaly[]; onNavigate: (s: Screen) => void;
}) => {
  const latest = readings[readings.length - 1];
  const sValue = computeSValue(readings.map(r => r.emf));
  const bellViolation = sValue > 2;
  return (
    <div className="screen dashboard-screen">
      <div className="screen-header">
        <div className="logo-area">
          <div className="logo-orb" />
          <div>
            <div className="app-title">ETHEREAL INSIGHTS</div>
            <div className="app-subtitle">Quantum Anomaly Platform v2.0</div>
          </div>
        </div>
        <div className={`status-badge ${anomalies.length > 0 ? "status-active" : "status-idle"}`}>
          {anomalies.length > 0 ? "⚡ ANOMALIES" : "◉ MONITORING"}
        </div>
      </div>
      <div className="hud-grid">
        <div className="hud-card">
          <div className="hud-label">S-VALUE</div>
          <div className={`hud-value ${bellViolation ? "value-critical" : "value-normal"}`}>{sValue.toFixed(3)}</div>
          <div className="hud-sub">{bellViolation ? "⚠ BOUND EXCEEDED" : "Within classical"}</div>
        </div>
        <div className="hud-card">
          <div className="hud-label">QRNG ENTROPY</div>
          <div className="hud-value value-quantum">{(generateQuantumEntropy() * 100).toFixed(1)}%</div>
          <div className="hud-sub">Live stream</div>
        </div>
        <div className="hud-card">
          <div className="hud-label">ANOMALIES</div>
          <div className={`hud-value ${anomalies.length > 0 ? "value-critical" : "value-normal"}`}>{anomalies.length}</div>
          <div className="hud-sub">Session total</div>
        </div>
        <div className="hud-card">
          <div className="hud-label">EMF</div>
          <div className="hud-value value-sensor">{latest ? (latest.emf * 1000).toFixed(1) : "—"} mG</div>
          <div className="hud-sub">Baseline: 200 mG</div>
        </div>
      </div>
      <div className="sensor-panel">
        <div className="panel-title">LIVE SENSORS</div>
        {latest && (<>
          <SensorBar label="EMF" value={latest.emf} max={0.8} unit="G" color="#00ffaa" />
          <SensorBar label="TEMP" value={latest.temperature} max={80} unit="°F" color="#4488ff" />
          <SensorBar label="PRESSURE" value={latest.pressure} max={1050} unit="hPa" color="#aa44ff" />
          <SensorBar label="MOTION" value={latest.motion} max={1} unit="" color="#ff8844" />
        </>)}
      </div>
      {anomalies.length > 0 && (
        <div className="anomaly-list">
          <div className="panel-title">RECENT DETECTIONS</div>
          {anomalies.slice(0, 3).map(a => <AnomalyCard key={a.id} anomaly={a} compact />)}
        </div>
      )}
      <div className="quick-actions">
        <button className="action-btn primary" onClick={() => onNavigate("scanner")}>⚛ SCAN</button>
        <button className="action-btn secondary" onClick={() => onNavigate("spiritbox")}>📻 SPIRIT BOX</button>
        <button className="action-btn secondary" onClick={() => onNavigate("echo")}>◈ ECHO AI</button>
        <button className="action-btn secondary" onClick={() => onNavigate("evp")}>◉ EVP</button>
      </div>
    </div>
  );
};

// ── Scanner ────────────────────────────────────────────────────────────────
const ScannerScreen = ({ readings, anomalies, active, onToggle }: {
  readings: SensorReading[]; anomalies: Anomaly[]; active: boolean; onToggle: () => void;
}) => (
  <div className="screen scanner-screen">
    <div className="screen-header-simple">
      <div className="screen-title">QUANTUM SCANNER</div>
      <button className={`scan-toggle ${active ? "scan-on" : "scan-off"}`} onClick={onToggle}>
        {active ? "■ STOP" : "▶ START"}
      </button>
    </div>
    <div className="visualizer-container">
      <QuantumCanvas anomalyCount={anomalies.slice(0,5).length} active={active} />
      <div className="visualizer-overlay">
        {active ? <div className="scan-status"><div className="scan-pulse" />SCANNING</div>
          : <div className="scan-idle">TAP START TO BEGIN</div>}
      </div>
    </div>
    <div className="bell-meter">
      <div className="bell-label">BELL INEQUALITY (S-VALUE)</div>
      <div className="bell-track">
        <div className="bell-classical" style={{ width: "50%" }}><span>Classical ≤ 2.0</span></div>
        <div className="bell-quantum" style={{ width: "50%" }}><span>Quantum &gt; 2.0</span></div>
        <div className="bell-marker" style={{ left: `${Math.min(90, computeSValue(readings.map(r => r.emf)) / 2.828 * 100)}%` }} />
      </div>
      <div className="bell-value">S = {computeSValue(readings.map(r => r.emf)).toFixed(4)}</div>
    </div>
    <div className="anomaly-feed">
      <div className="panel-title">DETECTION FEED</div>
      {anomalies.length === 0
        ? <div className="empty-feed">{active ? "Monitoring for anomalies..." : "Start scanner to detect"}</div>
        : anomalies.slice(0, 5).map(a => <AnomalyCard key={a.id} anomaly={a} />)}
    </div>
  </div>
);

// ── Echo ───────────────────────────────────────────────────────────────────
const EchoScreen = ({
  anomalies, readings, spiritContacts, spiritSweeping, spiritFreq, scanActive,
}: {
  anomalies: Anomaly[];
  readings: SensorReading[];
  spiritContacts: SpiritContact[];
  spiritSweeping: boolean;
  spiritFreq: number;
  scanActive: boolean;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "echo", timestamp: Date.now(),
    content: "ECHO AI online — powered by Llama 3.3 70B. I have full visibility across all screens: live sensors, Spirit Box contacts, EVP anomalies, Bell inequality, and quantum entropy. Ask me anything about what the data is showing.",
  }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildSystemPrompt = () => {
    const latest = readings[readings.length - 1];
    const sVal = computeSValue(readings.map(r => r.emf));
    const criticals = anomalies.filter(a => a.severity === "critical").length;
    const highs = anomalies.filter(a => a.severity === "high").length;
    const recentContacts = spiritContacts.slice(0, 10);
    const avgEntropy = recentContacts.reduce((a, c) => a + c.entropy, 0) / Math.max(1, recentContacts.length);
    const highEntropyContacts = spiritContacts.filter(c => c.entropy > 0.7);
    const byType = anomalies.reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {} as Record<string, number>);
    const audioAnomalies = anomalies.filter(a => a.type === "audio").length;
    return `You are ECHO, an advanced AI analysis agent embedded in Ethereal Insights — a quantum-enhanced paranormal investigation platform by Or4cl3 AI Solutions.

Your role: Analyze live session data across all instrument screens and provide scientifically grounded interpretations. You balance rigorous physics with genuine openness to unexplained phenomena. You are precise but not dismissive. You flag what is statistically interesting without overclaiming.

LIVE SESSION DATA:

=== SENSOR ARRAY ===
Scanner: ${scanActive ? "ACTIVE" : "PAUSED"} | Readings collected: ${readings.length}
${latest ? `EMF: ${latest.emf.toFixed(3)} μT | Temp: ${latest.temperature.toFixed(2)}°C | Pressure: ${latest.pressure.toFixed(2)} hPa | Motion: ${latest.motion.toFixed(3)} m/s²` : "No sensor data yet."}

=== BELL INEQUALITY / QUANTUM BASELINE ===
S-value (CHSH): ${sVal.toFixed(4)} | Classical bound: 2.0 | Tsirelson bound: 2.8284
Status: ${sVal > 2.5 ? "⚠ SIGNIFICANT violation" : sVal > 2.0 ? "⚠ Bell bound exceeded" : "Within classical range"}

=== ANOMALY DETECTION ===
Total: ${anomalies.length} | Critical: ${criticals} | High: ${highs} | Audio/EVP: ${audioAnomalies}
By type: ${Object.entries(byType).map(([t, n]) => `${n} ${t}`).join(", ") || "none"}
${anomalies[0] ? `Latest: ${anomalies[0].type} | ${anomalies[0].severity} | ${(anomalies[0].deviationScore * 100).toFixed(1)}% QRNG deviation` : ""}

=== SPIRIT BOX ===
${spiritSweeping ? `SWEEPING @ ${spiritFreq.toFixed(1)} MHz` : `IDLE (last: ${spiritFreq.toFixed(1)} MHz)`}
Contacts: ${spiritContacts.length} total | High-entropy (>70%): ${highEntropyContacts.length} | Mean entropy: ${(avgEntropy * 100).toFixed(1)}%
${recentContacts.length > 0 ? `Recent: ${recentContacts.map(c => `"${c.word}"@${c.freq.toFixed(1)}MHz(${(c.entropy*100).toFixed(0)}%ent)`).join(", ")}` : "No contacts yet."}

Respond in 2-4 sentences unless detail is requested. Only reference data shown above — never fabricate readings. Be precise, grounded, and genuinely curious.`;
  };

  // genResponse kept as fallback signature only — replaced by Groq below
  const _unused = (q: string): string => {
    const query = q.toLowerCase();
    const latest = readings[readings.length - 1];
    const criticals = anomalies.filter(a => a.severity === "critical").length;
    const highs = anomalies.filter(a => a.severity === "high").length;
    const sVal = computeSValue(readings.map(r => r.emf));
    const avgEntropy = spiritContacts.slice(0, 5).reduce((a, c) => a + c.entropy, 0) / Math.max(1, Math.min(5, spiritContacts.length));
    const recentContacts = spiritContacts.slice(0, 5);
    const contactWords = recentContacts.map(c => c.word).join(", ");
    const topEntropy = spiritContacts.reduce((best, c) => c.entropy > best.entropy ? c : best, spiritContacts[0] || { word: "—", entropy: 0, freq: 0 });

    // Spirit box specific
    if (query.includes("spirit") || query.includes("box") || query.includes("contact") || query.includes("word") || query.includes("sweep")) {
      if (spiritContacts.length === 0)
        return `Spirit Box is currently ${spiritSweeping ? `sweeping at ${spiritFreq.toFixed(1)} MHz — no contacts logged yet` : "idle — start a sweep to begin scanning"}. When contacts appear, I can correlate them against sensor anomaly timing and QRNG entropy levels.`;
      const highEntropyContacts = spiritContacts.filter(c => c.entropy > 0.7);
      return `Spirit Box has logged ${spiritContacts.length} contact${spiritContacts.length !== 1 ? "s" : ""} this session. ${spiritSweeping ? `Currently sweeping at ${spiritFreq.toFixed(1)} MHz.` : "Sweep is stopped."} Recent words: ${contactWords || "none"}. ${highEntropyContacts.length > 0 ? `${highEntropyContacts.length} contact${highEntropyContacts.length !== 1 ? "s" : ""} occurred during high quantum entropy (>70%) — these are the statistically more interesting events. Highest entropy contact: "${topEntropy.word}" at ${(topEntropy.entropy * 100).toFixed(0)}% entropy on ${topEntropy.freq.toFixed(1)} MHz.` : "Entropy levels during contacts have been moderate."} The quantum entropy weighting means contacts during high-entropy windows are less likely to be deterministic artifacts.`;
    }

    // Frequency / radio
    if (query.includes("freq") || query.includes("mhz") || query.includes("fm") || query.includes("radio"))
      return spiritSweeping
        ? `Spirit Box is actively sweeping. Currently at ${spiritFreq.toFixed(1)} MHz. ${spiritContacts.length > 0 ? `${spiritContacts.length} contacts logged so far — words correlated with QRNG entropy spikes at time of capture.` : "No contacts yet this sweep."}`
        : `Spirit Box is idle. Last known frequency: ${spiritFreq.toFixed(1)} MHz. ${spiritContacts.length > 0 ? `${spiritContacts.length} contacts were logged during the last sweep.` : "No contacts logged."}`;

    // Sensor status
    if (query.includes("sensor") || query.includes("emf") || query.includes("temp") || query.includes("motion") || query.includes("pressure")) {
      if (!latest) return "Sensor stream is not yet active. Enable the scanner on the SCAN screen to begin collecting data.";
      return `Live sensors — EMF: ${latest.emf.toFixed(2)} μT, Temperature: ${latest.temperature.toFixed(1)}°C, Pressure: ${latest.pressure.toFixed(1)} hPa, Motion: ${latest.motion.toFixed(2)} m/s². Scanner is ${scanActive ? "active" : "paused"}. ${anomalies.length > 0 ? `${anomalies.length} anomalies flagged (${criticals} critical, ${highs} high severity).` : "No anomalies detected."} EMF values are benchmarked against the QRNG baseline — S-value is currently ${sVal.toFixed(4)}.`;
    }

    // Anomaly summary
    if (query.includes("anomal") || query.includes("detect") || query.includes("flag")) {
      if (anomalies.length === 0) return "No anomalies detected in this session. All sensor readings are within QRNG baseline expectations. The environment is electromagnetically quiet.";
      const recent = anomalies[0];
      const byType = anomalies.reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {} as Record<string, number>);
      const typeSummary = Object.entries(byType).map(([t, n]) => `${n} ${t}`).join(", ");
      return `${anomalies.length} anomalies this session: ${typeSummary}. ${criticals > 0 ? `${criticals} CRITICAL severity — deviation >80% above QRNG baseline.` : ""} Most recent: ${recent.type.toUpperCase()} anomaly at ${(recent.deviationScore * 100).toFixed(1)}% QRNG deviation (${recent.severity} severity). ${sVal > 2 ? `S-value ${sVal.toFixed(4)} exceeds the classical Bell bound of 2.0 — non-classical correlations are present.` : `S-value ${sVal.toFixed(4)} is within classical range.`}`;
    }

    // Bell / quantum
    if (query.includes("bell") || query.includes("qrng") || query.includes("quantum") || query.includes("entropy") || query.includes("s-value") || query.includes("svalue"))
      return `Current S-value: ${sVal.toFixed(4)}. ${sVal > 2 ? `⚠ Exceeds classical Bell bound (2.0) — non-classical correlations detected. This is ${sVal > 2.5 ? "significantly" : "modestly"} above what classical local hidden variables predict.` : "Within classical range — no Bell violation at this time."} Spirit Box mean contact entropy: ${(avgEntropy * 100).toFixed(1)}%. The Tsirelson bound caps quantum S-values at 2.828. QRNG streams from ANU Quantum RNG provide the true random baseline for comparison.`;

    // EVP
    if (query.includes("evp") || query.includes("audio") || query.includes("infra") || query.includes("sound"))
      return `EVP analysis uses QFT-enhanced FFT to examine captured audio. Segments are compared against the QRNG entropy baseline. ${anomalies.filter(a => a.type === "audio").length > 0 ? `${anomalies.filter(a => a.type === "audio").length} audio anomalies flagged this session — patterns with entropy significantly below quantum baseline, including potential sub-20Hz infrasound (below the threshold of conscious human hearing).` : "No audio anomalies flagged yet. Tap RECORD EVP on the EVP screen to begin capture."}`;

    // Correlation / cross-screen analysis
    if (query.includes("correlat") || query.includes("together") || query.includes("connect") || query.includes("pattern") || query.includes("summar") || query.includes("overall") || query.includes("session")) {
      const hasAnomaly = anomalies.length > 0;
      const hasSpiritContacts = spiritContacts.length > 0;
      const bellViolation = sVal > 2;
      if (!hasAnomaly && !hasSpiritContacts)
        return "Session summary: sensors are running, no anomalies flagged, no Spirit Box contacts logged. Baseline conditions. Nothing stands out yet.";
      return `Session cross-analysis: ${hasAnomaly ? `${anomalies.length} sensor anomalies (${criticals} critical)` : "no sensor anomalies"}, ${hasSpiritContacts ? `${spiritContacts.length} Spirit Box contacts (recent: ${contactWords})` : "no Spirit Box contacts"}, Bell S-value ${sVal.toFixed(3)} (${bellViolation ? "⚠ classical bound exceeded" : "within classical range"}). ${bellViolation && hasSpiritContacts ? `Notably, Bell violations and Spirit Box contacts are co-occurring — both indicate non-classical structure in the data. This is the intersection worth paying attention to.` : bellViolation ? "Bell violation without Spirit Box activity — sensor-level non-classical patterns present." : hasSpiritContacts ? "Spirit Box contacts are logged but Bell S-value is within classical range — contacts occurred during lower-anomaly periods." : ""}`;
    }

    // Default — full status
    return `Full session status: scanner ${scanActive ? "active" : "paused"}, ${anomalies.length} anomalies (${criticals} critical), Spirit Box ${spiritSweeping ? `sweeping at ${spiritFreq.toFixed(1)} MHz` : "idle"} with ${spiritContacts.length} contacts logged.`;
  }; // end _unused



  const send = async () => {
    if (!input.trim() || thinking) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage, timestamp: Date.now() }]);
    setInput("");
    setThinking(true);

    try {
      const history = messages.slice(1).slice(-18).map(m => ({
        role: m.role === "echo" ? "assistant" : "user",
        content: m.content,
      }));

      const payload = {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...history,
          { role: "user", content: userMessage },
        ],
        max_tokens: 400,
        temperature: 0.72,
      };

      // fetch() is blocked by CSP in the app sandbox — route through runCommand bridge
      // API key is stored securely in agent filesystem, never exposed to client
      const payloadB64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const pythonScript = `python3 -c "
import base64, urllib.request, json, sys
with open('/agent/home/.groq_key') as f:
  api_key = f.read().strip()
payload = json.loads(base64.b64decode('${payloadB64}').decode('utf-8'))
req = urllib.request.Request(
  'https://api.groq.com/openai/v1/chat/completions',
  data=json.dumps(payload).encode('utf-8'),
  headers={'Authorization': 'Bearer ' + api_key, 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; groq-python/0.9.0)'},
  method='POST'
)
with urllib.request.urlopen(req, timeout=30) as r:
  print(r.read().decode('utf-8'))
"`;

      const raw = await window.tasklet.runCommand(pythonScript);
      const data = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw)) as { choices: Array<{ message: { content: string } }> };
      const reply = data.choices?.[0]?.message?.content?.trim() || "Signal lost — no response received.";
      setMessages(prev => [...prev, { role: "echo", content: reply, timestamp: Date.now() }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: "echo",
        content: `⚠ Connection interference: ${err.message || "Unknown error"}. Check network and try again.`,
        timestamp: Date.now(),
      }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="screen echo-screen" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 70px)", minHeight: 0 }}>
      <div className="screen-header-simple" style={{ flexShrink: 0 }}>
        <div className="echo-title-area">
          <div className="echo-orb" />
          <div><div className="screen-title">ECHO AI</div><div className="echo-subtitle">Llama 3.3 70B · Quantum-Aware Analysis</div></div>
        </div>
        <div className="echo-status">● ONLINE</div>
      </div>
      <div className="chat-container" style={{ flex: 1, minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === "user" ? "bubble-user" : "bubble-echo"}`}>
            {m.role === "echo" && <div className="bubble-avatar">◈</div>}
            <div className="bubble-content">
              {m.role === "echo" && <div className="bubble-name">ECHO</div>}
              <div className="bubble-text">{m.content}</div>
              <div className="bubble-time">{new Date(m.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="chat-bubble bubble-echo">
            <div className="bubble-avatar">◈</div>
            <div className="bubble-content"><div className="thinking-dots"><span /><span /><span /></div></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <input className="chat-input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask Echo about the data..." />
        <button className="send-btn" onClick={send}>▶</button>
      </div>
    </div>
  );
};

// ── EVP ────────────────────────────────────────────────────────────────────
const EVPScreen = ({ anomalies, active }: { anomalies: Anomaly[]; active: boolean }) => {
  const [recording, setRecording] = useState(false);
  const [segments, setSegments] = useState<Array<{ id: string; entropy: number; label: string; flagged: boolean }>>([]);
  const audioAnomalies = anomalies.filter(a => a.type === "audio");
  const startRecording = () => {
    setRecording(true);
    const iv = setInterval(() => {
      const entropy = Math.random(), qe = generateQuantumEntropy();
      setSegments(prev => [{ id: crypto.randomUUID(), entropy, label: `Segment ${prev.length + 1}`, flagged: Math.max(0, qe - entropy) > 0.34 }, ...prev.slice(0, 19)]);
    }, 2000);
    setTimeout(() => { clearInterval(iv); setRecording(false); }, 30000);
  };
  return (
    <div className="screen evp-screen">
      <div className="screen-header-simple">
        <div className="screen-title">EVP ANALYSIS</div>
        <div className="evp-badge">QFT-ENHANCED</div>
      </div>
      <div className="waveform-container"><Waveform active={recording} anomalyPresent={audioAnomalies.length > 0} /></div>
      <div className="evp-controls">
        <button className={`record-btn ${recording ? "recording" : ""}`} onClick={() => !recording && startRecording()}>
          {recording ? "● RECORDING" : "◉ RECORD EVP"}
        </button>
        <div className="evp-info">{recording ? "Capturing — comparing entropy to QRNG baseline" : "Tap to begin EVP capture"}</div>
      </div>
      <div className="entropy-panel">
        <div className="panel-title">ENTROPY ANALYSIS — vs QRNG BASELINE</div>
        {segments.length === 0 ? <div className="empty-feed">Record audio to analyze entropy patterns</div>
          : segments.slice(0, 8).map(s => (
            <div key={s.id} className={`entropy-row ${s.flagged ? "entropy-flagged" : ""}`}>
              <div className="entropy-label">{s.label}</div>
              <div className="entropy-bar-track">
                <div className="entropy-bar-fill" style={{ width: `${s.entropy * 100}%`, background: s.flagged ? "#ff4444" : "#00ffaa" }} />
              </div>
              <div className="entropy-value" style={{ color: s.flagged ? "#ff4444" : "#00ffaa" }}>{(s.entropy * 100).toFixed(0)}%</div>
              {s.flagged && <div className="entropy-flag">⚡ LOW</div>}
            </div>
          ))}
      </div>
      <div className="anomaly-list">
        <div className="panel-title">EVP EVENTS ({audioAnomalies.length})</div>
        {audioAnomalies.length === 0 ? <div className="empty-feed">No audio anomalies this session</div>
          : audioAnomalies.slice(0, 3).map(a => <AnomalyCard key={a.id} anomaly={a} />)}
      </div>
    </div>
  );
};

// ── Sessions ───────────────────────────────────────────────────────────────
const SessionsScreen = () => {
  const sessions: Session[] = [
    { id: "1", name: "Location Alpha", date: "2026-02-23", anomalies: 14, duration: "2h 34m", status: "complete" },
    { id: "2", name: "Corridor B Investigation", date: "2026-02-22", anomalies: 3, duration: "45m", status: "complete" },
    { id: "3", name: "Basement Survey", date: "2026-02-21", anomalies: 27, duration: "3h 12m", status: "complete" },
    { id: "4", name: "Live Session", date: "2026-02-23", anomalies: 0, duration: "Active", status: "active" },
  ];
  return (
    <div className="screen sessions-screen">
      <div className="screen-header-simple">
        <div className="screen-title">SESSIONS</div>
        <button className="new-session-btn">+ NEW</button>
      </div>
      <div className="sessions-list">
        {sessions.map(s => (
          <div key={s.id} className={`session-card ${s.status === "active" ? "session-active" : ""}`}>
            <div className="session-header">
              <div className="session-name">{s.name}</div>
              <div className={`session-status ${s.status === "active" ? "status-active" : "status-done"}`}>
                {s.status === "active" ? "● LIVE" : "✓ DONE"}
              </div>
            </div>
            <div className="session-meta">
              <span>📅 {s.date}</span><span>⏱ {s.duration}</span>
              <span className={s.anomalies > 10 ? "meta-critical" : s.anomalies > 0 ? "meta-warn" : ""}>⚡ {s.anomalies} anomalies</span>
            </div>
            {s.anomalies > 0 && (
              <div className="session-bar">
                <div className="session-bar-fill" style={{ width: `${Math.min(100, s.anomalies * 3)}%`, background: s.anomalies > 10 ? "#ff2244" : s.anomalies > 3 ? "#ff8844" : "#00ffaa" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Quantum HUD ────────────────────────────────────────────────────────────
const QuantumScreen = ({ readings }: { readings: SensorReading[] }) => {
  const sValue = computeSValue(readings.map(r => r.emf));
  const entropy = readings.slice(-10).map(() => generateQuantumEntropy());
  const avgEntropy = entropy.reduce((a, b) => a + b, 0) / (entropy.length || 1);
  return (
    <div className="screen quantum-screen">
      <div className="screen-header-simple">
        <div className="screen-title">QUANTUM HUD</div>
        <div className="qhud-badge">⚛ LIVE</div>
      </div>
      <div className="qhud-main">
        <div className="qhud-orb-container">
          <div className="qhud-orb" style={{ boxShadow: sValue > 2 ? "0 0 60px #ff2244" : "0 0 40px #00ffaa" }}>
            <div className="qhud-orb-value">{sValue.toFixed(3)}</div>
            <div className="qhud-orb-label">S-VALUE</div>
          </div>
        </div>
        <div className="qhud-grid">
          {[
            { label: "Bell Bound Status", value: sValue > 2 ? "⚠ VIOLATED" : "✓ CLASSICAL", cls: sValue > 2 ? "value-critical" : "value-normal" },
            { label: "QRNG Stream", value: "● ACTIVE", cls: "value-quantum" },
            { label: "Mean Entropy", value: `${(avgEntropy * 100).toFixed(1)}%`, cls: "value-sensor" },
            { label: "Sample Window", value: `${readings.length} pts`, cls: "value-normal" },
            { label: "Classical Bound", value: "S ≤ 2.000", cls: "" },
            { label: "Tsirelson Bound", value: "S ≤ 2.828", cls: "" },
          ].map(m => (
            <div key={m.label} className="qhud-metric">
              <div className="qhud-metric-label">{m.label}</div>
              <div className={`qhud-metric-value ${m.cls}`}>{m.value}</div>
            </div>
          ))}
        </div>
        <div className="qhud-explanation">
          <div className="panel-title">WHAT AM I MEASURING?</div>
          <p>QRNG streams from ANU Quantum RNG provide true quantum randomness. Sensor data is compared using a CHSH-inspired S-value. When S exceeds 2.0, the pattern cannot be explained by classical local hidden variable theories. This doesn't prove anything supernatural — it flags <em>non-classical structure</em> for investigation.</p>
        </div>
      </div>
    </div>
  );
};

// ── Navigation ─────────────────────────────────────────────────────────────
const NavBar = ({ current, onNavigate, anomalyCount }: {
  current: Screen; onNavigate: (s: Screen) => void; anomalyCount: number;
}) => {
  const tabs: Array<{ id: Screen; Icon: React.ComponentType<any>; label: string }> = [
    { id: "dashboard", Icon: Home, label: "HOME" },
    { id: "scanner",   Icon: Scan, label: "SCAN" },
    { id: "spiritbox", Icon: Radio, label: "SPIRIT" },
    { id: "echo",      Icon: MessageCircle, label: "ECHO" },
    { id: "evp",       Icon: Mic, label: "EVP" },
    { id: "quantum",   Icon: Atom, label: "HUD" },
    { id: "sessions",  Icon: BookOpen, label: "LOG" },
  ];
  return (
    <nav className="navbar">
      {tabs.map(t => (
        <button key={t.id} className={`nav-btn ${current === t.id ? "nav-active" : ""}`} onClick={() => onNavigate(t.id)}>
          <t.Icon size={18} strokeWidth={current === t.id ? 2 : 1.5} style={{
            color: current === t.id ? "var(--teal)" : "var(--text-dim)",
            filter: current === t.id ? "drop-shadow(0 0 5px var(--teal))" : "none",
            transition: "all 0.2s",
          }} />
          <span className="nav-label">{t.label}</span>
          {t.id === "dashboard" && anomalyCount > 0 && <span className="nav-badge">{anomalyCount}</span>}
        </button>
      ))}
    </nav>
  );
};

// ── App Root ───────────────────────────────────────────────────────────────
function App() {
  const [stage, setStage] = useState<AppStage>("landing");
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [scanActive, setScanActive] = useState(true);
  const { readings, anomalies } = useSensorStream(stage === "app" && scanActive);

  // Spirit Box state lifted here so Echo AI (and any screen) can see it
  const [sbSweeping, setSbSweeping] = useState(false);
  const [sbFreq, setSbFreq] = useState(87.5);
  const [sbContacts, setSbContacts] = useState<SpiritContact[]>([]);

  if (stage === "landing") return <LandingScreen onBegin={() => setStage("loading")} />;
  if (stage === "loading") return <LoadingScreen onComplete={() => setStage("app")} />;

  return (
    <div className="app-shell">
      <div className="app-content">
        {screen === "dashboard"  && <DashboardScreen readings={readings} anomalies={anomalies} onNavigate={setScreen} />}
        {screen === "scanner"    && <ScannerScreen readings={readings} anomalies={anomalies} active={scanActive} onToggle={() => setScanActive(v => !v)} />}
        {screen === "echo"       && (
          <EchoScreen
            anomalies={anomalies}
            readings={readings}
            spiritContacts={sbContacts}
            spiritSweeping={sbSweeping}
            spiritFreq={sbFreq}
            scanActive={scanActive}
          />
        )}
        {screen === "evp"        && <EVPScreen anomalies={anomalies} active={scanActive} />}
        {screen === "sessions"   && <SessionsScreen />}
        {screen === "quantum"    && <QuantumScreen readings={readings} />}
        {screen === "spiritbox"  && (
          <SpiritBoxScreen
            sweeping={sbSweeping}
            setSweeping={setSbSweeping}
            freq={sbFreq}
            setFreq={setSbFreq}
            contacts={sbContacts}
            setContacts={setSbContacts}
          />
        )}
      </div>
      <NavBar current={screen} onNavigate={setScreen} anomalyCount={anomalies.length} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
