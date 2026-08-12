"use client";

import { useEffect } from "react";
import { useLenis } from "./SmoothScrollProvider";
import { NAV_OFFSET } from "@/lib/navigation/useSectionClick";

/**
 * Lands the viewport on the right section when arriving at "/" with a URL
 * hash from a cross-page link (footer/navbar clicked from a product or
 * event page, a direct URL, or a refresh) — applies the same fixed-navbar
 * offset used for in-page Lenis scrolling so the target isn't left hidden
 * behind the navbar the way a bare browser hash-jump would leave it.
 */
export function HashScrollOnMount() {
  const lenisRef = useLenis();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash) as HTMLElement | null;
    if (!el) return;

    let cancelled = false;
    const scroll = (duration: number) => {
      if (cancelled) return;
      const lenis = lenisRef?.current;
      if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration });
      else el.scrollIntoView({ block: "start" });
    };

    // Below-the-fold content (the hero's pinned 3D section, GSAP-created
    // ScrollTrigger pin-spacers, images) keeps changing document height for
    // a while after mount, which would invalidate a single early scroll —
    // so this lands once, then re-corrects a couple of times as things
    // settle instead of trusting the very first layout pass.
    const attempts = [300, 900, 1700];
    const timers = attempts.map((delay) =>
      setTimeout(() => {
        if (cancelled) return;
        const top = el.getBoundingClientRect().top;
        if (Math.abs(top + NAV_OFFSET) > 24) scroll(delay === 300 ? 1.2 : 0.6);
      }, delay)
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [lenisRef]);

  return null;
}
