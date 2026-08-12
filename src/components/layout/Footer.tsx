"use client";

import Link from "next/link";
import { Gem } from "lucide-react";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/ui/BrandIcons";
import { useSectionClick } from "@/lib/navigation/useSectionClick";
import type { SiteSettings } from "@/lib/admin/types";

// Labels map to an existing homepage section id where one exists; the rest
// (House column) have no destination anywhere in the site yet and stay as
// inert placeholders rather than link to a page that doesn't exist.
const columns = [
  {
    title: "Collection",
    links: [
      { label: "Latest Drops", hash: "#latest-drops" },
      { label: "Limited Editions", hash: "#limited-editions" },
      { label: "Grail Vault", hash: "#grail-vault" },
      { label: "Collector's Shelf", hash: "#collector-shelf" },
    ],
  },
  {
    title: "Brands",
    links: [
      { label: "Mini GT", hash: "#brands" },
      { label: "Hot Wheels", hash: "#brands" },
      { label: "Inno64", hash: "#brands" },
      { label: "Kaido House", hash: "#brands" },
    ],
  },
  {
    title: "House",
    links: [
      { label: "Our Story", hash: null },
      { label: "Authentication", hash: null },
      { label: "Shipping", hash: null },
      { label: "Contact", hash: null },
    ],
  },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const onSectionClick = useSectionClick();
  const socials = [
    { Icon: InstagramIcon, href: settings.instagramUrl },
    { Icon: XIcon, href: settings.twitterUrl },
    { Icon: YoutubeIcon, href: settings.youtubeUrl },
  ];

  return (
    <footer className="relative border-t border-smoke/60 px-6 pb-10 pt-20 md:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Gem size={20} className="text-grail" />
              <span className="font-display text-base font-semibold tracking-[0.15em] text-pearl">
                {settings.siteName.toUpperCase()}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-silver">
              A digital automotive museum for the world&apos;s rarest diecast. {settings.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href || "#"}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/60 text-silver transition-colors hover:border-grail/50 hover:text-grail"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-[0.25em] text-ash">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.hash ? `/${link.hash}` : "#"}
                      onClick={link.hash ? onSectionClick(link.hash) : undefined}
                      className="text-sm text-silver transition-colors hover:text-pearl"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline mt-16 h-px" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-ash md:flex-row">
          <p>© 2026 {settings.siteName}. {settings.shippingNote}</p>
          <p className="text-grail">{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
