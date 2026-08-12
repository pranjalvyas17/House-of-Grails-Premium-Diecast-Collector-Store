"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

/**
 * A short, scroll-linked beat between Latest Drops and the Limited Editions
 * reveal — replaces what used to be a bare stretch of empty runway with an
 * intentional "something's coming" breath instead of another product grid.
 * Deliberately restrained: one line of copy, a silhouette, a light sweep,
 * a handful of particles — no new WebGL scene, no duplicate GLB.
 */
export function AnticipationTransition() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const textOpacity = useTransform(scrollYProgress, [0.18, 0.45, 0.8, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.18, 0.45], [26, 0]);
  const textBlurPx = useTransform(scrollYProgress, [0.18, 0.45], [14, 0]);
  const textBlur = useMotionTemplate`blur(${textBlurPx}px)`;
  const lineScale = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const silhouetteOpacity = useTransform(scrollYProgress, [0.1, 0.5, 0.95], [0, 0.14, 0]);
  const streakX = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]);

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className="relative h-[60vh] min-h-[420px] overflow-hidden bg-void md:h-[72vh]"
    >
      <div className="noise pointer-events-none absolute inset-0 opacity-25" />

      {/* Faint automotive silhouette — a suggestion of a car, not a render */}
      <motion.svg
        style={{ opacity: silhouetteOpacity }}
        viewBox="0 0 420 150"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(85vw,680px)] -translate-x-1/2 -translate-y-1/2"
        fill="none"
      >
        <path
          d="M20 108 C 40 104, 70 102, 95 92 C 120 70, 150 58, 210 56 C 270 54, 320 66, 360 86 C 385 96, 400 104, 402 108 L 402 116 C 402 120, 398 122, 392 122 L 360 122 M 60 122 L 352 122 M 95 92 C 130 84, 300 84, 330 90"
          stroke="var(--color-grail)"
          strokeWidth={1}
        />
        {[110, 320].map((cx) => (
          <circle key={cx} cx={cx} cy={122} r={22} stroke="var(--color-grail)" strokeWidth={1} />
        ))}
      </motion.svg>

      {/* Light streak sweeping across as the user scrolls */}
      <motion.div
        style={{ x: streakX }}
        className="pointer-events-none absolute inset-y-0 w-32 -skew-x-12 bg-linear-to-r from-transparent via-grail/10 to-transparent"
      />

      {/* Ambient drifting particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-grail/40"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <motion.div
        style={{ opacity: textOpacity, y: textY, filter: textBlur }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <p className="text-xs uppercase tracking-[0.5em] text-ash">The Next Piece</p>
        <motion.span style={{ scaleX: lineScale }} className="mt-6 h-px w-16 origin-center bg-grail/60" />
        <h2
          className="mt-6 max-w-2xl font-display font-semibold leading-[0.95] text-pearl"
          style={{ fontSize: "var(--text-display)" }}
        >
          Something Rare <span className="text-gradient-grail">Is Surfacing</span>
        </h2>
      </motion.div>
    </section>
  );
}
