"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Lock, Gem } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/data/products";

const doorEase = [0.87, 0, 0.13, 1] as const;

/** THE signature section — vault doors part to reveal the grail collection. */
export function GrailVault({ products: grailVault }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const doorTrigger = useRef<HTMLDivElement>(null);
  const inView = useInView(doorTrigger, { once: true, margin: "-20% 0px" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.3, 0.8]);

  return (
    <section
      id="grail-vault"
      ref={ref}
      className="relative overflow-hidden bg-void px-6 py-32 md:px-14"
    >
      {/* Ambient vault glow */}
      <motion.div
        style={{ scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-grail/8 blur-[140px]"
      />

      {/* Floating particles across the section */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-grail/50"
          style={{ left: `${(i * 41) % 100}%`, top: `${(i * 29) % 100}%` }}
          animate={{ y: [0, -24, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: 5 + (i % 6), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-ash">
          <Lock size={12} className="text-grail" />
          The Signature Collection
        </div>
        <h2
          className="mt-6 max-w-2xl font-display font-semibold leading-[0.92] text-pearl"
          style={{ fontSize: "var(--text-display)" }}
        >
          The <span className="text-gradient-grail">Grail Vault</span>
        </h2>
        <p className="mt-5 max-w-xl text-silver" style={{ fontSize: "var(--text-subtitle)" }}>
          Chase cars. Event exclusives. Tokyo Auto Salon, Thailand and Malaysia
          expo pieces. RWB and Kaido House grails — sealed until now.
        </p>

        {/* Vault door reveal */}
        <div
          ref={doorTrigger}
          className="relative mt-16 min-h-[28rem] overflow-hidden rounded-[calc(var(--radius-glass)+0.5rem)] border border-grail/20"
        >
          {/* Interior content (revealed) */}
          <div className="glass-strong noise relative grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 lg:p-10">
            {grailVault.map((product, i) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} index={i} />
                {product.event && (
                  <div className="mt-3 flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.15em] text-grail/80">
                    <Gem size={11} />
                    {product.event}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Left vault door */}
          <motion.div
            initial={{ x: "0%" }}
            animate={inView ? { x: "-100%" } : { x: "0%" }}
            transition={{ duration: 1.4, ease: doorEase, delay: 0.15 }}
            className="glass-strong absolute inset-y-0 left-0 z-20 flex w-1/2 items-center justify-end border-r border-grail/20 px-8"
          >
            <Gem size={28} className="text-grail/40" />
          </motion.div>

          {/* Right vault door */}
          <motion.div
            initial={{ x: "0%" }}
            animate={inView ? { x: "100%" } : { x: "0%" }}
            transition={{ duration: 1.4, ease: doorEase, delay: 0.15 }}
            className="glass-strong absolute inset-y-0 right-0 z-20 flex w-1/2 items-center justify-start border-l border-grail/20 px-8"
          >
            <Gem size={28} className="text-grail/40" />
          </motion.div>

          {/* Door seam glow, fades once opened */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={inView ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-px -translate-x-1/2 bg-grail shadow-grail"
          />
        </div>
      </div>
    </section>
  );
}
