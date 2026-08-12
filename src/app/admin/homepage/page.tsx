import type { Metadata } from "next";
import { HomepageService } from "@/lib/admin/services";
import { HomepageForm } from "@/components/admin/homepage/HomepageForm";

export const metadata: Metadata = { title: "Homepage" };

export default async function HomepagePage() {
  const config = await HomepageService.get();
  return <HomepageForm config={config} />;
}
