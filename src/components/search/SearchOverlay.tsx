"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Loader2, Clock, ArrowUpRight } from "lucide-react";
import { searchProductsAction } from "@/lib/site/searchAction";
import type { Product } from "@/lib/data/products";

const RECENT_KEY = "hog:recent-searches";
const MAX_RECENT = 5;
const SUGGESTIONS = ["Porsche", "Skyline", "Mini GT", "Hot Wheels", "RWB", "Lamborghini"];

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Private browsing / storage disabled — recent searches just won't persist.
  }
}

export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search the collection"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate/60 text-silver transition-colors hover:border-grail/50 hover:text-grail"
      >
        <Search size={17} />
      </button>
      <AnimatePresence>{open && <SearchOverlay onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[] | null>(null);
  // Lazy initializer, not an effect: this component only ever mounts
  // client-side (after a user click opens it), so reading localStorage
  // synchronously here is safe and avoids an extra render pass.
  const [recent, setRecent] = useState<string[]>(() => readRecent());
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const runSearch = (q: string) => {
    clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const products = await searchProductsAction(q);
        setResults(products);
      });
    }, 280);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    runSearch(value);
  };

  const commitRecent = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      MAX_RECENT
    );
    setRecent(next);
    writeRecent(next);
  };

  const applySuggestion = (term: string) => {
    setQuery(term);
    runSearch(term);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecent([]);
    writeRecent([]);
  };

  const hasQuery = query.trim().length > 0;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Search the collection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-start justify-center bg-void/85 px-4 pt-[12vh] backdrop-blur-xl md:pt-[16vh]"
    >
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong noise w-full max-w-2xl overflow-hidden rounded-(--radius-glass) border border-smoke/60 shadow-float"
      >
        <div className="flex items-center gap-4 border-b border-smoke/60 px-6 py-5">
          <Search size={20} className="shrink-0 text-grail" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRecent(query);
            }}
            placeholder="Search Porsche, Skyline, Mini GT…"
            aria-label="Search products"
            className="w-full bg-transparent font-display text-xl text-pearl placeholder:text-ash focus:outline-none md:text-2xl"
          />
          {isPending && <Loader2 size={18} className="shrink-0 animate-spin text-ash" />}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ash transition-colors hover:text-pearl"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          {!hasQuery ? (
            <div className="space-y-6">
              {recent.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ash">
                      <Clock size={12} /> Recent Searches
                    </p>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-ash underline-offset-4 transition-colors hover:text-grail hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        onClick={() => applySuggestion(term)}
                        className="rounded-full border border-smoke/60 px-3.5 py-1.5 text-sm text-silver transition-colors hover:border-grail/50 hover:text-pearl"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ash">Try Searching</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((term) => (
                    <button
                      key={term}
                      onClick={() => applySuggestion(term)}
                      className="rounded-full bg-smoke/40 px-3.5 py-1.5 text-sm text-silver transition-colors hover:bg-grail/15 hover:text-grail"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results === null ? null : results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="text-sm text-silver">
                No pieces match &ldquo;{query}&rdquo;.
              </p>
              <p className="text-xs text-ash">Try a brand, model or scale — e.g. &ldquo;Mini GT&rdquo;.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => {
                    commitRecent(query);
                    onClose();
                  }}
                  className="group flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-smoke/40"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-smoke/60">
                    <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-medium text-pearl">{product.name}</p>
                    <p className="text-xs text-ash">
                      {product.brand} · {product.scale}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-grail">${product.price}</p>
                  <ArrowUpRight
                    size={15}
                    className="shrink-0 text-ash transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-grail"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
