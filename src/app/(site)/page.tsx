import { Fragment, type ReactNode } from "react";
import { HashScrollOnMount } from "@/components/providers/HashScrollOnMount";
import { HeroSection } from "@/components/hero/HeroSection";
import { LatestDrops } from "@/components/sections/LatestDrops";
import { AnticipationTransition } from "@/components/sections/AnticipationTransition";
import { LimitedEditions } from "@/components/sections/LimitedEditions";
import { EventSection } from "@/components/events/EventSection";
import { GrailVault } from "@/components/sections/GrailVault";
import { CollectorShelf } from "@/components/sections/CollectorShelf";
import { DailyDrop } from "@/components/sections/DailyDrop";
import { BrandShowcase } from "@/components/sections/BrandShowcase";
import { CommunityStats } from "@/components/sections/CommunityStats";
import { InstagramWall } from "@/components/sections/InstagramWall";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

import { HomepageService } from "@/lib/admin/services/homepageService";
import { CollectionService } from "@/lib/admin/services/collectionService";
import { ProductService } from "@/lib/admin/services/productService";
import { EventService } from "@/lib/admin/services/eventService";
import { BrandService } from "@/lib/admin/services/brandService";
import { TestimonialService } from "@/lib/admin/services/testimonialService";
import {
  toPublicProduct,
  toPublicEvent,
  toPublicBrand,
  toPublicTestimonial,
  buildEventNameMap,
} from "@/lib/data/adapters";
import type { AdminProduct } from "@/lib/admin/types";

export default async function Home() {
  const [homepage, collections, adminProducts, adminEvents, adminBrands, adminTestimonials] =
    await Promise.all([
      HomepageService.get(),
      CollectionService.getAll(),
      ProductService.getAll(),
      EventService.getAll(),
      BrandService.getAll(),
      TestimonialService.getAll(),
    ]);

  const eventNameById = buildEventNameMap(adminEvents);
  const activeProducts = adminProducts.filter((p) => p.status === "active");
  const productById = new Map(activeProducts.map((p) => [p.id, p]));

  const resolveCollection = (key: string): AdminProduct[] =>
    (collections.find((c) => c.key === key)?.productIds ?? [])
      .map((id) => productById.get(id))
      .filter((p): p is AdminProduct => Boolean(p));

  const latestDrops = resolveCollection("latest-drops").map((p) => toPublicProduct(p, eventNameById));
  const limitedEditions = resolveCollection("limited-editions").map((p) => toPublicProduct(p, eventNameById));
  const grailVault = resolveCollection("grail-vault").map((p) => toPublicProduct(p, eventNameById));
  const collectorShelf = resolveCollection("collector-shelf").map((p) => toPublicProduct(p, eventNameById));
  const dailyDropProduct = resolveCollection("daily-drop")[0];
  const dailyDrop = dailyDropProduct ? toPublicProduct(dailyDropProduct, eventNameById) : null;

  const events = adminEvents.map(toPublicEvent);
  const brands = adminBrands.map((b) =>
    toPublicBrand(b, activeProducts.filter((p) => p.brand === b.name).length)
  );
  const testimonials = adminTestimonials.map(toPublicTestimonial);

  const sectionContent: Record<string, ReactNode> = {
    hero: <HeroSection heroTitle={homepage.heroTitle} heroSubtitle={homepage.heroSubtitle} />,
    "latest-drops": (
      <>
        <LatestDrops products={latestDrops} />
        <AnticipationTransition />
      </>
    ),
    "limited-editions": <LimitedEditions products={limitedEditions} />,
    "global-events": <EventSection events={events} />,
    "grail-vault": <GrailVault products={grailVault} />,
    "collector-shelf": <CollectorShelf products={collectorShelf} />,
    "daily-drop": <DailyDrop product={dailyDrop} />,
    brands: <BrandShowcase brands={brands} />,
    community: <CommunityStats />,
    instagram: <InstagramWall />,
    testimonials: <TestimonialsSection testimonials={testimonials} />,
  };

  return (
    <main className="relative bg-void">
      <HashScrollOnMount />
      {homepage.sections
        .filter((section) => section.enabled)
        .map((section) => (
          <Fragment key={section.id}>{sectionContent[section.key]}</Fragment>
        ))}
    </main>
  );
}
