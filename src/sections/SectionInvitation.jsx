import React, { useState } from "react";
import { toast } from "sonner";
import { SplitHeading, Magnetic } from "../components/MotionExtras";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND}/api`;

// Final Section: Invitation + Contact form
export default function SectionInvitation() {
  const [form, setForm] = useState({ name: "", email: "", brand: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Tell us your name, email, and the question that won't let you sleep.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
      toast.success("Signal received. We'll be in touch.");
    } catch (err) {
      toast.error("Couldn't reach the house. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      data-testid="section-invitation"
      className="section relative w-full"
      style={{ minHeight: "100vh", background: "#000", padding: "140px 0 80px", overflow: "hidden" }}
    >
      {/* Earth glow */}
      <div className="absolute inset-x-0 bottom-0 h-[80%]" style={{
        background: "radial-gradient(ellipse at 50% 120%, rgba(229,9,20,0.25), transparent 60%), radial-gradient(ellipse at 50% 130%, rgba(255,255,255,0.08), transparent 60%)"
      }} />
      <div className="absolute inset-x-0 bottom-0 h-[40vh]" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.15) 0, transparent 60%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
        transform: "scale(2)"
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
        <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6">09 / THE INVITATION</p>
        <h2 className="font-display text-white" style={{ fontSize: "clamp(40px, 6.5vw, 96px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
          <SplitHeading>LET'S BUILD</SplitHeading><br/>
          <SplitHeading>SOMETHING</SplitHeading><br/>
          <SplitHeading style={{ color: "#E50914" }}>PEOPLE REMEMBER.</SplitHeading>
        </h2>

        <div className="mt-10 space-y-2 font-mono text-sm text-white/50 max-w-md mx-auto">
          <p>Not another campaign.</p>
          <p>Not another post.</p>
          <p>Not another ad.</p>
          <p className="text-white pt-4">Something people talk about</p>
          <p className="text-white">long after the budget disappears.</p>
        </div>

        {/* CTAs */}
        <div className="mt-14 inline-flex flex-col sm:flex-row items-stretch justify-center mx-auto" data-testid="phone-cta-group">
          <a
            href="tel:+919875694549"
            data-testid="call-cta-1"
            className="font-mono text-xs tracking-[0.3em] uppercase border border-white/20 hover:border-white px-8 py-4 text-white transition-colors hover:bg-white/5"
          >
            CALL +91 98756 94549
          </a>
          <a
            href="tel:+919874260613"
            data-testid="call-cta-2"
            className="font-mono text-xs tracking-[0.3em] uppercase border border-white/20 hover:border-white px-8 py-4 text-white transition-colors hover:bg-white/5"
            style={{ marginLeft: -1 }}
          >
            CALL +91 98742 60613
          </a>
        </div>

        {/* Contact form */}
        <div className="mt-24 max-w-xl mx-auto text-left">
          <p className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-6 uppercase">ENTER THE HOUSE</p>
          {done ? (
            <div className="border border-white/20 p-10 text-center" style={{ animation: "float-up 0.6s ease both" }}>
              <p className="font-display text-white text-3xl">Signal received.</p>
              <p className="font-mono text-sm text-white/50 mt-3">We don't reply with a calendar link.<br/>We reply with an idea.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-2" data-testid="contact-form">
              <input
                className="hw-input"
                placeholder="YOUR NAME"
                data-testid="contact-name-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="hw-input"
                type="email"
                placeholder="EMAIL"
                data-testid="contact-email-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="hw-input"
                placeholder="BRAND / COMPANY"
                data-testid="contact-brand-input"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
              <textarea
                className="hw-input resize-none"
                rows={3}
                placeholder="WHAT'S THE QUESTION THAT WON'T LET YOU SLEEP?"
                data-testid="contact-message-input"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Magnetic strength={0.25} className="block">
                <button
                  type="submit"
                  disabled={busy}
                  data-testid="contact-submit-button"
                  className="mt-8 w-full bg-white text-black font-mono text-xs tracking-[0.3em] uppercase py-5 hover:bg-[#E50914] hover:text-white transition-colors disabled:opacity-50"
                >
                  {busy ? "SENDING SIGNAL..." : "ENTER THE HOUSE →"}
                </button>
              </Magnetic>
            </form>
          )}
        </div>

        <footer className="mt-32 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-xs text-white/40 tracking-widest">HOUSE OF WHY © {new Date().getFullYear()}</div>
          <div className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">Built for memory · Engineered for culture</div>
        </footer>
      </div>
    </section>
  );
}
