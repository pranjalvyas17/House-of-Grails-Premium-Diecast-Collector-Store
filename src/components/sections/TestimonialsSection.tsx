"use client";

import dynamic from "next/dynamic";
import type { Testimonial } from "@/lib/data/products";

// Swiper is a sizable dependency only needed for this one below-the-fold
// carousel — split it into its own chunk rather than the main bundle.
const Testimonials = dynamic(
  () => import("./Testimonials").then((m) => m.Testimonials),
  {
    ssr: false,
    loading: () => <div className="h-[26rem] w-full" />,
  }
);

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return <Testimonials testimonials={testimonials} />;
}
