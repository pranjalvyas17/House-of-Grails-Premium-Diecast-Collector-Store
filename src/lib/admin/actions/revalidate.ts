import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Centralised revalidation targets. The storefront pages below are
 * statically generated (SSG) and read the same persistent data as the
 * admin — after any mutation that could change what they show, their
 * cached HTML must be explicitly invalidated so the next request
 * regenerates it. This does NOT disable caching; it targets exactly the
 * paths a given mutation could have affected.
 */

export function revalidateProductPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/product/[id]", "page");
  if (id) revalidatePath(`/product/${id}`);
  // Event pages list their associated products — a product edit can change
  // what they display too.
  revalidatePath("/events/[slug]", "page");
}

export function revalidateEventPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/events/[slug]", "page");
  if (slug) revalidatePath(`/events/${slug}`);
  // A product can show which event(s) it belongs to.
  revalidatePath("/product/[id]", "page");
}

export function revalidateBrandPaths() {
  revalidatePath("/");
}

export function revalidateCollectionPaths() {
  revalidatePath("/");
}

export function revalidateHomepagePaths() {
  // 'layout' so the announcement bar (rendered in the shared (site) layout,
  // fed by the same homepage config) refreshes too, not just the page body.
  revalidatePath("/", "layout");
}

export function revalidateTestimonialPaths() {
  revalidatePath("/");
}

export function revalidateAdminMedia() {
  revalidatePath("/admin/media");
}
