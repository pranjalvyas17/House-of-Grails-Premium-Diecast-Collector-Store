"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { DiecastEvent } from "@/lib/data/events";

export function EventCard({ event, index = 0 }: { event: DiecastEvent; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10 }}
      layoutId={`event-${event.slug}`}
      className="group h-full w-62 shrink-0 sm:w-70"
    >
      <Link href={`/events/${event.slug}`} className="block h-full" aria-label={event.name}>
        <GlassCard tilt strong className="flex h-full flex-col">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-[calc(var(--radius-glass)-1px)]">
            <Image
              src={event.coverImage}
              alt={event.name}
              fill
              sizes="280px"
              className="object-cover opacity-70 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-90"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-carbon via-carbon/40 to-transparent" />

            {/* Year badge */}
            <div className="absolute right-4 top-4 rounded-full border border-grail/30 bg-void/60 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-grail backdrop-blur-md">
              {event.year}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-between px-5 pb-6 pt-5">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-ash">
                <MapPin size={11} className="text-ion" />
                {event.city ? `${event.city}, ${event.country}` : event.country}
              </div>
              <p className="mt-2 font-display text-lg font-semibold leading-tight text-pearl">
                {event.name}
              </p>
              <p className="mt-1.5 text-xs text-silver">{event.tagline}</p>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
