import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Tag,
  Layers,
  Home,
  Image as ImageIcon,
  MessageSquareQuote,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNav: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard, shortcut: "D" }],
  },
  {
    label: "Catalog",
    items: [
      { title: "Products", href: "/admin/products", icon: Package, shortcut: "P" },
      { title: "Events", href: "/admin/events", icon: CalendarDays, shortcut: "E" },
      { title: "Brands", href: "/admin/brands", icon: Tag, shortcut: "B" },
      { title: "Collections", href: "/admin/collections", icon: Layers, shortcut: "C" },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Homepage", href: "/admin/homepage", icon: Home, shortcut: "H" },
      { title: "Media Library", href: "/admin/media", icon: ImageIcon, shortcut: "M" },
      { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote, shortcut: "T" },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", href: "/admin/settings", icon: Settings, shortcut: "S" }],
  },
];

export const allNavItems: AdminNavItem[] = adminNav.flatMap((g) => g.items);
