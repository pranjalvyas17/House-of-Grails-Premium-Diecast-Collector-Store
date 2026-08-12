"use client";

import { SlidersHorizontal } from "lucide-react";

export type SortKey = "newest" | "popular" | "price" | "alphabetical";

export interface EventFilterState {
  brand: string;
  scale: string;
  availability: "all" | "in-stock" | "low-stock";
  sort: SortKey;
}

interface EventFiltersProps {
  brands: string[];
  scales: string[];
  state: EventFilterState;
  onChange: (next: EventFilterState) => void;
  resultCount: number;
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price", label: "Price" },
  { value: "alphabetical", label: "Alphabetical" },
];

const selectClass =
  "appearance-none rounded-full border border-slate/60 bg-transparent px-4 py-2 text-sm text-silver outline-none transition-colors hover:border-grail/40 focus:border-grail/60";

export function EventFilters({
  brands,
  scales,
  state,
  onChange,
  resultCount,
}: EventFiltersProps) {
  const set = <K extends keyof EventFilterState>(key: K, value: EventFilterState[K]) =>
    onChange({ ...state, [key]: value });

  return (
    <div className="glass-strong sticky top-20 z-30 mx-auto mb-10 flex max-w-7xl flex-wrap items-center gap-3 rounded-2xl px-5 py-4 md:mx-14">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ash">
        <SlidersHorizontal size={13} className="text-grail" />
        {resultCount} {resultCount === 1 ? "piece" : "pieces"}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <select
          value={state.brand}
          onChange={(e) => set("brand", e.target.value)}
          className={selectClass}
          aria-label="Filter by brand"
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={state.scale}
          onChange={(e) => set("scale", e.target.value)}
          className={selectClass}
          aria-label="Filter by scale"
        >
          <option value="all">All Scales</option>
          {scales.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={state.availability}
          onChange={(e) => set("availability", e.target.value as EventFilterState["availability"])}
          className={selectClass}
          aria-label="Filter by availability"
        >
          <option value="all">All Availability</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock (≤5)</option>
        </select>

        <div className="h-6 w-px bg-slate/60" />

        <select
          value={state.sort}
          onChange={(e) => set("sort", e.target.value as SortKey)}
          className={selectClass}
          aria-label="Sort results"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
