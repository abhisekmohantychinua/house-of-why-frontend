import React, { useEffect, useRef, useState } from "react";
import { SplitHeading } from "../components/MotionExtras";

// Section 2: The Attention Graveyard
// Dead content drifting. On scroll, some catch fire and turn into "creator" tiles.
export default function SectionGraveyard() {
  const [igniteAmount, setIgniteAmount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      setIgniteAmount(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tiles = React.useMemo(() => {
    const tags = ["BOOSTED", "SPONSORED", "SKIP", "IGNORE", "PROMOTED", "AD", "DISMISSED", "MUTED"];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (i % 6) * 16 + Math.random() * 4,
      y: Math.floor(i / 6) * 16 + Math.random() * 4,
      tag: tags[i % tags.length],
      drift: Math.random() * 2 - 1,
    }));
  }, []);

  return (
    <section
      ref={ref}
      data-testid="section-graveyard"
      className="section relative w-full"
      style={{ minHeight: "120vh", background: "#000" }}
    >
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Star field */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 75% 80%, #fff, transparent), radial-gradient(1px 1px at 50% 50%, #fff, transparent), radial-gradient(2px 2px at 10% 70%, #fff, transparent)",
          backgroundSize: "240px 240px"
        }} />

        {/* Floating dead/alive tiles */}
        <div className="absolute inset-0">
          {tiles.map((t) => {
            const alive = (t.id / tiles.length) < igniteAmount;
            return (
              <div
                key={t.id}
                className="absolute"
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: 130,
                  height: 80,
                  transform: `translate(-50%, -50%) translateY(${(igniteAmount * 80) * t.drift}px)`,
                  background: alive
                    ? `linear-gradient(135deg, #E50914 0%, #FFB000 100%)`
                    : "#0a0a0a",
                  border: `1px solid ${alive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                  filter: alive ? "brightness(1.05)" : "grayscale(1) brightness(0.5) blur(0.5px)",
                  transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: alive ? "#000" : "#444",
                }}
              >
                {alive ? "CHOSEN" : t.tag}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-8">
          <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">02 / THE ATTENTION GRAVEYARD</p>
          <h2 className="font-display text-white mb-10" style={{ fontSize: "clamp(48px, 8vw, 120px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
            <SplitHeading>ATTENTION ISN'T BOUGHT.</SplitHeading><br/>
            <span className="bleed-text"><SplitHeading>IT'S EARNED.</SplitHeading></span>
          </h2>
          <div className="max-w-xl space-y-4 font-mono text-sm text-white/60 leading-relaxed">
            <p>Most brands rent attention.</p>
            <p>Then wonder why it disappears.</p>
            <p className="text-white">We build attention people choose.</p>
            <p className="text-white/40">Because the strongest media channel isn't media.</p>
            <p className="text-white" style={{ color: "#E50914" }}>It's <span className="font-display text-white" style={{ fontStyle: "italic" }}>memory</span>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
