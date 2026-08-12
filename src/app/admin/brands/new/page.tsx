import type { Metadata } from "next";
import { BrandForm } from "@/components/admin/brands/BrandForm";

export const metadata: Metadata = { title: "New Brand" };

export default function NewBrandPage() {
  return <BrandForm />;
}
