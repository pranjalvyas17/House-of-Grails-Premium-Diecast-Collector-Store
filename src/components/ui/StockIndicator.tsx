"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/data/products";

export function StockIndicator({ product }: { product: Product }) {
  const hasRun = !!product.totalRun;
  const pct = hasRun ? (product.stock / product.totalRun!) * 100 : null;
  const urgent = product.stock <= 5;

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-[0.2em] text-ash">
          {hasRun ? "Remaining of run" : "Availability"}
        </span>
        <span className={urgent ? "font-medium text-ember" : "text-silver"}>
          {product.stock} {hasRun ? `/ ${product.totalRun}` : "left"}
        </span>
      </div>
      {hasRun && (
        <div className="mt-2 h-1.5 w-full origin-left overflow-hidden rounded-full bg-smoke/60">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.max(pct!, 2) / 100 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={`h-full w-full origin-left rounded-full ${
              urgent ? "bg-ember" : "bg-linear-to-r from-ion to-grail"
            }`}
          />
        </div>
      )}
    </div>
  );
}
