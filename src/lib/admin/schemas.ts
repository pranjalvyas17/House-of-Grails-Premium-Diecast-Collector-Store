import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(1, "Description is required"),
  brand: z.string().min(1, "Brand is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  vehicle: z.string().min(1, "Vehicle is required"),
  scale: z.string().min(1, "Scale is required"),
  price: z.coerce.number().min(0, "Price can't be negative"),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  totalRun: z.coerce.number().int().min(0).nullable(),
  rarity: z.enum(["standard", "limited", "chase", "grail"]),
  status: z.enum(["active", "draft", "archived"]),
  featured: z.boolean(),
  tags: z.array(z.string()),
  images: z.array(z.object({ id: z.string(), url: z.string().min(1, "Image URL required"), alt: z.string() })).min(1, "At least one image is required"),
  eventSlugs: z.array(z.string()),
  collectorScore: z.coerce.number().min(0).max(100),
  edition: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

// react-hook-form's form state holds PRE-coercion values (e.g. a number
// input's raw string before zod coerces it), so `useForm` must be typed
// with zod's *input* type — `z.infer`/`z.output` (the post-coercion shape)
// is only correct for the validated result handed to onSubmit.
export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;

export const eventSchema = z.object({
  name: z.string().min(2, "Name is required"),
  shortName: z.string().min(1, "Short name is required").max(10, "Keep it short (max 10 chars)"),
  year: z.coerce.number().int().min(2000).max(2100),
  country: z.string().min(1, "Country is required"),
  city: z.string(),
  eventDate: z.string(),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  bannerUrl: z.string(),
  coverUrl: z.string(),
  productIds: z.array(z.string()),
});

export type EventFormInput = z.input<typeof eventSchema>;
export type EventFormValues = z.output<typeof eventSchema>;

export const brandSchema = z.object({
  name: z.string().min(2, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string(),
  bannerUrl: z.string(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  handle: z.string().min(1, "Handle is required"),
  quote: z.string().min(10, "Quote is a bit short"),
  avatarUrl: z.string(),
  collectionSize: z.string().min(1, "Required"),
  featured: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  supportEmail: z.string().email("Enter a valid email"),
  currency: z.string().min(1),
  shippingNote: z.string(),
  instagramUrl: z.string(),
  twitterUrl: z.string(),
  youtubeUrl: z.string(),
  seoDefaultTitle: z.string().min(1),
  seoDefaultDescription: z.string().min(1),
  maintenanceMode: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const homepageSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  heroButtons: z.array(z.object({ id: z.string(), label: z.string().min(1, "Label required"), href: z.string().min(1, "Link required") })),
  announcementEnabled: z.boolean(),
  announcementText: z.string(),
  announcementHref: z.string(),
  heroImageUrl: z.string(),
  heroVideoUrl: z.string(),
  sections: z.array(z.object({ id: z.string(), key: z.string(), label: z.string(), enabled: z.boolean() })),
});

export type HomepageFormValues = z.infer<typeof homepageSchema>;
