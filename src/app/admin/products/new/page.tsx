import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductService, EventService } from "@/lib/admin/services";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const [brands, events] = await Promise.all([ProductService.distinctBrands(), EventService.getAll()]);
  return <ProductForm brands={brands} events={events} />;
}
