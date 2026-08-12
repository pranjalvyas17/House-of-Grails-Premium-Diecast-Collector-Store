"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/** Clears the fixed floating navbar when Lenis scrolls a section to the top. */
export const NAV_OFFSET = -96;

/**
 * Shared in-page section-anchor behaviour for the navbar and footer: smooth
 * scroll via Lenis when already on the homepage, otherwise let the browser
 * navigate to `/#hash` and leave the landing scroll to `HashScrollOnMount`
 * (mounted on the homepage), which applies the same offset once ready.
 */
export function useSectionClick() {
  const pathname = usePathname();
  const lenisRef = useLenis();

  return (hash: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    const el = document.querySelector(hash);
    const lenis = lenisRef?.current;
    if (el && lenis) {
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: NAV_OFFSET, duration: 1.2 });
    }
  };
}
