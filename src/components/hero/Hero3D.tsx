"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { Scene } from "./Scene";
import { HeroOverlay } from "./HeroOverlay";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { createRig } from "./rig";
import { useExperience } from "@/lib/store/experience";

/** Publishes this canvas's `invalidate` fn to a ref so plain DOM-level
 *  effects (GSAP, pointer, scroll — all outside the R3F tree) can request a
 *  redraw. Required for frameloop="demand": nothing renders unless asked. */
function InvalidateBridge({ bridgeRef }: { bridgeRef: React.MutableRefObject<() => void> }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    bridgeRef.current = invalidate;
  }, [invalidate, bridgeRef]);
  return null;
}

interface Hero3DProps {
  heroTitle: string;
  heroSubtitle: string;
}

export default function Hero3D({ heroTitle, heroSubtitle }: Hero3DProps) {
  const rig = useRef(createRig()).current;
  const sectionRef = useRef<HTMLElement>(null);
  const invalidateRef = useRef<() => void>(() => {});
  const loaded = useExperience((s) => s.loaded);
  const setIntroComplete = useExperience((s) => s.setIntroComplete);

  // Scroll progress across the pinned hero (140vh of travel).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    rig.scroll = v;
    invalidateRef.current();
  });
  const overlayFade = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // ── The 10-beat cinematic intro (GSAP mutates the rig outside React) ──
  useEffect(() => {
    if (!loaded) return;
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onUpdate: () => invalidateRef.current(),
    });
    tl.to(rig, { camReveal: 1, duration: 4.6 }, 0.2) //         6 · camera rides the rail
      .to(rig, { wireframe: 0, duration: 2.2 }, 0.3) //         2→3 · wireframe → dissolve
      .to(rig, { reveal: 1, duration: 1.8 }, 1.2) //            3 · paint materialises
      .to(rig, { lights: 1, duration: 1.0 }, 2.4) //            4 · headlights ignite
      .to(rig, { particles: 1, duration: 1.6 }, 2.6) //         5 · ambient particles
      .fromTo(rig, { baseSpin: 0.7 }, { baseSpin: 0, duration: 3.4 }, 1.2) // 6 · settle
      // 7 · typography — cued once the reveal/lights beats are underway,
      // rather than waiting on the full camera settle. This is also the
      // page's LCP element, so firing it earlier matters for real load perf.
      .call(() => setIntroComplete(true), [], 3.0);
    return () => {
      tl.kill();
    };
  }, [loaded, rig, setIntroComplete]);

  // ── Pointer parallax (beat 8) ──
  // Demand-mode: invalidate on move, then keep pumping frames for a short
  // settle window so the eased parallax in CameraRig can glide to rest
  // instead of freezing mid-lerp the instant the pointer stops.
  useEffect(() => {
    let raf = 0;
    let settleUntil = 0;
    let running = false;

    const pump = () => {
      invalidateRef.current();
      if (performance.now() < settleUntil) {
        raf = requestAnimationFrame(pump);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      rig.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      rig.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      settleUntil = performance.now() + 500;
      if (!running) {
        running = true;
        pump();
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [rig]);

  return (
    <section ref={sectionRef} className="relative h-[140vh] bg-void">
      {/* Pinned stage — the car stays on screen while the page scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          className="absolute inset-0"
          dpr={[1, 1.75]}
          frameloop="demand"
          gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
          camera={{ fov: 42, near: 0.1, far: 100, position: [0, 3.6, 12.5] }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 0.9;
          }}
        >
          <InvalidateBridge bridgeRef={invalidateRef} />
          <Suspense fallback={null}>
            <Scene rig={rig} />
          </Suspense>
        </Canvas>

        {/* Cinematic vignette + floor fade */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_90%_at_50%_20%,transparent_40%,rgba(5,5,6,0.6)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-linear-to-t from-void to-transparent" />

        <HeroOverlay fade={overlayFade} heroTitle={heroTitle} heroSubtitle={heroSubtitle} />

        <AnimatePresence>{!loaded && <LoadingScreen key="loader" />}</AnimatePresence>
      </div>
    </section>
  );
}
