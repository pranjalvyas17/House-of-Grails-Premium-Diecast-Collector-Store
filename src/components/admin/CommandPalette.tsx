"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, CalendarDays, Tag, Layers } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { adminNav } from "@/lib/admin/nav";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command Palette" description="Jump to any screen or action">
      <CommandInput placeholder="Search screens, products, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/admin/products/new")}>
            <Package /> New product
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/events/new")}>
            <CalendarDays /> New event
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/brands/new")}>
            <Tag /> New brand
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/collections")}>
            <Layers /> Manage collections
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {adminNav.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.items.map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
