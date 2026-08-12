"use client";

import { motion, type MotionValue } from "framer-motion";
import { useExperience } from "@/lib/store/experience";

const line = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.15 * i, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface HeroOverlayProps {
  fade?: MotionValue<number>;
  heroTitle: string;
  heroSubtitle: string;
}

/** Gilds the last word/segment in the house gold — the site's signature
 *  accent treatment, generalised so admin-edited copy still gets it. */
function GildLastWord({ text }: { text: string }) {
  const words = text.trim().split(" ");
  const last = words.pop();
  const rest = words.join(" ");
  return (
    <>
      {rest ? `${rest} ` : ""}
      <span className="text-gradient-grail">{last}</span>
    </>
  );
}

export function HeroOverlay({ fade, heroTitle, heroSubtitle }: HeroOverlayProps) {
  const introComplete = useExperience((s) => s.introComplete);
  const subtitleWords = heroSubtitle.trim().split(" ").filter(Boolean);

  return (
    <motion.div
      style={{ opacity: fade }}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-6 pb-10 pt-24 md:px-14 md:pb-16 md:pt-16">
      {/* Top spacer — keeps the headline block anchored to its original
          vertical position now that the eyebrow label above it is gone. */}
      <div aria-hidden />

      {/* Headline block */}
      <motion.div
        className="max-w-4xl"
        initial="hidden"
        animate={introComplete ? "show" : "hidden"}
      >
        <motion.h1
          variants={line}
          custom={0}
          className="font-display font-semibold leading-[0.9] text-pearl"
          style={{ fontSize: "var(--text-hero)" }}
        >
          <GildLastWord text={heroTitle} />
        </motion.h1>

        <motion.p
          variants={line}
          custom={2}
          className="mt-6 flex flex-wrap gap-x-4 text-lg tracking-wide text-silver md:text-xl"
        >
          {subtitleWords.map((word, i) => (
            <span
              key={i}
              className={i === subtitleWords.length - 1 ? "text-gradient-grail" : i === 0 ? undefined : "text-platinum"}
            >
              {word}
            </span>
          ))}
        </motion.p>
      </motion.div>

      {/* Bottom row */}
      <motion.div
        className="flex items-end justify-between"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-ash">
          <motion.span
            className="inline-block h-8 w-px bg-linear-to-b from-grail to-transparent"
            animate={{ scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          Scroll to explore
        </div>
        <div className="hidden text-right text-xs uppercase tracking-[0.3em] text-ash md:block">
          911 · Reference 001
          <br />
          <span className="text-grail">The Collection</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
