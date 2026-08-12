"use client";

import { Globe2, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { RecentlyPurchased } from "./RecentlyPurchased";
import type { Product } from "@/lib/data/products";
import { getRecentPurchases } from "@/lib/data/productDetail";

const ctaLabel: Record<Product["rarity"], string> = {
  standard: "Add to Collection",
  limited: "Secure This Edition",
  chase: "Claim the Chase",
  grail: "Claim This Grail",
};

export function StickyPurchasePanel({ product }: { product: Product }) {
  const recent = getRecentPurchases(product);

  return (
    <div className="sticky top-24">
      <GlassCard strong className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ash">
              {product.brand} · {product.scale}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold leading-tight text-pearl">
              {product.name}
            </h1>
          </div>
          <RarityBadge rarity={product.rarity} />
        </div>

        {product.edition && (
          <p className="mt-3 text-sm text-grail">{product.edition}</p>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-smoke/60 pt-6">
          <div>
            <p className="text-xs text-ash">Price</p>
            <p className="font-display text-4xl font-semibold text-pearl">
              ${product.price}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ash">Collector Score</p>
            <p className="font-display text-2xl font-semibold text-grail">
              {product.collectorScore}
              <span className="text-sm text-ash">/100</span>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <StockIndicator product={product} />
        </div>

        <MagneticButton className="mt-6 w-full bg-grail text-obsidian hover:bg-grail-bright">
          {ctaLabel[product.rarity]}
        </MagneticButton>

        <div className="mt-5 space-y-2 text-xs text-silver">
          <div className="flex items-center gap-2">
            <Globe2 size={14} className="text-ion" />
            Worldwide shipping, fully insured
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-ion" />
            Authenticated &amp; sealed before dispatch
          </div>
        </div>

        <div className="mt-6">
          <RecentlyPurchased feed={recent} />
        </div>
      </GlassCard>
    </div>
  );
}
