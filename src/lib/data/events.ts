import { allProducts, type Product } from "./products";

export interface DiecastEvent {
  id: string;
  slug: string;
  /** Full event name, e.g. "Malaysia Diecast Expo" */
  name: string;
  /** Short mark used on the card, e.g. "MDX" */
  shortName: string;
  year: number;
  country: string;
  city?: string;
  /** Human-readable date range shown on the card/hero. */
  eventDate?: string;
  /** Card badge / hero subtitle, e.g. "Asia's Premier Diecast Event" */
  tagline: string;
  description: string;
  coverImage: string;
}

const img = (seed: string, w = 1600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const diecastEvents: DiecastEvent[] = [
  {
    id: "ide-2025",
    slug: "ide-2025",
    name: "Indonesia Diecast Expo",
    shortName: "IDE",
    year: 2025,
    country: "Indonesia",
    city: "Jakarta",
    eventDate: "2025",
    tagline: "Southeast Asia's Collector Gathering",
    description:
      "Indonesia's home-grown diecast exhibition, bringing chase pieces and regional exclusives to Jakarta's growing collector scene.",
    coverImage: img("ide-2025-cover"),
  },
  {
    id: "mdx-2025",
    slug: "mdx-2025",
    name: "Malaysia Diecast Expo",
    shortName: "MDX",
    year: 2025,
    country: "Malaysia",
    city: "Kuala Lumpur",
    eventDate: "2025",
    tagline: "Asia's Premier Diecast Event",
    description:
      "The flagship Malaysian expo for 1:64 culture — expo-exclusive castings, brand showcases and the region's biggest collector meetup.",
    coverImage: img("mdx-2025-cover"),
  },
  {
    id: "hk-toycar-salon-2025",
    slug: "hk-toycar-salon-2025",
    name: "Hong Kong Toy Car Salon",
    shortName: "HKTS",
    year: 2025,
    country: "Hong Kong",
    city: "Hong Kong",
    eventDate: "2025",
    tagline: "Where East Meets Diecast",
    description:
      "Hong Kong's premier toy car exhibition, spotlighting limited castings from the region's most sought-after independent brands.",
    coverImage: img("hk-2025-cover"),
  },
  {
    id: "diecast-expo-singapore-2025",
    slug: "diecast-expo-singapore-2025",
    name: "The Diecast Expo",
    shortName: "TDX",
    year: 2025,
    country: "Singapore",
    city: "Singapore",
    eventDate: "30–31 August 2025",
    tagline: "The World's Premiere Diecast Exhibition",
    description:
      "Powered by Auto Expo — the world's premiere diecast exhibition returns to Singapore Expo, uniting brands and collectors under one roof.",
    coverImage: img("sg-expo-2025-cover"),
  },
  {
    id: "tmcs-singapore-2025",
    slug: "tmcs-singapore-2025",
    name: "The Model Car Show — Singapore",
    shortName: "TMCS SG",
    year: 2025,
    country: "Singapore",
    city: "Singapore",
    eventDate: "2025",
    tagline: "The Model Car Show",
    description:
      "Singapore's dedicated model car show, showcasing precision castings and scale-accurate builds from the region's leading houses.",
    coverImage: img("tmcs-sg-2025-cover"),
  },
  {
    id: "tmcs-malaysia-2025",
    slug: "tmcs-malaysia-2025",
    name: "The Model Car Show — Malaysia",
    shortName: "TMCS MY",
    year: 2025,
    country: "Malaysia",
    city: "Kuala Lumpur",
    eventDate: "2025",
    tagline: "The Model Car Show",
    description:
      "Malaysia's model car showcase, drawing collectors for exclusive reveals and hands-on brand exhibitions.",
    coverImage: img("tmcs-my-2025-cover"),
  },
  {
    id: "apa-2025",
    slug: "apa-2025",
    name: "Auto Passion Alliance",
    shortName: "APA",
    year: 2025,
    country: "Malaysia",
    eventDate: "2025",
    tagline: "United by Automotive Passion",
    description:
      "A collective expo for tuner-culture diecast — RWB, widebody and motorsport-inspired castings take centre stage.",
    coverImage: img("apa-2025-cover"),
  },
  {
    id: "tde-2025",
    slug: "tde-2025",
    name: "Thailand Diecast Expo",
    shortName: "TDE",
    year: 2025,
    country: "Thailand",
    city: "Bangkok",
    eventDate: "2025",
    tagline: "Thailand's Diecast Destination",
    description:
      "Bangkok's flagship diecast expo, bringing exclusive JDM and event-only castings to Southeast Asia's collector community.",
    coverImage: img("tde-2025-cover"),
  },
  {
    id: "works-model",
    slug: "works-model",
    name: "Works Model",
    shortName: "WORKS",
    year: 2025,
    country: "Japan",
    eventDate: "Ongoing",
    tagline: "Precision JDM Castings",
    description:
      "A specialist Japanese diecast house whose showcase pieces have become recurring grails across the collector circuit.",
    coverImage: img("works-model-cover"),
  },
  {
    id: "tokyo-auto-salon",
    slug: "tokyo-auto-salon",
    name: "Tokyo Auto Salon",
    shortName: "TAS",
    year: 2026,
    country: "Japan",
    city: "Chiba",
    eventDate: "January 2026",
    tagline: "Japan's Largest Tuning & Customisation Show",
    description:
      "The full-scale tuning show that diecast houses build their most ambitious castings around — RWB, widebody and show-car exclusives debut here first.",
    coverImage: img("tokyo-auto-salon-cover"),
  },
  {
    id: "hobby-expo-china",
    slug: "hobby-expo-china",
    name: "Hobby Expo China",
    shortName: "HEC",
    year: 2025,
    country: "China",
    city: "Shanghai",
    eventDate: "2025",
    tagline: "China's Collector Convergence",
    description:
      "A sprawling hobby and collectible expo where China's diecast scene reveals its most anticipated regional exclusives.",
    coverImage: img("hobby-expo-china-cover"),
  },
  {
    id: "mdx-2026",
    slug: "mdx-2026",
    name: "Malaysia Diecast Expo",
    shortName: "MDX",
    year: 2026,
    country: "Malaysia",
    city: "Kuala Lumpur",
    eventDate: "2026",
    tagline: "Asia's Premier Diecast Event",
    description:
      "MDX returns for 2026 with an even larger showcase — the region's biggest expo-exclusive drop of the year.",
    coverImage: img("mdx-2026-cover"),
  },
  {
    id: "tde-2026",
    slug: "tde-2026",
    name: "Thailand Diecast Expo",
    shortName: "TDE",
    year: 2026,
    country: "Thailand",
    city: "Bangkok",
    eventDate: "2026",
    tagline: "The World of Never-Ending Experiences",
    description:
      "TDE 2026 brings a new wave of Thailand-exclusive castings under a bigger roof, with brand takeovers across every hall.",
    coverImage: img("tde-2026-cover"),
  },
  {
    id: "hk-toycar-salon-2026",
    slug: "hk-toycar-salon-2026",
    name: "Hong Kong Toy Car Salon",
    shortName: "HKTS",
    year: 2026,
    country: "Hong Kong",
    city: "Hong Kong",
    eventDate: "2026",
    tagline: "Where East Meets Diecast",
    description:
      "Returning for 2026 — Hong Kong's toy car salon expands with new independent brands and a dedicated grail hall.",
    coverImage: img("hk-2026-cover"),
  },
  {
    id: "gt-show-2026",
    slug: "gt-show-2026",
    name: "GT Show",
    shortName: "GT",
    year: 2026,
    country: "Malaysia",
    eventDate: "2026",
    tagline: "The Grand Tourer Showcase",
    description:
      "A motorsport-flavoured showcase for GT and endurance-racing castings, from liveried grid cars to road-legal homologation specials.",
    coverImage: img("gt-show-2026-cover"),
  },
  {
    id: "cool-car-show-2026",
    slug: "cool-car-show-2026",
    name: "Cool Car Show",
    shortName: "CCS",
    year: 2026,
    country: "Malaysia",
    eventDate: "2026",
    tagline: "Icons, Reimagined",
    description:
      "A celebration of the icons every collector grew up with — classic silhouettes recast for a new generation of shelves.",
    coverImage: img("cool-car-show-2026-cover"),
  },
  {
    id: "tmcs-malaysia-2026",
    slug: "tmcs-malaysia-2026",
    name: "The Model Car Show — Malaysia",
    shortName: "TMCS MY",
    year: 2026,
    country: "Malaysia",
    city: "Kuala Lumpur",
    eventDate: "2026",
    tagline: "The Model Car Show",
    description:
      "TMCS Malaysia's 2026 edition — precision builds, scale-accurate liveries and hands-on brand exhibitions return.",
    coverImage: img("tmcs-my-2026-cover"),
  },
  {
    id: "almost-real",
    slug: "almost-real",
    name: "Almost Real",
    shortName: "AR",
    year: 2025,
    country: "United Kingdom",
    eventDate: "Ongoing",
    tagline: "Precision Beyond Scale",
    description:
      "A resin specialist house whose showcase releases have become a recurring fixture on the grail circuit for their obsessive detail.",
    coverImage: img("almost-real-cover"),
  },
];

/** Deterministic event → product associations (mock data; a product may
 *  legitimately have shown at more than one expo). Kept separate from the
 *  product catalogue so this feature never has to touch products.ts. */
const eventProductMap: Record<string, string[]> = {
  "ide-2025": ["ld-001", "cs-001"],
  "mdx-2025": ["gv-006", "cs-002"],
  "hk-toycar-salon-2025": ["ld-002", "cs-003"],
  "diecast-expo-singapore-2025": ["le-001", "cs-004"],
  "tmcs-singapore-2025": ["le-002", "cs-005"],
  "tmcs-malaysia-2025": ["gv-006", "cs-006"],
  "apa-2025": ["gv-005", "ld-003"],
  "tde-2025": ["gv-002", "ld-004"],
  "works-model": ["le-003", "cs-001"],
  "tokyo-auto-salon": ["gv-001", "gv-004"],
  "hobby-expo-china": ["ld-005", "cs-002"],
  "mdx-2026": ["gv-003", "ld-006"],
  "tde-2026": ["gv-002", "dd-001"],
  "hk-toycar-salon-2026": ["ld-002", "gv-004"],
  "gt-show-2026": ["cs-003", "le-001"],
  "cool-car-show-2026": ["cs-004", "ld-001"],
  "tmcs-malaysia-2026": ["cs-006", "gv-006"],
  "almost-real": ["le-002", "cs-005"],
};

export function getAllEvents(): DiecastEvent[] {
  return diecastEvents;
}

export function getEventBySlug(slug: string): DiecastEvent | undefined {
  return diecastEvents.find((e) => e.slug === slug);
}

export function getEventProducts(slug: string): Product[] {
  const ids = eventProductMap[slug] ?? [];
  return ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}
