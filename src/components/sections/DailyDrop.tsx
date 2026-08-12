"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Product } from "@/lib/data/products";

function useCountdownToMidnight() {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      setRemaining(midnight.getTime() - now.getTime());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  return { h, m, s };
}

export function DailyDrop({ product: dailyDrop }: { product: Product | null }) {
  const { h, m, s } = useCountdownToMidnight();

  if (!dailyDrop) return null;

  return (
    <section id="daily-drop" className="relative px-6 py-28 md:px-14">
      <div className="mx-auto max-w-6xl">
        <GlassCard strong className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image
                src={dailyDrop.image}
                alt={dailyDrop.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-carbon/80 via-transparent to-transparent md:bg-linear-to-r" />
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-ash">
                <Clock size={12} className="text-grail" />
                Today&apos;s Drop
              </div>

              <h3
                className="mt-6 font-display font-semibold leading-[0.95] text-pearl"
                style={{ fontSize: "var(--text-title)" }}
              >
                {dailyDrop.name}
              </h3>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ash">
                {dailyDrop.brand} · {dailyDrop.scale}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <RarityBadge rarity={dailyDrop.rarity} />
                <span className="text-xs text-ember">{dailyDrop.stock} remaining</span>
              </div>

              {/* Countdown */}
              <div className="mt-8 flex gap-4">
                {[
                  { label: "HRS", value: h },
                  { label: "MIN", value: m },
                  { label: "SEC", value: s },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="glass flex w-20 flex-col items-center rounded-2xl py-3"
                  >
                    <motion.span
                      key={unit.value}
                      initial={{ opacity: 0.4, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-2xl font-semibold tabular-nums text-grail"
                    >
                      {String(unit.value).padStart(2, "0")}
                    </motion.span>
                    <span className="mt-1 text-[10px] tracking-[0.2em] text-ash">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-6">
                <p className="font-display text-3xl font-semibold text-pearl">
                  ${dailyDrop.price}
                </p>
                <MagneticButton className="bg-grail text-obsidian hover:bg-grail-bright">
                  Claim Today&apos;s Grail
                </MagneticButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
