import Link from "next/link";

interface AnnouncementBarProps {
  enabled: boolean;
  text: string;
  href?: string;
}

/** Thin gold strip above the navbar — content is CMS-driven from the admin's Homepage screen. */
export function AnnouncementBar({ enabled, text, href }: AnnouncementBarProps) {
  if (!enabled || !text) return null;

  const content = (
    <p className="mx-auto max-w-7xl px-6 text-center text-xs uppercase tracking-[0.2em] text-obsidian">
      {text}
    </p>
  );

  return (
    <div className="relative z-50 bg-grail py-2">
      {href ? (
        <Link href={href} className="block hover:opacity-80">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
