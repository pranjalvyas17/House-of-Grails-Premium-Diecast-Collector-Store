"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Gem, X, ZoomIn } from "lucide-react";
import type { AdminImage } from "@/lib/admin/types";

/**
 * The product page's primary visual — the admin's own uploaded photos for
 * THIS product, not the shared hero Porsche GLB. Every product page used to
 * render the same 3D configurator regardless of what it was actually
 * selling; this replaces it with a real, per-product photo gallery sourced
 * straight from AdminProduct.images.
 */
export function ProductPhotoGallery({ images, name }: { images: AdminImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-(--radius-glass) border border-dashed border-smoke/60 bg-obsidian text-ash">
        <Gem size={28} className="text-smoke" />
        <p className="text-sm">No photos yet</p>
      </div>
    );
  }

  const current = images[active];

  return (
    <div>
      <div className="group relative aspect-4/3 w-full overflow-hidden rounded-(--radius-glass) border border-smoke/60 bg-obsidian">
        <AnimatePresence mode="wait">
          <motion.button
            key={current.id}
            type="button"
            onClick={() => setLightbox(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full cursor-zoom-in"
            aria-label={`View full size — ${current.alt || name}`}
          >
            <Image
              src={current.url}
              alt={current.alt || name}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
              className="object-cover"
            />
          </motion.button>
        </AnimatePresence>

        <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-void/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ash backdrop-blur-md">
          <ZoomIn size={12} />
          {images.length > 1 ? `${active + 1} / ${images.length}` : "Zoom"}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous photo"
              className="glass absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-pearl opacity-0 transition-opacity hover:text-grail group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % images.length)}
              aria-label="Next photo"
              className="glass absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-pearl opacity-0 transition-opacity hover:text-grail group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-xl border transition-colors ${
                i === active ? "border-grail" : "border-smoke/60 hover:border-grail/50"
              }`}
            >
              <Image src={img.url} alt={img.alt || `${name} — angle ${i + 1}`} fill sizes="10vw" className="object-cover" />
              {i === active && <div className="pointer-events-none absolute inset-0 bg-grail/10" />}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-80 flex items-center justify-center bg-void/90 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-4/3 w-full max-w-3xl overflow-hidden rounded-(--radius-glass) border border-smoke/60"
            >
              <Image src={current.url} alt={current.alt || `${name} — full view`} fill sizes="80vw" className="object-cover" />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
                    aria-label="Previous photo"
                    className="glass absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-pearl hover:text-grail"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActive((i) => (i + 1) % images.length)}
                    aria-label="Next photo"
                    className="glass absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-pearl hover:text-grail"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <button
                onClick={() => setLightbox(false)}
                aria-label="Close"
                className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-pearl"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
