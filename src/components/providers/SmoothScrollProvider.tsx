"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/**
 * Returns a ref to the live Lenis instance (or null before mount / under
 * reduced motion). Dereference `.current` inside an event handler, not
 * during render — e.g. `useLenis()?.current?.scrollTo(el, { offset })`.
 */
export const useLenis = () => useContext(LenisContext);

/**
 * Site-wide smooth scroll. Drives Lenis from GSAP's own ticker and keeps
 * ScrollTrigger synced to it every frame — the official Lenis + GSAP
 * integration pattern, required for the LimitedEditions pinned scroll to
 * track buttery Lenis motion instead of raw (steppy) wheel deltas.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = instance;
    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {/* "user" respects the OS reduced-motion preference for every Framer
          Motion animation site-wide — our CSS rule only covers CSS
          animations/transitions, not Framer's JS-driven ones. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LenisContext.Provider>
  );
}
