import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandForm } from "@/components/admin/brands/BrandForm";
import { BrandService } from "@/lib/admin/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const brand = await BrandService.getById(id);
  return { title: brand?.name ?? "Brand" };
}

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await BrandService.getById(id);
  if (!brand) notFound();

  return <BrandForm brand={brand} />;
}
