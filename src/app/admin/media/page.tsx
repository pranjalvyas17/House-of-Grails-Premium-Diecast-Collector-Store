import type { Metadata } from "next";
import { MediaService } from "@/lib/admin/services";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";

export const metadata: Metadata = { title: "Media Library" };

export default async function MediaPage() {
  const [assets, folders] = await Promise.all([MediaService.getAll(), MediaService.folders()]);
  return <MediaLibrary initialAssets={assets} initialFolders={folders} />;
}
