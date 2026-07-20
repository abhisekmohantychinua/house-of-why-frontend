import React, { useEffect, useRef, useState } from "react";
import { Close } from "../components/Icons";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND}/api`;

// The Why Engine - cinematic AI overlay
export default function WhyEngine({ externalOpenSignal }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const sessionRef = useRef(Math.random().toString(36).slice(2));
  const abortRef = useRef(null);

  useEffect(() => {
    if (externalOpenSignal && externalOpenSignal > 0) setOpen(true);
  }, [externalOpenSignal]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  const ask = async (e) => {
    e?.preventDefault();
    if (!question.trim() || streaming) return;
    setResponse("");
    setShowResponse(true);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${API}/why/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, session_id: sessionRef.current }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error("stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        // SSE events are separated by a blank line (\n\n). Split on that boundary.
        const events = buf.split("\n\n");
        buf = events.pop() || "";
        for (const evt of events) {
          // An event may contain multiple "data:" lines; concatenate them with newlines,
          // stripping the SSE-convention single leading space from each line.
          const lines = evt.split("\n").filter((l) => l.startsWith("data:"));
          if (lines.length === 0) continue;
          const data = lines
            .map((l) => {
              const v = l.slice(5);
              return v.startsWith(" ") ? v.slice(1) : v;
            })
            .join("\n");
          if (data === "[DONE]") continue;
          setResponse((r) => r + data);
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setResponse((r) => r + "\n\n[SIGNAL LOST]");
      }
    } finally {
      setStreaming(false);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setShowResponse(false);
    setResponse("");
    setQuestion("");
  };

  const suggestions = [
    "Why isn't my brand growing?",
    "Why do people scroll past my ads?",
    "Why does nobody remember our campaign?",
    "Why are we paying for attention?",
  ];

  return (
    <>
      <button
        data-testid="why-engine-fab"
        className="why-fab"
        onClick={() => setOpen(true)}
        aria-label="Open Why Engine"
      >
        ASK WHY
      </button>

      {open && (
        <div
          data-testid="why-engine-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)", animation: "float-up 0.4s ease both" }}
        >
          <button
            data-testid="why-engine-close"
            className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
            onClick={() => { reset(); setOpen(false); }}
          >
            <Close style={{ width: 28, height: 28 }} />
          </button>

          <div className="w-full max-w-3xl px-8">
            {!showResponse ? (
              <div>
                <p className="font-mono text-[10px] tracking-[0.4em] text-[#E50914] mb-6">// THE WHY ENGINE</p>
                <h3 className="font-display text-white mb-2" style={{ fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  Ask the question<br/>
                  <span className="bleed-text">your strategy avoids.</span>
                </h3>
                <p className="font-mono text-sm text-white/40 mt-6">Type a question. Receive a reframing.</p>

                <form onSubmit={ask} className="mt-10">
                  <input
                    autoFocus
                    data-testid="why-engine-input"
                    className="hw-input"
                    style={{ fontSize: "22px", padding: "20px 0" }}
                    placeholder="Why isn't my brand growing?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mt-6">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        data-testid={`suggestion-${s.slice(0, 12)}`}
                        onClick={() => setQuestion(s)}
                        className="font-mono text-[11px] tracking-wide text-white/50 hover:text-white border border-white/15 hover:border-white px-3 py-2 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    data-testid="why-engine-submit"
                    disabled={!question.trim()}
                    className="mt-10 bg-white text-black font-mono text-xs tracking-[0.3em] uppercase px-10 py-4 hover:bg-[#E50914] hover:text-white transition-colors disabled:opacity-30"
                  >
                    ASK →
                  </button>
                </form>
              </div>
            ) : (
              <div data-testid="why-engine-response">
                <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 mb-2">// YOUR QUESTION</p>
                <p className="font-mono text-sm text-white/60 mb-10">{question}</p>
                <div className="border-l-2 border-[#E50914] pl-8">
                  <pre
                    className="font-display text-white whitespace-pre-wrap"
                    style={{ fontSize: "clamp(20px, 2.4vw, 32px)", letterSpacing: "-0.02em", lineHeight: 1.4, fontFamily: "Clash Display, sans-serif" }}
                  >
                    {response}
                    {streaming && <span className="caret">&nbsp;</span>}
                  </pre>
                </div>
                <div className="mt-12 flex gap-4">
                  <button
                    data-testid="why-engine-reset"
                    onClick={reset}
                    className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/60 hover:text-white border border-white/15 hover:border-white px-6 py-3 transition-colors"
                  >
                    ASK ANOTHER
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
