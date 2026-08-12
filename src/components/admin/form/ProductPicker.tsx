"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Search, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminProduct } from "@/lib/admin/types";

interface ProductPickerProps {
  allProducts: AdminProduct[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

function SortableRow({ product, onRemove }: { product: AdminProduct; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-lg border bg-card px-3 py-2 ${isDragging ? "z-10 opacity-70" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={15} />
      </button>
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]?.url} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
        aria-label={`Remove ${product.name}`}
      >
        <X size={15} />
      </button>
    </div>
  );
}

/** Assign products to an event/collection and drag to set display order. */
export function ProductPicker({ allProducts, selectedIds, onChange }: ProductPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const byId = useMemo(() => new Map(allProducts.map((p) => [p.id, p])), [allProducts]);
  const selected = selectedIds.map((id) => byId.get(id)).filter((p): p is AdminProduct => !!p);

  const available = allProducts.filter(
    (p) => !selectedIds.includes(p.id) && p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = selectedIds.indexOf(String(active.id));
    const newIndex = selectedIds.indexOf(String(over.id));
    onChange(arrayMove(selectedIds, oldIndex, newIndex));
  };

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="outline" size="sm" nativeButton />}>
          <Plus size={14} /> Add product
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <div className="border-b p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-8 pl-7 text-sm"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {available.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground">No matching products.</p>
            )}
            {available.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange([...selectedIds, p.id]);
                  setQuery("");
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <div className="h-7 w-7 shrink-0 overflow-hidden rounded bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]?.url} alt="" className="h-full w-full object-cover" />
                </div>
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {selected.length === 0 ? (
        <p className="rounded-lg border border-dashed py-6 text-center text-xs text-muted-foreground">
          No products assigned yet.
        </p>
      ) : (
        <DndContext id="product-picker" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={selectedIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {selected.map((p) => (
                <SortableRow key={p.id} product={p} onRemove={() => onChange(selectedIds.filter((id) => id !== p.id))} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
