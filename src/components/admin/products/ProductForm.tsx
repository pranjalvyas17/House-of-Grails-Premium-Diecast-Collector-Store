"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/admin/form/FormField";
import { TagsInput } from "@/components/admin/form/TagsInput";
import { ImageManager } from "@/components/admin/form/ImageManager";
import { productSchema, type ProductFormInput, type ProductFormValues } from "@/lib/admin/schemas";
import { createProductAction, updateProductAction } from "@/lib/admin/actions/productActions";
import { uploadImageAction } from "@/lib/admin/actions/mediaActions";
import type { AdminProduct } from "@/lib/admin/types";
import type { AdminEvent } from "@/lib/admin/types";

interface ProductFormProps {
  product?: AdminProduct;
  brands: string[];
  events: AdminEvent[];
}

const defaultValues: ProductFormInput = {
  name: "",
  description: "",
  brand: "",
  manufacturer: "",
  vehicle: "",
  scale: "1:64",
  price: 0,
  stock: 0,
  totalRun: null,
  rarity: "standard",
  status: "draft",
  featured: false,
  tags: [],
  images: [],
  eventSlugs: [],
  collectorScore: 80,
  edition: "",
  seoTitle: "",
  seoDescription: "",
};

export function ProductForm({ product, brands, events }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          brand: product.brand,
          manufacturer: product.manufacturer,
          vehicle: product.vehicle,
          scale: product.scale,
          price: product.price,
          stock: product.stock,
          totalRun: product.totalRun,
          rarity: product.rarity,
          status: product.status,
          featured: product.featured,
          tags: product.tags,
          images: product.images,
          eventSlugs: product.eventSlugs,
          collectorScore: product.collectorScore,
          edition: product.edition,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
        }
      : defaultValues,
  });

  const onSubmit = (values: ProductFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        if (product) {
          await updateProductAction(product.id, values);
          toast.success("Product updated");
        } else {
          const created = await createProductAction(values);
          toast.success("Product created");
          router.push(`/admin/products/${created.id}`);
          return;
        }
        router.refresh();
      } catch {
        setServerError("Something went wrong — please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" render={<Link href="/admin/products" />} nativeButton={false}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="font-admin text-xl font-semibold tracking-tight">
              {product ? product.name : "New Product"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {product
                ? `Last updated ${new Date(product.updatedAt).toLocaleDateString("en-US")}`
                : "Add a new piece to the catalog"}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>

      {serverError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>The core information collectors will see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Name" htmlFor="name" required error={errors.name?.message}>
                <Input id="name" placeholder="e.g. Porsche 911 (992) GT3 RS" {...register("name")} />
              </FormField>

              <FormField label="Description" htmlFor="description" required error={errors.description?.message}>
                <Textarea id="description" rows={4} {...register("description")} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Vehicle" htmlFor="vehicle" required error={errors.vehicle?.message}>
                  <Input id="vehicle" placeholder="e.g. 911 GT3 RS" {...register("vehicle")} />
                </FormField>
                <FormField label="Scale" htmlFor="scale" required error={errors.scale?.message}>
                  <Input id="scale" placeholder="e.g. 1:64" {...register("scale")} />
                </FormField>
              </div>

              <FormField label="Edition" htmlFor="edition" hint="Optional — e.g. &lsquo;V2 Nightfall&rsquo;">
                <Input id="edition" {...register("edition")} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Drag to reorder — the first image is the featured image.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <ImageManager
                    images={field.value}
                    onChange={field.onChange}
                    onUpload={(file) => uploadImageAction(file, "products")}
                  />
                )}
              />
              {errors.images?.message && <p className="mt-2 text-xs text-destructive">{errors.images.message}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing &amp; inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <FormField label="Price (USD)" htmlFor="price" required error={errors.price?.message}>
                <Input id="price" type="number" step="0.01" {...register("price")} />
              </FormField>
              <FormField label="Stock" htmlFor="stock" required error={errors.stock?.message}>
                <Input id="stock" type="number" {...register("stock")} />
              </FormField>
              <FormField label="Total run" htmlFor="totalRun" hint="Leave blank if unlimited">
                <Input
                  id="totalRun"
                  type="number"
                  {...register("totalRun", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search engine listing</CardTitle>
              <CardDescription>How this product appears in search results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="SEO title" htmlFor="seoTitle">
                <Input id="seoTitle" {...register("seoTitle")} />
              </FormField>
              <FormField label="SEO description" htmlFor="seoDescription">
                <Textarea id="seoDescription" rows={3} {...register("seoDescription")} />
              </FormField>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Status" htmlFor="status">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => field.onChange(v ?? field.value)}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Featured product</p>
                  <p className="text-xs text-muted-foreground">Show in homepage spotlights</p>
                </div>
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Brand" htmlFor="brand" required error={errors.brand?.message}>
                <Input id="brand" list="brand-options" placeholder="e.g. Kaido House" {...register("brand")} />
                <datalist id="brand-options">
                  {brands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </FormField>

              <FormField label="Manufacturer" htmlFor="manufacturer" required error={errors.manufacturer?.message}>
                <Input id="manufacturer" {...register("manufacturer")} />
              </FormField>

              <FormField label="Rarity" htmlFor="rarity">
                <Controller
                  control={control}
                  name="rarity"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => field.onChange(v ?? field.value)}>
                      <SelectTrigger id="rarity" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="limited">Limited Edition</SelectItem>
                        <SelectItem value="chase">Chase Piece</SelectItem>
                        <SelectItem value="grail">Grail</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Collector score" htmlFor="collectorScore" hint="0–100">
                <Input id="collectorScore" type="number" min={0} max={100} {...register("collectorScore")} />
              </FormField>

              <FormField label="Tags" htmlFor="tags">
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => <TagsInput value={field.value} onChange={field.onChange} />}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Where this piece debuted or was shown.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="eventSlugs"
                render={({ field }) => (
                  <div className="max-h-56 space-y-2 overflow-y-auto">
                    {events.map((event) => {
                      const checked = field.value.includes(event.slug);
                      return (
                        <label
                          key={event.slug}
                          className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => {
                              field.onChange(
                                v ? [...field.value, event.slug] : field.value.filter((s) => s !== event.slug)
                              );
                            }}
                          />
                          {event.name} <span className="text-muted-foreground">· {event.year}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
