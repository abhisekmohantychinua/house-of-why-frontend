import React, { useEffect, useRef, useState } from "react";
import { SplitHeading } from "../components/MotionExtras";

// Section 3: House of Why Manifesto — Animated 3D house with floating, glow, particles
export default function SectionManifesto() {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = Math.max(0, Math.min(1, 1 - (r.top / vh)));
      setP(prog);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cx, y: cy });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  // House shape: array of brick coords (col,row)
  const bricks = React.useMemo(() => {
    const list = [];
    // Roof triangle (rows 0-3)
    for (let r = 0; r < 4; r++) {
      for (let c = 3 - r; c <= 4 + r; c++) list.push({ c, r });
    }
    // Body (rows 4-9) with door cutout
    for (let r = 4; r < 10; r++) {
      for (let c = 0; c < 8; c++) {
        if (r >= 7 && (c === 3 || c === 4)) continue;
        list.push({ c, r });
      }
    }
    // Mark window bricks (glow)
    return list.map((b, i) => {
      const isWindow =
        (b.r === 5 && (b.c === 1 || b.c === 6)) ||
        (b.r === 6 && (b.c === 1 || b.c === 6));
      const isRoofLight = b.r === 1 && (b.c === 3 || b.c === 4);
      return { ...b, isWindow, isRoofLight, idx: i };
    });
  }, []);

  // Floating embers around the house
  const embers = React.useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        x: 30 + Math.random() * 40,
        y: 20 + Math.random() * 60,
        d: 4 + Math.random() * 8,
        delay: Math.random() * 4,
        dur: 4 + Math.random() * 4,
      })),
    []
  );

  return (
    <section
      ref={ref}
      data-testid="section-manifesto"
      className="section relative w-full overflow-hidden"
      style={{ minHeight: "115vh", background: "#000" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Ambient backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(229,9,20,0.12), transparent 55%), radial-gradient(circle at 70% 60%, rgba(255,176,0,0.06), transparent 50%)",
            opacity: 0.5 + p * 0.5,
            transition: "opacity 0.8s",
          }}
        />

        {/* Concentric rings behind house */}
        <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
          {[1, 2, 3].map((r) => (
            <div
              key={r}
              className="absolute rounded-full border border-white/5"
              style={{
                width: r * 220,
                height: r * 220,
                left: -r * 110,
                top: -r * 110,
                animation: `pulse-ring ${4 + r}s infinite ease-out`,
                animationDelay: `${r * 0.6}s`,
              }}
            />
          ))}
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
          {/* House visual */}
          <div
            className="flex items-center justify-center relative"
            style={{ perspective: "1400px", minHeight: 480 }}
            onMouseMove={onMouseMove}
            onMouseLeave={onLeave}
          >
            {/* Floating embers */}
            <div className="absolute inset-0 pointer-events-none">
              {embers.map((e, i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${e.x}%`,
                    top: `${e.y}%`,
                    width: e.d,
                    height: e.d,
                    background: i % 3 === 0 ? "#E50914" : "#FFB000",
                    filter: "blur(1px)",
                    opacity: 0.7,
                    animation: `emberFloat ${e.dur}s ease-in-out ${e.delay}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* Spotlight beam */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "120%",
                height: "200%",
                top: "-50%",
                background:
                  "linear-gradient(180deg, rgba(229,9,20,0.18), transparent 60%)",
                clipPath: "polygon(40% 0, 60% 0, 80% 100%, 20% 100%)",
                opacity: p,
                transition: "opacity 0.8s",
              }}
            />

            {/* Floating + tilt wrapper */}
            <div
              className="house-float"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${10 - p * 8 + tilt.y * -8}deg) rotateY(${
                  -15 + p * 5 + tilt.x * 10
                }deg)`,
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div
                className="house-grid"
                style={{
                  transform: `scale(${0.8 + p * 0.3})`,
                  transition: "transform 0.6s ease",
                }}
              >
                {bricks.map((b, i) => {
                  const built = i / bricks.length < p * 1.6;
                  const angle = (b.c - 4) * 30;
                  const tz = built ? 0 : -200 - (i % 5) * 40;
                  return (
                    <div
                      key={i}
                      className="brick"
                      style={{
                        gridColumnStart: b.c + 1,
                        gridRowStart: b.r + 1,
                        background: b.isWindow
                          ? "linear-gradient(135deg, #FFB000 0%, #E50914 100%)"
                          : b.isRoofLight
                          ? "linear-gradient(135deg, #E50914, #6a0309)"
                          : built
                          ? `linear-gradient(135deg, hsl(${(i * 7) % 30 + 350}, 30%, ${
                              8 + (i % 5) * 4
                            }%), #0a0a0a)`
                          : "transparent",
                        boxShadow: b.isWindow
                          ? "0 0 20px rgba(255,176,0,0.55), inset 0 0 8px rgba(255,255,255,0.4)"
                          : b.isRoofLight
                          ? "0 0 20px rgba(229,9,20,0.6)"
                          : "none",
                        opacity: built ? 1 : 0,
                        transform: built
                          ? "translateZ(0)"
                          : `translateZ(${tz}px) rotateY(${angle}deg)`,
                        transition: `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${
                          (i * 12) % 600
                        }ms, opacity 0.6s ${(i * 12) % 600}ms, background 0.6s`,
                        borderColor: built
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                        animation: b.isWindow
                          ? "windowFlicker 3.6s infinite"
                          : undefined,
                      }}
                    />
                  );
                })}
              </div>

              {/* Door */}
              <div
                className="absolute"
                style={{
                  left: "calc(50% - 62px)",
                  bottom: 0,
                  width: 124,
                  height: 180,
                  background:
                    "linear-gradient(180deg, rgba(229,9,20,0.7), rgba(229,9,20,0.15) 60%, transparent)",
                  filter: "blur(2px)",
                  opacity: p * 0.9,
                  transition: "opacity 0.8s",
                }}
              />
            </div>

            {/* Caption */}
            <div
              className="absolute bottom-2 left-2 font-mono text-[10px] tracking-[0.35em] text-white/40"
              style={{ opacity: p }}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#E50914] mr-2 align-middle" style={{ animation: "pulseDot 1.4s infinite" }} />
              LIVE / 24-7 / SIGNAL
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">03 / MANIFESTO</p>
            <h2 className="font-display text-white" style={{ fontSize: "clamp(40px, 6vw, 84px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              <SplitHeading>BEFORE THE HOW,</SplitHeading><br/>
              <SplitHeading style={{ color: "#E50914" }}>THERE IS ALWAYS A WHY.</SplitHeading>
            </h2>
            <div className="mt-10 space-y-3 font-mono text-sm text-white/60">
              <p>Every trend.</p>
              <p>Every movement.</p>
              <p>Every purchase.</p>
              <p>Every obsession.</p>
              <p>Every brand people love.</p>
              <p className="text-white/90 mt-6">Started with a reason.</p>
              <p>A belief. A tension. A story.</p>
              <p className="font-display text-white mt-8" style={{ fontSize: "20px" }}>
                The answer to every WHY... is HOW.
              </p>
              <p className="text-[#FFB000]">That's where we come in.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
