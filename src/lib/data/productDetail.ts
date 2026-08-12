import { rarityLabel, type Product } from "./products";
import type { AdminProduct, AdminEvent } from "@/lib/admin/types";

export function getRelatedProducts(product: Product, pool: Product[], limit = 3): Product[] {
  const rest = pool.filter((p) => p.id !== product.id);
  const sameBrand = rest.filter((p) => p.brand === product.brand);
  const sameRarity = rest.filter(
    (p) => p.rarity === product.rarity && !sameBrand.includes(p)
  );
  const others = rest.filter((p) => !sameBrand.includes(p) && !sameRarity.includes(p));
  return [...sameBrand, ...sameRarity, ...others].slice(0, limit);
}

export interface HistoryEntry {
  year: string;
  title: string;
  note: string;
}

/** Generic narrative timeline synthesised from the product's own data. */
export function getHistoryTimeline(product: Product): HistoryEntry[] {
  const designYear = new Date(product.releasedAt).getFullYear() - 1;
  return [
    {
      year: String(designYear),
      title: "Original Design",
      note: `The full-scale ${product.name} first defined the silhouette this casting replicates — a benchmark ${product.brand} returned to for this run.`,
    },
    {
      year: new Date(product.releasedAt).getFullYear().toString(),
      title: product.event ? "Event Exclusive Cast" : "Cast & Verified",
      note: product.event
        ? `Produced exclusively for ${product.event}, with production capped at ${
            product.totalRun ?? "a sealed"
          } units.`
        : `Tooled at ${product.scale} scale with hand-finished detailing, verified against the source vehicle before release.`,
    },
    {
      year: "Today",
      title: "Vaulted",
      note: `Authenticated and entered into The House of Grails registry with a Collector Score of ${product.collectorScore}/100.`,
    },
  ];
}

export interface CollectorFactor {
  label: string;
  value: number;
}

/** Breaks the single collectorScore into presentable sub-factors (mock formula, deterministic per product). */
export function getCollectorBreakdown(product: Product): CollectorFactor[] {
  const base = product.collectorScore;
  const rarityBoost = { standard: 0, limited: 4, chase: 8, grail: 12 }[product.rarity];
  return [
    { label: "Rarity", value: Math.min(100, base - 6 + rarityBoost) },
    { label: "Demand", value: Math.min(100, base - 2) },
    { label: "Condition", value: Math.min(100, base + 1) },
    { label: "Provenance", value: Math.min(100, base - 4 + (product.event ? 6 : 0)) },
  ];
}

export interface EventDetail {
  name: string;
  location: string;
  date: string;
  description: string;
}

/** Resolves the event this product debuted at from its real eventSlugs, against the live event registry. */
export function getEventDetail(product: AdminProduct, events: AdminEvent[]): EventDetail | null {
  const slug = product.eventSlugs[0];
  if (!slug) return null;
  const event = events.find((e) => e.slug === slug);
  if (!event) return null;
  return {
    name: `${event.name} ${event.year}`,
    location: event.city ? `${event.city}, ${event.country}` : event.country,
    date: event.eventDate || String(event.year),
    description: event.description,
  };
}

export interface RecentPurchase {
  name: string;
  location: string;
  minutesAgo: number;
}

const firstNames = ["Marcus", "Priya", "Daniel", "Wei", "Sofia", "Ahmed", "Yuki", "Elena"];
const cities = ["New York", "Bangkok", "Kuala Lumpur", "London", "Tokyo", "Berlin", "Sydney", "Toronto"];

/** Deterministic-per-product fake activity feed — same product always shows the same feed (no hydration mismatch). */
export function getRecentPurchases(product: Product, count = 4): RecentPurchase[] {
  let seed = 0;
  for (let i = 0; i < product.id.length; i++) seed += product.id.charCodeAt(i);
  return Array.from({ length: count }).map((_, i) => {
    const n = (seed + i * 17) % firstNames.length;
    const c = (seed + i * 31) % cities.length;
    return {
      name: firstNames[n],
      location: cities[c],
      minutesAgo: ((seed + i * 13) % 58) + 2,
    };
  });
}

export { rarityLabel };
