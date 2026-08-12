import type { Metadata } from "next";
import { CollectionService, ProductService } from "@/lib/admin/services";
import { CollectionsManager } from "@/components/admin/collections/CollectionsManager";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([CollectionService.getAll(), ProductService.getAll()]);
  return <CollectionsManager initialCollections={collections} allProducts={products} />;
}
