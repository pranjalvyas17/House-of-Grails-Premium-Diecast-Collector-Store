"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/ui/ProductCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Product } from "@/lib/data/products";

export function LatestDrops({ products }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const blobX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      id="latest-drops"
      ref={ref}
      className="relative overflow-hidden px-6 py-28 md:px-14 md:py-36"
    >
      <motion.div
        style={{ x: blobX, y: blobY }}
        className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-ion/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            kicker="Fresh to the Collection"
            title={
              <>
                Latest <span className="text-gradient-grail">Drops</span>
              </>
            }
            description="New arrivals, curated daily. The freshest metal, verified before it ever reaches the shelf."
          />
          <MagneticButton className="border border-slate/60 text-pearl hover:border-grail/50">
            <span className="flex items-center gap-2">
              View All Drops <ArrowRight size={16} />
            </span>
          </MagneticButton>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
