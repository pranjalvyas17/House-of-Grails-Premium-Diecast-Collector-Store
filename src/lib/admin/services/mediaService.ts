import "server-only";
import { latestDrops, grailVault, brands } from "@/lib/data/products";
import type { MediaAsset } from "../types";
import { genId, nowISO, matchesQuery } from "./utils";
import { createJsonRepository } from "@/lib/server/jsonStore";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/server/mediaStorage";

// Persisted in /data/media.json. Uploaded files themselves live under
// /public/uploads/<folder>/ (see mediaStorage.ts) — this file only stores
// their metadata + resulting public URL, never a blob: reference.

function seed(): MediaAsset[] {
  const now = nowISO();
  const fromProducts: MediaAsset[] = [...latestDrops, ...grailVault].map((p) => ({
    id: genId("media"),
    name: `${p.name}.jpg`,
    url: p.image,
    type: "image" as const,
    size: 240_000 + Math.floor(Math.random() * 180_000),
    width: 800,
    height: 600,
    folder: "products",
    createdAt: now,
  }));
  const fromBrands: MediaAsset[] = brands.map((b) => ({
    id: genId("media"),
    name: `${b.id}-logo.jpg`,
    url: b.image,
    type: "image" as const,
    size: 90_000 + Math.floor(Math.random() * 40_000),
    width: 600,
    height: 600,
    folder: "brands",
    createdAt: now,
  }));
  return [...fromProducts, ...fromBrands];
}

const repo = createJsonRepository<MediaAsset>("media.json", seed);

export const MediaService = {
  async getAll(): Promise<MediaAsset[]> {
    const all = await repo.getAll();
    return [...all].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async getById(id: string): Promise<MediaAsset | null> {
    return repo.getById(id);
  },

  async search(query: string, folder?: string): Promise<MediaAsset[]> {
    const all = await repo.getAll();
    let results = all.filter((m) => matchesQuery([m.name, m.folder], query));
    if (folder && folder !== "all") results = results.filter((m) => m.folder === folder);
    return results;
  },

  async upload(file: File, folder = "uploads"): Promise<MediaAsset> {
    const saved = await saveUploadedFile(file, folder);
    const asset: MediaAsset = {
      id: genId("media"),
      name: saved.name,
      url: saved.url,
      type: saved.type,
      size: saved.size,
      width: null,
      height: null,
      folder,
      createdAt: nowISO(),
    };
    return repo.insert(asset);
  },

  async rename(id: string, name: string): Promise<MediaAsset | null> {
    return repo.update(id, { name });
  },

  async replace(id: string, file: File): Promise<MediaAsset | null> {
    const existing = await repo.getById(id);
    if (!existing) return null;
    const saved = await saveUploadedFile(file, existing.folder);
    await deleteUploadedFile(existing.url);
    return repo.update(id, { url: saved.url, size: saved.size, name: saved.name, type: saved.type });
  },

  async delete(id: string): Promise<boolean> {
    const existing = await repo.getById(id);
    if (!existing) return false;
    const removed = await repo.remove(id);
    if (removed) await deleteUploadedFile(existing.url);
    return removed;
  },

  async folders(): Promise<string[]> {
    const all = await repo.getAll();
    return Array.from(new Set(all.map((m) => m.folder))).sort();
  },
};
