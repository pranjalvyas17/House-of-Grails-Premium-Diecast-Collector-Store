"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Persists the file server-side (disk under /public/uploads/…) and
   *  resolves to the permanent public URL — never a blob: reference. */
  onUpload: (file: File) => Promise<string>;
  label?: string;
  aspect?: "square" | "video" | "wide";
  className?: string;
}

const aspectClass = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[3/1]",
};

export function SingleImageUpload({
  value,
  onChange,
  onUpload,
  label,
  aspect = "video",
  className,
}: SingleImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg border border-dashed bg-muted",
          aspectClass[aspect]
        )}
      >
        {uploading ? (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label ?? "Uploaded image"} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-background/80 text-destructive opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
          >
            <Upload size={18} />
            <span className="text-xs">{label ?? "Upload image"}</span>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
