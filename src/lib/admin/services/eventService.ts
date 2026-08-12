import "server-only";
import { getAllEvents, getEventProducts } from "@/lib/data/events";
import type { AdminEvent } from "../types";
import { genId, nowISO, slugify, matchesQuery } from "./utils";
import { createJsonRepository } from "@/lib/server/jsonStore";

// Persisted in /data/events.json.

function seed(): AdminEvent[] {
  return getAllEvents().map((e) => ({
    id: genId("evt"),
    slug: e.slug,
    name: e.name,
    shortName: e.shortName,
    year: e.year,
    country: e.country,
    city: e.city ?? "",
    eventDate: e.eventDate ?? "",
    tagline: e.tagline,
    description: e.description,
    bannerUrl: e.coverImage,
    coverUrl: e.coverImage,
    productIds: getEventProducts(e.slug).map((p) => p.id),
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }));
}

const repo = createJsonRepository<AdminEvent>("events.json", seed);

export interface EventInput {
  name: string;
  shortName: string;
  year: number;
  country: string;
  city: string;
  eventDate: string;
  tagline: string;
  description: string;
  bannerUrl: string;
  coverUrl: string;
  productIds: string[];
}

export const EventService = {
  async getAll(): Promise<AdminEvent[]> {
    return repo.getAll();
  },

  async getById(id: string): Promise<AdminEvent | null> {
    return repo.getById(id);
  },

  async getBySlug(slug: string): Promise<AdminEvent | null> {
    const all = await repo.getAll();
    return all.find((e) => e.slug === slug) ?? null;
  },

  async search(query: string): Promise<AdminEvent[]> {
    const all = await repo.getAll();
    return all.filter((e) => matchesQuery([e.name, e.shortName, e.country, e.city, e.year], query));
  },

  async create(input: EventInput): Promise<AdminEvent> {
    const now = nowISO();
    const event: AdminEvent = { id: genId("evt"), slug: slugify(`${input.name}-${input.year}`), ...input, createdAt: now, updatedAt: now };
    return repo.insert(event);
  },

  async update(id: string, patch: Partial<EventInput>): Promise<AdminEvent | null> {
    return repo.update(id, { ...patch, updatedAt: nowISO() });
  },

  async delete(id: string): Promise<boolean> {
    return repo.remove(id);
  },

  async associateProducts(id: string, productIds: string[]): Promise<AdminEvent | null> {
    return this.update(id, { productIds });
  },

  async reorderProducts(id: string, orderedProductIds: string[]): Promise<AdminEvent | null> {
    return this.update(id, { productIds: orderedProductIds });
  },
};
