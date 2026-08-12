"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/data/products";
import { getHistoryTimeline } from "@/lib/data/productDetail";

export function ProductHistory({ product }: { product: Product }) {
  const timeline = getHistoryTimeline(product);

  return (
    <div className="relative space-y-8 border-l border-smoke/60 pl-8">
      {timeline.map((entry, i) => (
        <motion.div
          key={entry.year + entry.title}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
          className="relative"
        >
          <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-grail bg-obsidian" />
          <p className="text-xs uppercase tracking-[0.2em] text-grail">{entry.year}</p>
          <p className="mt-1 font-display text-lg font-semibold text-pearl">{entry.title}</p>
          <p className="mt-2 max-w-xl text-sm text-silver">{entry.note}</p>
        </motion.div>
      ))}
    </div>
  );
}
