"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <motion.div
      className={align === "center" ? "text-center" : ""}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-ash ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-10 bg-grail/60" />
        {kicker}
      </div>
      <h2
        className="mt-6 font-display font-semibold leading-[0.95] text-pearl"
        style={{ fontSize: "var(--text-display)" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-xl text-silver ${
            align === "center" ? "mx-auto" : ""
          }`}
          style={{ fontSize: "var(--text-subtitle)" }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
