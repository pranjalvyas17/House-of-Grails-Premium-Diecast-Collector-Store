import "server-only";
import type { SiteSettings } from "../types";
import { nowISO } from "./utils";
import { createJsonSingleton } from "@/lib/server/jsonStore";

// Persisted in /data/settings.json — a SINGLETON resource, same shape as
// HomepageService.

function seed(): SiteSettings {
  return {
    siteName: "The House of Grails",
    tagline: "Rare. Exclusive. Legendary.",
    supportEmail: "concierge@houseofgrails.com",
    currency: "USD",
    shippingNote: "Worldwide shipping, fully insured on every order.",
    instagramUrl: "https://instagram.com/houseofgrails",
    twitterUrl: "https://x.com/houseofgrails",
    youtubeUrl: "https://youtube.com/@houseofgrails",
    seoDefaultTitle: "THE HOUSE OF GRAILS — Rare. Exclusive. Legendary.",
    seoDefaultDescription:
      "A digital automotive museum for the world's rarest diecast. Chase cars, event exclusives and grails — curated like a Porsche.",
    maintenanceMode: false,
    updatedAt: nowISO(),
  };
}

const store = createJsonSingleton<SiteSettings>("settings.json", seed);

export const SettingsService = {
  async get(): Promise<SiteSettings> {
    return store.get();
  },

  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    return store.update({ ...patch, updatedAt: nowISO() });
  },
};
