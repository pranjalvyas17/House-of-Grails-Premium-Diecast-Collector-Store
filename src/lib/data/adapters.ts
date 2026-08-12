import "server-only";
import type { Product } from "./products";
import type { DiecastEvent } from "./events";
import type { Brand, Testimonial } from "./products";
import type { AdminProduct, AdminEvent, AdminBrand, Testimonial as AdminTestimonial } from "@/lib/admin/types";

/**
 * Read-time projections from the ONE canonical admin-shaped record to the
 * narrower display shape the (already-built, unchanged) storefront
 * components expect. This is NOT a second copy of the data — every field
 * here is derived from the same AdminProduct/AdminEvent/etc. the admin
 * panel reads and writes via the service layer. Swapping which storefront
 * fields are shown only requires editing these functions, never adding a
 * new data source.
 */

/**
 * @param eventNameById Optional slug→display-name lookup (e.g. "Tokyo Auto
 *   Salon 2026"), built from EventService.getAll() by the caller — only
 *   needed by sections that actually show a product's event tag.
 */
export function toPublicProduct(p: AdminProduct, eventNameById?: Map<string, string>): Product {
  const primaryEventSlug = p.eventSlugs[0];
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    scale: p.scale,
    price: p.price,
    rarity: p.rarity,
    stock: p.stock,
    edition: p.edition || undefined,
    event: primaryEventSlug ? eventNameById?.get(primaryEventSlug) : undefined,
    totalRun: p.totalRun ?? undefined,
    image: p.images[0]?.url ?? "",
    collectorScore: p.collectorScore,
    releasedAt: p.createdAt,
  };
}

export function toPublicEvent(e: AdminEvent): DiecastEvent {
  return {
    id: e.id,
    slug: e.slug,
    name: e.name,
    shortName: e.shortName,
    year: e.year,
    country: e.country,
    city: e.city || undefined,
    eventDate: e.eventDate || undefined,
    tagline: e.tagline,
    description: e.description,
    coverImage: e.coverUrl || e.bannerUrl,
  };
}

export function toPublicBrand(b: AdminBrand, productCount: number): Brand {
  return {
    id: b.slug,
    name: b.name,
    tagline: b.tagline,
    productCount,
    image: b.logoUrl,
  };
}

export function toPublicTestimonial(t: AdminTestimonial): Testimonial {
  return {
    id: t.id,
    name: t.name,
    handle: t.handle,
    quote: t.quote,
    avatar: t.avatarUrl,
    collection: t.collectionSize,
  };
}

export function buildEventNameMap(events: AdminEvent[]): Map<string, string> {
  return new Map(events.map((e) => [e.slug, `${e.name} ${e.year}`]));
}
