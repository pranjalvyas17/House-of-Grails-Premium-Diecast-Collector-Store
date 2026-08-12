"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import type { DiecastEvent } from "@/lib/data/events";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.12 * i, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function EventHero({ event }: { event: DiecastEvent }) {
  return (
    <section className="relative h-[70vh] min-h-[32rem] w-full overflow-hidden bg-void">
      <Image
        src={event.coverImage}
        alt={event.name}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-50"
      />
      {/* Glass overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-void via-void/70 to-void/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_10%,transparent_30%,rgba(5,5,6,0.65)_100%)]" />
      <div className="noise pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 pt-28 md:px-14 md:pb-20">
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-silver transition-colors hover:text-pearl"
          >
            <ArrowLeft size={15} />
            All Events
          </Link>
        </motion.div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              initial="hidden"
              animate="show"
              custom={1.4}
              variants={fadeUp}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-ash"
            >
              <span className="h-px w-10 bg-grail/60" />
              {event.tagline}
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-4 font-display font-semibold leading-[0.92] text-pearl"
              style={{ fontSize: "var(--text-display)" }}
            >
              {event.name}
            </motion.h1>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            custom={2.6}
            variants={fadeUp}
            className="glass flex flex-wrap gap-6 rounded-2xl px-5 py-4 md:max-w-sm"
          >
            <div className="flex items-center gap-2 text-sm text-silver">
              <MapPin size={14} className="text-ion" />
              {event.city ? `${event.city}, ${event.country}` : event.country}
            </div>
            <div className="flex items-center gap-2 text-sm text-silver">
              <CalendarDays size={14} className="text-ion" />
              {event.eventDate ?? event.year}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-6 max-w-2xl text-silver"
          style={{ fontSize: "var(--text-subtitle)" }}
        >
          {event.description}
        </motion.p>
      </div>
    </section>
  );
}
