import type { Metadata } from "next";
import { BrandService } from "@/lib/admin/services";
import { BrandsTable } from "@/components/admin/brands/BrandsTable";

export const metadata: Metadata = { title: "Brands" };

export default async function AdminBrandsPage() {
  const brands = await BrandService.getAll();
  return <BrandsTable initialBrands={brands} />;
}
