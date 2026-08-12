"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EventCarousel } from "./EventCarousel";
import type { DiecastEvent } from "@/lib/data/events";

export function EventSection({ events }: { events: DiecastEvent[] }) {
  return (
    <section
      id="global-events"
      className="noise relative overflow-hidden py-28 md:py-36"
    >
      {/* Dark luxury backdrop — aurora + drifting particles */}
      <div className="pointer-events-none absolute inset-0 aurora opacity-50" />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-ion/50"
          style={{ left: `${(i * 47) % 100}%`, top: `${(i * 31) % 100}%` }}
          animate={{ y: [0, -28, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.35 }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-6 md:px-14">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-ash">
              <span className="h-px w-10 bg-grail/60" />
              Browse by Occasion
            </div>
            <h2
              className="mt-6 font-display font-semibold leading-[0.95] text-pearl"
              style={{ fontSize: "var(--text-display)" }}
            >
              Global Diecast <span className="text-gradient-grail">Events</span>
            </h2>
            <p className="mt-5 max-w-xl text-silver" style={{ fontSize: "var(--text-subtitle)" }}>
              Discover exclusive releases from the world&apos;s biggest collector events.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/events" className="group relative inline-flex items-center gap-2 text-sm text-silver transition-colors hover:text-pearl">
              View All Events
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-grail transition-all duration-300 group-hover:w-full" />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-16">
        <EventCarousel events={events} />
      </div>
    </section>
  );
}
