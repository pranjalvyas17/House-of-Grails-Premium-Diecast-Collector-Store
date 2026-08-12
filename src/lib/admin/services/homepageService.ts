import "server-only";
import type { HomepageConfig } from "../types";
import { genId, nowISO } from "./utils";
import { createJsonSingleton } from "@/lib/server/jsonStore";

// Persisted in /data/homepage.json — a SINGLETON resource (one config, not
// a list) — hence get()/update() rather than the getAll/getById/create/
// delete shape used by the list-based services.

function seed(): HomepageConfig {
  return {
    heroTitle: "THE HOUSE OF GRAILS",
    heroSubtitle: "Rare. Exclusive. Legendary.",
    heroButtons: [
      { id: genId("btn"), label: "Enter the Vault", href: "/#grail-vault" },
    ],
    announcementEnabled: false,
    announcementText: "Free worldwide shipping on every grail this week.",
    announcementHref: "/#latest-drops",
    heroImageUrl: "",
    heroVideoUrl: "",
    sections: [
      { id: genId("sec"), key: "hero", label: "Hero", enabled: true },
      { id: genId("sec"), key: "latest-drops", label: "Latest Drops", enabled: true },
      { id: genId("sec"), key: "limited-editions", label: "Limited Editions", enabled: true },
      { id: genId("sec"), key: "global-events", label: "Global Diecast Events", enabled: true },
      { id: genId("sec"), key: "grail-vault", label: "Grail Vault", enabled: true },
      { id: genId("sec"), key: "collector-shelf", label: "Collector's Shelf", enabled: true },
      { id: genId("sec"), key: "daily-drop", label: "Daily Drop", enabled: true },
      { id: genId("sec"), key: "brands", label: "Brand Showcase", enabled: true },
      { id: genId("sec"), key: "community", label: "Community Stats", enabled: true },
      { id: genId("sec"), key: "instagram", label: "Instagram Wall", enabled: true },
      { id: genId("sec"), key: "testimonials", label: "Testimonials", enabled: true },
    ],
    updatedAt: nowISO(),
  };
}

const store = createJsonSingleton<HomepageConfig>("homepage.json", seed);

export const HomepageService = {
  async get(): Promise<HomepageConfig> {
    return store.get();
  },

  async update(patch: Partial<HomepageConfig>): Promise<HomepageConfig> {
    return store.update({ ...patch, updatedAt: nowISO() });
  },

  async reorderSections(orderedSectionIds: string[]): Promise<HomepageConfig> {
    const current = await store.get();
    const byId = new Map(current.sections.map((s) => [s.id, s]));
    const reordered = orderedSectionIds.map((id) => byId.get(id)).filter((s): s is HomepageConfig["sections"][number] => !!s);
    return this.update({ sections: reordered });
  },

  async toggleSection(sectionId: string, enabled: boolean): Promise<HomepageConfig> {
    const current = await store.get();
    return this.update({
      sections: current.sections.map((s) => (s.id === sectionId ? { ...s, enabled } : s)),
    });
  },
};
