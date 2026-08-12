import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductService, EventService } from "@/lib/admin/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await ProductService.getById(id);
  return { title: product?.name ?? "Product" };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brands, events] = await Promise.all([
    ProductService.getById(id),
    ProductService.distinctBrands(),
    EventService.getAll(),
  ]);
  if (!product) notFound();

  return <ProductForm product={product} brands={brands} events={events} />;
}
