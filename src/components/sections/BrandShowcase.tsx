"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Brand } from "@/lib/data/products";

export function BrandShowcase({ brands }: { brands: Brand[] }) {
  return (
    <section id="brands" className="relative px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="The Houses We Trust"
          title={
            <>
              Curated <span className="text-gradient-grail">Brands</span>
            </>
          }
          description="Every maker in the collection, vetted for precision, detail and collector value."
        />

        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              whileHover={{ scale: 1.04 }}
              className={i === 0 ? "col-span-2 row-span-2" : ""}
            >
              <GlassCard tilt className="group relative h-full overflow-hidden p-6">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-carbon via-carbon/30 to-transparent" />
                </div>
                <div className="absolute inset-x-6 bottom-6">
                  <p className="font-display text-lg font-semibold text-pearl">
                    {brand.name}
                  </p>
                  <p className="mt-1 text-xs text-ash">{brand.tagline}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-grail">
                    {brand.productCount}+ pieces
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
