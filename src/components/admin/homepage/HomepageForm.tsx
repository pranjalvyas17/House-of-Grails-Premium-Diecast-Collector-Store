"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Save, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/admin/form/FormField";
import { SingleImageUpload } from "@/components/admin/form/SingleImageUpload";
import { SectionOrderList } from "@/components/admin/homepage/SectionOrderList";
import { homepageSchema, type HomepageFormValues } from "@/lib/admin/schemas";
import { updateHomepageAction } from "@/lib/admin/actions/homepageActions";
import { uploadImageAction } from "@/lib/admin/actions/mediaActions";
import type { HomepageConfig } from "@/lib/admin/types";

export function HomepageForm({ config }: { config: HomepageConfig }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HomepageFormValues>({
    resolver: zodResolver(homepageSchema),
    defaultValues: config,
  });

  const { fields: buttonFields, append: appendButton, remove: removeButton } = useFieldArray({
    control,
    name: "heroButtons",
  });

  const onSubmit = (values: HomepageFormValues) => {
    startTransition(async () => {
      await updateHomepageAction(values);
      toast.success("Homepage updated");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Homepage</h1>
          <p className="text-sm text-muted-foreground">Hero copy, announcement bar and section layout.</p>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hero</CardTitle>
            <CardDescription>The first thing visitors see.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Hero title" htmlFor="heroTitle" required error={errors.heroTitle?.message}>
              <Input id="heroTitle" {...register("heroTitle")} />
            </FormField>
            <FormField label="Hero subtitle" htmlFor="heroSubtitle" required error={errors.heroSubtitle?.message}>
              <Input id="heroSubtitle" {...register("heroSubtitle")} />
            </FormField>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Buttons</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendButton({ id: `btn_${Date.now()}`, label: "", href: "" })}
                >
                  <Plus size={13} /> Add button
                </Button>
              </div>
              <div className="space-y-2">
                {buttonFields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input placeholder="Label" {...register(`heroButtons.${i}.label`)} />
                    <Input placeholder="/#section" {...register(`heroButtons.${i}.href`)} />
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeButton(i)}>
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Controller
              control={control}
              name="heroImageUrl"
              render={({ field }) => (
                <div>
                  <p className="mb-1.5 text-sm font-medium">Hero image (fallback)</p>
                  <SingleImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onUpload={(file) => uploadImageAction(file, "homepage")}
                    label="Upload hero image"
                    aspect="video"
                  />
                </div>
              )}
            />

            <FormField label="Hero video URL" htmlFor="heroVideoUrl" hint="Optional — hosted video, plays instead of the 3D scene on low-power devices">
              <Input id="heroVideoUrl" placeholder="https://…" {...register("heroVideoUrl")} />
            </FormField>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcement bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                control={control}
                name="announcementEnabled"
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Show announcement bar</p>
                      <p className="text-xs text-muted-foreground">Displays above the navbar</p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
              <FormField label="Text" htmlFor="announcementText">
                <Input id="announcementText" {...register("announcementText")} />
              </FormField>
              <FormField label="Link" htmlFor="announcementHref">
                <Input id="announcementHref" placeholder="/#latest-drops" {...register("announcementHref")} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Drag to reorder, toggle to show or hide.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="sections"
                render={({ field }) => <SectionOrderList sections={field.value} onChange={field.onChange} />}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
