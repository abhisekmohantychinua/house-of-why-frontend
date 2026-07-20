import React from "react";
import { SplitHeading } from "../components/MotionExtras";

const brands = ["Amazon", "Meta", "Nykaa", "Samsung", "Flipkart", "Honda", "MakeMyTrip", "H&M", "HSBC", "CRED", "Vivo", "Realme"];

// Section 6: Social Proof — concrete wall with SVG turbulence-based crack reveal on hover
export default function SectionProof() {
  return (
    <section
      data-testid="section-proof"
      className="section relative w-full concrete"
      style={{ minHeight: "100vh", padding: "120px 0" }}
    >
      {/* Hidden SVG filter for concrete-crack displacement on hover */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="concreteCrack" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="14" />
          </filter>
          <filter id="rgbSplit">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>
            <feOffset in="r" dx="3" dy="0" result="ro"/>
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>
            <feOffset in="b" dx="-3" dy="0" result="bo"/>
            <feMerge>
              <feMergeNode in="ro"/>
              <feMergeNode in="bo"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #000 0%, transparent 20%, transparent 80%, #000 100%)" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">06 / SOCIAL PROOF</p>
        <div className="grid md:grid-cols-2 gap-12 items-end mb-20">
          <h2 className="font-display text-white" style={{ fontSize: "clamp(48px, 7vw, 110px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
            <SplitHeading>TRUST IS</SplitHeading><br/>
            <SplitHeading>EARNED.</SplitHeading>
          </h2>
          <div className="font-mono text-sm text-white/60 space-y-2 max-w-md md:justify-self-end">
            <p>Not pitched.</p>
            <p>Built. Repeated. Scaled. Refined.</p>
            <p className="text-white">Repeated again.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {brands.map((b, i) => (
            <div
              key={b}
              data-testid={`brand-${b.toLowerCase().replace(/[^a-z]/g, "")}`}
              className="brand-tile relative flex items-center justify-center h-32 md:h-44 px-4 overflow-hidden cursor-pointer"
              style={{ background: "#080808" }}
            >
              {/* Concrete crack layer (revealed via clip-path on hover) */}
              <div
                className="crack-layer absolute inset-0"
                aria-hidden
                style={{
                  background: "linear-gradient(135deg, rgba(229,9,20,0.35), rgba(255,176,0,0.25))",
                  clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                  transition: "clip-path 0.7s cubic-bezier(0.7,0,0.3,1)",
                  mixBlendMode: "screen",
                  filter: "url(#concreteCrack)",
                }}
              />
              {/* Subtle horizontal RGB shift on hover */}
              <div
                className="brand-label relative z-10 font-display uppercase tracking-tighter transition-all duration-500"
                style={{
                  fontSize: "clamp(20px, 2.6vw, 36px)",
                  letterSpacing: "-0.04em",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.42)",
                }}
              >
                {b}
              </div>
              {/* Small cinematic crack lines */}
              <svg className="crack-svg absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden>
                <path d="M0,55 L60,52 L80,40 L120,58 L160,46 L200,52" stroke="rgba(229,9,20,0.7)" strokeWidth="0.6" fill="none" />
                <path d="M20,80 L70,72 L110,86 L150,70 L200,82" stroke="rgba(255,176,0,0.55)" strokeWidth="0.4" fill="none" />
              </svg>
            </div>
          ))}
        </div>

        <p className="font-mono text-xs text-white/30 mt-10 max-w-md">
          And the next one will be yours.
        </p>
      </div>
    </section>
  );
}
