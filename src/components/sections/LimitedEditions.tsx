"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RarityBadge } from "@/components/ui/RarityBadge";
import type { Product } from "@/lib/data/products";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Apple-style pinned scroll reveal — one panel per limited edition, crossfaded via ScrollTrigger scrub. */
export function LimitedEditions({ products: limitedEditions }: { products: Product[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelsRef.current;
      if (!wrapRef.current || panels.length === 0) return;

      gsap.set(panels, { autoAlpha: 0, scale: 0.94 });
      gsap.set(panels[0], { autoAlpha: 1, scale: 1 });

      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        // Short scroll distance per panel — enough to feel the crossfade
        // without turning the section into a long scroll gate.
        end: () => `+=${panels.length * 55}%`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const total = panels.length;
          // `raw` centers panel i's peak visibility at progress = i/(total-1)
          // — panel 0 at progress 0, the last panel at progress 1. The
          // previous `progress * total` mapping centered panel 0's peak at
          // progress 1/(2*total) instead, so at the very start of the pin
          // (progress 0) every panel's computed opacity was already
          // dropping toward 0 — the first frames of the section rendered
          // fully black before the crossfade caught up.
          const raw = total > 1 ? self.progress * (total - 1) : 0;
          panels.forEach((panel, i) => {
            const dist = Math.abs(raw - i);
            const visible = gsap.utils.clamp(0, 1, 1 - dist * 2.2);
            gsap.set(panel, {
              autoAlpha: visible,
              scale: 0.94 + visible * 0.06,
            });
          });
        },
      });

      return () => st.kill();
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="limited-editions" className="relative bg-obsidian">
      <div ref={wrapRef} className="relative h-screen w-full overflow-hidden">
        {limitedEditions.map((product, i) => (
          <div
            key={product.id}
            ref={(el) => {
              if (el) panelsRef.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-14"
          >
            <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-glass)] border border-smoke/60">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-obsidian/70 via-transparent to-transparent" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <RarityBadge rarity={product.rarity} />
                  {product.edition && (
                    <span className="text-xs uppercase tracking-[0.2em] text-ash">
                      {product.edition}
                    </span>
                  )}
                </div>
                <h3
                  className="mt-6 font-display font-semibold leading-[0.92] text-pearl"
                  style={{ fontSize: "var(--text-display)" }}
                >
                  {product.name}
                </h3>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-ash">
                  {product.brand} · {product.scale}
                </p>
                <div className="mt-8 flex items-center gap-8">
                  <div>
                    <p className="text-xs text-ash">Collector Score</p>
                    <p className="mt-1 text-2xl font-display font-semibold text-grail">
                      {product.collectorScore}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-smoke" />
                  <div>
                    <p className="text-xs text-ash">Price</p>
                    <p className="mt-1 text-2xl font-display font-semibold text-pearl">
                      ${product.price}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-smoke" />
                  <div>
                    <p className="text-xs text-ash">Remaining</p>
                    <p className="mt-1 text-2xl font-display font-semibold text-ember">
                      {product.stock}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 flex gap-2">
              {limitedEditions.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    dotIdx === i ? "w-8 bg-grail" : "w-1.5 bg-smoke"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
