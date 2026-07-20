import React, { useEffect, useRef, useState } from "react";

// Cinematic page loader: black → heartbeat → "WELCOME TO THE HOUSE OF WHY" → release
export default function Loader({ onDone }) {
  const [phase, setPhase] = useState(0); // 0: black, 1: typing, 2: pulse, 3: release
  const [t, setT] = useState("");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const word = "WELCOME TO THE HOUSE OF WHY";
    let mounted = true;
    const seq = async () => {
      document.body.style.overflow = "hidden";
      await new Promise((r) => setTimeout(r, 350));
      if (!mounted) return;
      setPhase(1);
      for (let i = 0; i <= word.length; i++) {
        if (!mounted) return;
        setT(word.slice(0, i));
        await new Promise((r) => setTimeout(r, 38));
      }
      await new Promise((r) => setTimeout(r, 600));
      if (!mounted) return;
      setPhase(2);
      await new Promise((r) => setTimeout(r, 900));
      if (!mounted) return;
      setPhase(3);
      await new Promise((r) => setTimeout(r, 900));
      if (!mounted) return;
      document.body.style.overflow = "";
      onDoneRef.current?.();
    };
    seq();
    return () => {
      mounted = false;
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      data-testid="loader"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: "#000",
        opacity: phase === 3 ? 0 : 1,
        pointerEvents: phase === 3 ? "none" : "auto",
        transition: "opacity 0.9s cubic-bezier(0.7, 0, 0.3, 1)",
      }}
    >
      {/* heartbeat ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative" style={{ width: 220, height: 220 }}>
          <div
            className="absolute inset-0 rounded-full border border-white/20"
            style={{ animation: "pulse-ring 2.4s infinite ease-out" }}
          />
          <div
            className="absolute inset-6 rounded-full border border-[#E50914]/40"
            style={{ animation: "pulse-ring 2.4s infinite ease-out 0.4s" }}
          />
          <div
            className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E50914]"
            style={{
              width: 14,
              height: 14,
              left: "50%",
              top: "50%",
              animation: "loadHeart 0.9s infinite ease-in-out",
              boxShadow: "0 0 40px rgba(229,9,20,0.8)",
            }}
          />
        </div>
      </div>

      {/* Top mark */}
      <div className="absolute top-10 left-10 font-mono text-[10px] tracking-[0.4em] text-white/40">
        SIGNAL · BOOTING
      </div>
      <div className="absolute top-10 right-10 font-mono text-[10px] tracking-[0.4em] text-white/40">
        v1.0
      </div>

      {/* Center text */}
      <div className="absolute bottom-24 left-0 right-0 text-center px-6">
        <p
          className="font-display text-white"
          style={{
            fontSize: "clamp(20px, 2.6vw, 36px)",
            letterSpacing: "-0.02em",
            opacity: phase >= 1 ? 1 : 0,
            transition: "opacity 0.6s",
          }}
        >
          {t}
          {phase < 2 && <span className="caret">&nbsp;</span>}
        </p>
        <p
          className="font-mono text-[10px] tracking-[0.5em] text-white/40 mt-4"
          style={{ opacity: phase === 2 ? 1 : 0, transition: "opacity 0.4s" }}
        >
          ENTER →
        </p>
      </div>

      {/* Curtain reveal */}
      <div
        className="absolute inset-0"
        style={{
          background: "#000",
          transform: phase === 3 ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 1.2s cubic-bezier(0.7, 0, 0.3, 1)",
        }}
      />
    </div>
  );
}
