"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Grid, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "./EventCard";
import type { DiecastEvent } from "@/lib/data/events";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/grid";

// `grid` is a real, documented Swiper option (the Grid module is passed in
// `modules` below) but this version's React bindings don't merge the Grid
// module's type augmentation into the component's `breakpoints` prop —
// an upstream type-definition gap, not a runtime issue. Cast through
// `unknown` to bypass the incomplete type rather than the actual option.
const breakpoints = {
  640: { spaceBetween: 24 },
  // Tablet: two-row snapping grid.
  768: { grid: { rows: 2, fill: "row" }, spaceBetween: 24, slidesPerView: "auto" },
  // Desktop: single flowing row.
  1280: { grid: { rows: 1 }, spaceBetween: 28, slidesPerView: "auto" },
} as unknown as ComponentProps<typeof Swiper>["breakpoints"];

export function EventCarousel({ events }: { events: DiecastEvent[] }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  return (
    <div className="relative">
      <Swiper
        modules={[FreeMode, Grid, Mousewheel]}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        onSlideChange={(s) => {
          setAtStart(s.isBeginning);
          setAtEnd(s.isEnd);
        }}
        freeMode={{ enabled: true, momentum: true, momentumRatio: 0.8 }}
        mousewheel={{ forceToAxis: true, sensitivity: 0.7 }}
        grabCursor
        slidesPerView="auto"
        spaceBetween={20}
        watchOverflow
        breakpoints={breakpoints}
        className="overflow-visible! px-6! md:px-14!"
      >
        {events.map((event, i) => (
          <SwiperSlide key={event.slug} className="h-auto! w-auto!">
            <EventCard event={event} index={i} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Desktop nav arrows */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden items-center justify-between md:flex">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={atStart}
          aria-label="Previous events"
          className="pointer-events-auto ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-slate/60 bg-obsidian/80 text-pearl backdrop-blur-md transition-opacity duration-300 hover:border-grail/50 hover:text-grail disabled:opacity-0"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          disabled={atEnd}
          aria-label="Next events"
          className="pointer-events-auto mr-2 flex h-11 w-11 items-center justify-center rounded-full border border-slate/60 bg-obsidian/80 text-pearl backdrop-blur-md transition-opacity duration-300 hover:border-grail/50 hover:text-grail disabled:opacity-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
