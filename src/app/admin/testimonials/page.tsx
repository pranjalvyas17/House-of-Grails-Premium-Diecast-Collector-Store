import type { Metadata } from "next";
import { TestimonialService } from "@/lib/admin/services";
import { TestimonialsManager } from "@/components/admin/testimonials/TestimonialsManager";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const testimonials = await TestimonialService.getAll();
  return <TestimonialsManager initialTestimonials={testimonials} />;
}
