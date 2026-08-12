import "server-only";
import { testimonials as publicTestimonials } from "@/lib/data/products";
import type { Testimonial } from "../types";
import { genId, nowISO, matchesQuery } from "./utils";
import { createJsonRepository } from "@/lib/server/jsonStore";

// Persisted in /data/testimonials.json.

function seed(): Testimonial[] {
  return publicTestimonials.map((t, i) => ({
    id: genId("test"),
    name: t.name,
    handle: t.handle,
    quote: t.quote,
    avatarUrl: t.avatar,
    collectionSize: t.collection,
    featured: i === 0,
    createdAt: nowISO(),
  }));
}

const repo = createJsonRepository<Testimonial>("testimonials.json", seed);

export interface TestimonialInput {
  name: string;
  handle: string;
  quote: string;
  avatarUrl: string;
  collectionSize: string;
  featured: boolean;
}

export const TestimonialService = {
  async getAll(): Promise<Testimonial[]> {
    return repo.getAll();
  },

  async getById(id: string): Promise<Testimonial | null> {
    return repo.getById(id);
  },

  async search(query: string): Promise<Testimonial[]> {
    const all = await repo.getAll();
    return all.filter((t) => matchesQuery([t.name, t.handle, t.quote], query));
  },

  async create(input: TestimonialInput): Promise<Testimonial> {
    const testimonial: Testimonial = { id: genId("test"), ...input, createdAt: nowISO() };
    return repo.insert(testimonial);
  },

  async update(id: string, patch: Partial<TestimonialInput>): Promise<Testimonial | null> {
    return repo.update(id, patch);
  },

  async delete(id: string): Promise<boolean> {
    return repo.remove(id);
  },
};
