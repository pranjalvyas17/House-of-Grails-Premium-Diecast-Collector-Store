"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { allNavItems } from "@/lib/admin/nav";

function titleForSegment(segment: string) {
  if (/^[a-z0-9-]+$/.test(segment) && segment.length > 12) return "Detail";
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function AdminTopbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // ["admin", "products", "new"]
  const crumbs = segments.slice(1); // drop "admin"

  const rootLabel = allNavItems.find((i) => i.href === "/admin")?.title ?? "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">{rootLabel}</BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.map((seg, i) => {
            const href = "/admin/" + crumbs.slice(0, i + 1).join("/");
            const isLast = i === crumbs.length - 1;
            return (
              <span key={href} className="flex items-center gap-2.5">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{titleForSegment(seg)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{titleForSegment(seg)}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 text-muted-foreground sm:flex"
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        >
          <Search size={14} />
          Search…
          <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={16} />
        </Button>
      </div>
    </header>
  );
}
