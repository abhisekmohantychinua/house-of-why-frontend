import React, { useEffect, useRef, useState } from "react";

// Sound layer — opt-in. Provides notification stack burst + ambient drone via Web Audio API.
export function useSoundEngine() {
  const ctxRef = useRef(null);
  const droneRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      ctxRef.current = new Ctx();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };

  const enable = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (!droneRef.current) {
      // Two detuned saws + low-pass filter = cinematic drone
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.type = "sawtooth"; o2.type = "sawtooth";
      o1.frequency.value = 55;       // A1
      o2.frequency.value = 55 * 1.005;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 280;
      filter.Q.value = 4;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      o1.connect(filter); o2.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      o1.start(); o2.start();
      // Fade in
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5);
      droneRef.current = { o1, o2, filter, gain };
    } else {
      droneRef.current.gain.gain.cancelScheduledValues(ctx.currentTime);
      droneRef.current.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2);
    }
    setEnabled(true);
  };

  const disable = () => {
    const ctx = ctxRef.current;
    if (ctx && droneRef.current) {
      droneRef.current.gain.gain.cancelScheduledValues(ctx.currentTime);
      droneRef.current.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    }
    setEnabled(false);
  };

  // Notification burst: rapid stack of short sine pings
  const burst = (count = 28) => {
    if (!enabled || !ctxRef.current || ctxRef.current.state !== "running") return;
    const ctx = ctxRef.current;
    const baseFreqs = [620, 880, 1320, 1760, 980, 740];
    for (let i = 0; i < count; i++) {
      const t = ctx.currentTime + i * 0.045 + Math.random() * 0.02;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = baseFreqs[i % baseFreqs.length] * (0.95 + Math.random() * 0.1);
      gain.gain.value = 0;
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.start(t); osc.stop(t + 0.22);
    }
  };

  // Single "click" tick (used on letter Y zoom)
  const tick = () => {
    if (!enabled || !ctxRef.current || ctxRef.current.state !== "running") return;
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 200;
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => () => {
    try {
      droneRef.current?.o1.stop();
      droneRef.current?.o2.stop();
      ctxRef.current?.close();
    } catch (e) {}
  }, []);

  return { enabled, enable, disable, burst, tick };
}

export default function SoundToggle({ engine }) {
  const { enabled, enable, disable } = engine;
  return (
    <button
      data-testid="sound-toggle"
      onClick={() => (enabled ? disable() : enable())}
      className="fixed top-20 right-6 z-[60] font-mono text-[10px] tracking-[0.3em] uppercase border border-white/20 hover:border-white px-3 py-2 text-white/80 hover:text-white transition-colors"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
      aria-label="Toggle sound"
    >
      <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ background: enabled ? "#E50914" : "rgba(255,255,255,0.3)", boxShadow: enabled ? "0 0 8px #E50914" : "none" }} />
      {enabled ? "SOUND ON" : "SOUND OFF"}
    </button>
  );
}
