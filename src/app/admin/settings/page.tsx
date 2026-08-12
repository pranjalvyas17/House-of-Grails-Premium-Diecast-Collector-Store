import type { Metadata } from "next";
import { SettingsService } from "@/lib/admin/services";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await SettingsService.get();
  return <SettingsForm settings={settings} />;
}
