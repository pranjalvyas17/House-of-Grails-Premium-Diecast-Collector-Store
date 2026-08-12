"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { RarityBadge } from "./RarityBadge";
import type { Product } from "@/lib/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
  compact?: boolean;
}

export function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      layoutId={`product-${product.id}`}
      className="group"
    >
      <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <GlassCard tilt className="overflow-hidden">
          <div className="relative aspect-4/3 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-carbon/90 via-transparent to-transparent" />

            <div className="absolute left-4 top-4">
              <RarityBadge rarity={product.rarity} />
            </div>

            {product.stock <= 5 && (
              <div className="absolute right-4 top-4 rounded-full bg-ember/15 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-ember backdrop-blur-md">
                {product.stock} left
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
                  {product.brand} · {product.scale}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-pearl">
                  {product.name}
                </p>
              </div>
            </div>
          </div>

          {!compact && (
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-xs text-ash">Collector Score</p>
                <p className="text-sm font-medium text-grail">{product.collectorScore}/100</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ash">Price</p>
                <p className="font-display text-lg font-semibold text-pearl">
                  ${product.price}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/60 text-silver transition-all duration-300 group-hover:border-grail/50 group-hover:text-grail group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </div>
          )}
        </GlassCard>
      </Link>
    </motion.div>
  );
}
