"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/data/products";
import { getCollectorBreakdown } from "@/lib/data/productDetail";

const R = 54;
const CIRC = 2 * Math.PI * R;

export function CollectorScoreRing({ product }: { product: Product }) {
  const breakdown = getCollectorBreakdown(product);

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
      <div className="flex justify-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-smoke)" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="url(#score-grad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              whileInView={{ strokeDashoffset: CIRC * (1 - product.collectorScore / 100) }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-ion)" />
                <stop offset="100%" stopColor="var(--color-grail)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold text-pearl">
              {product.collectorScore}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ash">/ 100</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {breakdown.map((factor, i) => (
          <div key={factor.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-[0.15em] text-ash">{factor.label}</span>
              <span className="text-silver">{factor.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full origin-left overflow-hidden rounded-full bg-smoke/60">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: factor.value / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full origin-left rounded-full bg-linear-to-r from-ion to-grail"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
