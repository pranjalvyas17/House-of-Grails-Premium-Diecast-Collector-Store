"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/data/products";

export function EventProductsGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="glass mx-auto max-w-md rounded-2xl px-8 py-16 text-center">
        <p className="font-display text-lg text-pearl">No pieces match those filters</p>
        <p className="mt-2 text-sm text-silver">Try widening your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductCard product={product} index={i % 6} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
