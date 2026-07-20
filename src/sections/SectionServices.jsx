import React, { useState } from "react";
import { SplitHeading } from "../components/MotionExtras";

const services = [
  { num: "01", name: "Brand Strategy", line: "We find the reason people should care.", sub: "Before the logo. Before the campaign. Before the budget." },
  { num: "02", name: "Ad Films & Content", line: "Stories engineered to survive the skip button.", sub: "" },
  { num: "03", name: "Motion & Graphics", line: "Design that moves faster than culture.", sub: "" },
  { num: "04", name: "Campaign Ideation", line: "Concepts people steal. Screenshots people save.", sub: "" },
  { num: "05", name: "Social & Reels", line: "Built for feeds. Remembered beyond them.", sub: "" },
  { num: "06", name: "Go-To-Market", line: "Launches designed to feel inevitable.", sub: "" },
];

// Section 4: What we do — service planets orbit
export default function SectionServices() {
  const [active, setActive] = useState(0);

  return (
    <section
      data-testid="section-services"
      className="section relative w-full"
      style={{ minHeight: "100vh", background: "#000", padding: "120px 0" }}
    >
      <div className="max-w-7xl mx-auto px-8">
        <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">04 / WHAT WE DO</p>
        <h2 className="font-display text-white mb-20" style={{ fontSize: "clamp(48px, 7vw, 110px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
          <SplitHeading>EVERYTHING.</SplitHeading><br/>
          <span className="bleed-text"><SplitHeading>UNDER ONE ROOF.</SplitHeading></span>
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Planets list */}
          <div className="space-y-3">
            {services.map((s, i) => (
              <button
                key={s.num}
                data-testid={`service-${s.num}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="block w-full text-left py-6 border-b border-white/10 group cursor-pointer"
                style={{ background: "transparent" }}
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-xs text-white/30">{s.num}</span>
                  <div className="flex-1">
                    <h3
                      className="font-display"
                      style={{
                        fontSize: "clamp(28px, 4vw, 52px)",
                        letterSpacing: "-0.03em",
                        color: active === i ? "#fff" : "rgba(255,255,255,0.35)",
                        transition: "color 0.4s",
                      }}
                    >
                      {s.name}
                    </h3>
                    <p
                      className="font-mono text-sm mt-2 overflow-hidden"
                      style={{
                        maxHeight: active === i ? 120 : 0,
                        opacity: active === i ? 0.7 : 0,
                        transition: "max-height 0.5s, opacity 0.5s",
                        color: "#fff",
                      }}
                    >
                      {s.line}
                      {s.sub && <><br/><span className="text-white/40">{s.sub}</span></>}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-white/30">→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Planet visual */}
          <div className="hidden md:flex items-center justify-center relative" style={{ height: 460 }}>
            <div className="absolute inset-0 rotate-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/40 rounded-full" />
            </div>
            <div className="absolute inset-8 rotate-slow-rev rounded-full border border-white/5" />
            <div className="absolute inset-20 rotate-slow rounded-full border border-white/10" />

            <div
              className="planet relative flex items-center justify-center"
              key={active}
              style={{ animation: "float-up 0.7s ease both" }}
            >
              <div className="text-center">
                <div className="font-mono text-xs text-white/40">{services[active].num}</div>
                <div className="font-display text-white text-2xl mt-2" style={{ letterSpacing: "-0.02em" }}>
                  {services[active].name}
                </div>
              </div>
              <div className="absolute -inset-4 rounded-full" style={{
                border: "1px solid rgba(229,9,20,0.4)",
                animation: "pulse-ring 3s infinite ease-out"
              }} />
            </div>
          </div>
        </div>

        <div className="mt-24 max-w-2xl">
          <p className="font-mono text-sm text-white/40 leading-loose">
            Strategy. Creative. Production. Creators. Distribution. Measurement.
          </p>
          <p className="font-display text-white mt-4 text-2xl">
            No handoffs. No excuses. <span style={{ color: "#E50914" }}>No bottlenecks.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
