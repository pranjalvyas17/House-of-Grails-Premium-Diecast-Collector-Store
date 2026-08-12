import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductPhotoGallery } from "@/components/product/ProductPhotoGallery";
import { StickyPurchasePanel } from "@/components/product/StickyPurchasePanel";
import { ProductHistory } from "@/components/product/ProductHistory";
import { CollectorScoreRing } from "@/components/product/CollectorScoreRing";
import { EventInfo } from "@/components/product/EventInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRelatedProducts, getEventDetail } from "@/lib/data/productDetail";
import { toPublicProduct, buildEventNameMap } from "@/lib/data/adapters";
import { ProductService } from "@/lib/admin/services/productService";
import { EventService } from "@/lib/admin/services/eventService";

export async function generateStaticParams() {
  const products = await ProductService.getAll();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await ProductService.getById(id);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name} — ${product.brand} ${product.scale}. Collector Score ${product.collectorScore}/100. Rare. Exclusive. Legendary.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [adminProduct, allAdminProducts, events] = await Promise.all([
    ProductService.getById(id),
    ProductService.getAll(),
    EventService.getAll(),
  ]);
  if (!adminProduct) notFound();

  const eventNameById = buildEventNameMap(events);
  const product = toPublicProduct(adminProduct, eventNameById);
  const pool = allAdminProducts
    .filter((p) => p.status === "active")
    .map((p) => toPublicProduct(p, eventNameById));

  const related = getRelatedProducts(product, pool);
  const event = getEventDetail(adminProduct, events);

  return (
    <main className="relative bg-void pt-28 md:pt-32">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-silver transition-colors hover:text-pearl"
        >
          <ArrowLeft size={15} />
          Back to the Collection
        </Link>

        {/* Configurator stage */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProductPhotoGallery images={adminProduct.images} name={product.name} />
          </div>

          <div className="lg:col-span-5">
            <StickyPurchasePanel product={product} />
          </div>
        </div>

        {/* Product history */}
        <section className="mt-28">
          <SectionHeading
            kicker="Provenance"
            title={
              <>
                Product <span className="text-gradient-grail">History</span>
              </>
            }
          />
          <div className="mt-12">
            <ProductHistory product={product} />
          </div>
        </section>

        {/* Collector score breakdown */}
        <section className="mt-28">
          <SectionHeading
            kicker="The Numbers"
            title={
              <>
                Collector <span className="text-gradient-grail">Score</span>
              </>
            }
          />
          <div className="mt-12">
            <CollectorScoreRing product={product} />
          </div>
        </section>

        {/* Event information, when applicable */}
        {event && (
          <section className="mt-28">
            <SectionHeading kicker="Where It Debuted" title="Event Information" />
            <div className="mt-12">
              <EventInfo event={event} />
            </div>
          </section>
        )}
      </div>

      <div className="mt-28">
        <RelatedProducts products={related} />
      </div>
    </main>
  );
}
