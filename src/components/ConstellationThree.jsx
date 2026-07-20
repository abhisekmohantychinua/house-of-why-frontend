import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Chromatic aberration shader
const ChromaticShader = {
  uniforms: {
    tDiffuse: { value: null },
    uOffset: { value: 0.0025 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uOffset;
    varying vec2 vUv;
    void main() {
      vec2 dir = vUv - 0.5;
      float r = texture2D(tDiffuse, vUv - dir * uOffset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv + dir * uOffset).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};

// True WebGL constellation with EffectComposer (bloom + chromatic aberration)
export default function ConstellationThree() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.003);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(0, 0, 420);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // EffectComposer for post-processing
    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.2, 0.6, 0.1);
    composer.addPass(bloom);
    const chroma = new ShaderPass(ChromaticShader);
    composer.addPass(chroma);

    // Particles
    const COUNT = 520;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.55) * 380;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r * 0.55;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 260;
      sizes[i] = 1.4 + Math.random() * 3.2;
      seeds[i] = Math.random() * 1000;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aSeed;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;
        varying float vPulse;
        void main() {
          vec3 p = position;
          float pulse = sin(uTime * 1.2 + aSeed) * 0.5 + 0.5;
          vPulse = pulse;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vec2 toMouse = uMouse * 80.0 - mv.xy;
          float d = length(toMouse);
          float pull = exp(-d * 0.008) * 18.0;
          mv.xy += normalize(toMouse + 0.0001) * pull;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (aSize + pulse * 2.0) * uPixelRatio * (340.0 / -mv.z);
        }
      `,
      fragmentShader: `
        varying float vPulse;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          vec3 col = mix(vec3(0.95, 0.05, 0.1), vec3(1.0), pow(core, 4.0));
          float alpha = core * (0.7 + vPulse * 0.3);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Lines
    const lineGeo = new THREE.BufferGeometry();
    const MAX_LINES = 700;
    const linePositions = new Float32Array(MAX_LINES * 6);
    const lineColors = new Float32Array(MAX_LINES * 6);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Data-packet pulses traveling along lines
    const packetGeo = new THREE.BufferGeometry();
    const PACKETS = 60;
    const packetPos = new Float32Array(PACKETS * 3);
    const packetSeeds = new Float32Array(PACKETS);
    const packetPair = new Int32Array(PACKETS * 2);
    for (let i = 0; i < PACKETS; i++) {
      packetSeeds[i] = Math.random();
      packetPair[i * 2] = Math.floor(Math.random() * COUNT);
      packetPair[i * 2 + 1] = Math.floor(Math.random() * COUNT);
    }
    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
    const packetMat = new THREE.PointsMaterial({
      size: 6,
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const packets = new THREE.Points(packetGeo, packetMat);
    scene.add(packets);

    // Mouse
    const mouse = new THREE.Vector2(0, 0);
    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const THRESHOLD = 70;
    const THRESHOLD_SQ = THRESHOLD * THRESHOLD;

    const animate = () => {
      const t = clock.getElapsedTime();
      pMat.uniforms.uTime.value = t;
      pMat.uniforms.uMouse.value.lerp(mouse, 0.08);

      points.rotation.z = Math.sin(t * 0.08) * 0.05;
      points.rotation.y = t * 0.04;

      // Lines
      let li = 0;
      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < COUNT && li < MAX_LINES; i += 2) {
        const ax = arr[i * 3], ay = arr[i * 3 + 1], az = arr[i * 3 + 2];
        for (let j = i + 1; j < Math.min(i + 30, COUNT) && li < MAX_LINES; j++) {
          const bx = arr[j * 3], by = arr[j * 3 + 1], bz = arr[j * 3 + 2];
          const dx = ax - bx, dy = ay - by, dz = az - bz;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < THRESHOLD_SQ) {
            const o = li * 6;
            linePositions[o] = ax; linePositions[o + 1] = ay; linePositions[o + 2] = az;
            linePositions[o + 3] = bx; linePositions[o + 4] = by; linePositions[o + 5] = bz;
            const a = 1 - Math.sqrt(d2) / THRESHOLD;
            lineColors[o] = 0.95 * a; lineColors[o + 1] = 0.05 * a; lineColors[o + 2] = 0.1 * a;
            lineColors[o + 3] = 0.95 * a; lineColors[o + 4] = 0.05 * a; lineColors[o + 5] = 0.1 * a;
            li++;
          }
        }
      }
      for (let k = li * 6; k < MAX_LINES * 6; k++) linePositions[k] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineGeo.setDrawRange(0, li * 2);

      // Data packets
      for (let i = 0; i < PACKETS; i++) {
        const seed = packetSeeds[i];
        const k = (t * 0.4 + seed) % 1;
        const aIdx = packetPair[i * 2];
        const bIdx = packetPair[i * 2 + 1];
        const ax = arr[aIdx * 3], ay = arr[aIdx * 3 + 1], az = arr[aIdx * 3 + 2];
        const bx = arr[bIdx * 3], by = arr[bIdx * 3 + 1], bz = arr[bIdx * 3 + 2];
        packetPos[i * 3] = ax + (bx - ax) * k;
        packetPos[i * 3 + 1] = ay + (by - ay) * k;
        packetPos[i * 3 + 2] = az + (bz - az) * k;
        if (k < 0.02 || k > 0.98) {
          packetPair[i * 2] = Math.floor(Math.random() * COUNT);
          packetPair[i * 2 + 1] = Math.floor(Math.random() * COUNT);
        }
      }
      packetGeo.attributes.position.needsUpdate = true;

      composer.render();
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      pGeo.dispose(); pMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      packetGeo.dispose(); packetMat.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" data-testid="constellation-canvas" />;
}
