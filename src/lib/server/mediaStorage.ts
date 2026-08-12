import "server-only";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Local-disk media persistence for development — files land under
 * /public/uploads/<folder>/ and are served by Next.js as ordinary static
 * assets, so the returned URL (e.g. "/uploads/products/911-gt3-abc123.jpg")
 * works everywhere a normal image path does, with no blob: URLs anywhere in
 * persisted data.
 *
 * TODO(backend): swap this module's internals for a real object-storage
 * upload (S3 / Cloudflare R2 / Cloudinary / etc.) once one is chosen —
 * `saveUploadedFile` and `deleteUploadedFile` are the only two functions
 * that need new bodies; every caller (MediaService, the other services'
 * image fields) only ever sees the returned URL string.
 */

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

function slugifyFileBase(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "file";
}

export interface SavedFile {
  url: string;
  name: string;
  size: number;
  type: "image" | "video";
}

export async function saveUploadedFile(file: File, folder: string): Promise<SavedFile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || (file.type.split("/")[1] ? `.${file.type.split("/")[1]}` : "");
  const base = slugifyFileBase(file.name);
  const unique = crypto.randomBytes(4).toString("hex");
  const filename = `${base}-${unique}${ext}`;

  const safeFolder = folder.replace(/[^a-z0-9-]+/gi, "-");
  const dir = path.join(UPLOADS_ROOT, safeFolder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return {
    url: `/uploads/${safeFolder}/${filename}`,
    name: file.name,
    size: file.size,
    type: file.type.startsWith("video") ? "video" : "image",
  };
}

/** Best-effort delete — media rows can outlive their file (e.g. seeded
 *  picsum.photos URLs aren't local files) so failures here are non-fatal. */
export async function deleteUploadedFile(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  await unlink(filePath).catch(() => undefined);
}
