"use server";

import { SettingsService } from "@/lib/admin/services";
import type { SiteSettings } from "@/lib/admin/types";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(patch: Partial<SiteSettings>) {
  const settings = await SettingsService.update(patch);
  // settings feed the footer, which lives in the shared (site) layout.
  revalidatePath("/", "layout");
  return settings;
}
