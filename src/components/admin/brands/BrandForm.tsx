"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/admin/form/FormField";
import { SingleImageUpload } from "@/components/admin/form/SingleImageUpload";
import { brandSchema, type BrandFormValues } from "@/lib/admin/schemas";
import { createBrandAction, updateBrandAction } from "@/lib/admin/actions/brandActions";
import { uploadImageAction } from "@/lib/admin/actions/mediaActions";
import type { AdminBrand } from "@/lib/admin/types";

const defaultValues: BrandFormValues = {
  name: "",
  tagline: "",
  description: "",
  logoUrl: "",
  bannerUrl: "",
};

export function BrandForm({ brand }: { brand?: AdminBrand }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: brand
      ? {
          name: brand.name,
          tagline: brand.tagline,
          description: brand.description,
          logoUrl: brand.logoUrl,
          bannerUrl: brand.bannerUrl,
        }
      : defaultValues,
  });

  const onSubmit = (values: BrandFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        if (brand) {
          await updateBrandAction(brand.id, values);
          toast.success("Brand updated");
        } else {
          await createBrandAction(values);
          toast.success("Brand created");
          router.push("/admin/brands");
          return;
        }
        router.refresh();
      } catch {
        setServerError("Something went wrong — please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" render={<Link href="/admin/brands" />} nativeButton={false}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="font-admin text-xl font-semibold tracking-tight">{brand ? brand.name : "New Brand"}</h1>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {brand ? "Save changes" : "Create brand"}
        </Button>
      </div>

      {serverError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Name" htmlFor="name" required error={errors.name?.message}>
            <Input id="name" placeholder="e.g. Kaido House" {...register("name")} />
          </FormField>
          <FormField label="Tagline" htmlFor="tagline" required error={errors.tagline?.message}>
            <Input id="tagline" placeholder="e.g. The chase culture" {...register("tagline")} />
          </FormField>
          <FormField label="Description" htmlFor="description" required error={errors.description?.message}>
            <Textarea id="description" rows={4} {...register("description")} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>Logo and banner shown on the brand showcase.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="logoUrl"
            render={({ field }) => (
              <SingleImageUpload
                value={field.value}
                onChange={field.onChange}
                onUpload={(file) => uploadImageAction(file, "brands/logo")}
                label="Upload logo"
                aspect="square"
              />
            )}
          />
          <Controller
            control={control}
            name="bannerUrl"
            render={({ field }) => (
              <SingleImageUpload
                value={field.value}
                onChange={field.onChange}
                onUpload={(file) => uploadImageAction(file, "brands/banner")}
                label="Upload banner"
                aspect="square"
              />
            )}
          />
        </CardContent>
      </Card>
    </form>
  );
}
