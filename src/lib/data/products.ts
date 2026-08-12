/** Mock catalogue data for THE HOUSE OF GRAILS. Swap for a real API in Phase 4+. */

export type Rarity = "standard" | "limited" | "chase" | "grail";

export interface Product {
  id: string;
  name: string;
  brand: string;
  scale: string;
  price: number;
  rarity: Rarity;
  stock: number;
  edition?: string;
  event?: string;
  /** Original production run size, when known — powers the stock indicator's scarcity bar. */
  totalRun?: number;
  image: string;
  collectorScore: number;
  releasedAt: string;
}

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const latestDrops: Product[] = [
  {
    id: "ld-001",
    name: "Porsche 911 (992) GT3 RS",
    brand: "Mini GT",
    scale: "1:64",
    price: 42,
    rarity: "limited",
    stock: 12,
    edition: "Weissach Package",
    image: img("911-gt3rs"),
    collectorScore: 92,
    releasedAt: "2026-07-18",
  },
  {
    id: "ld-002",
    name: "Nissan Skyline GT-R R34",
    brand: "Inno64",
    scale: "1:64",
    price: 38,
    rarity: "standard",
    stock: 40,
    image: img("r34-gtr"),
    collectorScore: 81,
    releasedAt: "2026-07-15",
  },
  {
    id: "ld-003",
    name: "RWB Porsche 964",
    brand: "Kaido House",
    scale: "1:64",
    price: 89,
    rarity: "chase",
    stock: 3,
    edition: "V1 Chase",
    image: img("rwb-964"),
    collectorScore: 97,
    releasedAt: "2026-07-20",
  },
  {
    id: "ld-004",
    name: "Toyota Supra MK4",
    brand: "Pop Race",
    scale: "1:64",
    price: 45,
    rarity: "limited",
    stock: 22,
    image: img("supra-mk4"),
    collectorScore: 85,
    releasedAt: "2026-07-12",
  },
  {
    id: "ld-005",
    name: "Lamborghini Countach LP500",
    brand: "Tarmac Works",
    scale: "1:64",
    price: 55,
    rarity: "standard",
    stock: 30,
    image: img("countach"),
    collectorScore: 78,
    releasedAt: "2026-07-10",
  },
  {
    id: "ld-006",
    name: "Nissan Silvia S15",
    brand: "Inno64",
    scale: "1:64",
    price: 36,
    rarity: "limited",
    stock: 18,
    image: img("s15-silvia"),
    collectorScore: 83,
    releasedAt: "2026-07-08",
  },
];

export const limitedEditions: Product[] = [
  {
    id: "le-001",
    name: "Mazda RX-7 FD3S",
    brand: "Kaido House",
    scale: "1:64",
    price: 95,
    rarity: "grail",
    stock: 1,
    edition: "V2 Nightfall",
    totalRun: 300,
    image: img("rx7-fd"),
    collectorScore: 99,
    releasedAt: "2026-06-01",
  },
  {
    id: "le-002",
    name: "Porsche 911 (964) Singer",
    brand: "Tarmac Works",
    scale: "1:64",
    price: 78,
    rarity: "grail",
    stock: 2,
    edition: "Commission Series",
    totalRun: 250,
    image: img("singer-964"),
    collectorScore: 98,
    releasedAt: "2026-05-20",
  },
  {
    id: "le-003",
    name: "Hot Wheels Bone Shaker",
    brand: "Hot Wheels",
    scale: "1:64",
    price: 250,
    rarity: "chase",
    stock: 1,
    edition: "Super Treasure Hunt",
    totalRun: 500,
    image: img("bone-shaker"),
    collectorScore: 95,
    releasedAt: "2026-04-11",
  },
];

export const grailVault: Product[] = [
  {
    id: "gv-001",
    name: "RWB Porsche 993",
    brand: "Kaido House",
    scale: "1:64",
    price: 320,
    rarity: "grail",
    stock: 1,
    edition: "V1 Chase",
    event: "Tokyo Auto Salon 2026",
    totalRun: 200,
    image: img("rwb-993-vault"),
    collectorScore: 99,
    releasedAt: "2026-01-12",
  },
  {
    id: "gv-002",
    name: "Nissan GT-R R35 LB Works",
    brand: "Inno64",
    scale: "1:64",
    price: 210,
    rarity: "grail",
    stock: 2,
    event: "Thailand Toy Expo",
    totalRun: 350,
    image: img("lb-r35"),
    collectorScore: 96,
    releasedAt: "2026-02-03",
  },
  {
    id: "gv-003",
    name: "Toyota Supra A90 Widebody",
    brand: "Pop Race",
    scale: "1:64",
    price: 180,
    rarity: "grail",
    stock: 3,
    event: "Malaysia Model Expo",
    totalRun: 400,
    image: img("a90-widebody"),
    collectorScore: 94,
    releasedAt: "2026-03-15",
  },
  {
    id: "gv-004",
    name: "Mazda RX-7 FC RE-Amemiya",
    brand: "Kaido House",
    scale: "1:64",
    price: 275,
    rarity: "grail",
    stock: 1,
    event: "Tokyo Auto Salon 2026",
    totalRun: 180,
    image: img("fc-reamemiya"),
    collectorScore: 98,
    releasedAt: "2026-01-14",
  },
  {
    id: "gv-005",
    name: "Porsche 911 (997) GT3 RWB",
    brand: "Tarmac Works",
    scale: "1:64",
    price: 240,
    rarity: "grail",
    stock: 2,
    event: "RWB Global Meet",
    totalRun: 300,
    image: img("997-rwb"),
    collectorScore: 97,
    releasedAt: "2026-02-22",
  },
  {
    id: "gv-006",
    name: "Nissan Silvia S15 D-Max",
    brand: "Mini GT",
    scale: "1:64",
    price: 165,
    rarity: "grail",
    stock: 4,
    event: "Malaysia Model Expo",
    totalRun: 450,
    image: img("s15-dmax"),
    collectorScore: 93,
    releasedAt: "2026-03-01",
  },
];

