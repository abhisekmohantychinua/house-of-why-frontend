import React, { useEffect, useRef, useState } from "react";

// Section 1: The Question
// Black screen, typewriter "WHY?", then chaotic post explosion, then disintegrate, then zoom into Y
export default function SectionQuestion({ onBurst, onTunnel }) {
  const [phase, setPhase] = useState(0); // 0: typing why, 1: posts explode, 2: how questions, 3: disintegrate
  const [typed, setTyped] = useState("");
  const containerRef = useRef(null);
  const burstRef = useRef(onBurst);
  const tunnelRef = useRef(onTunnel);
  burstRef.current = onBurst;
  tunnelRef.current = onTunnel;

  useEffect(() => {
    let mounted = true;
    const sequence = async () => {
      const word = "WHY?";
      for (let i = 0; i <= word.length; i++) {
        if (!mounted) return;
        setTyped(word.slice(0, i));
        await new Promise((r) => setTimeout(r, 280));
      }
      await new Promise((r) => setTimeout(r, 1100));
      if (!mounted) return;
      setPhase(1);
      burstRef.current?.();
      await new Promise((r) => setTimeout(r, 1400));
      if (!mounted) return;
      setPhase(2);
      await new Promise((r) => setTimeout(r, 4200));
      if (!mounted) return;
      setPhase(3);
      tunnelRef.current?.();
    };
    sequence();
    return () => { mounted = false; };
  }, []);

  // Generate chaotic post positions
  const posts = React.useMemo(() => {
    const labels = ["BOOSTED", "SPONSORED", "SKIP IN 5", "AD", "TRENDING", "PROMOTED", "#VIRAL", "REEL", "SHORT", "PAID PARTNERSHIP", "BUY NOW", "LIMITED"];
    return Array.from({ length: 64 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rot: (Math.random() - 0.5) * 40,
      delay: Math.random() * 0.8,
      label: labels[i % labels.length],
      w: 80 + Math.random() * 140,
    }));
  }, []);

  return (
    <section
      ref={containerRef}
      data-testid="section-question"
      className="section relative w-full overflow-hidden"
      style={{ background: "#000", minHeight: "160vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Y-tunnel scroll layers (visible only as user scrolls towards bottom of section) */}
      {phase === 3 && (
        <div className="absolute inset-0 pointer-events-none" style={{ perspective: "1000px" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
            <div
              key={k}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily: "Clash Display, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(120px, 26vw, 480px)",
                color: "transparent",
                WebkitTextStroke: `1px rgba(229,9,20,${0.6 - k * 0.06})`,
                transform: `translateZ(${-k * 220}px) scale(${1 + k * 0.4})`,
                opacity: Math.max(0, 1 - k * 0.12),
                animation: `tunnelPulse ${3 + k * 0.3}s ease-in-out infinite ${k * 0.08}s`,
              }}
            >
              Y
            </div>
          ))}
        </div>
      )}
      {/* Posts explosion */}
      <div
        className="posts-explosion absolute inset-0 pointer-events-none"
        style={{
          opacity: phase >= 1 && phase < 3 ? 1 : 0,
          transition: "opacity 0.6s",
          filter: phase === 2 ? "saturate(1.1)" : "none",
        }}
      >
        {posts.map((p) => (
          <div
            key={p.id}
            className="post-tile"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) rotate(${p.rot}deg) scale(${phase >= 1 ? 1 : 0})`,
              opacity: phase >= 1 ? (phase === 3 ? 0 : 0.8) : 0,
              width: p.w,
              transition: `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${p.delay}s, opacity 1.2s`,
            }}
          >
            {p.label}
          </div>
        ))}
      </div>

      {/* Center text */}
      <div className="relative z-10 text-center px-6">
        {phase < 2 && (
          <h1
            data-testid="hero-why-text"
            className="font-display text-white"
            style={{
              fontSize: "clamp(80px, 18vw, 280px)",
              lineHeight: 1,
              fontWeight: 700,
              opacity: phase === 3 ? 0 : 1,
              transition: "opacity 0.8s",
              filter: phase === 3 ? "blur(20px)" : "none",
            }}
          >
            {typed}
            {typed.length < 4 && <span className="caret">&nbsp;</span>}
          </h1>
        )}

        {phase === 2 && (
          <div className="font-display text-white space-y-3" style={{ animation: "float-up 0.6s ease both" }}>
            <p className="text-xs font-mono tracking-[0.4em] text-white/40 mb-8">EVERYONE IS ASKING HOW.</p>
            {[
              "How do we get more reach?",
              "How do we go viral?",
              "How do we sell more?",
              "How do we grow?",
              "How do we win?",
            ].map((q, i) => (
              <p
                key={i}
                className="font-display text-white/80"
                style={{
                  fontSize: "clamp(20px, 3vw, 40px)",
                  letterSpacing: "-0.02em",
                  opacity: 0,
                  animation: `float-up 0.7s ease ${i * 0.18}s both`,
                }}
              >
                {q}
              </p>
            ))}
          </div>
        )}

        {phase === 3 && (
          <div className="text-center" style={{ animation: "float-up 1s ease both" }}>
            <h2
              className="font-display text-white"
              style={{ fontSize: "clamp(40px, 8vw, 120px)", letterSpacing: "-0.04em", lineHeight: 1 }}
            >
              NOBODY ASKS<br />
              <span style={{ color: "#E50914" }}>WHY.</span>
            </h2>
            <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 mt-10">SCROLL ↓</p>
          </div>
        )}
      </div>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.9) 100%)"
      }} />
      </div>
    </section>
  );
}
