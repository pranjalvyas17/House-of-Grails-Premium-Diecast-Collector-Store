"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Card } from "@/components/ui/card";
import { deleteBrandAction } from "@/lib/admin/actions/brandActions";
import type { AdminBrand } from "@/lib/admin/types";

export function BrandsTable({ initialBrands }: { initialBrands: AdminBrand[] }) {
  const [brands, setBrands] = useState(initialBrands);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminBrand | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () => brands.filter((b) => b.name.toLowerCase().includes(query.toLowerCase())),
    [brands, query]
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const ok = await deleteBrandAction(target.id);
      if (ok) {
        setBrands((prev) => prev.filter((b) => b.id !== target.id));
        toast.success(`${target.name} deleted`);
      }
      setDeleteTarget(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Brands</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {brands.length} brands</p>
        </div>
        <Button render={<Link href="/admin/brands/new" />} nativeButton={false}>
          <Plus size={16} /> Add Brand
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brands…" className="pl-8" />
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Tag size={28} />
          <p className="text-sm">No brands match your search.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((brand) => (
            <Card key={brand.id} className="p-4">
              <div className="flex items-start justify-between">
                <Link href={`/admin/brands/${brand.id}`} className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={brand.logoUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{brand.name}</p>
                    <p className="text-xs text-muted-foreground">{brand.tagline}</p>
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm" nativeButton>
                        <MoreHorizontal size={15} />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={`/admin/brands/${brand.id}`} />}>
                      <Pencil size={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(brand)}>
                      <Trash2 size={14} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}

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
