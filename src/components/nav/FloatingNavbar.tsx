"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Menu, X, Gem } from "lucide-react";
import { useSectionClick } from "@/lib/navigation/useSectionClick";
import { SearchTrigger } from "@/components/search/SearchOverlay";

const links = [
  { label: "Drops", href: "#latest-drops" },
  { label: "Limited", href: "#limited-editions" },
  { label: "Vault", href: "#grail-vault" },
  { label: "Shelf", href: "#collector-shelf" },
  { label: "Brands", href: "#brands" },
  { label: "Community", href: "#community" },
];

export function FloatingNavbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const onSectionClick = useSectionClick();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    setHidden(y > lastY.current && y > 200);
    lastY.current = y;
  });

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5"
      >
        <nav
          className={`flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-float" : "bg-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Gem size={18} className="text-grail" />
            <span className="whitespace-nowrap font-display text-xs font-semibold tracking-widest text-pearl sm:text-sm sm:tracking-[0.15em]">
              HOUSE OF GRAILS
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={`/${link.href}`}
                onClick={onSectionClick(link.href)}
                className="relative rounded-full px-4 py-2 text-sm text-silver transition-colors hover:text-pearl"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SearchTrigger />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-pearl lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-strong fixed inset-x-4 top-20 z-40 rounded-3xl p-6 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={`/${link.href}`}
                  onClick={(e) => {
                    onSectionClick(link.href)(e);
                    setMenuOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-lg text-silver transition-colors hover:bg-smoke/50 hover:text-pearl"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
