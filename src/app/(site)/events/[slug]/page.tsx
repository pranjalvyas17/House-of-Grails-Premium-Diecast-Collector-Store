import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventHero } from "@/components/events/EventHero";
import { EventDetailContent } from "@/components/events/EventDetailContent";
import { EventService } from "@/lib/admin/services/eventService";
import { ProductService } from "@/lib/admin/services/productService";
import { toPublicEvent, toPublicProduct, buildEventNameMap } from "@/lib/data/adapters";

export async function generateStaticParams() {
  const events = await EventService.getAll();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await EventService.getBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.name} ${event.year}`,
    description: event.description,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [adminEvent, allEvents, allAdminProducts] = await Promise.all([
    EventService.getBySlug(slug),
    EventService.getAll(),
    ProductService.getAll(),
  ]);
  if (!adminEvent) notFound();

  const event = toPublicEvent(adminEvent);
  const eventNameById = buildEventNameMap(allEvents);
  const productById = new Map(allAdminProducts.map((p) => [p.id, p]));
  const products = adminEvent.productIds
    .map((id) => productById.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .filter((p) => p.status === "active")
    .map((p) => toPublicProduct(p, eventNameById));

  return (
    <main className="relative bg-void pb-28">
      <EventHero event={event} />
      <div className="mt-14">
        <EventDetailContent products={products} />
      </div>
    </main>
  );
}
