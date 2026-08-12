import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { CommandPalette } from "@/components/admin/CommandPalette";

export const metadata: Metadata = {
  title: {
    default: "Admin — The House of Grails",
    template: "%s · Admin",
  },
  description: "Store management for The House of Grails.",
  robots: { index: false, follow: false },
};

// The whole /admin section reads mutable, in-memory "database" state on
// every page — it must never be statically prerendered at build time (which
// would freeze that data forever) or served from a stale cache. Applies to
// every nested route automatically. TODO(backend): once a real database is
// wired up, revisit whether specific pages can safely opt back into
// caching/ISR.
export const dynamic = "force-dynamic";

/**
 * Completely separate shell from the public museum site — its own
 * typography (Geist via --font-admin), its own neutral dark palette
 * (shadcn tokens), no navbar/footer/Lenis/GSAP from (site). Intentionally
 * a different "application" living at /admin inside the same Next.js app.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-admin bg-background text-foreground">
      <TooltipProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminTopbar />
            <main className="flex-1 space-y-6 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <CommandPalette />
        <Toaster />
      </TooltipProvider>
    </div>
  );
}
