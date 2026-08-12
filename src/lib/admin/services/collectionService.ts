import "server-only";
import { latestDrops, limitedEditions, collectorShelf, grailVault, dailyDrop } from "@/lib/data/products";
import type { Collection, CollectionKey } from "../types";
import { nowISO } from "./utils";
import { createJsonRepository } from "@/lib/server/jsonStore";

// Persisted in /data/collections.json.
// Collections are a FIXED set of six named slots (the owner can't create or
// delete a collection, only edit which products sit in it and in what
// order) — hence no create()/delete() here, unlike the other services.

function seed(): Collection[] {
  const now = nowISO();
  return [
    {
      key: "latest-drops",
      name: "Latest Drops",
      description: "New arrivals shown on the homepage, most recent first.",
      productIds: latestDrops.map((p) => p.id),
      updatedAt: now,
    },
    {
      key: "limited-editions",
      name: "Limited Editions",
      description: "The pinned Apple-style scroll reveal on the homepage.",
      productIds: limitedEditions.map((p) => p.id),
      updatedAt: now,
    },
    {
      key: "collector-shelf",
      name: "Collector's Shelf",
      description: "The icon showcase — Porsche, Skyline, Supra and friends.",
      productIds: collectorShelf.map((p) => p.id),
      updatedAt: now,
    },
    {
      key: "grail-vault",
      name: "Grail Vault",
      description: "The signature vault-door reveal section.",
      productIds: grailVault.map((p) => p.id),
      updatedAt: now,
    },
    {
      key: "homepage-featured",
      name: "Homepage Featured",
      description: "Cross-section spotlight products for the homepage.",
      productIds: [...latestDrops.slice(0, 2), ...grailVault.slice(0, 2)].map((p) => p.id),
      updatedAt: now,
    },
    {
      key: "daily-drop",
      name: "Daily Drop",
      description: "Today's single spotlighted piece with a countdown.",
      productIds: [dailyDrop.id],
      updatedAt: now,
    },
  ];
}

const repo = createJsonRepository<Collection>("collections.json", seed, (c) => c.key);

export const CollectionService = {
  async getAll(): Promise<Collection[]> {
    return repo.getAll();
  },

  async getByKey(key: CollectionKey): Promise<Collection | null> {
    return repo.getById(key);
  },

  async setProducts(key: CollectionKey, productIds: string[]): Promise<Collection | null> {
    return repo.update(key, { productIds, updatedAt: nowISO() });
  },

  async reorder(key: CollectionKey, orderedProductIds: string[]): Promise<Collection | null> {
    return this.setProducts(key, orderedProductIds);
  },
};
