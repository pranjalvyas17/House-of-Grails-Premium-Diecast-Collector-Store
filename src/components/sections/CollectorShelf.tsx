"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Product } from "@/lib/data/products";

export function CollectorShelf({ products: collectorShelf }: { products: Product[] }) {
  const rows = [collectorShelf.slice(0, 3), collectorShelf.slice(3, 6)];

  return (
    <section id="collector-shelf" className="relative px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Every Icon, Displayed"
          title={
            <>
              Collector&apos;s <span className="text-gradient-grail">Shelf</span>
            </>
          }
          description="Porsche. Skyline. Supra. RX-7. Silvia. Lamborghini. The icons every shelf deserves."
        />

        <div className="mt-16 space-y-14">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="relative">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {row.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="animate-float"
                    style={{ animationDelay: `${(rowIdx * 3 + i) * 0.4}s` }}
                  >
                    <GlassCard tilt className="group p-5">
                      <div className="relative aspect-square overflow-hidden rounded-2xl">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="mt-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
                          {product.brand}
                        </p>
                        <p className="mt-1 font-display font-medium text-pearl">
                          {product.name}
                        </p>
                        <p className="mt-2 text-sm text-grail">${product.price}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
              {/* Shelf line — the glass ledge beneath each row */}
              <div className="hairline mt-8 h-px" />
              <div
                className="mx-auto h-8 max-w-[95%] rounded-b-full opacity-40 blur-xl"
                style={{
                  background:
                    "radial-gradient(closest-side, var(--color-grail), transparent)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
