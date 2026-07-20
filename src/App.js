import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Toaster } from "sonner";
import Lenis from "lenis";

import NavBar from "./components/NavBar";
import WhyEngine from "./components/WhyEngine";
import { ScrollProgress, SectionIndicator, MarqueeStrip, CursorTrail } from "./components/MotionExtras";
import SoundToggle, { useSoundEngine } from "./components/SoundLayer";
import Loader from "./components/Loader";

import SectionQuestion from "./sections/SectionQuestion";
import SectionGraveyard from "./sections/SectionGraveyard";
import SectionManifesto from "./sections/SectionManifesto";
import SectionServices from "./sections/SectionServices";
import SectionConstellation from "./sections/SectionConstellation";
import SectionProof from "./sections/SectionProof";
import SectionMachine from "./sections/SectionMachine";
import SectionBreaker from "./sections/SectionBreaker";
import SectionInvitation from "./sections/SectionInvitation";

function CustomCursor() {
  const dot = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (!dot.current) return;
      dot.current.style.left = e.clientX + "px";
      dot.current.style.top = e.clientY + "px";
    };
    const enter = (e) => {
      if (e.target.closest("button, a, input, textarea, .hw-input")) {
        dot.current?.classList.add("hover");
      } else {
        dot.current?.classList.remove("hover");
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
    };
  }, []);
  return <div ref={dot} className="hw-cursor" />;
}

function App() {
  const [askKey, setAskKey] = useState(0);
  const sound = useSoundEngine();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="App grain" id="top">
      <Toaster
        position="bottom-left"
        theme="dark"
        toastOptions={{
          style: { background: "#0a0a0a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }
        }}
      />
      <CustomCursor />
      <CursorTrail />
      <ScrollProgress />
      <SectionIndicator />
      <SoundToggle engine={sound} />
      <NavBar onAsk={() => setAskKey((k) => k + 1)} />

      <main>
        <SectionQuestion onBurst={() => sound.burst()} onTunnel={() => sound.tick()} />
        <SectionGraveyard />
        <MarqueeStrip items={["MEMORY OVER METRICS", "WHY BEFORE HOW", "CULTURE NOT CONTENT", "BUILT TO BE REMEMBERED"]} accent />
        <SectionManifesto />
        <div id="section-services"><SectionServices /></div>
        <MarqueeStrip items={["STRATEGY", "CREATIVE", "CREATORS", "MOTION", "FILM", "LAUNCH"]} reverse slow />
        <SectionConstellation />
        <div id="section-proof"><SectionProof /></div>
        <SectionMachine />
        <SectionBreaker />
        <SectionInvitation />
      </main>

      <WhyEngine externalOpenSignal={askKey} />
    </div>
  );
}

export default App;
