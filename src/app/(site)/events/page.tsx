import type { Metadata } from "next";
import { EventCard } from "@/components/events/EventCard";
import { EventService } from "@/lib/admin/services/eventService";
import { toPublicEvent } from "@/lib/data/adapters";

export const metadata: Metadata = {
  title: "Global Diecast Events",
  description:
    "Every collector expo in the House of Grails registry — browse exclusive releases by the event they debuted at.",
};

export default async function EventsIndexPage() {
  const adminEvents = await EventService.getAll();
  const events = adminEvents.map(toPublicEvent);

  return (
    <main className="relative bg-void pb-28 pt-32 md:pt-36">
      <div className="noise pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-14">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-ash">
          <span className="h-px w-10 bg-grail/60" />
          The Full Registry
        </div>
        <h1
          className="mt-6 font-display font-semibold leading-[0.95] text-pearl"
          style={{ fontSize: "var(--text-display)" }}
        >
          Global Diecast <span className="text-gradient-grail">Events</span>
        </h1>
        <p className="mt-5 max-w-xl text-silver" style={{ fontSize: "var(--text-subtitle)" }}>
          Every expo, salon and showcase in the registry. Browse by occasion to
          find the pieces that debuted there.
        </p>

        <div className="mt-16 flex flex-wrap justify-center gap-6 sm:justify-start">
          {events.map((event, i) => (
            <EventCard key={event.slug} event={event} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
