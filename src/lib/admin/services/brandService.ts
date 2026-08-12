import "server-only";
import { brands } from "@/lib/data/products";
import type { AdminBrand } from "../types";
import { genId, nowISO, slugify, matchesQuery } from "./utils";
import { createJsonRepository } from "@/lib/server/jsonStore";

// Persisted in /data/brands.json.

function seed(): AdminBrand[] {
  return brands.map((b) => ({
    id: genId("brand"),
    slug: b.id,
    name: b.name,
    tagline: b.tagline,
    description: `${b.name} — ${b.tagline}. ${b.productCount}+ pieces in the collection.`,
    logoUrl: b.image,
    bannerUrl: b.image,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }));
}

const repo = createJsonRepository<AdminBrand>("brands.json", seed);

export interface BrandInput {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
}

export const BrandService = {
  async getAll(): Promise<AdminBrand[]> {
    return repo.getAll();
  },

  async getById(id: string): Promise<AdminBrand | null> {
    return repo.getById(id);
  },

  async search(query: string): Promise<AdminBrand[]> {
    const all = await repo.getAll();
    return all.filter((b) => matchesQuery([b.name, b.tagline], query));
  },

  async create(input: BrandInput): Promise<AdminBrand> {
    const now = nowISO();
    const brand: AdminBrand = { id: genId("brand"), slug: slugify(input.name), ...input, createdAt: now, updatedAt: now };
    return repo.insert(brand);
  },

  async update(id: string, patch: Partial<BrandInput>): Promise<AdminBrand | null> {
    const withSlug = patch.name ? { ...patch, slug: slugify(patch.name) } : patch;
    return repo.update(id, { ...withSlug, updatedAt: nowISO() });
  },

  async delete(id: string): Promise<boolean> {
    return repo.remove(id);
  },
};
