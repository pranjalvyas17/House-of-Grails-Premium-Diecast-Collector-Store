"use server";

import { ProductService } from "@/lib/admin/services/productService";
import { EventService } from "@/lib/admin/services/eventService";
import { toPublicProduct, buildEventNameMap } from "@/lib/data/adapters";
import type { Product } from "@/lib/data/products";

const MAX_RESULTS = 8;

/**
 * Storefront product search — a thin Server Action bridge over the same
 * ProductService/adapter the rest of the site already reads through. No
 * separate search index or dataset; it's the live persisted catalogue,
 * filtered to what customers should actually see (active listings only).
 */
export async function searchProductsAction(query: string): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const [results, events] = await Promise.all([
    ProductService.search(trimmed, { status: "active" }),
    EventService.getAll(),
  ]);

  const eventNameById = buildEventNameMap(events);
  return results.slice(0, MAX_RESULTS).map((p) => toPublicProduct(p, eventNameById));
}
