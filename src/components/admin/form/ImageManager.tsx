"use client";

import { useRef, useState } from "react";
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
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, X, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ManagedImage {
  id: string;
  url: string;
  alt: string;
}

interface ImageManagerProps {
  images: ManagedImage[];
  onChange: (images: ManagedImage[]) => void;
  /** Persists a file server-side (disk under /public/uploads/…) and
   *  resolves to the permanent public URL — never a blob: reference. */
  onUpload: (file: File) => Promise<string>;
}

function SortableImage({
  image,
  featured,
  onSetFeatured,
  onRemove,
}: {
  image: ManagedImage;
  featured: boolean;
  onSetFeatured: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border bg-muted",
        isDragging && "z-10 opacity-70",
        featured && "ring-2 ring-primary"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-1.5 top-1.5 flex h-6 w-6 cursor-grab items-center justify-center rounded-md bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={13} />
      </button>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-background/80 text-destructive opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        aria-label="Remove image"
      >
        <X size={13} />
      </button>

      <button
        type="button"
        onClick={onSetFeatured}
        className={cn(
          "absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm transition-opacity",
          featured ? "text-primary opacity-100" : "text-foreground opacity-0 group-hover:opacity-100"
        )}
      >
        <Star size={11} className={featured ? "fill-primary" : ""} />
        {featured ? "Featured" : "Set featured"}
      </button>
    </div>
  );
}

/** Upload/reorder/feature/remove product images. Drag to reorder — the
 * first image is always the featured/cover image. */
export function ImageManager({ images, onChange, onUpload }: ImageManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    onChange(arrayMove(images, oldIndex, newIndex));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    setPendingCount((n) => n + fileList.length);
    try {
      const uploaded = await Promise.all(
        fileList.map(async (file) => ({
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          url: await onUpload(file),
          alt: file.name,
        }))
      );
      onChange([...images, ...uploaded]);
    } finally {
      setPendingCount((n) => Math.max(0, n - fileList.length));
    }
  };

  return (
    <div>
      <DndContext id="image-manager" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {images.map((img, i) => (
              <SortableImage
                key={img.id}
                image={img}
                featured={i === 0}
                onSetFeatured={() => {
                  const rest = images.filter((x) => x.id !== img.id);
                  onChange([img, ...rest]);
                }}
                onRemove={() => onChange(images.filter((x) => x.id !== img.id))}
              />
            ))}

            {Array.from({ length: pendingCount }).map((_, i) => (
              <div
                key={`pending-${i}`}
                className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-muted-foreground"
              >
                <Loader2 size={18} className="animate-spin" />
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Upload size={18} />
              <span className="text-xs">Upload</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="mt-2 text-xs text-muted-foreground">
        Drag to reorder. The first image is the featured/cover image — drag
        one to the front, or use &ldquo;Set featured&rdquo;.
      </p>
    </div>
  );
}
