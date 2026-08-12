"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Testimonial } from "@/lib/data/products";

// Even so a -50% translate always lands on a repeat boundary — the loop
// point is exact regardless of how many real testimonials exist.
const REPEATS = 6;

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <GlassCard className="flex h-full w-[320px] shrink-0 flex-col justify-between p-7 sm:w-[380px]">
      <Quote className="text-grail/50" size={26} />
      <p className="mt-5 line-clamp-4 text-base leading-relaxed text-platinum">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-7 flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-grail/30">
          <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-pearl">{t.name}</p>
          <p className="truncate text-xs text-ash">
            {t.handle} · {t.collection}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function MarqueeRow({ testimonials, direction }: { testimonials: Testimonial[]; direction: "left" | "right" }) {
  const track = Array.from({ length: REPEATS }, (_, i) => i).flatMap((rep) =>
    testimonials.map((t) => ({ ...t, trackKey: `${t.id}-${rep}` }))
  );

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
      <div
        className={`flex w-max gap-5 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {track.map((t) => (
          <TestimonialCard key={t.trackKey} t={t} />
        ))}
      </div>
    </div>
  );
}

/**
 * Two rows flowing in opposite directions — read together they emanate
 * outward from the section's center rather than a single strip that
 * visibly starts and ends at the left edge. Loops continuously via CSS
 * animation (not Swiper's `loop`, which silently disables itself when
 * there are fewer testimonials than fit on screen at once).
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="center"
          kicker="From the Collection"
          title={
            <>
              Trusted by <span className="text-gradient-grail">Collectors</span>
            </>
          }
        />
      </div>

      <div className="relative mt-16 space-y-5">
        <MarqueeRow testimonials={testimonials} direction="left" />
        <MarqueeRow testimonials={testimonials} direction="right" />
      </div>
    </section>
  );
}
