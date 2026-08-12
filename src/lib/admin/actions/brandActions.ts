"use server";

import { BrandService, type BrandInput } from "@/lib/admin/services";
import { revalidateBrandPaths } from "./revalidate";

export async function createBrandAction(input: BrandInput) {
  const brand = await BrandService.create(input);
  revalidateBrandPaths();
  return brand;
}

export async function updateBrandAction(id: string, patch: Partial<BrandInput>) {
  const brand = await BrandService.update(id, patch);
  revalidateBrandPaths();
  return brand;
}

export async function deleteBrandAction(id: string) {
  const ok = await BrandService.delete(id);
  revalidateBrandPaths();
  return ok;
}
