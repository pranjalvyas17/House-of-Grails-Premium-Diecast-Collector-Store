"use server";

import { ProductService, type ProductInput } from "@/lib/admin/services";
import { revalidateProductPaths } from "./revalidate";

export async function createProductAction(input: ProductInput) {
  const product = await ProductService.create(input);
  revalidateProductPaths(product.id);
  return product;
}

export async function updateProductAction(id: string, patch: Partial<ProductInput>) {
  const product = await ProductService.update(id, patch);
  revalidateProductPaths(id);
  return product;
}

export async function deleteProductAction(id: string) {
  const ok = await ProductService.delete(id);
  revalidateProductPaths(id);
  return ok;
}

export async function archiveProductAction(id: string) {
  const product = await ProductService.archive(id);
  revalidateProductPaths(id);
  return product;
}

export async function unarchiveProductAction(id: string) {
  const product = await ProductService.unarchive(id);
  revalidateProductPaths(id);
  return product;
}

export async function duplicateProductAction(id: string) {
  const product = await ProductService.duplicate(id);
  if (product) revalidateProductPaths(product.id);
  return product;
}
