import React, { useEffect, useRef, useState } from "react";

// Section 8: The Internet Breaker — Full-screen glitch with RGB split, datamosh, broken layouts
export default function SectionBreaker() {
  const ref = useRef(null);
  const [phase, setPhase] = useState(0); // 0 hidden, 1 chaos, 2 resolved

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setPhase(1);
        setTimeout(() => setPhase(2), 2400);
      }
    }, { threshold: 0.35 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const errors = React.useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    text: ["404 NOT FOUND", "ERR_CONNECTION_RESET", "TypeError: undefined", "<Component />", "[BROKEN]", "Failed to fetch", "panic: runtime", "</html>", "TimeoutError", "Segfault 0x0000", "STACK OVERFLOW", "RAM EXCEEDED"][i % 12],
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 8 + Math.random() * 6,
    rot: (Math.random() - 0.5) * 20,
    delay: Math.random() * 0.6,
  })), []);

  const noiseBars = React.useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    top: Math.random() * 100,
    h: 2 + Math.random() * 30,
    delay: Math.random() * 1.4,
  })), []);

  return (
    <section
      ref={ref}
      data-testid="section-breaker"
      className="section relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#000", padding: "120px 0" }}
    >
      {/* RGB scanlines layer */}
      {phase === 1 && (
        <div className="absolute inset-0 pointer-events-none datamosh" />
      )}

      {/* Horizontal slice glitches */}
      {phase === 1 && noiseBars.map((b, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${b.top}%`,
            height: b.h,
            background: i % 2 === 0 ? "rgba(229,9,20,0.4)" : "rgba(0,255,255,0.35)",
            mixBlendMode: "screen",
            transform: `translateX(${(Math.random() - 0.5) * 80}px)`,
            animation: `errShift 0.18s infinite ${b.delay}s`,
          }}
        />
      ))}

      {/* Stray error labels */}
      {phase === 1 && errors.map((e, i) => (
        <div
          key={i}
          className="absolute font-mono pointer-events-none"
          style={{
            top: `${e.top}%`,
            left: `${e.left}%`,
            fontSize: e.size,
            color: i % 4 === 0 ? "#E50914" : i % 4 === 1 ? "#00FFFF" : "rgba(255,255,255,0.45)",
            transform: `rotate(${e.rot}deg)`,
            animation: `errShift ${0.12 + e.delay * 0.5}s infinite`,
          }}
        >
          {e.text}
        </div>
      ))}

      {/* Center content */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-8">
        {phase < 2 ? (
          <>
            <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">08 / SIGNAL LOST</p>
            <h2
              className="font-display rgb-split-text"
              data-text="WE BREAK THE INTERNET"
              style={{ fontSize: "clamp(48px, 9vw, 140px)", letterSpacing: "-0.04em", color: "#fff", lineHeight: 0.9 }}
            >
              WE BREAK<br/>THE INTERNET
            </h2>
            <div className="mt-6 font-mono text-[10px] tracking-[0.4em] text-white/50">
              <span style={{ color: "#E50914" }}>● REC</span> &nbsp; 00:00:0{phase} &nbsp; / &nbsp; 24FPS
            </div>
          </>
        ) : (
          <div style={{ animation: "float-up 0.9s ease both" }}>
            <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">08 / SIGNAL RESTORED</p>
            <h2 className="font-display text-white" style={{ fontSize: "clamp(40px, 6vw, 90px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              WE BUILD.<br/>WE LAUNCH.<br/><span style={{ color: "#E50914" }}>WE BREAK THE INTERNET.</span>
            </h2>
            <p className="font-mono text-sm text-white/50 mt-8">Sometimes in that order.</p>
            <div className="mt-12 inline-block">
              <div className="font-display text-white text-4xl border border-white/30 px-8 py-4">
                HOUSE <span className="text-white/50">/</span> OF <span className="text-white/50">/</span> WHY
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
