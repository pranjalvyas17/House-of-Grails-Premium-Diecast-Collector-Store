"use client";

import { useMemo, useState } from "react";
import { EventFilters, type EventFilterState } from "./EventFilters";
import { EventProductsGrid } from "./EventProductsGrid";
import type { Product } from "@/lib/data/products";

export function EventDetailContent({ products }: { products: Product[] }) {
  const [state, setState] = useState<EventFilterState>({
    brand: "all",
    scale: "all",
    availability: "all",
    sort: "newest",
  });

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );
  const scales = useMemo(
    () => Array.from(new Set(products.map((p) => p.scale))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products;

    if (state.brand !== "all") list = list.filter((p) => p.brand === state.brand);
    if (state.scale !== "all") list = list.filter((p) => p.scale === state.scale);
    if (state.availability === "in-stock") list = list.filter((p) => p.stock > 5);
    if (state.availability === "low-stock") list = list.filter((p) => p.stock <= 5);

    const sorted = [...list];
    switch (state.sort) {
      case "newest":
        sorted.sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));
        break;
      case "popular":
        sorted.sort((a, b) => b.collectorScore - a.collectorScore);
        break;
      case "price":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "alphabetical":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  }, [products, state]);

  return (
    <>
      <EventFilters
        brands={brands}
        scales={scales}
        state={state}
        onChange={setState}
        resultCount={filtered.length}
      />
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <EventProductsGrid products={filtered} />
      </div>
    </>
  );
}
