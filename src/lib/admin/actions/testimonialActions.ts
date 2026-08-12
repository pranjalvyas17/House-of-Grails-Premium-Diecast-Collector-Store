"use server";

import { TestimonialService, type TestimonialInput } from "@/lib/admin/services";
import { revalidateTestimonialPaths } from "./revalidate";

export async function createTestimonialAction(input: TestimonialInput) {
  const testimonial = await TestimonialService.create(input);
  revalidateTestimonialPaths();
  return testimonial;
}

export async function updateTestimonialAction(id: string, patch: Partial<TestimonialInput>) {
  const testimonial = await TestimonialService.update(id, patch);
  revalidateTestimonialPaths();
  return testimonial;
}

export async function deleteTestimonialAction(id: string) {
  const ok = await TestimonialService.delete(id);
  revalidateTestimonialPaths();
  return ok;
}
