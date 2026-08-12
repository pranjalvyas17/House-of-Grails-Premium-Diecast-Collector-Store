"use server";

import { HomepageService } from "@/lib/admin/services";
import type { HomepageConfig } from "@/lib/admin/types";
import { revalidateHomepagePaths } from "./revalidate";

export async function updateHomepageAction(patch: Partial<HomepageConfig>) {
  const config = await HomepageService.update(patch);
  revalidateHomepagePaths();
  return config;
}
