import "server-only";
import { allProducts } from "@/lib/data/products";
import type { AdminProduct, ProductStatus, Rarity } from "../types";
import { genId, nowISO, slugify, matchesQuery } from "./utils";
import { createJsonRepository } from "@/lib/server/jsonStore";

// Persisted in /data/products.json — see src/lib/server/jsonStore.ts for
// the storage mechanism. Seeded once from the public catalogue on first
// read; never reseeded after that.

function seed(): AdminProduct[] {
  return allProducts.map((p, i) => ({
    id: p.id,
    slug: slugify(p.name),
    name: p.name,
    description:
      `The ${p.name} from ${p.brand}, cast at ${p.scale} scale. ` +
      `Collector Score ${p.collectorScore}/100.`,
    brand: p.brand,
    manufacturer: p.brand,
    vehicle: p.name.replace(/^(Porsche|Nissan|Toyota|Mazda|Lamborghini|Hot Wheels)\s*/, ""),
    scale: p.scale,
    price: p.price,
    stock: p.stock,
    totalRun: p.totalRun ?? null,
    rarity: p.rarity as Rarity,
    status: "active" as ProductStatus,
    featured: i % 5 === 0,
    tags: [p.rarity, p.brand.toLowerCase().replace(/\s+/g, "-")],
    images: [
      { id: genId("img"), url: p.image, alt: p.name },
      { id: genId("img"), url: `https://picsum.photos/seed/${p.id}-side/800/600`, alt: `${p.name} — side` },
      { id: genId("img"), url: `https://picsum.photos/seed/${p.id}-rear/800/600`, alt: `${p.name} — rear` },
    ],
    eventSlugs: [],
    collectorScore: p.collectorScore,
    edition: p.edition ?? "",
    seoTitle: `${p.name} | ${p.brand} ${p.scale}`,
    seoDescription: `Shop the ${p.name} — a ${p.rarity} piece from ${p.brand} at ${p.scale} scale.`,
    createdAt: new Date(p.releasedAt).toISOString(),
    updatedAt: new Date(p.releasedAt).toISOString(),
  }));
}

const repo = createJsonRepository<AdminProduct>("products.json", seed);

export interface ProductInput {
  name: string;
  description: string;
  brand: string;
  manufacturer: string;
  vehicle: string;
  scale: string;
  price: number;
  stock: number;
  totalRun: number | null;
  rarity: Rarity;
  status: ProductStatus;
  featured: boolean;
  tags: string[];
  images: { id: string; url: string; alt: string }[];
  eventSlugs: string[];
  collectorScore: number;
  edition: string;
  seoTitle: string;
  seoDescription: string;
}

export const ProductService = {
  async getAll(): Promise<AdminProduct[]> {
    return repo.getAll();
  },

  async getById(id: string): Promise<AdminProduct | null> {
    return repo.getById(id);
  },

  async search(query: string, filters?: { status?: ProductStatus; brand?: string }): Promise<AdminProduct[]> {
    const all = await repo.getAll();
    let results = all.filter((p) => matchesQuery([p.name, p.brand, p.vehicle, p.scale, ...p.tags], query));
    if (filters?.status) results = results.filter((p) => p.status === filters.status);
    if (filters?.brand) results = results.filter((p) => p.brand === filters.brand);
    return results;
  },

  async create(input: ProductInput): Promise<AdminProduct> {
    const now = nowISO();
    const product: AdminProduct = {
      id: genId("prod"),
      slug: slugify(input.name),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    return repo.insert(product);
  },

  async update(id: string, patch: Partial<ProductInput>): Promise<AdminProduct | null> {
    const withSlug = patch.name ? { ...patch, slug: slugify(patch.name) } : patch;
    return repo.update(id, { ...withSlug, updatedAt: nowISO() });
  },

  async delete(id: string): Promise<boolean> {
    return repo.remove(id);
  },

  async archive(id: string): Promise<AdminProduct | null> {
    return this.update(id, { status: "archived" });
  },

  async unarchive(id: string): Promise<AdminProduct | null> {
    return this.update(id, { status: "active" });
  },

  async duplicate(id: string): Promise<AdminProduct | null> {
    const source = await repo.getById(id);
    if (!source) return null;
    const now = nowISO();
    const copy: AdminProduct = {
      ...source,
      id: genId("prod"),
      name: `${source.name} (Copy)`,
      slug: slugify(`${source.name} copy`),
      status: "draft",
      featured: false,
      createdAt: now,
      updatedAt: now,
    };
    return repo.insert(copy);
  },

  async reorderImages(id: string, orderedImageIds: string[]): Promise<AdminProduct | null> {
    const product = await repo.getById(id);
    if (!product) return null;
    const byId = new Map(product.images.map((img) => [img.id, img]));
    const reordered = orderedImageIds.map((imgId) => byId.get(imgId)).filter((x): x is AdminProduct["images"][number] => !!x);
    return this.update(id, { images: reordered });
  },

  async setFeaturedImage(id: string, imageId: string): Promise<AdminProduct | null> {
    const product = await repo.getById(id);
    if (!product) return null;
    const target = product.images.find((img) => img.id === imageId);
    if (!target) return product;
    const rest = product.images.filter((img) => img.id !== imageId);
    return this.update(id, { images: [target, ...rest] });
  },

  async distinctBrands(): Promise<string[]> {
    const all = await repo.getAll();
    return Array.from(new Set(all.map((p) => p.brand))).sort();
  },
};
