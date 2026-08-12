"use server";

import { CollectionService } from "@/lib/admin/services";
import type { CollectionKey } from "@/lib/admin/types";
import { revalidateCollectionPaths } from "./revalidate";

export async function setCollectionProductsAction(key: CollectionKey, productIds: string[]) {
  const collection = await CollectionService.setProducts(key, productIds);
  revalidateCollectionPaths();
  return collection;
}
