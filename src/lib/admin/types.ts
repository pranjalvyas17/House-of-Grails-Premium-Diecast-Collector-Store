/**
 * Admin domain models. These are deliberately decoupled from the public
 * site's read-only mock catalogue (`src/lib/data/*`) — the admin operates on
 * its own in-memory store (seeded FROM that catalogue) so that editing in
 * the CMS can never accidentally mutate what the live site reads, and so a
 * future backend can own these shapes independently of the site's own
 * (much simpler) display types.
 */

export type ProductStatus = "active" | "draft" | "archived";
export type Rarity = "standard" | "limited" | "chase" | "grail";

export interface AdminImage {
  id: string;
  url: string;
  alt: string;
}

export interface AdminProduct {
  id: string;
  slug: string;
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
  /** Ordered gallery — images[0] is the featured/cover image. */
  images: AdminImage[];
  eventSlugs: string[];
  collectorScore: number;
  edition: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEvent {
  id: string;
  slug: string;
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
  /** Ordered — determines display order on the public event page. */
  productIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminBrand {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type CollectionKey =
  | "latest-drops"
  | "limited-editions"
  | "collector-shelf"
  | "grail-vault"
  | "homepage-featured"
  | "daily-drop";

export interface Collection {
  key: CollectionKey;
  name: string;
  description: string;
  /** Ordered list of AdminProduct ids assigned to this collection. */
  productIds: string[];
  updatedAt: string;
}

export interface HomepageButton {
  id: string;
  label: string;
  href: string;
}

export interface HomepageSection {
  id: string;
  /** Matches the public component this row represents (informational). */
  key: string;
  label: string;
  enabled: boolean;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroButtons: HomepageButton[];
  announcementEnabled: boolean;
  announcementText: string;
  announcementHref: string;
  heroImageUrl: string;
  heroVideoUrl: string;
  /** Ordered — position in this array is the section's render order. */
  sections: HomepageSection[];
  updatedAt: string;
}

export type MediaType = "image" | "video";

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  size: number;
  width: number | null;
  height: number | null;
  folder: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  quote: string;
  avatarUrl: string;
  collectionSize: string;
  featured: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  currency: string;
  shippingNote: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  maintenanceMode: boolean;
  updatedAt: string;
}
