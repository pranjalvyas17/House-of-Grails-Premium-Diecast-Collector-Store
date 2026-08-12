"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Search,
  Upload,
  Grid3x3,
  List,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  ImageOff,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  uploadMediaAction,
  renameMediaAction,
  replaceMediaAction,
  deleteMediaAction,
} from "@/lib/admin/actions/mediaActions";
import type { MediaAsset } from "@/lib/admin/types";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({
  initialAssets,
  initialFolders,
}: {
  initialAssets: MediaAsset[];
  initialFolders: string[];
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("all");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceTargetId = useRef<string | null>(null);

  const folders = ["all", ...initialFolders];

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (folder !== "all" && a.folder !== folder) return false;
      if (query.trim() && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [assets, folder, query]);

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    startTransition(async () => {
      for (const file of Array.from(files)) {
        const asset = await uploadMediaAction(file);
        setAssets((prev) => [asset, ...prev]);
      }
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
    });
  };

  const handleRename = () => {
    if (!selected) return;
    startTransition(async () => {
      const updated = await renameMediaAction(selected.id, renameValue);
      if (updated) {
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setSelected(updated);
        toast.success("Renamed");
      }
    });
  };

  const handleReplace = (id: string, file: File) => {
    startTransition(async () => {
      const updated = await replaceMediaAction(id, file);
      if (updated) {
        setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        if (selected?.id === id) setSelected(updated);
        toast.success("Replaced");
      }
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const ok = await deleteMediaAction(target.id);
      if (ok) {
        setAssets((prev) => prev.filter((a) => a.id !== target.id));
        if (selected?.id === target.id) setSelected(null);
        toast.success(`${target.name} deleted`);
      }
      setDeleteTarget(null);
    });
  };

  return (
    <div
      className="space-y-6"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        handleUpload(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {assets.length} files</p>
        </div>
        <Button onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Upload
        </Button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" className="pl-8" />
        </div>
        <Select value={folder} onValueChange={(v) => setFolder(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {folders.map((f) => (
              <SelectItem key={f} value={f} className="capitalize">{f === "all" ? "All folders" : f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setView("grid")} aria-label="Grid view">
            <Grid3x3 size={14} />
          </Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setView("list")} aria-label="List view">
            <List size={14} />
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-20 text-muted-foreground">
          <ImageOff size={28} />
          <p className="text-sm">No files match your search.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((asset) => (
            <button
              key={asset.id}
              onClick={() => {
                setSelected(asset);
                setRenameValue(asset.name);
              }}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted text-left"
            >
              {asset.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Film size={24} />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-x-0 bottom-0 truncate bg-background/80 px-2 py-1 text-[11px] backdrop-blur-sm">
                {asset.name}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Name</th>
                <th className="px-4 py-2.5 text-left font-medium">Folder</th>
                <th className="px-4 py-2.5 text-left font-medium">Size</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} className="border-t">
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => {
                        setSelected(asset);
                        setRenameValue(asset.name);
                      }}
                      className="flex items-center gap-2.5"
                    >
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-muted">
                        {asset.type === "image" && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={asset.url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      {asset.name}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 capitalize text-muted-foreground">{asset.folder}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{formatBytes(asset.size)}</td>
                  <td className="px-4 py-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" nativeButton>
                            <MoreHorizontal size={15} />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(asset);
                            setRenameValue(asset.name);
                          }}
                        >
                          <Pencil size={14} /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(asset)}>
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isDraggingOver && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl border-2 border-dashed border-primary p-12 text-center">
            <Upload className="mx-auto mb-3 text-primary" size={32} />
            <p className="font-medium">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* Detail panel */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>File details</SheetTitle>
            <SheetDescription>Rename, replace or remove this asset.</SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 px-4 pb-4">
              <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
                {selected.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.url} alt={selected.name} className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Film size={32} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Name</p>
                <div className="flex gap-2">
                  <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                  <Button variant="outline" onClick={handleRename}>Save</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant="secondary" className="mt-1 capitalize">{selected.type}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="mt-1">{formatBytes(selected.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Folder</p>
                  <p className="mt-1 capitalize">{selected.folder}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                  <p className="mt-1">{new Date(selected.createdAt).toLocaleDateString("en-US")}</p>
                </div>
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    replaceTargetId.current = selected.id;
                    replaceRef.current?.click();
                  }}
                >
                  <RefreshCw size={14} /> Replace
                </Button>
                <Button variant="destructive" onClick={() => setDeleteTarget(selected)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <input
        ref={replaceRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && replaceTargetId.current) handleReplace(replaceTargetId.current, file);
          e.target.value = "";
        }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
