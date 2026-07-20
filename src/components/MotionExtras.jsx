import React, { useEffect, useRef, useState } from "react";

// Scroll progress bar (top)
export function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setW(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: `${w}%` }} data-testid="scroll-progress" />;
}

// Section indicator (left side dots)
const SECTIONS = [
  { id: "section-question", n: "01", label: "THE QUESTION" },
  { id: "section-graveyard", n: "02", label: "GRAVEYARD" },
  { id: "section-manifesto", n: "03", label: "MANIFESTO" },
  { id: "section-services", n: "04", label: "SERVICES" },
  { id: "section-constellation", n: "05", label: "CONSTELLATION" },
  { id: "section-proof", n: "06", label: "PROOF" },
  { id: "section-machine", n: "07", label: "MACHINE" },
  { id: "section-breaker", n: "08", label: "BREAKER" },
  { id: "section-invitation", n: "09", label: "INVITATION" },
];

export function SectionIndicator() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach((s, i) => {
      const el = document.querySelector(`[data-testid='${s.id}']`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const jump = (id) => {
    document.querySelector(`[data-testid='${id}']`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="section-indicator hidden md:flex" data-testid="section-indicator">
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          data-testid={`indicator-${s.n}`}
          className={`dot ${active === i ? "active" : ""}`}
          onClick={() => jump(s.id)}
          aria-label={s.label}
        >
          <span className="label">{s.n} — {s.label}</span>
        </button>
      ))}
    </div>
  );
}

// Marquee strip — speed reacts to scroll velocity
export function MarqueeStrip({ items, reverse = false, slow = false, accent = false }) {
  const innerRef = useRef(null);
  const lastY = useRef(0);
  const velocity = useRef(0);
  const offset = useRef(0);

  useEffect(() => {
    let raf;
    lastY.current = window.scrollY;
    const baseSpeed = slow ? 0.25 : 0.4; // px per frame, baseline
    const dir = reverse ? 1 : -1;
    const loop = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      // Smooth velocity towards measured dy
      velocity.current += (dy - velocity.current) * 0.18;
      const boost = Math.min(8, Math.abs(velocity.current) * 0.45);
      const speed = (baseSpeed + boost) * dir;
      offset.current += speed;
      if (innerRef.current) {
        // The track is 200% wide; wrap at -50%
        const w = innerRef.current.scrollWidth / 2;
        if (offset.current < -w) offset.current += w;
        if (offset.current > 0) offset.current -= w;
        innerRef.current.style.transform = `translateX(${offset.current}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reverse, slow]);

  const stroke = accent ? { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.6)" } : {};
  return (
    <div className="w-full overflow-hidden py-6 border-y border-white/10" style={{ background: "#000" }}>
      <div ref={innerRef} className="flex" style={{ width: "max-content", willChange: "transform" }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center gap-12 px-6">
            {items.map((it, i) => (
              <React.Fragment key={i}>
                <span
                  className="font-display uppercase whitespace-nowrap"
                  style={{ fontSize: "clamp(36px, 7vw, 96px)", letterSpacing: "-0.03em", ...stroke }}
                >
                  {it}
                </span>
                <span className="text-[#E50914]" style={{ fontSize: "clamp(28px, 6vw, 80px)" }}>✦</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Magnetic wrapper for CTAs
export function Magnetic({ children, strength = 0.35, className = "", ...props }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = e.clientX - (r.left + r.width / 2);
    const cy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${cx * strength}px, ${cy * strength}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </span>
  );
}

// Split heading — letters animate up on view; words stay unbroken
export function SplitHeading({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const text = String(children);
  // Split into words (preserving spaces); render each word as a non-breakable group of letter spans.
  const words = text.split(/(\s+)/);
  let letterIdx = 0;
  return (
    <span ref={ref} className={`split-heading ${vis ? "in" : ""} ${className}`} style={style}>
      {words.map((w, wi) => {
        if (/^\s+$/.test(w)) {
          return <span key={`s${wi}`}>{"\u00A0"}</span>;
        }
        return (
          <span key={`w${wi}`} className="split-word">
            {w.split("").map((ch) => {
              const i = letterIdx++;
              return (
                <span key={i} style={{ transitionDelay: `${i * 0.03}s` }}>{ch}</span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

// Cursor trail (subtle red dot lagging behind primary cursor)
export function CursorTrail() {
  const ref = useRef(null);
  useEffect(() => {
    let raf, tx = 0, ty = 0, cx = 0, cy = 0;
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (ref.current) {
        ref.current.style.left = cx + "px";
        ref.current.style.top = cy + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", move); };
  }, []);
  return <div ref={ref} className="cursor-trail" />;
}
