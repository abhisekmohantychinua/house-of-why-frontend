import React, { useEffect, useState } from "react";

export default function NavBar({ onAsk }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-testid="nav-bar"
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center"
      style={{
        mixBlendMode: "difference",
        background: scrolled ? "rgba(0,0,0,0)" : "transparent",
      }}
    >
      <a href="#top" data-testid="nav-logo" className="font-display text-white tracking-tighter text-sm uppercase">
        House <span className="text-white/50">/</span> Of <span className="text-white/50">/</span> Why
      </a>
      <div className="flex items-center gap-6">
        <a href="#section-services" className="hidden md:inline font-mono text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors">Services</a>
        <a href="#section-proof" className="hidden md:inline font-mono text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors">Work</a>
        <button
          data-testid="nav-cta"
          onClick={onAsk}
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-black bg-white px-4 py-2 hover:bg-[#E50914] hover:text-white transition-colors"
        >
          ENTER →
        </button>
      </div>
    </nav>
  );
}