export const collectorShelf: Product[] = [
  { id: "cs-001", name: "Porsche 911 Turbo S", brand: "Mini GT", scale: "1:64", price: 40, rarity: "standard", stock: 25, image: img("911-turbos"), collectorScore: 80, releasedAt: "2026-06-10" },
  { id: "cs-002", name: "Nissan Skyline GT-R R34 V-Spec", brand: "Inno64", scale: "1:64", price: 42, rarity: "limited", stock: 15, image: img("r34-vspec"), collectorScore: 88, releasedAt: "2026-06-08" },
  { id: "cs-003", name: "Toyota Supra RZ", brand: "Pop Race", scale: "1:64", price: 44, rarity: "standard", stock: 28, image: img("supra-rz"), collectorScore: 82, releasedAt: "2026-06-05" },
  { id: "cs-004", name: "Mazda RX-7 Spirit R", brand: "Tarmac Works", scale: "1:64", price: 48, rarity: "limited", stock: 10, image: img("rx7-spiritr"), collectorScore: 89, releasedAt: "2026-06-02" },
  { id: "cs-005", name: "Nissan Silvia Q's", brand: "Inno64", scale: "1:64", price: 36, rarity: "standard", stock: 32, image: img("silvia-qs"), collectorScore: 79, releasedAt: "2026-05-28" },
  { id: "cs-006", name: "Lamborghini Diablo SV", brand: "Kaido House", scale: "1:64", price: 92, rarity: "limited", stock: 8, image: img("diablo-sv"), collectorScore: 91, releasedAt: "2026-05-25" },
];

export const dailyDrop: Product = {
  id: "dd-001",
  name: "Porsche 911 (930) Turbo",
  brand: "Tarmac Works",
  scale: "1:64",
  price: 62,
  rarity: "chase",
  stock: 6,
  edition: "Today Only",
  totalRun: 150,
  image: img("930-turbo"),
  collectorScore: 90,
  releasedAt: "2026-07-22",
};

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  productCount: number;
  image: string;
}

export const brands: Brand[] = [
  { id: "minigt", name: "Mini GT", tagline: "Precision at 1:64", productCount: 340, image: img("brand-minigt") },
  { id: "hotwheels", name: "Hot Wheels", tagline: "Since 1968", productCount: 1200, image: img("brand-hotwheels") },
  { id: "inno64", name: "Inno64", tagline: "JDM specialists", productCount: 210, image: img("brand-inno64") },
  { id: "poprace", name: "Pop Race", tagline: "Detail obsessed", productCount: 95, image: img("brand-poprace") },
  { id: "kaidohouse", name: "Kaido House", tagline: "The chase culture", productCount: 60, image: img("brand-kaidohouse") },
  { id: "tarmacworks", name: "Tarmac Works", tagline: "Motorsport heritage", productCount: 180, image: img("brand-tarmacworks") },
  { id: "bburago", name: "Bburago", tagline: "Since 1974", productCount: 420, image: img("brand-bburago") },
];

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  quote: string;
  avatar: string;
  collection: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t-001",
    name: "Marcus Chen",
    handle: "@grailhunter",
    quote:
      "The Grail Vault reveal is unreal. I've never seen a diecast site feel this cinematic — it's the reason I check daily.",
    avatar: img("avatar-1", 100, 100),
    collection: "142 pieces",
  },
  {
    id: "t-002",
    name: "Priya Sharma",
    handle: "@jdm.priya",
    quote:
      "Copped the RWB 993 chase within seconds of drop. The stock indicator and countdown make it feel like a real auction house.",
    avatar: img("avatar-2", 100, 100),
    collection: "88 pieces",
  },
  {
    id: "t-003",
    name: "Daniel Okafor",
    handle: "@shelflife",
    quote:
      "This is the Porsche of diecast collecting — genuinely. The product pages feel like configuring a real car.",
    avatar: img("avatar-3", 100, 100),
    collection: "210 pieces",
  },
];

export const instagramWall = Array.from({ length: 8 }).map((_, i) => ({
  id: `ig-${i}`,
  image: img(`insta-${i}`, 500, 500),
  likes: 200 + i * 37,
}));

export const communityStats = [
  { label: "Collectors Worldwide", value: 48000, suffix: "+" },
  { label: "Grails Vaulted", value: 1240, suffix: "" },
  { label: "Countries Shipped", value: 62, suffix: "" },
  { label: "Avg. Collector Score", value: 91, suffix: "%" },
];

export const rarityLabel: Record<Rarity, string> = {
  standard: "Standard",
  limited: "Limited Edition",
  chase: "Chase Piece",
  grail: "Grail",
};

/** Every product across every section, deduplicated by id — the catalogue product pages resolve against. */
export const allProducts: Product[] = [
  ...latestDrops,
  ...limitedEditions,
  ...grailVault,
  ...collectorShelf,
  dailyDrop,
];
