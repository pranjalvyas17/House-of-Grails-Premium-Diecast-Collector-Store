import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/data/products";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="px-6 py-20 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="You May Also Grail"
          title={
            <>
              Related <span className="text-gradient-grail">Pieces</span>
            </>
          }
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
