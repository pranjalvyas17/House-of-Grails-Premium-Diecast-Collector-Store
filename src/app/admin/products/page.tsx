import type { Metadata } from "next";
import { ProductService } from "@/lib/admin/services";
import { ProductsTable } from "@/components/admin/products/ProductsTable";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const products = await ProductService.getAll();
  return <ProductsTable initialProducts={products} />;
}
