"use server";

import { MediaService } from "@/lib/admin/services";
import { saveUploadedFile } from "@/lib/server/mediaStorage";
import { revalidateAdminMedia } from "./revalidate";

/**
 * Generic image/video upload used by every admin form (product gallery,
 * event banner/cover, brand logo/banner, homepage hero, testimonial
 * avatar). Saves to /public/uploads/<folder>/ and returns the resulting
 * public URL — never a blob: reference. `folder` just namespaces where the
 * file lands on disk (e.g. "products", "events/banner", "brands/banner").
 */
export async function uploadImageAction(file: File, folder: string): Promise<string> {
  const saved = await saveUploadedFile(file, folder);
  return saved.url;
}

export async function uploadMediaAction(file: File, folder?: string) {
  const asset = await MediaService.upload(file, folder);
  revalidateAdminMedia();
  return asset;
}

export async function renameMediaAction(id: string, name: string) {
  const asset = await MediaService.rename(id, name);
  revalidateAdminMedia();
  return asset;
}

export async function replaceMediaAction(id: string, file: File) {
  const asset = await MediaService.replace(id, file);
  revalidateAdminMedia();
  return asset;
}

export async function deleteMediaAction(id: string) {
  const ok = await MediaService.delete(id);
  revalidateAdminMedia();
  return ok;
}
