import React, { useEffect, useRef, useState } from "react";
import ConstellationThree from "../components/ConstellationThree";
import { SplitHeading } from "../components/MotionExtras";

// Animated count-up
function CountUp({ value, duration = 1800, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setN(value * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration]);
  // Format: Indian style for big values
  const format = (v) => {
    if (value >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (value >= 1e5) {
      // Indian numbering: e.g. 5,00,000
      const i = Math.floor(v);
      const s = i.toString();
      if (s.length <= 3) return s;
      const last3 = s.slice(-3);
      const rest = s.slice(0, -3);
      const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      return grouped + "," + last3;
    }
    return Math.floor(v).toString();
  };
  return <span ref={ref}>{format(n)}{suffix}</span>;
}

// Section 5: Creator Constellation with true WebGL Three.js + count-up
export default function SectionConstellation() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { v: 500000, suffix: "+", l: "Creators" },
    { v: 2, suffix: "B+", l: "Views", custom: "2B+" },
    { v: 200, suffix: "+", l: "Campaigns" },
    { v: 23, suffix: "", l: "Languages" },
    { v: 7, suffix: "", l: "Platforms" },
    { v: 6, suffix: "", l: "Cities" },
  ];

  return (
    <section
      ref={ref}
      data-testid="section-constellation"
      className="section relative w-full"
      style={{ minHeight: "100vh", background: "#000", padding: "120px 0" }}
    >
      <ConstellationThree />
      <div className="relative z-10 max-w-7xl mx-auto px-8 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">05 / CREATOR CONSTELLATION</p>
        <h2 className="font-display text-white" style={{ fontSize: "clamp(48px, 8vw, 130px)", letterSpacing: "-0.04em", lineHeight: 0.92 }}>
          <SplitHeading>CULTURE DOESN'T</SplitHeading><br/>
          <SplitHeading>SPREAD.</SplitHeading><br/>
          <SplitHeading style={{ color: "#E50914" }}>PEOPLE DO.</SplitHeading>
        </h2>
        <p className="font-mono text-sm text-white/60 mt-8 max-w-md">
          One network. 23 languages. Built to move ideas at internet speed.
        </p>

        <div className="flex flex-wrap items-end gap-x-8 gap-y-10 mt-20 max-w-5xl">
          {stats.map((s, i) => (
            <div
              key={s.l}
              data-testid={`stat-${s.l.toLowerCase()}`}
              className="border-l border-white/10 pl-4"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.8s ${i*0.1}s` }}
            >
              <div className="counter">
                {s.custom ? s.custom : <CountUp value={s.v} suffix={s.suffix} />}
              </div>
              <div className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
