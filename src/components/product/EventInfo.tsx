import { CalendarDays, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { EventDetail } from "@/lib/data/productDetail";

export function EventInfo({ event }: { event: EventDetail }) {
  return (
    <GlassCard border className="p-7">
      <p className="text-xs uppercase tracking-[0.25em] text-ash">Event Exclusive</p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-pearl">{event.name}</h3>
      <p className="mt-3 max-w-xl text-sm text-silver">{event.description}</p>
      <div className="mt-5 flex flex-wrap gap-6 text-xs text-ash">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-ion" />
          {event.location}
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-ion" />
          {new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </GlassCard>
  );
}
