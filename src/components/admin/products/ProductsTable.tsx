"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Star,
  PackageX,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  duplicateProductAction,
  archiveProductAction,
  unarchiveProductAction,
  deleteProductAction,
} from "@/lib/admin/actions/productActions";
import type { AdminProduct, ProductStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const statusVariant: Record<ProductStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  archived: "outline",
};

export function ProductsTable({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [brand, setBrand] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [, startTransition] = useTransition();

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (query.trim() && !`${p.name} ${p.brand} ${p.vehicle}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [products, status, brand, query]);

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      const copy = await duplicateProductAction(id);
      if (copy) {
        setProducts((prev) => [copy, ...prev]);
        toast.success("Product duplicated as draft");
      }
    });
  };

  const handleArchiveToggle = (product: AdminProduct) => {
    startTransition(async () => {
      const updated = product.status === "archived"
        ? await unarchiveProductAction(product.id)
        : await archiveProductAction(product.id);
      if (updated) {
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success(product.status === "archived" ? "Product restored" : "Product archived");
      }
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const ok = await deleteProductAction(target.id);
      if (ok) {
        setProducts((prev) => prev.filter((p) => p.id !== target.id));
        toast.success(`${target.name} deleted`);
      }
      setDeleteTarget(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {products.length} products</p>
        </div>
        <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="pl-8"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus((v ?? "all") as typeof status)}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={brand} onValueChange={(v) => setBrand(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Brand" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rarity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageX size={28} />
                    <p className="text-sm">No products match your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]?.url} alt="" className="h-full w-full object-cover" />
                      {p.featured && (
                        <Star size={10} className="absolute right-0.5 top-0.5 fill-primary text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand} · {p.scale}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[p.status]} className="capitalize">{p.status}</Badge>
                </TableCell>
                <TableCell className="capitalize text-sm text-muted-foreground">{p.rarity}</TableCell>
                <TableCell className="text-right text-sm font-medium">${p.price.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span className={cn("text-sm", p.stock <= 5 && "font-medium text-destructive")}>{p.stock}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" nativeButton>
                          <MoreHorizontal size={15} />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/products/${p.id}`} />}>
                        <Pencil size={14} /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(p.id)}>
                        <Copy size={14} /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchiveToggle(p)}>
                        {p.status === "archived" ? (
                          <>
                            <ArchiveRestore size={14} /> Restore
                          </>
                        ) : (
                          <>
                            <Archive size={14} /> Archive
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(p)}>
                        <Trash2 size={14} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. The product will be permanently removed from the catalog.
            </AlertDialogDescription>
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
