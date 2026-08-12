import { FloatingNavbar } from "@/components/nav/FloatingNavbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { HomepageService, SettingsService } from "@/lib/admin/services";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [homepage, settings] = await Promise.all([HomepageService.get(), SettingsService.get()]);

  return (
    <SmoothScrollProvider>
      <AnnouncementBar
        enabled={homepage.announcementEnabled}
        text={homepage.announcementText}
        href={homepage.announcementHref}
      />
      <FloatingNavbar />
      <PageTransition>{children}</PageTransition>
      <Footer settings={settings} />
    </SmoothScrollProvider>
  );
}
