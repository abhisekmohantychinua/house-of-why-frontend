import React from "react";
import { SplitHeading } from "../components/MotionExtras";

// Section 7: Culture Machine — surreal mechanical heart with rotating rings
export default function SectionMachine() {
  return (
    <section
      data-testid="section-machine"
      className="section relative w-full"
      style={{ minHeight: "100vh", background: "#000", padding: "120px 0", overflow: "hidden" }}
    >
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(circle at 50% 60%, rgba(229,9,20,0.35), transparent 60%)"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
        {/* Mechanical heart */}
        <div className="flex items-center justify-center" style={{ minHeight: 460 }}>
          <div className="relative" style={{ width: 380, height: 380 }}>
            {/* outer ring */}
            <div className="absolute inset-0 rounded-full border border-white/15 rotate-slow flex items-center justify-center">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="absolute" style={{
                  width: 8, height: 8, background: "#E50914",
                  borderRadius: 2,
                  transform: `rotate(${i * 15}deg) translateY(-180px)`,
                  transformOrigin: "center 0",
                }} />
              ))}
            </div>
            <div className="absolute inset-8 rounded-full border border-white/10 rotate-slow-rev" />
            <div className="absolute inset-16 rounded-full border border-white/20 rotate-slow flex items-center justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="absolute font-mono text-[8px] text-white/40" style={{
                  transform: `rotate(${i * 30}deg) translateY(-140px)`,
                }}>
                  {["VIEW", "LIKE", "SHARE", "SAVE", "CLICK", "WATCH", "SCROLL", "TAP", "LOOP", "REACT", "FEEL", "REMEMBER"][i]}
                </div>
              ))}
            </div>
            <div className="absolute inset-32 rounded-full border-2 border-[#E50914]" style={{
              animation: "pulse-ring 2s infinite ease-out"
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#E50914]/20 flex items-center justify-center" style={{
                animation: "pulseDot 1.6s infinite",
                boxShadow: "0 0 60px rgba(229,9,20,0.6)"
              }}>
                <div className="w-10 h-10 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">07 / THE CULTURE MACHINE</p>
          <h2 className="font-display text-white" style={{ fontSize: "clamp(40px, 6vw, 88px)", letterSpacing: "-0.04em", lineHeight: 0.92 }}>
            <SplitHeading>WE DON'T MAKE</SplitHeading><br/><SplitHeading>CONTENT.</SplitHeading><br/>
            <SplitHeading style={{ color: "#E50914" }}>WE CREATE CONTEXT.</SplitHeading>
          </h2>
          <div className="mt-10 space-y-3 font-mono text-sm text-white/60 max-w-md">
            <p>Content is what people see.</p>
            <p>Context is why they care.</p>
            <p className="text-white">That's the difference.</p>
            <p className="text-[#FFB000]">And that's the whole game.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
